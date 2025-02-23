"use client";

import { getProductDetailById } from "@/app/api/getProducts";
import ProductManagementHeader from "@/components/product-management/ProductManagementHeader";
import ProductCarousel from "@/components/product/ProductCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDimension, formatPrice, formatWeight } from "@/utils/formatter";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FC } from "react";

const ProductAdmin: FC = () => {
  const { productId } = useParams();

  const { data: productDetail, isLoading: productDetailLoading } = useQuery({
    queryKey: ["product"],
    queryFn: () => getProductDetailById({ productId: Number(productId) }),
  });

  return (
    <section className="w-full rounded-2xl bg-white py-4 md:py-7 min-h-[calc(100vh-178px)] shadow-sm">
      <ProductManagementHeader />

      {!productDetail || productDetailLoading ? (
        <Skeleton className="w-10"></Skeleton>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-10 px-20">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-md">
              {productDetail && (
                <ProductCarousel
                  productName={productDetail.name ?? "product"}
                  images={productDetail.images ?? []}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-2xl md:text-4xl font-poppins font-semibold">
              {productDetail?.name}
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              {productDetail?.description}
            </p>
            <h2 className={"text-2xl md:text-3xl font-poppins font-medium"}>
              {formatPrice(String(productDetail.price))}
            </h2>

            <div className="space-y-4">
              <div>
                <h2 className="text-gray-700 font-semibold mb-1">Dimensions</h2>
                <div className="flex gap-2">
                  <p>{formatDimension(productDetail.length)} x</p>
                  <p>{formatDimension(productDetail.width)} x</p>
                  <p>{formatDimension(productDetail.height)}</p>
                </div>
              </div>

              <div>
                <h2 className="text-gray-700 font-semibold mb-1">Weight</h2>
                <p>{formatWeight(productDetail.weight)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <p className="text-gray-600">Category</p>
              <p>{productDetail.category.name}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductAdmin;
