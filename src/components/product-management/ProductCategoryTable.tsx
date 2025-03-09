"use client";

import React, { FC, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { ADMIN_PRODUCT_CATEGORY_PER_PAGE } from "@/constant/productConstant";
import { getPaginatedProductCategories } from "@/app/api/product/getProducts";
import { PaginationAdmin } from "@/components/pagination/PaginationAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import EditProductCategoryDialog from "@/components/product-management/EditProductCategoryDialog";
import { useProductAdmin } from "@/store/productAdminStore";
import DeleteProductCategoryAlert from "@/components/product-management/DeleteProductCategoryAlert";

const ProductCategoryTable: FC = () => {
  const [page, setPage] = useState<number>(0);
  const { data } = useSession();
  const { updateProductCategory } = useProductAdmin();

  const {
    data: productCategories,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["product-category-table", page, updateProductCategory],
    queryFn: () =>
      getPaginatedProductCategories({
        page,
        limit: ADMIN_PRODUCT_CATEGORY_PER_PAGE,
        accessToken: data?.accessToken,
      }),
    enabled: !!data?.accessToken,
  });

  const renderLoading = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-8 w-full" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-8 w-full" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-8 w-full" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: ADMIN_PRODUCT_CATEGORY_PER_PAGE }).map(
            (_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    );
  };

  const renderError = () => {
    return <div>Error loading product categories.</div>;
  };

  const renderContent = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[10%]">Id</TableHead>
            <TableHead className="w-[45%]">Product Category Name</TableHead>
            <TableHead className="w-[45%] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productCategories?.content.map((productCategory) => (
            <TableRow key={productCategory.id}>
              <TableCell>{productCategory.id}</TableCell>
              <TableCell>{productCategory.name}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-8">
                  <EditProductCategoryDialog
                    id={productCategory.id}
                    name={productCategory.name}
                  />
                  <DeleteProductCategoryAlert
                    id={productCategory.id}
                    name={productCategory.name}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <section className="mt-4 px-4 py-4 shadow-sm md:mt-7 md:px-10 md:py-7">
      {isLoading ? renderLoading() : isError ? renderError() : renderContent()}

      {productCategories && (
        <PaginationAdmin
          desc="Product Category"
          page={page}
          setPage={setPage}
          totalPages={productCategories?.totalPages}
          totalElements={productCategories?.totalElements}
          currentPageSize={productCategories?.content.length}
        />
      )}
    </section>
  );
};

export default ProductCategoryTable;
