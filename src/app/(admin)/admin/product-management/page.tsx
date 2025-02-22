"use client";

import { getPaginatedProducts } from "@/app/api/getProducts";
import { PaginationProductAdmin } from "@/components/pagination/PaginationProductAdmin";
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
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center px-4 md:px-7 justify-between gap-4 border-b pb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Product Management
        </h2>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full sm:w-auto pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition duration-200">
            Add Product
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 md:mt-7 w-full overflow-x-auto px-4 md:px-7 text-gray-600">
        {productsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="text-left pl-4 py-3 bg-gray-50 rounded-l-lg font-medium text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-3 bg-gray-50 font-medium text-gray-700">
                      Category
                    </th>
                    <th className="text-left py-3 bg-gray-50 font-medium text-gray-700">
                      Price
                    </th>
                    <th className="text-center py-3 bg-gray-50 font-medium text-gray-700">
                      Thumbnail
                    </th>
                    <th className="text-center py-3 bg-gray-50 rounded-r-lg font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products?.content.map((product) => (
                    <tr
                      className="hover:bg-gray-50 transition-colors duration-150"
                      key={product.id}
                    >
                      <td className="pl-4 py-4 border-b border-gray-100">
                        <div className="font-medium text-gray-800">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {product.id}
                        </div>
                      </td>
                      <td className="py-4 border-b border-gray-100">
                        <span className="px-3 py-1 text-sm rounded-full bg-gray-200">
                          {product.categoryName}
                        </span>
                      </td>
                      <td className="py-4 border-b border-gray-100">
                        <span className="font-medium text-gray-800">
                          {formatPrice(String(product.price))}
                        </span>
                      </td>
                      <td className="py-4 border-b border-gray-100">
                        <div className="flex justify-center">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={
                                imageUrls?.get(product.id) ??
                                "/images/no-image-icon.jpg"
                              }
                              fill
                              className="object-cover"
                              alt={`${product.name} thumbnail`}
                              onError={() => handleImageOnError(product.id)}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 border-b border-gray-100">
                        <div className="flex justify-center space-x-2">
                          <ActionButtons />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
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
                          imageUrls?.get(product.id) ??
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
                      <span className="inline-block px-3 py-1 text-sm rounded-full bg-gray-200 mt-1">
                        {product.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="font-medium text-gray-800">
                      {formatPrice(String(product.price))}
                    </span>
                    <div className="flex space-x-2">
                      <ActionButtons />
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

// Extracted Action Buttons Component
const ActionButtons = () => (
  <>
    <button className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-blue-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    </button>
    <button className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-green-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </button>
    <button className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-red-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  </>
);

export default ProductManagementPage;
