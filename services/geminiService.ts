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
  geminiApiClient.initialize(apiKey);
  const model = "gemini-2.5-flash";

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
    你必須使用提供的參考圖片來生成 Ailisha 的臉部。參考圖片顯示了 Ailisha 的確切外觀。
    
    生成一張真實、高品質的垂直旅行照片（9:16 比例），照片中 Ailisha 正在探索並享受 ${cityName}。
    
    關鍵要求 - 使用參考圖片生成 AILISHA 的臉部：
    - 參考圖片（第一張圖片）顯示了 Ailisha 的確切臉部、特徵和外觀。
    - 你必須完全複製參考圖片中的人物：
      * 完全相同的臉型輪廓和結構
      * 完全相同的眼睛（形狀、顏色、表情）
      * 完全相同的鼻子
      * 完全相同的嘴巴和笑容
      * 完全相同的髮型（樣式、顏色、長度）
      * 完全相同的膚色
      * 完全相同的整體面部外觀和特徵
    - 不要創建通用或不同的臉部。臉部必須是參考圖片的完全複製品。
    - 服裝：${outfitDesc}（服裝可以改變，但臉部必須與參考圖片完全相同）
    - 姿勢：Ailisha 自然地探索城市，看起來輕鬆愉快。她可能：
      * 在街頭市場中行走
      * 站在俯瞰城市的觀景點
      * 坐在咖啡館
      * 用手機拍照
      * 觀看有趣的建築或風景
    - 表情：自然、快樂、放鬆，享受當下
    
    背景：清楚地顯示 ${cityName} - ${cityDescription}。城市應該具有可識別的特徵、建築和氛圍。包含代表城市氛圍的元素：${vibe}。
    
    風格：專業旅行攝影，鮮豔色彩，自然光線，Instagram 風格構圖，4K 解析度，垂直格式（9:16 比例）。
    
    最重要：Ailisha 的臉部必須與參考圖片完全一致。完全複製參考圖片中的臉部。這是絕對的首要任務。
  `;

  try {
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
 * Simplified version: Only generates photo of the user at the landmark
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
  geminiApiClient.initialize(apiKey);
  const model = "gemini-2.5-flash";

  // Clean base64 strings
  const cleanUser = userSelfieBase64.includes(',') 
    ? userSelfieBase64.split(',')[1] 
    : userSelfieBase64;

  if (!cleanUser) {
    throw new Error('用戶自拍照無效');
  }

  // 載入 Ailisha 參考圖片
  const ailishaImageBase64 = await loadAilishaImage();
  
  if (!ailishaImageBase64) {
    throw new Error('無法載入 Ailisha 參考圖片');
  }
  
  const cleanAilisha = ailishaImageBase64.includes(',')
    ? ailishaImageBase64.split(',')[1]
    : ailishaImageBase64;

  logger.debug('開始生成景點合照', 'generateSouvenirPhoto', {
    model,
    city: cityName,
    landmark: landmarkName,
    userImageSize: cleanUser.length,
    ailishaImageSize: cleanAilisha.length,
  });

  const outfitDesc = getOutfitForVibe(vibe);

  // 強化的提示詞：Ailisha 與玩家兩人合照（繁體中文）
  const prompt = `
    你被提供了兩張參考圖片，按照以下順序：
    1. 第一張圖片（Image #1）：這是 AILISHA - 用於右邊的人
    2. 第二張圖片（Image #2）：這是玩家（USER）- 用於左邊的人
    
    生成一張真實、高品質的寬角旅行自拍照片，照片中有兩個人一起站在 ${cityName} 的著名地標 "${landmarkName}" 前。
    
    === 右邊的人（使用 Image #1 - AILISHA）===
    關鍵要求：這個人必須看起來完全像 Image #1 中的 Ailisha。
    - 臉部：完全複製 Image #1 的臉部 - 相同的臉型、眼睛、鼻子、嘴巴、髮型、膚色
    - 不要創建不同的臉部。必須是 Image #1 臉部的完全複製品
    - 服裝：${outfitDesc}（服裝可以改變，但臉部必須與 Image #1 完全相同）
    - 姿勢：站在左邊的人旁邊，看起來充滿活力和友善，可能比出勝利手勢或指向地標
    - 位置：照片的右側
    
    === 左邊的人（使用 Image #2 - 玩家）===
    - 臉部：匹配 Image #2 中的人物 - 相同的面部特徵、髮型和性別
    - 他們正對著鏡頭微笑
    - 位置：照片的左側
    
    背景：清楚地顯示 ${landmarkName}，${landmarkDesc}。地標應該清晰可辨且突出。
    
    風格：專業旅行攝影，鮮豔色彩，自然光線，網紅自拍風格，4K 解析度，正方形格式（1:1 比例）。
    
    絕對優先：右邊的人必須擁有與 Image #1（Ailisha）完全一致的臉部。這是最關鍵的要求。
  `;

  try {
    // Gemini API 調用：傳遞兩張參考圖片和 prompt
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
          // Prompt 說明
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

    // Check for image in response - 使用與 generateCityPhoto 相同的解析邏輯
    const parts = response.candidates?.[0]?.content?.parts || [];
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
    throw new ApiError("API 沒有返回圖片", "NO_IMAGE_GENERATED");
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
      contents: {
        parts: [
          { text: prompt.trim() }
        ]
      },
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