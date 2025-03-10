"use client";

import Link from "next/link";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import AddProductCategory from "@/components/product-management/categories/AddProductCategory";
import { useProductAdmin } from "@/store/productAdminStore";
import ProductCategorySelection from "@/components/product-management/categories/ProductCategorySelection";
import { useSession } from "next-auth/react";
import { userRoles } from "@/constant/userConstant";

interface ProductManagementHeaderProps {
  selectedTab?: number;
}

const ProductManagementHeader: FC<ProductManagementHeaderProps> = ({
  selectedTab,
}) => {
  const {
    searchQuery,
    productCategoryId,
    setSearchQuery,
    setProductCategoryId,
    setProductPage,
  } = useProductAdmin();
  const { data } = useSession();

  return (
    <div className="z-[40] flex w-full flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-7 md:sticky md:top-[0]">
      <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
        Product Management
      </h2>
      <div className="flex h-full flex-col gap-3 sm:w-auto sm:flex-row">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 sm:w-auto"
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

        {selectedTab === 1 && (
          <>
            <div className="w-60">
              <ProductCategorySelection
                productCategoryId={productCategoryId}
                setProductCategoryId={setProductCategoryId}
                setPage={setProductPage}
              />
            </div>

            {data?.role === userRoles.ADMIN_SUPER && (
              <Link href={`/admin/product-management/form`}>
                <Button className="h-full">Add Product</Button>
              </Link>
            )}
          </>
        )}
        {selectedTab === 2 && data?.role === userRoles.ADMIN_SUPER && (
          <AddProductCategory />
        )}
      </div>
    </div>
  );
};

export default ProductManagementHeader;
