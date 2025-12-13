import { CityVibe } from "../types";
import { GeminiImageResponse, GeminiTextResponse } from "../types/api";
import { loadAilishaImage } from "../utils/ailishaImage";
import { geminiApiClient } from "./apiClient";
import { ApiError, ErrorHandler } from "../utils/errorHandler";
import { logger } from "../utils/logger";

// --- API Functions ---

// NOTE: We now use local data for cities/landmarks to save resources and ensure logic.
// The getNextCityOptions and getCityDetailsAndLandmarks functions are removed/replaced by local logic in App.tsx.

/**
 * Helper to get an outfit description based on city vibe.
 */
const getOutfitForVibe = (vibe: CityVibe): string => {
  const outfits = {
    urban: "stylish streetwear, a fashionable trench coat or leather jacket, sunglasses on head, looking chic",
    beach: "a cute floral summer dress or a stylish swimsuit with a sarong, wearing a sun hat",
    historic: "elegant casual travel wear, a light blouse and long skirt, carrying a vintage camera",
    nature: "sporty hiking gear, a fitted tank top and cargo pants, backpack, adventurous look",
    cold: "a cozy knitted sweater, a warm scarf and stylish wool coat, ear muffs"
  };
  return outfits[vibe] || outfits.urban;
};

/**
 * Generates a city photo of Ailisha exploring the city (9:16 aspect ratio)
 * Returns both the photo URL and the prompt used
 */
export const generateCityPhoto = async (
  cityName: string,
  cityDescription: string,
  vibe: CityVibe,
  apiKey: string
): Promise<{ photoUrl: string; prompt: string }> => {
  // 確保 AI 客戶端已初始化
  initializeAI(apiKey);
  const model = "gemini-3-pro-image-preview";

  // 載入 Ailisha 參考圖片
  const ailishaImageBase64 = await loadAilishaImage();
  
  if (!ailishaImageBase64) {
    throw new Error('無法載入 Ailisha 參考圖片');
  }
  
  const cleanAilisha = ailishaImageBase64.includes(',')
    ? ailishaImageBase64.split(',')[1]
    : ailishaImageBase64;

  logger.debug('Ailisha 參考圖片已載入', 'generateCityPhoto', {
    size: cleanAilisha.length,
    city: cityName,
    vibe,
  });

  const outfitDesc = getOutfitForVibe(vibe);

  // 生成 Ailisha 在城市中自在愜意觀光的照片
  // 強調使用參考圖片來確保臉部一致性
  const prompt = `
    You MUST use the reference image provided to generate Ailisha's face. The reference image shows Ailisha's exact appearance.
    
    Generate a realistic, high-quality vertical travel photo (9:16 aspect ratio) of Ailisha exploring and enjoying ${cityName}.
    
    CRITICAL REQUIREMENTS - USE THE REFERENCE IMAGE FOR AILISHA'S FACE:
    - The reference image (first image) shows Ailisha's EXACT face, features, and appearance.
    - You MUST replicate the person in the reference image EXACTLY:
      * IDENTICAL face shape and structure
      * IDENTICAL eyes (shape, color, expression)
      * IDENTICAL nose
      * IDENTICAL mouth and smile
      * IDENTICAL hair (style, color, length)
      * IDENTICAL skin tone
      * IDENTICAL overall facial appearance and features
    - DO NOT create a generic or different face. The face MUST be an EXACT COPY of the reference image.
    - Outfit: ${outfitDesc} (clothing can change, but face must remain IDENTICAL to reference)
    - Pose: Ailisha is exploring the city naturally, looking relaxed and happy. She might be:
      * Walking through a street market
      * Standing at a viewpoint overlooking the city
      * Sitting at a cafe
      * Taking photos with her phone
      * Looking at interesting architecture or scenery
    - Expression: Natural, happy, relaxed, enjoying the moment
    
    Background: Clearly show ${cityName} - ${cityDescription}. The city should be recognizable with its characteristic features, architecture, and atmosphere. Include elements that represent the city's vibe: ${vibe}.
    
    Style: Professional travel photography, vibrant colors, natural lighting, Instagram-worthy composition, 4k resolution, vertical format (9:16 aspect ratio).
    
    MOST IMPORTANT: Ailisha's face must be pixel-perfect identical to the reference image. Copy the face from the reference image exactly. This is the absolute top priority.
  `;

  try {
    // 初始化 API 客戶端
    geminiApiClient.initialize(apiKey);
    
    logger.debug('開始生成城市照片', 'generateCityPhoto', { model, city: cityName });
    
    // Gemini API 調用：傳遞 Ailisha 參考圖和 prompt
    const response = await geminiApiClient.generateContent({
      model,
      contents: {
        parts: [
          // Ailisha 參考圖
          { 
            inlineData: { 
              mimeType: "image/jpeg", 
              data: cleanAilisha 
            } 
          },
          // Prompt 說明
          { 
            text: prompt 
          }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "9:16",
            imageSize: "1K"
        }
      }
    }) as GeminiImageResponse;

    // Check for image in response
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        logger.info('城市照片生成成功', 'generateCityPhoto', { city: cityName });
        return {
          photoUrl: `data:image/png;base64,${part.inlineData.data}`,
          prompt: prompt.trim()
        };
      }
    }
    throw new ApiError("API 沒有返回圖片", "NO_IMAGE_GENERATED");
  } catch (error) {
    ErrorHandler.handle(error, 'generateCityPhoto');
    throw error;
  }
};

