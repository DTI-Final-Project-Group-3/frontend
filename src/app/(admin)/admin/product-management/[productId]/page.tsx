"use client";

import { getProductDetailById } from "@/app/api/product/getProducts";
import ProductManagementHeader from "@/components/product-management/ProductManagementHeader";
import ProductCarousel from "@/components/product/ProductCarousel";
import { Skeleton } from "@/components/ui/skeleton";
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
    <section className="w-full space-y-2 rounded-lg py-4 shadow-sm md:py-7">
      <ProductManagementHeader />

      {!productDetail || productDetailLoading ? (
        <Skeleton className="w-10"></Skeleton>
      ) : (
        <div className="flex min-h-[calc(100vh-178px)] items-center rounded-lg bg-white">
          <div className="grid grid-cols-1 gap-8 px-20 md:grid-cols-2 md:gap-12">
            <div className="flex w-full justify-center">
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
              <h1 className="font-poppins text-2xl font-semibold md:text-4xl">
                {productDetail?.name}
              </h1>
              <p className="text-base text-gray-600 md:text-lg">
                {productDetail?.description}
              </p>
              <h2 className={"font-poppins text-2xl font-medium md:text-3xl"}>
                {formatPrice(String(productDetail.price))}
              </h2>

              <div className="space-y-4">
                <div>
                  <h2 className="mb-1 font-semibold text-gray-700">
                    Dimensions
                  </h2>
                  <div className="flex gap-2">
                    <p>{formatDimension(productDetail.length)} x</p>
                    <p>{formatDimension(productDetail.width)} x</p>
                    <p>{formatDimension(productDetail.height)}</p>
                  </div>
                </div>

                <div>
                  <h2 className="mb-1 font-semibold text-gray-700">Weight</h2>
                  <p>{formatWeight(productDetail.weight)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <p className="text-gray-600">Category</p>
                <p>{productDetail.category.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductAdmin;
