/**
 * Error handling utilities for Hypernode Automation Engine
 */

export enum ErrorCode {
  // Database errors
  DB_CONNECTION_ERROR = 'DB_CONNECTION_ERROR',
  DB_QUERY_ERROR = 'DB_QUERY_ERROR',
  DB_TRANSACTION_ERROR = 'DB_TRANSACTION_ERROR',

  // Redis/Cache errors
  REDIS_CONNECTION_ERROR = 'REDIS_CONNECTION_ERROR',
  REDIS_OPERATION_ERROR = 'REDIS_OPERATION_ERROR',
  CACHE_NOT_FOUND = 'CACHE_NOT_FOUND',

  // Queue errors
  QUEUE_ERROR = 'QUEUE_ERROR',
  JOB_PROCESSING_ERROR = 'JOB_PROCESSING_ERROR',
  JOB_NOT_FOUND = 'JOB_NOT_FOUND',

  // Solana errors
  SOLANA_CONNECTION_ERROR = 'SOLANA_CONNECTION_ERROR',
  SOLANA_RPC_ERROR = 'SOLANA_RPC_ERROR',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',

  // Matchmaking errors
  NO_SUITABLE_NODE = 'NO_SUITABLE_NODE',
  MATCHING_ERROR = 'MATCHING_ERROR',
  INSUFFICIENT_RESOURCES = 'INSUFFICIENT_RESOURCES',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Authorization errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // API errors
  API_ERROR = 'API_ERROR',
  WEBHOOK_ERROR = 'WEBHOOK_ERROR',
  TIMEOUT = 'TIMEOUT',

  // Configuration errors
  CONFIG_ERROR = 'CONFIG_ERROR',
  MISSING_CONFIG = 'MISSING_CONFIG',

  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
}

export class AutomationError extends Error {
  code: ErrorCode;
  context?: any;
  statusCode?: number;
  isRetryable: boolean;

  constructor(
    message: string,
    code: ErrorCode,
    context?: any,
    isRetryable: boolean = false,
    statusCode: number = 500
  ) {
    super(message);
    this.name = 'AutomationError';
    this.code = code;
    this.context = context;
    this.isRetryable = isRetryable;
    this.statusCode = statusCode;
  }
}

export class DatabaseError extends AutomationError {
  constructor(message: string, context?: any, isRetryable: boolean = true) {
    super(message, ErrorCode.DB_QUERY_ERROR, context, isRetryable, 500);
    this.name = 'DatabaseError';
  }
}

export class RedisError extends AutomationError {
  constructor(message: string, context?: any, isRetryable: boolean = true) {
    super(message, ErrorCode.REDIS_OPERATION_ERROR, context, isRetryable, 500);
    this.name = 'RedisError';
  }
}

export class QueueError extends AutomationError {
  constructor(message: string, context?: any, isRetryable: boolean = true) {
    super(message, ErrorCode.QUEUE_ERROR, context, isRetryable, 500);
    this.name = 'QueueError';
  }
}

export class SolanaError extends AutomationError {
  constructor(message: string, context?: any, isRetryable: boolean = true) {
    super(message, ErrorCode.SOLANA_RPC_ERROR, context, isRetryable, 502);
    this.name = 'SolanaError';
  }
}

export class ValidationError extends AutomationError {
  constructor(message: string, context?: any) {
    super(message, ErrorCode.VALIDATION_ERROR, context, false, 400);
    this.name = 'ValidationError';
  }
}

export class MatchingError extends AutomationError {
  constructor(message: string, context?: any) {
    super(message, ErrorCode.MATCHING_ERROR, context, true, 503);
    this.name = 'MatchingError';
  }
}

export class TimeoutError extends AutomationError {
  constructor(message: string, context?: any) {
    super(message, ErrorCode.TIMEOUT, context, true, 504);
    this.name = 'TimeoutError';
  }
}

export class WebhookError extends AutomationError {
  constructor(message: string, context?: any, isRetryable: boolean = true) {
    super(message, ErrorCode.WEBHOOK_ERROR, context, isRetryable, 500);
    this.name = 'WebhookError';
  }
}

/**
 * Format error for logging
 */
export function formatError(error: any): {
  code: string;
  message: string;
  context?: any;
  stack?: string;
} {
  if (error instanceof AutomationError) {
    return {
      code: error.code,
      message: error.message,
      context: error.context,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }

  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: error?.message || 'Unknown error occurred',
    stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
  };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  if (error instanceof AutomationError) {
    return error.isRetryable;
  }

  // Default retryable errors based on type
  const errorString = error?.toString?.() || '';
  return (
    errorString.includes('ECONNREFUSED') ||
    errorString.includes('ETIMEDOUT') ||
    errorString.includes('ENOTFOUND') ||
    errorString.includes('temporarily unavailable')
  );
}

/**
 * Get HTTP status code from error
 */
export function getStatusCode(error: any): number {
  if (error instanceof AutomationError) {
    return error.statusCode || 500;
  }
  return 500;
}

/**
 * Create error response
 */
export function createErrorResponse(error: any): {
  error: string;
  code: string;
  message: string;
  context?: any;
} {
  const formatted = formatError(error);
  return {
    error: 'Error',
    code: formatted.code,
    message: formatted.message,
    context: formatted.context,
  };
}
