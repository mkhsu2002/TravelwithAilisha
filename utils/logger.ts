/**
 * 統一日誌系統
 * 在開發環境顯示日誌，生產環境可整合錯誤追蹤服務
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const prefix = `[${level.toUpperCase()}]`;
    const contextPrefix = context ? `[${context}]` : '';
    return `${prefix}${contextPrefix} ${message}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: string,
    data?: unknown
  ): LogEntry {
    return {
      level,
      message,
      context,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Debug 日誌（僅開發環境）
   */
  debug(message: string, context?: string, data?: unknown): void {
    if (this.isDevelopment) {
      const entry = this.createLogEntry('debug', message, context, data);
      console.log(this.formatMessage('debug', message, context), data || '');
    }
  }

  /**
   * Info 日誌（僅開發環境）
   */
  info(message: string, context?: string, data?: unknown): void {
    if (this.isDevelopment) {
      const entry = this.createLogEntry('info', message, context, data);
      console.info(this.formatMessage('info', message, context), data || '');
    }
  }

  /**
   * Warning 日誌
   */
  warn(message: string, context?: string, data?: unknown): void {
    const entry = this.createLogEntry('warn', message, context, data);
    console.warn(this.formatMessage('warn', message, context), data || '');
    
    // 生產環境可整合警告追蹤
    if (this.isProduction) {
      // TODO: 整合警告追蹤服務
    }
  }

  /**
   * Error 日誌
   */
  error(message: string, context?: string, error?: unknown): void {
    const entry = this.createLogEntry('error', message, context, error);
    console.error(this.formatMessage('error', message, context), error || '');
    
    // 生產環境可整合錯誤追蹤
    if (this.isProduction && error instanceof Error) {
      // TODO: 整合錯誤追蹤服務（如 Sentry）
      // errorTrackingService.captureException(error, {
      //   tags: { context },
      //   extra: { message },
      // });
    }
  }
}

// 匯出單例
export const logger = new Logger();

