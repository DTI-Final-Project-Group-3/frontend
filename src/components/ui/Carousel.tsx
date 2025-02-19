"use client";

import { ProductImage } from "@/types/models/products";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface CarouselProps {
  productName: string;
  images: ProductImage[];
  isBanner?: boolean;
}

const Carousel: FC<CarouselProps> = ({ productName, images, isBanner }) => {
  const [selectedImagePosition, setSelectedImagePosition] = useState<number>(1);
  const [mainImageUrl, setMainImageUrl] = useState<string>(
    "/images/no-image-icon.jpg"
  );
  const [imagesUrl, setImagesUrl] = useState<ProductImage[]>([]);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleImageChange = (changePosition: number, directChange: boolean) => {
    const maxPosition = imagesUrl.reduce(
      (max, image) => (image.position > max ? image.position : max),
      1
    );

    let newPosition: number;
    if (directChange) {
      newPosition = changePosition;
    } else {
      newPosition = selectedImagePosition + changePosition;
      if (newPosition < 1) {
        newPosition = maxPosition;
      } else if (newPosition > maxPosition) {
        newPosition = 1;
      }
    }

    setSelectedImagePosition(newPosition);
    const selectedPictureUrl = imagesUrl.find(
      (image) => image.position === newPosition
    )?.url;
    setMainImageUrl(selectedPictureUrl ?? "/images/no-image-icon.jpg");
  };

  const handleMainImageError = () => {
    setMainImageUrl("/images/no-image-icon.jpg");
  };

  const handleImagesError = (position: number) => {
    const objIndex = imagesUrl.findIndex(
      (image) => image.position === position
    );
    if (objIndex !== -1) {
      const updatedImages = [...imagesUrl];
      updatedImages[objIndex] = {
        ...updatedImages[objIndex],
        url: "/images/no-image-icon.jpg",
      };
      setImagesUrl(updatedImages);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      handleImageChange(diff > 0 ? 1 : -1, false);
    }
    setTouchStart(null);
  };

  useEffect(() => {
    const initialImage =
      images.find((image) => image.position === 1)?.url ??
      "/images/no-image-icon.jpg";
    setMainImageUrl(initialImage);
    setImagesUrl(images);
  }, [images]);

  return (
    <div className="flex flex-col w-full max-w-screen-lg mx-auto">
      <div className="relative flex items-center justify-center w-full">
        <button
          onClick={() => handleImageChange(-1, false)}
          className="absolute left-2 z-10 bg-white/80 rounded-full p-2.5 shadow-md hover:bg-white transition-colors duration-200 text-gray-700 hover:text-gray-900"
          aria-label="Previous image"
        >
          ←
        </button>
        <div
          className="w-full aspect-square relative bg-gray-50"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={mainImageUrl}
            fill
            style={{ objectFit: "contain" }}
            alt={productName}
            onError={handleMainImageError}
            priority
            className="p-2"
          />
        </div>
        <button
          onClick={() => handleImageChange(1, false)}
          className="absolute right-2 z-10 bg-white/80 rounded-full p-2.5 shadow-md hover:bg-white transition-colors duration-200 text-gray-700 hover:text-gray-900"
          aria-label="Next image"
        >
          →
        </button>
      </div>

      {!isBanner && (
        <div className="flex gap-3 mt-4 overflow-x-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {imagesUrl
            .sort((a, b) => a.position - b.position)
            .map((image) => (
              <div
                key={image.position}
                className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                  selectedImagePosition === image.position
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={image.url}
                  fill
                  style={{ objectFit: "cover" }}
                  alt={productName}
                  onClick={() => handleImageChange(image.position, true)}
                  onError={() => handleImagesError(image.position)}
                  className="cursor-pointer"
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
