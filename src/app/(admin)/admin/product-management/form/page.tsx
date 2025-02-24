"use client";

import { deleteAssetBuilderIo } from "@/app/api/builder-io/deleteBuilderIo";
import { postFileBuilderIo } from "@/app/api/builder-io/postBuilderIo";
import ProductManagementHeader from "@/components/product-management/ProductManagementHeader";
import ProductFormComponent from "@/components/product/ProductForm";
import { FC, useEffect, useState } from "react";

const ProductFormPage: FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(Array.from(files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (images.length === 0) return;

    try {
      // Upload each image concurrently
      const responses = await Promise.all(
        images.map((file) =>
          postFileBuilderIo({
            name: file.name,
            altText: file.name,
            folder: process.env.NEXT_PUBLIC_BUILDER_IO_PRODUCT_FOLDER_ID,
            file,
          })
        )
      );
      // Map the responses to an array of URLs
      const urls = responses.map((res) => res.url);
      setImageUrls(urls);
      console.log("Uploaded image URLs:", urls);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  useEffect(() => {
    console.log("Current uploaded image URLs:", imageUrls);
  }, [imageUrls]);

  return (
    <section className="w-full rounded-2xl bg-white py-4 md:py-7 min-h-[calc(100vh-178px)] shadow-sm">
      <ProductManagementHeader />

      <div className="mt-4 md:mt-7 w-full overflow-x-auto flex justify-center px-4 md:px-17 text-gray-600">
        <ProductFormComponent />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col items-center gap-4"
      >
        <input
          type="file"
          accept="image/jpeg,image/gif,image/png"
          onChange={handleImageChange}
          multiple
          className="border p-2 rounded"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default ProductFormPage;
