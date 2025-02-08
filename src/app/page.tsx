"use client";

import { getPaginatedWarehouseInventories } from "@/api/getWarehouseInventory";
import ProductCard from "@/components/product/productCard";
import { PaginatedWarehouseInventoryResponse } from "@/types/models/warehouseInventories";
import Image from "next/image";
import { useEffect, useState } from "react";
import { INVENTORY_PER_PAGE } from "@/constant/warehouseInventoryConstant";
import { PaginationResponse } from "@/types/api/pagination";
import LoadingCard from "@/components/ui/loadingCard";

export default function Home() {
  const [products, setProducts] = useState<
    PaginationResponse<PaginatedWarehouseInventoryResponse> | undefined
  >();
  const [productCategoryId, setProductCategoryId] = useState<
    number | undefined
  >(undefined);
  const [searchQuery, setSearchQUery] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(0);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  const handlePageChange = (pageChange: number) => {
    const pageRequest = page + pageChange;
    if (pageRequest >= 0) {
      setPage(pageRequest);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      try {
        const response = await getPaginatedWarehouseInventories({
          page,
          limit: INVENTORY_PER_PAGE,
          category: productCategoryId,
          search: searchQuery,
        });
        setProducts(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching warehouse inventories:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div className="min-h-[calc(100vh-70px)] mt-[24px] w-full">
      <div className="h-[540px] md:max-w-4xl lg:max-w-[1340px] mx-auto w-full relative bg-slate-50 rounded-md">
        <Image
          src="/images/dummy-hero-img.png"
          alt="hero images"
          height={1000}
          width={1340}
          className="h-full w-full object-cover rounded-md"
        />
      </div>

      <main className="mt-[24px] md:max-w-4xl lg:max-w-[1340px] mx-auto w-full px-6 md:px-0">
        <div>
          <h1 className="text-2xl font-semibold mb-4">Product List</h1>
          <h1></h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pageLoading
            ? [...Array(INVENTORY_PER_PAGE)].map((_, index) => (
                <LoadingCard key={index} />
              ))
            : products?.content?.map((product) => (
                <div key={product.productId}>
                  <ProductCard
                    warehouseInventoryId={product.warehouseInventoryId}
                    productName={product.productName}
                    price={product.price}
                    statusId={product.statusId}
                    statusName={product.statusName}
                    productCategoryName={product.productCategoryName}
                    warehouseName={product.warehouseName}
                  />
                </div>
              ))}
        </div>

        <div className="flex pt-10 justify-center gap-3">
          <div className="w-16 justify-end flex">
            <button
              onClick={() => handlePageChange(-1)}
              className={`${products?.hasPrev ? "visible" : "invisible"}`}
            >
              Prev
            </button>
          </div>

          <p className="w-8 text-center">
            {products?.currentPage !== undefined
              ? products?.currentPage + 1
              : 1}
          </p>
          <div className="flex justify-start w-16">
            <button
              onClick={() => handlePageChange(+1)}
              className={`${products?.hasNext ? "visible" : "invisible"}`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-black mt-10 min-h-80"></footer>
    </div>
  );
}
