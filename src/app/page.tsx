"use client";

import { getPaginatedWarehouseInventories } from "@/api/getWarehouseInventories";
import Image from "next/image";
import { useState } from "react";
import { INVENTORY_PER_PAGE } from "@/constant/warehouseInventoryConstant";
import LoadingCard from "@/components/ui/loadingCard";
import { toast } from "@/hooks/use-toast";

import { useCartStore } from "@/store/cartStore";
import InventoryCard from "@/components/inventory/InventoryCard";
import { WarehouseInventorySummary } from "@/types/models/warehouseInventories";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/ui/Pagination";
import Filtering from "@/components/inventory/Filtering";

export default function Home() {
  const [productCategoryId, setProductCategoryId] = useState<number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(0);
  const addToCart = useCartStore((state) => state.addToCart);
  useCartStore.getState().isUserVerified = true;
  useCartStore.getState().isUserRegistered = true;

  const handlePageChange = (
    pageChange: number,
    isDirectPage: boolean = false
  ) => {
    const pageRequest = isDirectPage ? pageChange : page + pageChange;
    if (
      pageRequest >= 0 &&
      pageRequest < (warehouseInventories?.totalPages || 0)
    ) {
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

  const { data: warehouseInventories, isLoading: pageLoading } = useQuery({
    queryKey: ["warehouseInventories", page, productCategoryId, searchQuery],
    queryFn: () =>
      getPaginatedWarehouseInventories({
        page,
        limit: INVENTORY_PER_PAGE,
        category: productCategoryId || undefined,
        search: searchQuery,
      }),
    staleTime: 5 * 60 * 1000,
  });

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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <Filtering
              onFilterChange={(category) => setProductCategoryId(category)}
            />
          </div>
          <div className="col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>

        <Pagination
          currentPage={page}
          totalPages={warehouseInventories?.totalPages || 0}
          onPageChange={handlePageChange}
          hasNext={warehouseInventories?.hasNext || false}
          hasPrev={warehouseInventories?.hasPrev || false}
        />
      </main>
      <footer className="bg-black mt-10 min-h-80"></footer>
    </div>
  );
}
