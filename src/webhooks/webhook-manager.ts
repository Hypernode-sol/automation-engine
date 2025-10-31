import axios from 'axios';
import { logger } from '../utils/logger';

export class WebhookManager {
  private discordUrl: string | undefined;
  private slackUrl: string | undefined;

  constructor() {
    this.discordUrl = process.env.DISCORD_WEBHOOK_URL;
    this.slackUrl = process.env.SLACK_WEBHOOK_URL;
  }

  async sendJobMatched(job: any, match: any) {
    const message = `
🎯 **Job Matched**
Job ID: ${job.jobId}
Node ID: ${match.nodeId}
GPU: ${match.gpuModel}
Reputation: ${match.reputation}
    `.trim();

    await this.sendToAll(message);
  }

  async sendJobCompleted(data: any) {
    const message = `
✅ **Job Completed**
Signature: ${data.signature}
Timestamp: ${data.timestamp}
    `.trim();

    await this.sendToAll(message);
  }

  async sendNodeConnected(data: any) {
    const message = `
🖥️ **New Node Connected**
Signature: ${data.signature}
Timestamp: ${data.timestamp}
    `.trim();

    await this.sendToAll(message);
  }

  private async sendToAll(message: string) {
    const promises: Promise<void>[] = [];

    if (this.discordUrl) {
      promises.push(this.sendToDiscord(message));
    }

    if (this.slackUrl) {
      promises.push(this.sendToSlack(message));
    }

    await Promise.allSettled(promises);
  }

  private async sendToDiscord(message: string) {
    try {
      await axios.post(this.discordUrl!, {
        content: message,
      });
      logger.debug('Discord webhook sent');
    } catch (error) {
      logger.error('Failed to send Discord webhook', { error });
    }
  }

  private async sendToSlack(message: string) {
    try {
      await axios.post(this.slackUrl!, {
        text: message,
      });
      logger.debug('Slack webhook sent');
    } catch (error) {
      logger.error('Failed to send Slack webhook', { error });
    }
  }
}
