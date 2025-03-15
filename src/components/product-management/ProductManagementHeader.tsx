"use client";

import Link from "next/link";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import AddProductCategory from "@/components/product-management/categories/AddProductCategory";
import { useSession } from "next-auth/react";
import { userRoles } from "@/constant/userConstant";

interface ProductManagementHeaderProps {
  selectedTab?: number;
}

const ProductManagementHeader: FC<ProductManagementHeaderProps> = ({
  selectedTab,
}) => {
  const { data } = useSession();

  return (
    <div className="z-[40] grid grid-cols-1 gap-3 rounded-xl bg-white p-7 md:sticky md:top-[0] md:grid-cols-3">
      <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
        Product Management
      </h2>
      <div className="md:col-start-3 md:grid md:grid-cols-3">
        <div className="col-start-3">
          {selectedTab === 1 && data?.role === userRoles.ADMIN_SUPER && (
            <Link href={`/admin/product-management/form`}>
              <Button className="h-full w-full">Add Product</Button>
            </Link>
          )}
          {selectedTab === 2 && data?.role === userRoles.ADMIN_SUPER && (
            <AddProductCategory />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagementHeader;
