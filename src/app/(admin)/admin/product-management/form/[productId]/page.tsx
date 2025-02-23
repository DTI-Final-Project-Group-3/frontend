"use client";

import { getProductDetailById } from "@/app/api/getProducts";
import ProductForm from "@/components/product/ProductForm";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FC } from "react";

const EditProductFormPage: FC = () => {
  const { productId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetailById({ productId: Number(productId) }),
  });

  return (
    <div>
      <h1>Edit Product</h1>
      <ProductForm props={data}></ProductForm>
    </div>
  );
};

export default EditProductFormPage;
