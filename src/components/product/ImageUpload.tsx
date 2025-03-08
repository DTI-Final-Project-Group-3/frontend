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
      className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-gray-300"} border-gray-200`}
    >
      <div onClick={handleImageClick} className="relative h-full w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Product image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-50">
            <ImagePlus className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {imageUrl && !disabled && (
        <button
          type="button"
          onClick={handleImageRemove}
          className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md transition-colors hover:bg-gray-100"
          aria-label="Remove image"
        >
          <X className="h-4 w-4" />
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