/**
 * Generates the souvenir photo using gemini-3-pro-image-preview
 * Returns both the photo URL and the prompt used
 */
export const generateSouvenirPhoto = async (
  userSelfieBase64: string,
  cityName: string,
  landmarkName: string,
  landmarkDesc: string,
  vibe: CityVibe,
  apiKey: string
): Promise<{ photoUrl: string; prompt: string }> => {
  // 確保 AI 客戶端已初始化
  initializeAI(apiKey);
  const model = "gemini-3-pro-image-preview";

  // Clean base64 strings
  const cleanUser = userSelfieBase64.includes(',') 
    ? userSelfieBase64.split(',')[1] 
    : userSelfieBase64;

  // 載入 Ailisha 參考圖片
  const ailishaImageBase64 = await loadAilishaImage();
  
  if (!ailishaImageBase64) {
    throw new Error('無法載入 Ailisha 參考圖片');
  }
  
  const cleanAilisha = ailishaImageBase64.includes(',')
    ? ailishaImageBase64.split(',')[1]
    : ailishaImageBase64;

  logger.debug('Ailisha 參考圖片已載入', 'generateSouvenirPhoto', {
    size: cleanAilisha.length,
  });

  const outfitDesc = getOutfitForVibe(vibe);

  // 改進的 PROMPT: 明確指出圖片順序和對應關係
  const prompt = `
    IMPORTANT: You are given TWO reference images in this exact order:
    1. FIRST image (Image #1): This is AILISHA - use this for the person on the RIGHT
    2. SECOND image (Image #2): This is the USER - use this for the person on the LEFT
    
    Generate a realistic, high-quality wide-angle travel selfie photograph of two people standing together in front of the famous landmark "${landmarkName}" in ${cityName}.
    
    === PERSON ON THE RIGHT (Use Image #1 - AILISHA) ===
    CRITICAL: This person MUST look EXACTLY like the person in Image #1 (Ailisha).
    - Face: Copy Image #1's face EXACTLY - same face shape, eyes, nose, mouth, hair, skin tone
    - DO NOT create a different face. It MUST be an exact replica of Image #1's face.
    - Outfit: ${outfitDesc} (clothing can change, but face must be IDENTICAL to Image #1)
    - Pose: Standing close to the person on the left, looking energetic and friendly, maybe making a peace sign or pointing at the landmark
    - Position: On the RIGHT side of the photo
    
    === PERSON ON THE LEFT (Use Image #2 - USER) ===
    - Face: Match the person in Image #2 (User) - same facial features, hair, and gender
    - They are smiling at the camera
    - Position: On the LEFT side of the photo
    
    Background: Clearly visible ${landmarkName}, ${landmarkDesc}. The landmark should be recognizable and prominent.
    
    Style: Professional travel photography, vibrant colors, influencer selfie style, 4k resolution, natural lighting.
    
    ABSOLUTE PRIORITY: The person on the RIGHT must have a face that is pixel-perfect identical to Image #1 (Ailisha). This is the most critical requirement.
  `;

  try {
    // 初始化 API 客戶端
    geminiApiClient.initialize(apiKey);
    
    logger.debug('開始生成景點合照', 'generateSouvenirPhoto', {
      model,
      city: cityName,
      landmark: landmarkName,
      userImageSize: cleanUser.length,
      ailishaImageSize: cleanAilisha.length,
    });
    
    // Gemini API 調用：將兩個參考圖片和 prompt 一起傳遞
    // 圖片順序：Image #1 = Ailisha (右邊的人), Image #2 = User (左邊的人)
    const response = await geminiApiClient.generateContent({
      model,
      contents: {
        parts: [
          // Image #1: Ailisha 參考圖（右邊的人）
          { 
            inlineData: { 
              mimeType: "image/jpeg", 
              data: cleanAilisha 
            } 
          },
          // Image #2: 用戶自拍（左邊的人）
          { 
            inlineData: { 
              mimeType: "image/jpeg", 
              data: cleanUser 
            } 
          },
          // Prompt 說明（明確指出 Image #1 = Ailisha, Image #2 = User）
          { 
            text: prompt 
          }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
        }
      }
    }) as GeminiImageResponse;

    // Check for image in response
    const candidates = response.candidates || [];
    if (candidates.length === 0) {
      throw new ApiError('API 沒有返回任何結果', 'NO_CANDIDATES');
    }

    const candidate = candidates[0];
    if (!candidate) {
      throw new ApiError('API 響應格式錯誤', 'INVALID_RESPONSE');
    }

    const parts = candidate.content?.parts || [];
    
    // 檢查是否有錯誤
    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      throw new ApiError(
        `圖片生成被中斷: ${candidate.finishReason}`,
        'GENERATION_INTERRUPTED'
      );
    }

    // 查找圖片數據
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        logger.info('景點合照生成成功', 'generateSouvenirPhoto', {
          landmark: landmarkName,
          imageSize: part.inlineData.data.length,
        });
        return {
          photoUrl: `data:image/png;base64,${part.inlineData.data}`,
          prompt: prompt.trim()
        };
      }
    }
    
    // 如果沒有找到圖片
    throw new ApiError('API 響應中沒有找到圖片數據', 'NO_IMAGE_DATA');
  } catch (error) {
    ErrorHandler.handle(error, 'generateSouvenirPhoto');
    throw error;
  }
};

