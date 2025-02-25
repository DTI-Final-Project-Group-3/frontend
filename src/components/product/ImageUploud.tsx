"use client";

import { FC, useRef } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
  imageUrl?: string;
  onImageChange: (file: File | null) => void;
  disabled?: boolean;
}

const ImageUpload: FC<ImageUploadProps> = ({
  imageUrl,
  onImageChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Validate file
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      onImageChange(file);
    }
    event.target.value = "";
  };

  const handleImageRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onImageChange(null);
    }
  };

  return (
    <div
      className={`
        relative 
        w-full 
        aspect-square 
        border-2 
        rounded-lg 
        overflow-hidden
        transition-all
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-300"}
        border-gray-200
      `}
    >
      <div onClick={handleImageClick} className="w-full h-full relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Product image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <ImagePlus className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {imageUrl && !disabled && (
        <button
          type="button"
          onClick={handleImageRemove}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ImageUpload;
