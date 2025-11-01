import { Pool } from 'pg';
import { RedisClientType } from 'redis';
import { logger } from '../utils/logger';

interface Job {
  jobId: string;
  jobType: string;
  requirements: {
    gpuModel?: string;
    vramMin?: number;
    capabilities?: string[];
  };
  price: number;
}

interface NodeMatch {
  nodeId: string;
  operator: string;
  gpuModel: string;
  vram: number;
  reputation: number;
  score: number;
}

export class JobMatchmaker {
  constructor(
    private db: Pool,
    private redis: RedisClientType
  ) {}

  async matchJob(job: Job): Promise<NodeMatch | null> {
    logger.info('Matching job', { jobId: job.jobId });

    // Get online nodes from database
    const result = await this.db.query(
      `
      SELECT
        node_id,
        owner_wallet,
        gpu_model,
        vram_gb,
        reputation_score,
        last_heartbeat,
        jobs_completed,
        jobs_failed
      FROM nodes
      WHERE
        status = 'online'
        AND last_heartbeat > NOW() - INTERVAL '5 minutes'
        ${job.requirements.vramMin ? `AND vram_gb >= $1` : ''}
      ORDER BY reputation_score DESC, jobs_completed DESC
      LIMIT 50
    `,
      job.requirements.vramMin ? [job.requirements.vramMin] : []
    );

    if (result.rows.length === 0) {
      logger.warn('No online nodes available');
      return null;
    }

    // Score each node
    const scoredNodes = result.rows.map((node) => {
      const reputationScore = node.reputation_score / 1000; // Normalize 0-1
      const successRate =
        node.jobs_completed / (node.jobs_completed + node.jobs_failed + 1);
      const vramScore = job.requirements.vramMin
        ? Math.min(node.vram_gb / job.requirements.vramMin, 1)
        : 1;

      // Weighted score
      const score =
        reputationScore * 0.4 + successRate * 0.4 + vramScore * 0.2;

      return {
        nodeId: node.node_id,
        operator: node.owner_wallet,
        gpuModel: node.gpu_model,
        vram: node.vram_gb,
        reputation: node.reputation_score,
        score,
      };
    });

    // Sort by score and pick best
    scoredNodes.sort((a, b) => b.score - a.score);

    const bestMatch = scoredNodes[0];

    logger.info('Job matched successfully', {
      jobId: job.jobId,
      nodeId: bestMatch.nodeId,
      score: bestMatch.score,
    });

    return bestMatch;
  }

  async getAvailableNodes(filters?: {
    gpuModel?: string;
    vramMin?: number;
  }): Promise<any[]> {
    let query = `
      SELECT
        node_id,
        gpu_model,
        vram_gb,
        reputation_score,
        jobs_completed,
        last_heartbeat
      FROM nodes
      WHERE status = 'online'
    `;

    const params: any[] = [];

    if (filters?.gpuModel) {
      params.push(filters.gpuModel);
      query += ` AND gpu_model = $${params.length}`;
    }

    if (filters?.vramMin) {
      params.push(filters.vramMin);
      query += ` AND vram_gb >= $${params.length}`;
    }

    query += ' ORDER BY reputation_score DESC';

    const result = await this.db.query(query, params);
    return result.rows;
  }
}
