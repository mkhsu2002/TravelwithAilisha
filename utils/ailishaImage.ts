/**
 * Ailisha 圖片工具函數
 */

let ailishaImageBase64: string | null = null;

/**
 * 載入 Ailisha.jpg 並轉換為 base64
 */
export const loadAilishaImage = async (): Promise<string> => {
  if (ailishaImageBase64) {
    return ailishaImageBase64;
  }

  try {
    const response = await fetch('/Ailisha.jpg');
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        ailishaImageBase64 = base64;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('載入 Ailisha 圖片失敗:', error);
    // 返回空字串，讓調用者處理錯誤
    return '';
  }
};

/**
 * 獲取 Ailisha 頭像 URL（用於 UI 顯示）
 */
export const getAilishaAvatarUrl = (): string => {
  return '/Ailisha.jpg';
};