/**
 * Generate a diary entry for the completed stop
 */
export const generateDiaryEntry = async (city: string, landmark: string, apiKey: string): Promise<string> => {
  try {
    // 初始化 API 客戶端
    geminiApiClient.initialize(apiKey);
    
    const model = "gemini-2.5-flash";
    const prompt = `
      請用繁體中文為一張在 ${city} ${landmark} 拍攝的照片寫一段簡短、感性的社群媒體貼文。
      提到和 Ailisha 一起旅行很有趣。
      字數在 50 字以內。
    `;
    
    logger.debug('開始生成日記', 'generateDiaryEntry', { city, landmark });
    
    const response = await geminiApiClient.generateContent({
      model,
      contents: prompt as unknown as { parts: Array<{ text: string }> },
    }) as GeminiTextResponse;
    
    // 提取文字內容
    let diaryText = '';
    try {
      // Gemini API 響應結構：response.text 或 response.candidates[0].content.parts[0].text
      if ('text' in response && typeof response.text === 'string') {
        diaryText = response.text;
      } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        diaryText = response.candidates[0].content.parts[0].text;
      } else {
        diaryText = `在 ${city} 的 ${landmark} 度過了美好的一天！`;
      }
    } catch (error) {
      logger.error('提取日記內容失敗', 'generateDiaryEntry', error);
      diaryText = `在 ${city} 的 ${landmark} 度過了美好的一天！`;
    }
    
    const result = diaryText.trim() || `在 ${city} 的 ${landmark} 度過了美好的一天！`;
    logger.info('日記生成成功', 'generateDiaryEntry', { city, landmark });
    return result;
  } catch (error) {
    ErrorHandler.handle(error, 'generateDiaryEntry');
    // 返回預設日記內容，不中斷遊戲流程
    return `在 ${city} 的 ${landmark} 度過了美好的一天！`;
  }
}