import { Connection, PublicKey, Commitment } from '@solana/web3.js';
import { Pool } from 'pg';
import Queue from 'bull';
import { logger } from '../utils/logger';
import { WebhookManager } from '../webhooks/webhook-manager';

export class SolanaListener {
  private running = false;
  private nodeRegistryProgramId: PublicKey;
  private jobReceiptProgramId: PublicKey;
  private paymentSplitterProgramId: PublicKey;

  constructor(
    private connection: Connection,
    private db: Pool,
    private jobQueue: Queue.Queue,
    private webhookManager: WebhookManager
  ) {
    this.nodeRegistryProgramId = new PublicKey(
      process.env.NODE_REGISTRY_PROGRAM_ID!
    );
    this.jobReceiptProgramId = new PublicKey(
      process.env.JOB_RECEIPT_PROGRAM_ID!
    );
    this.paymentSplitterProgramId = new PublicKey(
      process.env.PAYMENT_SPLITTER_PROGRAM_ID!
    );
  }

  async start() {
    this.running = true;
    logger.info('Starting Solana event listeners...');

    // Listen to Node Registry events
    this.connection.onLogs(
      this.nodeRegistryProgramId,
      async (logs, ctx) => {
        try {
          await this.handleNodeRegistryLogs(logs);
        } catch (error) {
          logger.error('Error handling node registry logs', { error });
        }
      },
      'confirmed' as Commitment
    );

    // Listen to Job Receipt events
    this.connection.onLogs(
      this.jobReceiptProgramId,
      async (logs, ctx) => {
        try {
          await this.handleJobReceiptLogs(logs);
        } catch (error) {
          logger.error('Error handling job receipt logs', { error });
        }
      },
      'confirmed' as Commitment
    );

    // Listen to Payment Splitter events
    this.connection.onLogs(
      this.paymentSplitterProgramId,
      async (logs, ctx) => {
        try {
          await this.handlePaymentSplitterLogs(logs);
        } catch (error) {
          logger.error('Error handling payment splitter logs', { error });
        }
      },
      'confirmed' as Commitment
    );

    logger.info('✅ All event listeners active');
  }

  stop() {
    this.running = false;
    logger.info('Stopping Solana event listeners...');
    // Note: @solana/web3.js doesn't provide a way to unsubscribe from onLogs
    // In production, we'd need to track subscription IDs
  }

  private async handleNodeRegistryLogs(logs: any) {
    const logStr = JSON.stringify(logs.logs);

    // Check for NodeRegistered event
    if (logStr.includes('NodeRegistered')) {
      logger.info('NodeRegistered event detected', { signature: logs.signature });

      // Parse event data (simplified - in production use proper IDL parsing)
      // Store in database

      await this.webhookManager.sendNodeConnected({
        signature: logs.signature,
        timestamp: new Date().toISOString(),
      });
    }

    // Check for NodeStatusUpdated event
    if (logStr.includes('NodeStatusUpdated')) {
      logger.info('NodeStatusUpdated event detected', {
        signature: logs.signature,
      });
    }
  }

  private async handleJobReceiptLogs(logs: any) {
    const logStr = JSON.stringify(logs.logs);

    // Check for JobCreated event
    if (logStr.includes('JobCreated')) {
      logger.info('JobCreated event detected', { signature: logs.signature });

      // Add job to queue for matchmaking
      await this.jobQueue.add({
        signature: logs.signature,
        timestamp: new Date().toISOString(),
        // Parse full job data from transaction
      });
    }

    // Check for JobCompleted event
    if (logStr.includes('JobCompleted')) {
      logger.info('JobCompleted event detected', { signature: logs.signature });

      await this.webhookManager.sendJobCompleted({
        signature: logs.signature,
        timestamp: new Date().toISOString(),
      });
    }

    // Check for PaymentDistributed event
    if (logStr.includes('PaymentDistributed')) {
      logger.info('PaymentDistributed event detected', {
        signature: logs.signature,
      });
    }
  }

  private async handlePaymentSplitterLogs(logs: any) {
    const logStr = JSON.stringify(logs.logs);

    if (logStr.includes('PaymentProcessed')) {
      logger.info('PaymentProcessed event detected', {
        signature: logs.signature,
      });
    }
  }
}
