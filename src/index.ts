import dotenv from 'dotenv';
import express from 'express';
import { Connection } from '@solana/web3.js';
import { Pool } from 'pg';
import { createClient } from 'redis';
import Queue from 'bull';

import { SolanaListener } from './listeners/solana-listener';
import { JobMatchmaker } from './matchmaker/job-matchmaker';
import { MetricsAggregator } from './metrics/aggregator';
import { WebhookManager } from './webhooks/webhook-manager';
import { logger } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 3002;

async function main() {
  logger.info('🚀 Hypernode Automation Engine starting...');

  // Initialize database
  const db = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await db.query('SELECT NOW()');
    logger.info('✅ Database connected');
  } catch (error) {
    logger.error('❌ Database connection failed', { error });
    process.exit(1);
  }

  // Initialize Redis
  const redis = createClient({
    url: process.env.REDIS_URL,
  });

  redis.on('error', (err) => logger.error('Redis error', { error: err }));
  await redis.connect();
  logger.info('✅ Redis connected');

  // Initialize job queue
  const jobQueue = new Queue('hypernode-jobs', process.env.REDIS_URL!);

  jobQueue.on('error', (error) => {
    logger.error('Queue error', { error });
  });

  logger.info('✅ Job queue initialized');

  // Initialize Solana connection
  const solanaConnection = new Connection(
    process.env.SOLANA_RPC_URL!,
    'confirmed'
  );

  try {
    const version = await solanaConnection.getVersion();
    logger.info('✅ Solana connected', { version: version['solana-core'] });
  } catch (error) {
    logger.error('❌ Solana connection failed', { error });
    process.exit(1);
  }

  // Initialize components
  const matchmaker = new JobMatchmaker(db, redis);
  const metricsAggregator = new MetricsAggregator(db, solanaConnection);
  const webhookManager = new WebhookManager();
  const solanaListener = new SolanaListener(
    solanaConnection,
    db,
    jobQueue,
    webhookManager
  );

  // Start Solana event listener
  solanaListener.start();
  logger.info('✅ Solana listener started');

  // Start metrics aggregation (every 5 minutes)
  setInterval(() => {
    metricsAggregator.aggregate().catch((err) => {
      logger.error('Metrics aggregation failed', { error: err });
    });
  }, 5 * 60 * 1000);

  logger.info('✅ Metrics aggregator started');

  // Process job queue
  jobQueue.process(async (job) => {
    logger.info('Processing job', { jobId: job.data.jobId });

    try {
      const match = await matchmaker.matchJob(job.data);

      if (match) {
        logger.info('Job matched', {
          jobId: job.data.jobId,
          nodeId: match.nodeId,
        });

        // Notify webhook
        await webhookManager.sendJobMatched(job.data, match);

        return { success: true, match };
      } else {
        logger.warn('No matching node found', { jobId: job.data.jobId });
        return { success: false, reason: 'no_match' };
      }
    } catch (error) {
      logger.error('Job processing failed', { jobId: job.data.jobId, error });
      throw error;
    }
  });

  logger.info('✅ Job processor started');

  // Initialize Express API
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get current metrics
  app.get('/api/metrics/current', async (req, res) => {
    try {
      const metrics = await metricsAggregator.getCurrentMetrics();
      res.json(metrics);
    } catch (error) {
      logger.error('Failed to get metrics', { error });
      res.status(500).json({ error: 'Failed to get metrics' });
    }
  });

  // Get validation/audit data
  app.get('/api/validation', async (req, res) => {
    try {
      const data = await metricsAggregator.getValidationData();
      res.json(data);
    } catch (error) {
      logger.error('Failed to get validation data', { error });
      res.status(500).json({ error: 'Failed to get validation data' });
    }
  });

  // Matchmaker endpoint
  app.post('/api/matchmaker/match', async (req, res) => {
    try {
      const job = req.body;
      const match = await matchmaker.matchJob(job);

      if (match) {
        res.json({ success: true, match });
      } else {
        res.json({ success: false, reason: 'no_match' });
      }
    } catch (error) {
      logger.error('Matchmaking failed', { error });
      res.status(500).json({ error: 'Matchmaking failed' });
    }
  });

  // Trigger webhook manually
  app.post('/api/webhooks/trigger', async (req, res) => {
    try {
      const { event, data } = req.body;

      switch (event) {
        case 'job_completed':
          await webhookManager.sendJobCompleted(data);
          break;
        case 'node_connected':
          await webhookManager.sendNodeConnected(data);
          break;
        default:
          return res.status(400).json({ error: 'Unknown event type' });
      }

      res.json({ success: true });
    } catch (error) {
      logger.error('Webhook trigger failed', { error });
      res.status(500).json({ error: 'Webhook trigger failed' });
    }
  });

  app.listen(PORT, () => {
    logger.info(`✅ API server listening on port ${PORT}`);
    logger.info('🎉 Hypernode Automation Engine is fully operational!');
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully...');

    solanaListener.stop();
    await jobQueue.close();
    await redis.quit();
    await db.end();

    process.exit(0);
  });
}

main().catch((error) => {
  logger.error('Fatal error', { error });
  process.exit(1);
});
