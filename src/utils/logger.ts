/**
 * Enhanced logging module with structured logging support
 */

import winston from 'winston';
import { formatError } from './errors';

const logLevel = process.env.LOG_LEVEL || 'info';

// Custom format for structured logging
const structuredFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level.toUpperCase()}] ${message} ${metaStr}`;
  })
);

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: logLevel,
  transports: [
    // Console transport with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        structuredFormat
      ),
    }),
    // Error log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: jsonFormat,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    // Combined log file
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: jsonFormat,
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
  ],
});

// Add request logging helper
export function logRequest(
  method: string,
  path: string,
  context?: Record<string, any>
): void {
  logger.info(`API Request: ${method} ${path}`, context);
}

// Add response logging helper
export function logResponse(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  context?: Record<string, any>
): void {
  logger.info(`API Response: ${method} ${path} - ${statusCode}`, {
    statusCode,
    durationMs: duration,
    ...context,
  });
}

// Add error logging with context
export function logErrorWithContext(
  error: any,
  context: string,
  additionalContext?: Record<string, any>
): void {
  const formatted = formatError(error);
  logger.error(`Error in ${context}`, {
    code: formatted.code,
    message: formatted.message,
    errorContext: formatted.context,
    ...additionalContext,
  });
}

// Add database operation logging
export function logDatabaseOperation(
  operation: string,
  duration: number,
  success: boolean,
  context?: Record<string, any>
): void {
  const level = success ? 'debug' : 'warn';
  const message = `Database ${operation} - ${duration}ms`;
  logger[level](message, { success, ...context });
}

// Add queue operation logging
export function logQueueOperation(
  jobId: string,
  operation: string,
  duration?: number,
  context?: Record<string, any>
): void {
  const message = `Queue operation [${jobId}] ${operation}`;
  logger.info(message, { duration, ...context });
}

// Add Redis operation logging
export function logRedisOperation(
  command: string,
  duration: number,
  success: boolean,
  context?: Record<string, any>
): void {
  const level = success ? 'debug' : 'warn';
  const message = `Redis ${command} - ${duration}ms`;
  logger[level](message, { success, ...context });
}

// Add Solana operation logging
export function logSolanaOperation(
  operation: string,
  duration: number,
  success: boolean,
  context?: Record<string, any>
): void {
  const level = success ? 'info' : 'error';
  const message = `Solana ${operation} - ${duration}ms`;
  logger[level](message, { success, ...context });
}

// Add job lifecycle logging
export function logJobEvent(
  jobId: string,
  event: 'created' | 'started' | 'completed' | 'failed' | 'retried',
  context?: Record<string, any>
): void {
  logger.info(`Job [${jobId}] ${event}`, context);
}

// Add performance metrics logging
export function logMetric(
  metric: string,
  value: number,
  unit: string = '',
  context?: Record<string, any>
): void {
  logger.debug(`Metric: ${metric}=${value}${unit}`, context);
}

// Add matching operation logging
export function logMatchingOperation(
  jobId: string,
  nodeCount: number,
  selectedNodeId?: string,
  context?: Record<string, any>
): void {
  const message = selectedNodeId
    ? `Matched job [${jobId}] to node [${selectedNodeId}] from ${nodeCount} available`
    : `No matching node found for job [${jobId}] among ${nodeCount} available`;
  logger.info(message, context);
}

// Add batch operation logging
export function logBatchOperation(
  operation: string,
  itemCount: number,
  successCount: number,
  duration: number,
  context?: Record<string, any>
): void {
  const successRate = ((successCount / itemCount) * 100).toFixed(2);
  logger.info(`Batch ${operation}: ${successCount}/${itemCount} (${successRate}%) - ${duration}ms`, context);
}

// Add webhook event logging
export function logWebhookEvent(
  webhookId: string,
  event: string,
  statusCode?: number,
  context?: Record<string, any>
): void {
  logger.info(`Webhook [${webhookId}] event: ${event}${statusCode ? ' (' + statusCode + ')' : ''}`, context);
}

// Create child logger with context
export function createContextLogger(context: string) {
  return {
    info: (message: string, meta?: Record<string, any>) =>
      logger.info(`[${context}] ${message}`, meta),
    warn: (message: string, meta?: Record<string, any>) =>
      logger.warn(`[${context}] ${message}`, meta),
    error: (message: string, meta?: Record<string, any>) =>
      logger.error(`[${context}] ${message}`, meta),
    debug: (message: string, meta?: Record<string, any>) =>
      logger.debug(`[${context}] ${message}`, meta),
  };
}
