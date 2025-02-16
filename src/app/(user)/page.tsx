"use client";

import { getPaginatedWarehouseInventories } from "@/api/getWarehouseInventories";
import Image from "next/image";
import { useEffect, useState } from "react";
import { INVENTORY_PER_PAGE } from "@/constant/warehouseInventoryConstant";
import LoadingCard from "@/components/ui/loadingCard";
import { toast } from "@/hooks/use-toast";

import { CartItem, useCartStore } from "@/store/cartStore";
import InventoryCard from "@/components/inventory/InventoryCard";
import { WarehouseInventorySummary } from "@/types/models/warehouseInventories";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/ui/Pagination";
import Filtering from "@/components/inventory/Filtering";
import LocationSelector from "@/components/location/LocationSelector";
import { useLocationStore } from "@/store/locationStore";
import { useSearchStore } from "@/store/searchStore";

export default function Home() {
  const [productCategoryId, setProductCategoryId] = useState<number | null>(
    null
  );
  const [page, setPage] = useState<number>(0);
  const addToCart = useCartStore((state) => state.addToCart);
  useCartStore.getState().isUserVerified = true;
  useCartStore.getState().isUserRegistered = true;
  const { location } = useLocationStore();
  const { searchQuery } = useSearchStore();

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
    const cartItem: CartItem = {
      inventoryId: inventory.id,
      product: inventory.product,
      stockQuantity: inventory.quantity,
      cartQuantity: 1,
      warehouse: inventory.warehouse,
    };

    addToCart(cartItem);
    toast({
      title: "Added to cart",

      duration: 2000,
      description: `${inventory.product.name} has been added to your cart.`,
    });
  };

  const {
    data: warehouseInventories,
    isLoading: pageLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["warehouseInventories", page, productCategoryId, searchQuery],
    queryFn: () =>
      getPaginatedWarehouseInventories({
        page,
        limit: INVENTORY_PER_PAGE,
        longitude: location?.longitude,
        latitude: location?.latitude,
        category: productCategoryId || undefined,
        search: searchQuery,
      }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (location) {
      refetch();
    }
  }, [location, refetch]);

  return (
    <>
      <div className="min-h-[calc(100vh-70px)] mt-6 w-full">
        <div className="relative mx-auto w-full max-w-[1340px] h-[540px] rounded-lg overflow-hidden">
          <Image
            src="/images/dummy-hero-img.png"
            alt="hero images"
            height={1000}
            width={1340}
            className="h-full w-full object-cover"
          />
        </div>

        <main className="mx-auto mt-16 w-full max-w-[1340px] px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="col-span-1 flex flex-col gap-8 md:sticky md:top-24 h-fit">
              <Filtering
                onFilterChange={(category) => setProductCategoryId(category)}
              />
              <LocationSelector />
            </div>

            <div className="col-span-3">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pageLoading || isFetching
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
                          statusId={inventory.status.id}
                          statusName={inventory.status.name}
                          onAddToCart={() => handleAddToCart(inventory)}
                        />
                      </div>
                    ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={warehouseInventories?.totalPages || 0}
                onPageChange={handlePageChange}
                hasNext={warehouseInventories?.hasNext || false}
                hasPrev={warehouseInventories?.hasPrev || false}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
