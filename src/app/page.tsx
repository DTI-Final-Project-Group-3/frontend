"use client";

import { getPaginatedWarehouseInventories } from "@/api/getWarehouseInventory";
import ProductCard from "@/components/product/productCard";
import Image from "next/image";
import { useEffect, useState } from "react";
import { INVENTORY_PER_PAGE } from "@/constant/warehouseInventoryConstant";
import { PaginationResponse } from "@/types/api/pagination";
import LoadingCard from "@/components/ui/loadingCard";
import { toast } from "@/hooks/use-toast";
import { Product } from "@/types/models/products";
import { useCartStore } from "@/store/cartStore";
import InventoryCard from "@/components/inventory/InventoryCard";
import { WarehouseInventorySummary } from "@/types/models/warehouseInventories";

type ProductCart = {
  id: number;
  name: string;
  productImage: string;
  description: string;
  stock: number;
  quantity: number;
  price: number;
};

export default function Home() {
  const [warehouseInventories, setWarehouseInventories] = useState<
    PaginationResponse<WarehouseInventorySummary> | undefined
  >();
  const [productCategoryId, setProductCategoryId] = useState<
    number | undefined
  >(undefined);
  const [searchQuery, setSearchQUery] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(0);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const addToCart = useCartStore((state) => state.addToCart);
  useCartStore.getState().isUserVerified = true;
  useCartStore.getState().isUserRegistered = true;

  const handlePageChange = (pageChange: number) => {
    const pageRequest = page + pageChange;
    if (pageRequest >= 0) {
      setPage(pageRequest);
    }
  };

  const handleAddToCart = (inventory: WarehouseInventorySummary) => {
    addToCart(inventory);
    toast({
      title: "Added to cart",

      duration: 2000,
      description: `${inventory.product.name} has been added to your cart.`,
    });
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
        setWarehouseInventories(response);
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
            : warehouseInventories?.content?.map((inventory) => (
                <div key={inventory.id}>
                  <InventoryCard
                    id={inventory.id}
                    product={inventory.product}
                    status={inventory.status}
                    warehouse={inventory.warehouse}
                    quantity={inventory.quantity}
                    onAddToCart={() => {
                      handleAddToCart(inventory);
                    }}
                  />
                </div>
              ))}
        </div>

        <div className="flex pt-10 justify-center gap-3">
          <div className="w-16 justify-end flex">
            <button
              onClick={() => handlePageChange(-1)}
              className={`${warehouseInventories?.hasPrev ? "visible" : "invisible"}`}
            >
              Prev
            </button>
          </div>

          <p className="w-8 text-center">
            {warehouseInventories?.currentPage !== undefined
              ? warehouseInventories?.currentPage + 1
              : 1}
          </p>
          <div className="flex justify-start w-16">
            <button
              onClick={() => handlePageChange(+1)}
              className={`${warehouseInventories?.hasNext ? "visible" : "invisible"}`}
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
