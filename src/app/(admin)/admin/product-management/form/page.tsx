import ProductManagementHeader from "@/components/product-management/ProductManagementHeader";
import ProductForm from "@/components/product/ProductForm";
import { FC } from "react";

const ProductFormPage: FC = () => {
  return (
    <section className="w-full rounded-2xl bg-white py-4 md:py-7 min-h-[calc(100vh-178px)] shadow-sm">
      <ProductManagementHeader />

      <div className="mt-4 md:mt-7 w-full overflow-x-auto flex justify-center px-4 md:px-17 text-gray-600">
        <ProductForm />
      </div>
    </section>
  );
};

export default ProductFormPage;
