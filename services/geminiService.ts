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
 * Generates the souvenir photo using gemini-3-pro-image-preview
 */
export const generateSouvenirPhoto = async (
  userSelfieBase64: string,
  cityName: string,
  landmarkName: string,
  landmarkDesc: string,
  vibe: CityVibe,
  apiKey: string
): Promise<string> => {
  // 確保 AI 客戶端已初始化
  initializeAI(apiKey);
  const model = "gemini-3-pro-image-preview";

  // Clean base64 strings
  const cleanUser = userSelfieBase64.includes(',') 
    ? userSelfieBase64.split(',')[1] 
    : userSelfieBase64;

  // 載入 Ailisha 參考圖片
  const ailishaImageBase64 = await loadAilishaImage();
  const cleanAilisha = ailishaImageBase64.includes(',')
    ? ailishaImageBase64.split(',')[1]
    : ailishaImageBase64;

  const outfitDesc = getOutfitForVibe(vibe);

  // UPDATED PROMPT: 
  // 1. Use Ailisha reference image for face consistency.
  // 2. Dynamic outfit based on location vibe.
  const prompt = `
    Generate a realistic, high-quality wide-angle travel selfie of two people standing in front of the famous ${landmarkName} in ${cityName}.
    
    Person 1 (Left): Matches the facial features, hair, and gender of the person in the first reference image (User). They are smiling at the camera.
    
    Person 2 (Right): This is Ailisha. 
    **Face**: She MUST match the facial features, appearance, and look exactly like the person in the second reference image. Maintain complete facial consistency with the reference photo.
    **Outfit**: She is wearing ${outfitDesc}.
    **Pose**: She is standing close to Person 1, looking energetic and friendly, maybe making a peace sign or pointing at the landmark.
    
    Background: Clearly visible ${landmarkName}, ${landmarkDesc}. 
    Style: Professional travel photography, vibrant colors, influencer selfie style, 4k resolution.
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanUser } },
          { inlineData: { mimeType: "image/jpeg", data: cleanAilisha } },
          { text: prompt }
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
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
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