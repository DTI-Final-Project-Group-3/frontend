"use client";

import { getProductDetailById } from "@/app/api/product/getProducts";
import ProductManagementHeader from "@/components/product-management/ProductManagementHeader";
import ProductFormComponent from "@/components/product-management/ProductForm";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FC } from "react";

const EditProductFormPage: FC = () => {
  const { productId } = useParams();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetailById({ productId: Number(productId) }),
  });

  return (
    <section className="min-h-[calc(100vh-178px)] w-full rounded-2xl bg-white py-4 shadow-sm md:py-7">
      <ProductManagementHeader />

      <div className="md:px-17 mt-4 flex w-full justify-center overflow-x-auto px-4 text-gray-600 md:mt-7">
        {data && !isLoading && !isFetching && (
          <ProductFormComponent props={data} />
        )}
      </div>
    </section>
  );
};

export default EditProductFormPage;
