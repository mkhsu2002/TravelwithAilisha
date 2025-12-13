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
        className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-pink-300 rounded-2xl cursor-pointer bg-white group-hover:bg-pink-50 transition-all duration-300 shadow-sm group-hover:shadow-md"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <p className="mb-2 text-sm text-gray-700 font-medium group-hover:text-pink-600 transition-colors">
            點擊上傳自拍照
          </p>
          <p className="text-xs text-gray-400">支援 PNG, JPG, WebP (最大 5MB)</p>
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