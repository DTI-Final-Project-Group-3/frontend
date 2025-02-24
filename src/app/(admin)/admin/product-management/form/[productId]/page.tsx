"use client";

import { getProductDetailById } from "@/app/api/product/getProducts";
import ProductManagementHeader from "@/components/product-management/ProductManagementHeader";
import ProductFormComponent from "@/components/product/ProductForm";
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
    <section className="w-full rounded-2xl bg-white py-4 md:py-7 min-h-[calc(100vh-178px)] shadow-sm">
      <ProductManagementHeader />

      <div className="mt-4 md:mt-7 w-full overflow-x-auto flex justify-center px-4 md:px-17 text-gray-600">
        {data && !isLoading && !isFetching && (
          <ProductFormComponent props={data}></ProductFormComponent>
        )}
      </div>
    </section>
  );
};

export default EditProductFormPage;
