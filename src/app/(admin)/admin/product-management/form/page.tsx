import ProductManagementHeader from "@/components/product-management/ProductManagementHeader";
import ProductFormComponent from "@/components/product-management/products/ProductForm";
import { FC } from "react";

const ProductFormPage: FC = () => {
  return (
    <section className="min-h-[calc(100vh-178px)] w-full space-y-2 rounded-lg py-4 shadow-sm md:py-7">
      <ProductManagementHeader />
      <div className="md:px-17 flex w-full justify-center overflow-x-auto rounded-lg bg-white px-4 py-5 text-gray-600 md:py-10">
        <ProductFormComponent />
      </div>
    </section>
  );
};

export default ProductFormPage;
