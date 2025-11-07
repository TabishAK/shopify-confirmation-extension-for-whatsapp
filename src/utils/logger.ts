import { LOG_NAMESPACE } from '@constants/logging';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelMethodMap: Record<LogLevel, (...args: unknown[]) => void> = {
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
};

const formatScope = (scope: string): string => `${LOG_NAMESPACE}:${scope}`;

export interface Logger {
  debug(message: string, ...details: unknown[]): void;
  info(message: string, ...details: unknown[]): void;
  warn(message: string, ...details: unknown[]): void;
  error(message: string, ...details: unknown[]): void;
}

export const createLogger = (scope: string): Logger => {
  const namespace = formatScope(scope);

  const log = (level: LogLevel, message: string, details: unknown[]): void => {
    const method = levelMethodMap[level];
    method(`[${namespace}] ${message}`, ...details);
  };

  return {
    debug(message, ...details) {
      log('debug', message, details);
    },
    info(message, ...details) {
      log('info', message, details);
    },
    warn(message, ...details) {
      log('warn', message, details);
    },
    error(message, ...details) {
      log('error', message, details);
    }
  };
};

