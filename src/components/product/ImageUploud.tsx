"use client";

import { FC, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, X, ImagePlus } from "lucide-react";

interface ImageUploadProps {
  imageUrl?: string;
  onImageChange: (url: string) => void;
  disabled?: boolean;
}

const ImageUpload: FC<ImageUploadProps> = ({
  imageUrl,
  onImageChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0];

    if (file) {
      setIsLoading(true);
      setError(null);

      try {
        if (!file.type.startsWith("image/")) {
          throw new Error("Please upload an image file");
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Image size should be less than 5MB");
        }
        const url = URL.createObjectURL(file);
        onImageChange(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload image");
      } finally {
        setIsLoading(false);
        event.target.value = "";
      }
    }
  };

  const handleImageRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onImageChange("");
      setError(null);
    }
  };

  return (
    <div
      className={`
        relative 
        w-[200px] 
        h-[200px] 
        border-2 
        rounded-lg 
        overflow-hidden
        transition-all
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-300"}
        ${error ? "border-red-500" : "border-gray-200"}
        ${isLoading ? "border-blue-500" : ""}
      `}
    >
      <div onClick={handleImageClick} className="w-full h-full relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Uploaded image"
            width={200}
            height={200}
            className="object-center"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <ImagePlus className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
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

      {error && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-red-500 text-white text-xs">
          {error}
        </div>
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
