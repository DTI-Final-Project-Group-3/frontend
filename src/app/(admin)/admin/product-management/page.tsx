"use client";

import { getPaginatedProducts } from "@/app/api/getProducts";
import { PaginationProductAdmin } from "@/components/pagination/PaginationProductAdmin";
import ActionButtons from "@/components/product-management/ActionButtons";
import ProductManagementHeader from "@/components/product-management/ProductManagementHeader";
import { ADMIN_PRODUCT_PER_PAGE } from "@/constant/productConstant";
import { formatPrice } from "@/utils/formatter";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ProductManagementPage = () => {
  const [page, setPage] = useState<number>(0);
  const [productCategoryId, setProductCategoryId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<Map<number, string>>(new Map());

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products", page, productCategoryId, searchQuery],
    queryFn: () =>
      getPaginatedProducts({
        page: page,
        limit: ADMIN_PRODUCT_PER_PAGE,
        productCategoryId,
        searchQuery,
      }),
  });

  const handleImageOnError = (productId: number) => {
    setImageUrls((prev) => {
      const newMap = new Map(prev);
      newMap.set(productId, "/images/no-image-icon.jpg");
      return newMap;
    });
  };

  useEffect(() => {
    if (products) {
      const newMap = new Map<number, string>();
      products.content.forEach((product) => {
        newMap.set(
          product.id,
          product.thumbnail ?? "/images/no-image-icon.jpg"
        );
      });
      setImageUrls(newMap);
    }
  }, [products]);

  return (
    <section className="w-full rounded-2xl bg-white py-4 md:py-7 min-h-[calc(100vh-178px)] shadow-sm">
      <ProductManagementHeader />

      <div className="mt-4 md:mt-7 px-4 md:px-10">
        {productsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : products?.content.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium">No products found</h3>
            <p className="mt-1">
              Try changing your search criteria or add a new product.
            </p>
          </div>
        ) : (
          <div className="md:min-h-[calc(100vh-300px)]">
            <div className="hidden md:block">
              <div className="grid grid-cols-[40%_20%_10%_15%_15%] mb-2 px-2 border-b border-gray-200 pb-2">
                <div className="text-gray-700 font-medium">Name</div>
                <div className="text-gray-700 font-medium">Category</div>
                <div className="text-gray-700 font-medium">Price</div>
                <div className="text-gray-700 font-medium text-center">
                  Thumbnail
                </div>
                <div className="text-gray-700 font-medium text-center">
                  Actions
                </div>
              </div>

              <div className="space-y-2">
                {products?.content.map((product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-[40%_20%_10%_15%_15%] items-center p-2 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-gray-800 truncate">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        ID: {product.id}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <span className="px-3 py-1 text-sm rounded-full bg-gray-200 truncate inline-block max-w-full">
                        {product.categoryName}
                      </span>
                    </div>

                    <div className="font-medium text-gray-800 truncate">
                      {formatPrice(String(product.price))}
                    </div>

                    <div className="flex justify-center">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={
                            imageUrls.get(product.id) ??
                            "/images/no-image-icon.jpg"
                          }
                          fill
                          className="object-cover"
                          alt={`${product.name} thumbnail`}
                          onError={() => handleImageOnError(product.id)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-center space-x-2">
                      <ActionButtons productId={product.id} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:hidden space-y-4">
              {products?.content.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={
                          imageUrls.get(product.id) ??
                          "/images/no-image-icon.jpg"
                        }
                        fill
                        className="object-cover"
                        alt={`${product.name} thumbnail`}
                        onError={() => handleImageOnError(product.id)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">ID: {product.id}</p>
                      <span className="inline-block px-3 py-1 text-sm rounded-full bg-gray-200 mt-1 truncate">
                        {product.categoryName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="font-medium text-gray-800">
                      {formatPrice(String(product.price))}
                    </span>
                    <div className="flex space-x-2">
                      <ActionButtons productId={product.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {products && (
          <div className="mt-6">
            <PaginationProductAdmin
              currentPage={page}
              totalPages={products.totalPages}
              hasNext={products.hasNext}
              hasPrev={products.hasPrev}
              onPageChange={setPage}
              totalElements={products.totalElements}
              currentPageSize={products.content.length}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductManagementPage;
