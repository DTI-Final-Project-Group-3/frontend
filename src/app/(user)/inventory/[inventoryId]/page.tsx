"use client";

import { getWarehouseInventoryDetailById } from "@/api/getWarehouseInventories";
import Carousel from "@/components/ui/Carousel";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CartItem, useCartStore } from "@/store/cartStore";
import { ProductSummary } from "@/types/models/products";
import {
  WarehouseInventoryDetail,
  WarehouseInventorySummary,
} from "@/types/models/warehouseInventories";
import { formatDimension, formatPrice, formatWeight } from "@/utils/formatter";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FC, useState } from "react";

const InventoryPage: FC = () => {
  const { inventoryId } = useParams();
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const addToCart = useCartStore((state) => state.addToCart);

  const {
    data: inventory,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["warehouseInventoryDetail", inventoryId],
    queryFn: () => getWarehouseInventoryDetailById(Number(inventoryId)),
  });

  const handleAddToCart = (inventory: WarehouseInventoryDetail | undefined) => {
    if (!inventory) return;
    const productItem: ProductSummary = {
      id: inventory.product.id,
      name: inventory.product.name,
      price: inventory.product.price,
      thumbnail: inventory.product.images?.find((image) => image.position === 1)
        ?.url,
      category: inventory.product.category,
    };

    const cartItem: CartItem = {
      inventoryId: inventory.id,
      product: productItem,
      stockQuantity: inventory.quantity,
      cartQuantity: cartQuantity,
      warehouse: inventory.warehouse,
    };
    addToCart(cartItem);
    toast({
      title: "Added to cart",
      duration: 2000,
      description: `${inventory.product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="mx-auto px-4 md:pt-16 pt-8 max-w-7xl">
      {isLoading || isFetching ? (
        <div>Loading ...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-md">
              {inventory?.data.product && (
                <Carousel
                  productName={inventory?.data.product.name ?? "product"}
                  images={inventory?.data.product.images ?? []}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-2xl md:text-4xl font-poppins font-semibold">
              {inventory?.data.product.name}
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              {inventory?.data.product.description}
            </p>
            <h2
              className={cn(
                "text-2xl md:text-3xl font-poppins font-medium",
                inventory?.data.status.id === 1
                  ? ""
                  : "text-red-500 font-semibold"
              )}
            >
              {inventory?.data.status.id === 1
                ? formatPrice(String(inventory?.data.product.price))
                : inventory?.data.status.name}
            </h2>

            <div className="space-y-4">
              <div>
                <h2 className="text-gray-700 font-semibold mb-1">Dimensions</h2>
                <div className="flex gap-2">
                  <p>{formatDimension(inventory?.data.product.length)} x</p>
                  <p>{formatDimension(inventory?.data.product.width)} x</p>
                  <p>{formatDimension(inventory?.data.product.height)}</p>
                </div>
              </div>

              <div>
                <h2 className="text-gray-700 font-semibold mb-1">Weight</h2>
                <p>{formatWeight(inventory?.data.product.weight)}</p>
              </div>
            </div>

            <div className="flex gap-4 py-6">
              <div className="flex items-center border border-gray-300 rounded-md h-12">
                <button
                  className={cn(
                    "px-4 py-1 text-xl transition-colors",
                    cartQuantity <= 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                  disabled={cartQuantity <= 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCartQuantity(cartQuantity - 1);
                  }}
                >
                  -
                </button>
                <input
                  type="text"
                  value={cartQuantity}
                  readOnly
                  className="w-12 text-center border-x border-gray-300 pointer-events-none"
                />
                <button
                  className={cn(
                    "px-4 py-1 text-xl transition-colors",
                    cartQuantity >= (inventory?.data.quantity ?? 0)
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                  disabled={cartQuantity >= (inventory?.data.quantity ?? 0)}
                  onClick={(e) => {
                    e.preventDefault();
                    setCartQuantity(cartQuantity + 1);
                  }}
                >
                  +
                </button>
              </div>
              <button
                className={cn(
                  "flex-1 bg-black text-white rounded-md px-6 py-3 text-base font-medium hover:bg-gray-800 transition-colors",
                  cartQuantity >= (inventory?.data.quantity ?? 0)
                    ? "cursor-not-allowed text-gray-300"
                    : ""
                )}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(inventory?.data);
                }}
                disabled={cartQuantity >= (inventory?.data.quantity ?? 0)}
              >
                Add to Cart
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <p className="text-gray-600">Remaining stock</p>
              <p>{inventory?.data.quantity}</p>
              <p className="text-gray-600">Category</p>
              <p>{inventory?.data.product.category.name}</p>
              <p className="text-gray-600">Send from</p>
              <p>{inventory?.data.warehouse.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
