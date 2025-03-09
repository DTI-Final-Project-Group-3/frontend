import React, { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPaginatedProducts } from "@/app/api/product/getProducts";
import { ADMIN_PRODUCT_PER_PAGE } from "@/constant/productConstant";
import { Card, CardContent } from "@/components/ui/card";
import ImageComponent from "@/components/common/ImageComponent";
import { formatPrice } from "@/utils/formatter";
import ActionButtons from "@/components/product-management/ActionButtons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationAdmin } from "@/components/pagination/PaginationAdmin";

const ProductListTable: FC = () => {
  const [page, setPage] = useState<number>(0);
  const [productCategoryId, setProductCategoryId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products-admin", page, productCategoryId, searchQuery],
    queryFn: () =>
      getPaginatedProducts({
        page: page,
        limit: ADMIN_PRODUCT_PER_PAGE,
        productCategoryId,
        searchQuery,
      }),
  });

  const renderEmptyState = () => (
    <div className="flex flex-grow text-center text-gray-500">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 className="mt-2 text-lg font-medium">No products found</h3>
      <p className="mt-1">
        Try changing your search criteria or add a new product.
      </p>
    </div>
  );

  const renderLoading = () => (
    <div className="flex h-64 items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-black"></div>
    </div>
  );

  const renderMobileView = () => (
    <div className="space-y-4 md:hidden">
      {products?.content.map((product) => (
        <Card key={product.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                <ImageComponent
                  src={product.thumbnail}
                  className="object-cover"
                  alt={`${product.name} thumbnail`}
                  fill={true}
                  sizes="50px, 50px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-gray-800">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500">ID: {product.id}</p>
                <span className="mt-1 inline-block truncate rounded-full bg-gray-200 px-3 py-1 text-sm">
                  {product.categoryName}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="font-medium text-gray-800">
                {formatPrice(String(product.price))}
              </span>
              <div className="flex space-x-2">
                <ActionButtons productId={product.id} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderDesktopTable = () => (
    <div className="hidden md:block md:min-h-[calc(100vh-300px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead className="w-[20%]">Category</TableHead>
            <TableHead className="w-[10%]">Price</TableHead>
            <TableHead className="w-[15%] text-center">Thumbnail</TableHead>
            <TableHead className="w-[15%] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.content.map((product) => (
            <TableRow key={product.id} className="hover:bg-gray-50">
              <TableCell className="min-w-0">
                <div className="truncate font-medium text-gray-800">
                  {product.name}
                </div>
                <div className="truncate text-xs text-gray-500">
                  ID: {product.id}
                </div>
              </TableCell>
              <TableCell className="min-w-0">
                <span className="inline-block max-w-full truncate rounded-full bg-gray-200 px-3 py-1 text-sm">
                  {product.categoryName}
                </span>
              </TableCell>
              <TableCell className="truncate font-medium text-gray-800">
                {formatPrice(String(product.price))}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                    <ImageComponent
                      src={product.thumbnail}
                      fill={true}
                      className="object-cover"
                      alt={`${product.name} thumbnail`}
                      sizes="50px, 50px"
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <ActionButtons productId={product.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <section className="min-h-[calc(100vh-178px)] w-full rounded-2xl bg-white py-4 shadow-sm md:py-7">
      <div className="mt-4 px-4 md:mt-7 md:px-10">
        {productsLoading ? (
          renderLoading()
        ) : products?.content.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderDesktopTable()}
            {renderMobileView()}
          </>
        )}

        {products && (
          <div className="mt-6">
            <PaginationAdmin
              desc="Products"
              page={page}
              setPage={setPage}
              totalPages={products.totalPages}
              totalElements={products.totalElements}
              currentPageSize={products.content.length}
            />
          </div>
        )}
      </div>
    </section>
  );
};
export default ProductListTable;
