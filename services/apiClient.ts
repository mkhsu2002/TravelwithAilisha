import { GoogleGenAI } from '@google/genai';
import { ApiError, NetworkError, ErrorHandler } from '../utils/errorHandler';
import { logger } from '../utils/logger';

/**
 * API 配置
 */
const API_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 60000, // 增加超時時間到60秒，因為圖片生成需要更長時間
} as const;

/**
 * 重試配置
 */
interface RetryConfig {
  maxRetries?: number;
  delay?: number;
  exponentialBackoff?: boolean;
}

/**
 * 帶重試的 API 調用
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxRetries = API_CONFIG.MAX_RETRIES,
    delay = API_CONFIG.RETRY_DELAY,
    exponentialBackoff = true,
  } = config;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 如果不是網路錯誤或可重試的錯誤，直接拋出
      if (
        error instanceof ApiError &&
        error.statusCode &&
        error.statusCode >= 400 &&
        error.statusCode < 500 &&
        error.statusCode !== 429
      ) {
        // 4xx 錯誤（除了 429）不重試
        throw error;
      }

      // 最後一次嘗試，直接拋出錯誤
      if (attempt === maxRetries) {
        break;
      }

      // 計算延遲時間（指數退避）
      const waitTime = exponentialBackoff
        ? delay * Math.pow(2, attempt)
        : delay;

      logger.warn(
        `API 調用失敗，${waitTime}ms 後重試 (${attempt + 1}/${maxRetries})`,
        'ApiClient',
        error
      );

      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // 如果所有重試都失敗，拋出最後的錯誤
  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new NetworkError('API 調用失敗，請稍後再試');
}

/**
 * 帶超時的 API 調用
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = API_CONFIG.TIMEOUT
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new NetworkError('請求超時，請稍後再試')),
        timeoutMs
      )
    ),
  ]);
}

/**
 * Gemini API Client
 */
export class GeminiApiClient {
  private client: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  /**
   * 初始化客戶端
   */
  initialize(apiKey: string): void {
    if (!apiKey || apiKey.trim() === '') {
      throw new ApiError('API Key 未設定', 'API_KEY_MISSING');
    }

    // 如果 API Key 改變或實例不存在，創建新實例
    if (!this.client || this.apiKey !== apiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey });
        this.apiKey = apiKey;
        logger.info('Gemini API 客戶端初始化成功', 'GeminiApiClient');
      } catch (error) {
        ErrorHandler.handle(error, 'GeminiApiClient.initialize');
        throw new ApiError('初始化 API 客戶端失敗', 'INIT_FAILED');
      }
    }
  }

  /**
   * 獲取客戶端實例
   */
  private getClient(): GoogleGenAI {
    if (!this.client) {
      throw new ApiError('API 客戶端未初始化，請先配置 API Key', 'CLIENT_NOT_INITIALIZED');
    }
    return this.client;
  }

  /**
   * 生成內容（帶重試和超時）
   */
  async generateContent(
    params: {
      model: string;
      contents: unknown;
      config?: {
        imageConfig?: {
          aspectRatio?: string;
          imageSize?: string;
        };
      };
    },
    retryConfig?: RetryConfig
  ): Promise<unknown> {
    const client = this.getClient();

    return withTimeout(
      withRetry(
        async () => {
          try {
            // 根據模型類型使用正確的 API 格式
            const isImageModel = params.model.includes('image');
            
            // 構建 API 參數
            const apiParams: any = {
              model: params.model,
            };
            
            if (isImageModel) {
              // 圖片生成模型 (gemini-2.5-flash-image)
              // contents 格式：數組，每個元素包含 parts
              const contentsObj = params.contents as { parts?: Array<any> };
              if (contentsObj && contentsObj.parts) {
                apiParams.contents = [{ parts: contentsObj.parts }];
              } else {
                apiParams.contents = [params.contents];
              }
              
              // generationConfig 用於圖片生成配置
              apiParams.generationConfig = {
                responseModalities: ['IMAGE'],
              };
              
              // 添加圖片配置（如果提供）
              if (params.config?.imageConfig) {
                if (params.config.imageConfig.aspectRatio) {
                  apiParams.generationConfig.aspectRatio = params.config.imageConfig.aspectRatio;
                }
                if (params.config.imageConfig.imageSize) {
                  apiParams.generationConfig.imageSize = params.config.imageConfig.imageSize;
                }
              }
            } else {
              // 文字生成模型 (gemini-2.5-flash)
              apiParams.contents = params.contents;
              if (params.config) {
                apiParams.generationConfig = params.config;
              }
            }
            
            logger.debug('API 調用參數', 'generateContent', {
              model: apiParams.model,
              hasContents: !!apiParams.contents,
              contentsLength: Array.isArray(apiParams.contents) ? apiParams.contents.length : 0,
              generationConfig: apiParams.generationConfig,
            });
            
            const response = await client.models.generateContent(apiParams);
            return response;
          } catch (error: unknown) {
            // 處理 API 錯誤
            if (error && typeof error === 'object' && 'error' in error) {
              const apiError = (error as { error: { message?: string; code?: number } }).error;
              throw new ApiError(
                apiError.message || 'API 調用失敗',
                String(apiError.code || 'UNKNOWN'),
                apiError.code
              );
            }

            // 處理網路錯誤
            if (error instanceof TypeError && error.message.includes('fetch')) {
              throw new NetworkError('網路連線錯誤');
            }

            throw error;
          }
        },
        retryConfig
      )
    );
  }

  /**
   * 驗證 API Key
   */
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const tempClient = new GoogleGenAI({ apiKey });
      // 發送一個輕量級請求驗證 API Key
      // 注意：這裡需要根據實際 API 調整驗證邏輯
      await tempClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'test',
      });
      return true;
    } catch {
      return false;
    }
  }
}

// 匯出單例
export const geminiApiClient = new GeminiApiClient();

