import ProductManagementHeader from "@/components/product-management/ProductManagementHeader";
import ProductFormComponent from "@/components/product-management/ProductForm";
import { FC } from "react";

const ProductFormPage: FC = () => {
  return (
    <section className="min-h-[calc(100vh-178px)] w-full rounded-2xl bg-white py-4 shadow-sm md:py-7">
      <ProductManagementHeader />
      <div className="md:px-17 mt-4 flex w-full justify-center overflow-x-auto px-4 text-gray-600 md:mt-7">
        <ProductFormComponent />
      </div>
    </section>
  );
};

export default ProductFormPage;
