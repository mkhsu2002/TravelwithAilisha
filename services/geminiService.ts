import { GoogleGenAI } from "@google/genai";
import { CityVibe } from "../types";
import { GeminiImageResponse, GeminiTextResponse } from "../types/api";
import { loadAilishaImage } from "../utils/ailishaImage";

// Initialize the client
let aiInstance: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

/**
 * 初始化或更新 AI 客戶端
 * @param apiKey - Gemini API Key
 */
export const initializeAI = (apiKey: string): GoogleGenAI => {
  if (!apiKey) {
    throw new Error('API Key 未設定。請在右上角點擊「設定 API Key」進行配置。');
  }

  // 如果 API Key 改變或實例不存在，創建新實例
  if (!aiInstance || currentApiKey !== apiKey) {
    aiInstance = new GoogleGenAI({ apiKey });
    currentApiKey = apiKey;
  }
  
  return aiInstance;
};

/**
 * 獲取 AI 實例（需要先初始化）
 */
const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    throw new Error('AI 客戶端未初始化。請先配置 API Key。');
  }
  return aiInstance;
};

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

  // 調試：確認圖片已載入
  console.log('Ailisha 參考圖片已載入，大小:', cleanAilisha.length, 'bytes');
  console.log('生成城市照片:', cityName, '風格:', vibe);

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
    const ai = getAI();
    
    // 調試：確認圖片數據
    console.log('Ailisha 參考圖片大小:', cleanAilisha.length, 'bytes');
    console.log('使用模型:', model);
    
    // Gemini API 調用：傳遞 Ailisha 參考圖和 prompt
    const response = await ai.models.generateContent({
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
    }) as unknown as GeminiImageResponse;

    // Check for image in response
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return {
          photoUrl: `data:image/png;base64,${part.inlineData.data}`,
          prompt: prompt.trim()
        };
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("City photo generation failed:", error);
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

  // 調試：確認圖片已載入
  console.log('Ailisha 參考圖片已載入，大小:', cleanAilisha.length, 'bytes');

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
    const ai = getAI();
    
    // 調試：確認圖片數據
    console.log('用戶圖片大小:', cleanUser.length, 'bytes');
    console.log('Ailisha 參考圖片大小:', cleanAilisha.length, 'bytes');
    console.log('使用模型:', model);
    
    // Gemini API 調用：將兩個參考圖片和 prompt 一起傳遞
    // 圖片順序：Image #1 = Ailisha (右邊的人), Image #2 = User (左邊的人)
    const response = await ai.models.generateContent({
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
    }) as unknown as GeminiImageResponse;

    // Check for image in response
    const candidates = response.candidates || [];
    if (candidates.length === 0) {
      console.error('API 響應中沒有 candidates');
      throw new Error('API 沒有返回任何結果');
    }

    const candidate = candidates[0];
    const parts = candidate?.content?.parts || [];
    
    // 檢查是否有錯誤
    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      console.error('API 響應 finishReason:', candidate.finishReason);
      throw new Error(`圖片生成被中斷: ${candidate.finishReason}`);
    }

    // 查找圖片數據
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        console.log('成功生成圖片，大小:', part.inlineData.data.length, 'bytes');
        return {
          photoUrl: `data:image/png;base64,${part.inlineData.data}`,
          prompt: prompt.trim()
        };
      }
    }
    
    // 如果沒有找到圖片
    console.error('API 響應中沒有圖片數據');
    console.error('Response structure:', JSON.stringify(response, null, 2));
    throw new Error('API 響應中沒有找到圖片數據');
  } catch (error: any) {
    console.error("Image generation failed:", error);
    // 提供更詳細的錯誤訊息
    if (error?.message) {
      throw new Error(`生成景點合照失敗: ${error.message}`);
    }
    if (error?.error?.message) {
      throw new Error(`生成景點合照失敗: ${error.error.message}`);
    }
    throw new Error('生成景點合照時發生未知錯誤，請稍後再試');
  }
};

/**
 * Generate a diary entry for the completed stop
 */
export const generateDiaryEntry = async (city: string, landmark: string, apiKey: string): Promise<string> => {
  // 確保 AI 客戶端已初始化
  initializeAI(apiKey);
   const model = "gemini-2.5-flash";
   const prompt = `
     請用繁體中文為一張在 ${city} ${landmark} 拍攝的照片寫一段簡短、感性的社群媒體貼文。
     提到和 Ailisha 一起旅行很有趣。
     字數在 50 字以內。
   `;
   
   const ai = getAI();
   const response = await ai.models.generateContent({
       model,
       contents: prompt
   });
   
   // 提取文字內容
   let diaryText = '';
   try {
     // Gemini API 響應結構：response.text 或 response.candidates[0].content.parts[0].text
     if (response.text) {
       diaryText = response.text;
     } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
       diaryText = response.candidates[0].content.parts[0].text;
     } else {
       diaryText = `在 ${city} 的 ${landmark} 度過了美好的一天！`;
     }
   } catch (error) {
     console.error('提取日記內容失敗:', error);
     diaryText = `在 ${city} 的 ${landmark} 度過了美好的一天！`;
   }
   
   return diaryText.trim() || `在 ${city} 的 ${landmark} 度過了美好的一天！`;
}