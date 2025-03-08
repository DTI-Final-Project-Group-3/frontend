import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { ProductImage } from "@/types/models/products";

export interface SelectedFileImage {
  file: File;
  position: number;
}

interface ImageSelectorProps {
  existingImages?: ProductImage[];
  selectedFileImages: SelectedFileImage[];
  setSelectedFileImages: (images: SelectedFileImage[]) => void;
}

type ImageSelection =
  | { type: "existing"; url: string; position: number }
  | { type: "file"; file: File; position: number; preview: string }
  | null;

const ImageSelector: React.FC<ImageSelectorProps> = ({
  existingImages = [],
  selectedFileImages = [],
  setSelectedFileImages,
}) => {
  const [imageSelections, setImageSelections] = useState<ImageSelection[]>(
    Array(5).fill(null),
  );

  // Initialize component with existing images
  useEffect(() => {
    if (existingImages.length > 0 || selectedFileImages.length > 0) {
      const newSelections: ImageSelection[] = [...imageSelections];

      // Add existing images
      existingImages.forEach((img) => {
        if (img.position >= 0 && img.position < 5) {
          newSelections[img.position] = {
            type: "existing",
            url: img.url,
            position: img.position,
          };
        }
      });

      // Add selected file images
      selectedFileImages.forEach((img) => {
        if (img.position >= 0 && img.position < 5) {
          newSelections[img.position] = {
            type: "file",
            file: img.file,
            position: img.position,
            preview: URL.createObjectURL(img.file),
          };
        }
      });

      setImageSelections(newSelections);
    }
  }, []);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imageSelections.forEach((selection) => {
        if (selection?.type === "file" && selection.preview) {
          URL.revokeObjectURL(selection.preview);
        }
      });
    };
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    position: number,
  ): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newSelections = [...imageSelections];

      // Create preview URL
      const preview = URL.createObjectURL(file);
      newSelections[position] = { type: "file", file, position, preview };
      setImageSelections(newSelections);

      // Update parent component state
      const newSelectedFiles = [
        ...selectedFileImages.filter((img) => img.position !== position),
      ];
      newSelectedFiles.push({ file, position });
      setSelectedFileImages(newSelectedFiles);
    }
  };

  const handleDeleteImage = (position: number): void => {
    const newSelections = [...imageSelections];

    // If it's a file image, revoke the object URL to avoid memory leaks
    if (
      newSelections[position]?.type === "file" &&
      "preview" in newSelections[position]!
    ) {
      URL.revokeObjectURL((newSelections[position] as any).preview);
    }

    newSelections[position] = null;
    setImageSelections(newSelections);

    // Update parent component state
    const newSelectedFiles = selectedFileImages.filter(
      (img) => img.position !== position,
    );
    setSelectedFileImages(newSelectedFiles);
  };

  // Determine if a position is selectable (only if all previous positions are filled)
  const isPositionSelectable = (position: number): boolean => {
    if (position === 0) return true;
    for (let i = 0; i < position; i++) {
      if (imageSelections[i] === null) return false;
    }
    return true;
  };

  // Determine if a position is deletable (must be the last filled position)
  const isPositionDeletable = (position: number): boolean => {
    if (imageSelections[position] === null) return false;

    // Check if this is the last filled position
    for (let i = position + 1; i < imageSelections.length; i++) {
      if (imageSelections[i] !== null) return false;
    }

    return true;
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold">Image Selection</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-lg border-2 ${!isPositionSelectable(index) ? "border-gray-200 bg-gray-100" : imageSelections[index] ? "border-warehub-green" : "border-dashed border-gray-400 hover:border-warehub-green-light"}`}
            >
              {imageSelections[index] ? (
                <>
                  <div className="h-full w-full">
                    <img
                      src={
                        imageSelections[index]!.type === "existing"
                          ? imageSelections[index]!.url
                          : (imageSelections[index] as any).preview
                      }
                      alt={`Selected image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {isPositionDeletable(index) && (
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 bg-opacity-70 p-1 text-white transition-opacity hover:bg-opacity-100"
                      title="Delete image"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="absolute left-0 top-0 rounded-br-md bg-warehub-green px-2 py-1 text-xs text-white">
                    {index + 1}
                  </div>
                </>
              ) : (
                <div className="p-4 text-center">
                  <p className="mb-2 text-sm text-gray-500">
                    {!isPositionSelectable(index)
                      ? "Fill previous slots first"
                      : `Image ${index + 1}`}
                  </p>
                  <input
                    type="file"
                    id={`image-input-${index}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, index)}
                    disabled={!isPositionSelectable(index)}
                  />
                  <label
                    htmlFor={`image-input-${index}`}
                    className={`rounded-md px-3 py-1 text-sm ${
                      isPositionSelectable(index)
                        ? "cursor-pointer bg-warehub-green text-white hover:bg-warehub-green-light"
                        : "cursor-not-allowed bg-gray-200 text-gray-500"
                    }`}
                  >
                    Select Image
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;
