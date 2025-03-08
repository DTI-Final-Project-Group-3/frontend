"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { postFileBuilderIo } from "@/app/api/builder-io/postBuilderIo";
import { toast } from "@/hooks/use-toast";
import TestProductImageUpload from "@/components/product/TestProductImageUpload";

const TextImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState<
    Map<number, string | File>
  >(new Map());

  const handleSubmit = async () => {
    try {
      const uploadPromises = selectedImages.map(async (image, index) => {
        const response = await postFileBuilderIo({
          name: image.file.name,
          altText: image.file.name,
          folder: process.env.NEXT_PUBLIC_BUILDER_IO_PRODUCT_IMAGE_FOLDER_ID,
          file: image.file,
        });
        return {
          url: response.url,
          position: index + 1,
        };
      });
      const responses = await Promise.all(uploadPromises);
    } catch {
      toast({
        title: "Failed to upload images",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
    console.log("submit", selectedImages);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-full">
        <TestProductImageUpload
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      </div>

      <Button className="w-40" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default TextImageUpload;
