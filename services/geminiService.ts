import { GoogleGenAI } from "@google/genai";
import { CityVibe } from "../types";

// Initialize the client. 
// NOTE: API Key is managed via process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  vibe: CityVibe
): Promise<string> => {
  const model = "gemini-3-pro-image-preview";

  // Clean base64 strings
  const cleanUser = userSelfieBase64.includes(',') 
    ? userSelfieBase64.split(',')[1] 
    : userSelfieBase64;

  const outfitDesc = getOutfitForVibe(vibe);

  // UPDATED PROMPT: 
  // 1. Stronger face consistency instruction.
  // 2. Dynamic outfit based on location vibe.
  const prompt = `
    Generate a realistic, high-quality wide-angle travel selfie of two people standing in front of the famous ${landmarkName} in ${cityName}.
    
    Person 1 (Left): Matches the facial features, hair, and gender of the person in the provided reference image (User). They are smiling at the camera.
    
    Person 2 (Right): This is Ailisha. 
    **Face**: She MUST look like a specific Asian female influencer. She has long, dark, wavy hair (volume), soft almond-shaped eyes, a delicate nose, and a radiant, photogenic smile. She has a slender, fit physique.
    **Outfit**: She is wearing ${outfitDesc}.
    **Pose**: She is standing close to Person 1, looking energetic and friendly, maybe making a peace sign or pointing at the landmark.
    
    Background: Clearly visible ${landmarkName}, ${landmarkDesc}. 
    Style: Professional travel photography, vibrant colors, influencer selfie style, 4k resolution.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanUser } },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
        }
      }
    });

    // Check for image in response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
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
export const generateDiaryEntry = async (city: string, landmark: string): Promise<string> => {
   const model = "gemini-2.5-flash";
   const prompt = `
     請用繁體中文為一張在 ${city} ${landmark} 拍攝的照片寫一段簡短、感性的社群媒體貼文。
     提到和 Ailisha 一起旅行很有趣。
     字數在 50 字以內。
   `;
   
   const response = await ai.models.generateContent({
       model,
       contents: prompt
   });
   return response.text || `在 ${city} 的 ${landmark} 度過了美好的一天！`;
}