/**
 * Utility functions for provisioning scripts
 */

/**
 * Color codes for terminal output
 */
export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
} as const;

/**
 * Logs a success message
 */
export function logSuccess(message: string): void {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

/**
 * Logs an error message
 */
export function logError(message: string): void {
  console.error(`${colors.red}✗ ${message}${colors.reset}`);
}

/**
 * Logs a warning message
 */
export function logWarning(message: string): void {
  console.warn(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

/**
 * Logs an info message
 */
export function logInfo(message: string): void {
  console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
}

/**
 * Logs a header
 */
export function logHeader(message: string): void {
  console.log(`\n${colors.cyan}${colors.bright}${message}${colors.reset}\n`);
}

/**
 * Logs a section divider
 */
export function logDivider(char: string = '=', length: number = 50): void {
  console.log(char.repeat(length));
}

/**
 * Formats a duration in milliseconds to a human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Sanitizes a string to be used as a slug
 */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug);
}

/**
 * Retries an async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        logWarning(
          `Operation failed, retrying in ${formatDuration(delay)}... (attempt ${attempt + 1}/${maxRetries})`
        );
        await sleep(delay);
      }
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

/**
 * Sleeps for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncates a string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Formats bytes to a human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Creates a progress indicator
 */
export class ProgressIndicator {
  private spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private current = 0;
  private interval: NodeJS.Timeout | null = null;
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  start(): void {
    this.interval = setInterval(() => {
      process.stdout.write(
        `\r${colors.cyan}${this.spinner[this.current]} ${this.message}${colors.reset}`
      );
      this.current = (this.current + 1) % this.spinner.length;
    }, 80);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      process.stdout.write('\r\x1b[K'); // Clear the line
    }
  }

  succeed(message?: string): void {
    this.stop();
    logSuccess(message || this.message);
  }

  fail(message?: string): void {
    this.stop();
    logError(message || this.message);
  }
}

/**
 * Prompts for confirmation
 */
export async function confirm(
  question: string,
  defaultValue: boolean = false
): Promise<boolean> {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const suffix = defaultValue ? ' (Y/n)' : ' (y/N)';
    rl.question(`${question}${suffix}: `, (answer: string) => {
      rl.close();

      if (!answer.trim()) {
        resolve(defaultValue);
        return;
      }

      const normalized = answer.trim().toLowerCase();
      resolve(normalized === 'y' || normalized === 'yes');
    });
  });
}

/**
 * Validates that all required environment variables are set
 */
export function validateRequiredEnvVars(vars: string[]): void {
  const missing: string[] = [];

  for (const varName of vars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    logError('Missing required environment variables:');
    missing.forEach((varName) => {
      console.log(`  - ${varName}`);
    });
    console.log('\nPlease set these in your .env.local file');
    process.exit(1);
  }
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Gets environment variable or throws
 */
export function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

/**
 * Gets environment variable with default
 */
export function getEnvOrDefault(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}
