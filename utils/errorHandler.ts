import { ToastType } from '../components/Toast';

/**
 * 錯誤類型定義
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class NetworkError extends Error {
  constructor(message: string = '網路連線錯誤') {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}

/**
 * 錯誤資訊介面
 */
interface ErrorInfo {
  message: string;
  type: ToastType;
  code?: string;
  originalError?: unknown;
}

/**
 * 統一錯誤處理器
 */
export class ErrorHandler {
  /**
   * 標準化錯誤物件
   */
  private static normalizeError(error: unknown): ErrorInfo {
    // 如果是已知的錯誤類型
    if (error instanceof ApiError) {
      return {
        message: error.message,
        type: 'error',
        code: error.code,
        originalError: error,
      };
    }

    if (error instanceof NetworkError) {
      return {
        message: '網路連線錯誤，請檢查您的網路連線',
        type: 'error',
        code: 'NETWORK_ERROR',
        originalError: error,
      };
    }

    if (error instanceof ValidationError) {
      return {
        message: error.message,
        type: 'warning',
        code: 'VALIDATION_ERROR',
        originalError: error,
      };
    }

    if (error instanceof StorageError) {
      return {
        message: '儲存資料時發生錯誤',
        type: 'error',
        code: 'STORAGE_ERROR',
        originalError: error,
      };
    }

    // 如果是標準 Error 物件
    if (error instanceof Error) {
      return {
        message: error.message || '發生未知錯誤',
        type: 'error',
        code: 'UNKNOWN_ERROR',
        originalError: error,
      };
    }

    // 如果是字串
    if (typeof error === 'string') {
      return {
        message: error,
        type: 'error',
        code: 'STRING_ERROR',
        originalError: error,
      };
    }

    // 如果是物件且有 message 屬性
    if (error && typeof error === 'object' && 'message' in error) {
      return {
        message: String((error as { message: unknown }).message) || '發生未知錯誤',
        type: 'error',
        code: 'OBJECT_ERROR',
        originalError: error,
      };
    }

    // 預設錯誤
    return {
      message: '發生未知錯誤，請稍後再試',
      type: 'error',
      code: 'UNKNOWN_ERROR',
      originalError: error,
    };
  }

  /**
   * 記錄錯誤（開發環境）
   */
  private static logError(errorInfo: ErrorInfo, context: string): void {
    if (import.meta.env.DEV) {
      console.error(`[${context}]`, {
        message: errorInfo.message,
        code: errorInfo.code,
        originalError: errorInfo.originalError,
      });
    }

    // 生產環境可以整合錯誤追蹤服務（如 Sentry）
    if (import.meta.env.PROD && errorInfo.originalError instanceof Error) {
      // TODO: 整合錯誤追蹤服務
      // errorTrackingService.captureException(errorInfo.originalError, {
      //   tags: { context },
      //   extra: { code: errorInfo.code },
      // });
    }
  }

  /**
   * 處理錯誤
   * @param error - 錯誤物件
   * @param context - 錯誤發生的上下文
   * @param showToast - 顯示 Toast 的函數（可選）
   * @returns 標準化的錯誤資訊
   */
  static handle(
    error: unknown,
    context: string,
    showToast?: (message: string, type: ToastType) => void
  ): ErrorInfo {
    const errorInfo = this.normalizeError(error);
    
    // 記錄錯誤
    this.logError(errorInfo, context);

    // 顯示用戶友好的訊息
    if (showToast) {
      showToast(errorInfo.message, errorInfo.type);
    }

    return errorInfo;
  }

  /**
   * 僅記錄錯誤，不顯示 Toast
   */
  static logOnly(error: unknown, context: string): ErrorInfo {
    const errorInfo = this.normalizeError(error);
    this.logError(errorInfo, context);
    return errorInfo;
  }
}

