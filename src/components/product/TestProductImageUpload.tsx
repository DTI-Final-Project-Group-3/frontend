import React, { ChangeEvent, FC, useEffect, useMemo } from "react";
import { ProductImage } from "@/types/models/products";
import ImageComponent from "@/components/common/ImageComponent";
import { ImagePlus, PenSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestProductImageUploadProps {
  existingImage?: ProductImage[];
  selectedImages: Map<number, string | File>;
  setSelectedImages: (val: Map<number, string | File>) => void;
}

const TestProductImageUpload: FC<TestProductImageUploadProps> = ({
  existingImage,
  selectedImages,
  setSelectedImages,
}) => {
  useEffect(() => {
    if (existingImage) {
      const newMap = new Map(selectedImages);
      existingImage.forEach((image) => {
        newMap.set(image.position, image.url);
      });
      setSelectedImages(newMap);
    }
  }, []);

  const handleFileChange = (
    position: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
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
      const newMap = new Map(selectedImages);
      newMap.set(position, file);
      setSelectedImages(newMap);
    }
    event.target.value = "";
  };

  const isPositionSelectable = (position: number): boolean => {
    if (position === 1) return true;
    return selectedImages.has(position - 1);
  };

  const handleImageRemove = (position: number) => {
    const newMap = new Map<number, string | File>();

    selectedImages.forEach((value, key) => {
      if (key < position) {
        newMap.set(key, value);
      } else if (key > position) {
        newMap.set(key - 1, value);
      }
    });

    setSelectedImages(newMap);
  };

  const imageUrls = useMemo(() => {
    const urls = new Map<number, string>();
    selectedImages.forEach((value, key) => {
      if (value instanceof File) {
        urls.set(key, URL.createObjectURL(value));
      } else {
        urls.set(key, value);
      }
    });
    return urls;
  }, [selectedImages]);

  return (
    <div className="grid w-full grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, index) => {
        const position = index + 1;
        const imageUrl = imageUrls.get(position);

        return (
          <div
            className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all`}
            key={index}
          >
            <div className="relative h-full w-full">
              {imageUrl ? (
                <ImageComponent
                  key={imageUrl}
                  src={imageUrl}
                  alt="Product image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                  priority
                />
              ) : (
                <>
                  <input
                    type="file"
                    id={`image-input-${index}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(position, e)}
                    disabled={!isPositionSelectable(position)}
                  />
                  <label htmlFor={`image-input-${index}`}>
                    <div
                      className={cn(
                        "flex h-full items-center justify-center",
                        isPositionSelectable(position)
                          ? "cursor-pointer bg-white"
                          : "cursor-not-allowed bg-gray-100",
                      )}
                    >
                      <ImagePlus className="h-12 w-12 text-gray-400" />
                    </div>
                  </label>
                </>
              )}
            </div>

            {imageUrl && (
              <>
                <button
                  type="button"
                  onClick={() => handleImageRemove(position)}
                  className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md transition-colors hover:bg-gray-100"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>

                <input
                  type="file"
                  id={`image-change-${index}`}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(position, e)}
                />

                <label
                  htmlFor={`image-change-${index}`}
                  className="absolute left-3 top-2 cursor-pointer rounded-full bg-white p-1 shadow-md transition-colors hover:bg-gray-100"
                  aria-label="Change image"
                >
                  <PenSquare className="h-4 w-4" />
                </label>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TestProductImageUpload;
