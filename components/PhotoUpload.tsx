import React, { ChangeEvent } from 'react';

interface PhotoUploadProps {
  onImageSelected: (base64: string) => void;
  onFileChange?: (file: File) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImageSelected, onFileChange }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onFileChange) {
        onFileChange(file);
      } else {
        // 回退到舊的行為
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            onImageSelected(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="w-full group">
      <label
        htmlFor="photo-upload"
        className="flex flex-col items-center justify-center w-full h-56 sm:h-64 border-2 border-dashed border-pink-300 rounded-3xl cursor-pointer bg-gradient-to-br from-white to-pink-50/50 group-hover:from-pink-50 group-hover:to-purple-50 group-hover:border-pink-400 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-[1.02]"
      >
        <div className="flex flex-col items-center justify-center pt-6 pb-8 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <p className="mb-2 text-base sm:text-lg text-gray-700 font-bold group-hover:text-pink-600 transition-colors">
            點擊上傳自拍照
          </p>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">支援 PNG, JPG, WebP (最大 5MB)</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <span>📷</span>
            <span>或拖放圖片到這裡</span>
          </div>
        </div>
        <input
          id="photo-upload"
          type="file"
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          aria-label="上傳自拍照"
        />
      </label>
    </div>
  );
};