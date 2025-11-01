import { Connection } from '@solana/web3.js';
import { Pool } from 'pg';
import { logger } from '../utils/logger';

export class MetricsAggregator {
  constructor(
    private db: Pool,
    private solanaConnection: Connection
  ) {}

  async aggregate() {
    logger.info('Aggregating metrics...');

    try {
      const metrics = await this.getCurrentMetrics();

      // Store aggregated metrics in database
      await this.db.query(
        `
        INSERT INTO metrics_snapshots (
          total_nodes,
          active_nodes,
          total_jobs,
          jobs_completed,
          jobs_failed,
          total_hyper_paid,
          avg_job_duration_ms,
          timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      `,
        [
          metrics.totalNodes,
          metrics.activeNodes,
          metrics.totalJobs,
          metrics.jobsCompleted,
          metrics.jobsFailed,
          metrics.totalHyperPaid,
          metrics.avgJobDuration,
        ]
      );

      logger.info('Metrics aggregated successfully', metrics);
    } catch (error) {
      logger.error('Failed to aggregate metrics', { error });
      throw error;
    }
  }

  async getCurrentMetrics() {
    const [nodesResult, jobsResult, paymentsResult] = await Promise.all([
      // Nodes metrics
      this.db.query(`
        SELECT
          COUNT(*) as total_nodes,
          COUNT(*) FILTER (WHERE status = 'online') as active_nodes
        FROM nodes
      `),

      // Jobs metrics
      this.db.query(`
        SELECT
          COUNT(*) as total_jobs,
          COUNT(*) FILTER (WHERE status = 'completed') as jobs_completed,
          COUNT(*) FILTER (WHERE status = 'failed') as jobs_failed,
          AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) * 1000) as avg_duration_ms
        FROM jobs
      `),

      // Payments metrics
      this.db.query(`
        SELECT
          COALESCE(SUM(amount), 0) as total_paid
        FROM payments
      `),
    ]);

    return {
      totalNodes: parseInt(nodesResult.rows[0].total_nodes),
      activeNodes: parseInt(nodesResult.rows[0].active_nodes),
      totalJobs: parseInt(jobsResult.rows[0].total_jobs),
      jobsCompleted: parseInt(jobsResult.rows[0].jobs_completed),
      jobsFailed: parseInt(jobsResult.rows[0].jobs_failed),
      avgJobDuration: parseFloat(jobsResult.rows[0].avg_duration_ms) || 0,
      totalHyperPaid: parseFloat(paymentsResult.rows[0].total_paid) || 0,
    };
  }

  async getValidationData() {
    // Get recent jobs for validation page
    const recentJobs = await this.db.query(`
      SELECT
        job_id,
        job_type,
        status,
        price,
        created_at,
        completed_at,
        tx_signature
      FROM jobs
      ORDER BY created_at DESC
      LIMIT 50
    `);

    // Get recent nodes
    const recentNodes = await this.db.query(`
      SELECT
        node_id,
        gpu_model,
        status,
        reputation_score,
        jobs_completed,
        registered_at
      FROM nodes
      ORDER BY registered_at DESC
      LIMIT 20
    `);

    return {
      recentJobs: recentJobs.rows,
      recentNodes: recentNodes.rows,
      lastUpdated: new Date().toISOString(),
    };
  }
}
