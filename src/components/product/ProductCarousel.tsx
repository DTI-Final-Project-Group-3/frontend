"use client";

import { ProductImage } from "@/types/models/products";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface ProductCarouselProps {
  productName: string;
  images: ProductImage[];
  isBanner?: boolean;
}

const ProductCarousel: FC<ProductCarouselProps> = ({
  productName,
  images,
  isBanner,
}) => {
  const [selectedImagePosition, setSelectedImagePosition] = useState<number>(1);
  const [mainImageUrl, setMainImageUrl] = useState<string>(
    "/images/no-image-icon.jpg",
  );
  const [imagesUrl, setImagesUrl] = useState<ProductImage[]>([]);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleImageChange = (changePosition: number, directChange: boolean) => {
    const maxPosition = imagesUrl.reduce(
      (max, image) => (image.position > max ? image.position : max),
      1,
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
      (image) => image.position === newPosition,
    )?.url;
    setMainImageUrl(selectedPictureUrl ?? "/images/no-image-icon.jpg");
  };

  const handleMainImageError = () => {
    setMainImageUrl("/images/no-image-icon.jpg");
  };

  const handleImagesError = (position: number) => {
    const objIndex = imagesUrl.findIndex(
      (image) => image.position === position,
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
    <div className="mx-auto flex w-full max-w-screen-lg flex-col">
      <div className="relative flex w-full items-center justify-center">
        <button
          onClick={() => handleImageChange(-1, false)}
          className="absolute left-2 z-10 rounded-full bg-white/80 p-2.5 text-gray-700 shadow-md transition-colors duration-200 hover:bg-white hover:text-gray-900"
          aria-label="Previous image"
        >
          ←
        </button>
        <div
          className="relative aspect-square w-full bg-gray-50"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={mainImageUrl}
            fill
            alt={productName}
            onError={handleMainImageError}
            priority
            className="object-contain p-2"
            sizes="500px, 500px"
          />
        </div>
        <button
          onClick={() => handleImageChange(1, false)}
          className="absolute right-2 z-10 rounded-full bg-white/80 p-2.5 text-gray-700 shadow-md transition-colors duration-200 hover:bg-white hover:text-gray-900"
          aria-label="Next image"
        >
          →
        </button>
      </div>

      {!isBanner && (
        <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-4 flex gap-3 overflow-x-auto px-2 pb-2">
          {imagesUrl
            .sort((a, b) => a.position - b.position)
            .map((image) => (
              <div
                key={image.position}
                className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors duration-200 ${
                  selectedImagePosition === image.position
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={image.url}
                  fill
                  alt={productName}
                  onClick={() => handleImageChange(image.position, true)}
                  onError={() => handleImagesError(image.position)}
                  className="cursor-pointer object-cover"
                  sizes="200px, 200px"
                  priority
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
