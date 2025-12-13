/**
 * Gemini API 回應類型定義
 */

export interface GeminiImageResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        inlineData?: {
          mimeType: string;
          data: string;
        };
        text?: string;
      }>;
    };
  }>;
}

export interface GeminiTextResponse {
  text?: string;
  candidates?: Array<{
    content: {
      parts: Array<{
        text?: string;
      }>;
    };
  }>;
}

export interface GeminiError {
  code: number;
  message: string;
  status: string;
}
