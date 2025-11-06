/**
 * Input validation utilities for Hypernode Automation Engine
 */

import { ValidationError } from './errors';

/**
 * Validate required string field
 */
export function validateRequiredString(value: any, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationError(`${fieldName} is required and must be a non-empty string`);
  }
  return value.trim();
}

/**
 * Validate required number field
 */
export function validateRequiredNumber(value: any, fieldName: string): number {
  const num = Number(value);
  if (isNaN(num)) {
    throw new ValidationError(`${fieldName} must be a valid number`);
  }
  return num;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = email.trim();
  if (!emailRegex.test(trimmed)) {
    throw new ValidationError(`Invalid email format: ${email}`);
  }
  return trimmed;
}

/**
 * Validate URL format
 */
export function validateURL(url: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    throw new ValidationError(`Invalid URL format: ${url}`);
  }
}

/**
 * Validate integer value with bounds
 */
export function validateInteger(
  value: any,
  fieldName: string,
  options?: { min?: number; max?: number }
): number {
  const num = Number(value);
  if (!Number.isInteger(num)) {
    throw new ValidationError(`${fieldName} must be an integer`);
  }

  if (options?.min !== undefined && num < options.min) {
    throw new ValidationError(
      `${fieldName} must be at least ${options.min}`
    );
  }

  if (options?.max !== undefined && num > options.max) {
    throw new ValidationError(
      `${fieldName} must be at most ${options.max}`
    );
  }

  return num;
}

/**
 * Validate positive number
 */
export function validatePositive(value: any, fieldName: string): number {
  const num = validateRequiredNumber(value, fieldName);
  if (num <= 0) {
    throw new ValidationError(`${fieldName} must be a positive number`);
  }
  return num;
}

/**
 * Validate non-negative number
 */
export function validateNonNegative(value: any, fieldName: string): number {
  const num = validateRequiredNumber(value, fieldName);
  if (num < 0) {
    throw new ValidationError(`${fieldName} cannot be negative`);
  }
  return num;
}

/**
 * Validate percentage (0-100)
 */
export function validatePercentage(value: any, fieldName: string): number {
  return validateInteger(value, fieldName, { min: 0, max: 100 });
}

/**
 * Validate array
 */
export function validateArray<T>(value: any, fieldName: string): T[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`);
  }
  return value;
}

/**
 * Validate non-empty array
 */
export function validateNonEmptyArray<T>(value: any, fieldName: string): T[] {
  const arr = validateArray<T>(value, fieldName);
  if (arr.length === 0) {
    throw new ValidationError(`${fieldName} must not be empty`);
  }
  return arr;
}

/**
 * Validate object
 */
export function validateObject(value: any, fieldName: string): Record<string, any> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an object`);
  }
  return value;
}

/**
 * Validate enum value
 */
export function validateEnum<T extends string | number>(
  value: any,
  fieldName: string,
  allowedValues: T[]
): T {
  if (!allowedValues.includes(value)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`
    );
  }
  return value;
}

/**
 * Validate date string or timestamp
 */
export function validateDate(value: any, fieldName: string): Date {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date`);
  }
  return date;
}

/**
 * Validate future date
 */
export function validateFutureDate(value: any, fieldName: string): Date {
  const date = validateDate(value, fieldName);
  if (date.getTime() <= Date.now()) {
    throw new ValidationError(`${fieldName} must be in the future`);
  }
  return date;
}

/**
 * Validate past date
 */
export function validatePastDate(value: any, fieldName: string): Date {
  const date = validateDate(value, fieldName);
  if (date.getTime() >= Date.now()) {
    throw new ValidationError(`${fieldName} must be in the past`);
  }
  return date;
}

/**
 * Validate Solana public key format
 */
export function validatePublicKey(value: any, fieldName: string): string {
  const str = validateRequiredString(value, fieldName);
  if (!/^[1-9A-HJ-NP-Z]{43,44}$/.test(str)) {
    throw new ValidationError(`${fieldName} is not a valid Solana public key`);
  }
  return str;
}

/**
 * Validate string length
 */
export function validateStringLength(
  value: string,
  fieldName: string,
  options?: { min?: number; max?: number }
): string {
  const str = validateRequiredString(value, fieldName);

  if (options?.min !== undefined && str.length < options.min) {
    throw new ValidationError(
      `${fieldName} must be at least ${options.min} characters`
    );
  }

  if (options?.max !== undefined && str.length > options.max) {
    throw new ValidationError(
      `${fieldName} must be at most ${options.max} characters`
    );
  }

  return str;
}

/**
 * Validate job request object
 */
export function validateJobRequest(request: any): {
  model: string;
  params: Record<string, any>;
  timeoutMs?: number;
  priority?: number;
} {
  const validated = validateObject(request, 'Job request');

  return {
    model: validateRequiredString(validated.model, 'model'),
    params: validateObject(validated.params || {}, 'params'),
    timeoutMs: validated.timeoutMs
      ? validatePositive(validated.timeoutMs, 'timeoutMs')
      : 30000,
    priority: validated.priority
      ? validatePercentage(validated.priority, 'priority')
      : 50,
  };
}

/**
 * Validate node configuration
 */
export function validateNodeConfig(config: any): {
  id: string;
  publicKey: string;
  gpuMemoryGb: number;
  cpuCores: number;
  maxConcurrentJobs: number;
  region: string;
} {
  const validated = validateObject(config, 'Node configuration');

  return {
    id: validateRequiredString(validated.id, 'id'),
    publicKey: validatePublicKey(validated.publicKey, 'publicKey'),
    gpuMemoryGb: validatePositive(validated.gpuMemoryGb, 'gpuMemoryGb'),
    cpuCores: validatePositive(validated.cpuCores, 'cpuCores'),
    maxConcurrentJobs: validatePositive(
      validated.maxConcurrentJobs,
      'maxConcurrentJobs'
    ),
    region: validateRequiredString(validated.region, 'region'),
  };
}

/**
 * Validate webhook configuration
 */
export function validateWebhookConfig(config: any): {
  url: string;
  events: string[];
  secret?: string;
  retries?: number;
  retryDelayMs?: number;
} {
  const validated = validateObject(config, 'Webhook configuration');

  return {
    url: validateURL(validated.url),
    events: validateNonEmptyArray<string>(validated.events, 'events'),
    secret: validated.secret ? validateRequiredString(validated.secret, 'secret') : undefined,
    retries: validated.retries
      ? validateNonNegative(validated.retries, 'retries')
      : 3,
    retryDelayMs: validated.retryDelayMs
      ? validatePositive(validated.retryDelayMs, 'retryDelayMs')
      : 1000,
  };
}

/**
 * Sanitize string to prevent injection attacks
 */
export function sanitizeString(value: string): string {
  return value
    .replace(/[<>\"']/g, '') // Remove dangerous characters
    .trim()
    .substring(0, 1000); // Limit length
}

/**
 * Validate and sanitize user input
 */
export function validateAndSanitize(value: string, fieldName: string): string {
  const validated = validateRequiredString(value, fieldName);
  return sanitizeString(validated);
}
