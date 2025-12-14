import React, { ChangeEvent } from 'react';

interface PhotoUploadProps {
  onImageSelected: (base64: string) => void;
  onFileChange?: (file: File) => void;
  previewImage?: string | null;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImageSelected, onFileChange, previewImage }) => {
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
    <div className="w-full group relative">
      <label
        htmlFor="photo-upload"
        className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
          previewImage 
            ? 'border-pink-300 bg-pink-50 p-6 min-h-[200px]' 
            : 'border-gray-300 bg-gray-50 h-52 group-hover:bg-pink-50 group-hover:border-pink-300'
        }`}
      >
        {previewImage ? (
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg ring-4 ring-pink-100">
                <img 
                  src={previewImage} 
                  className="w-full h-full object-cover" 
                  alt="預覽"
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-pink-600">
                點擊更換照片
              </p>
              <p className="text-xs text-gray-400 mt-1">支援 PNG, JPG, WebP (最大 5MB)</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
              <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <p className="mb-2 text-base text-gray-700 font-semibold group-hover:text-pink-600 transition-colors">
              點擊上傳自拍照
            </p>
            <p className="text-xs text-gray-500">支援 PNG, JPG, WebP (最大 5MB)</p>
          </div>
        )}
      </label>
      <input
        id="photo-upload"
        type="file"
        className="absolute opacity-0 w-0 h-0 overflow-hidden"
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0, overflow: 'hidden' }}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        aria-label="上傳自拍照"
      />
    </div>
  );
};