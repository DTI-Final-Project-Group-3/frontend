"use client";

import { getProductDetailById } from "@/app/api/getProducts";
import ProductCarousel from "@/components/product/ProductCarousel";
import { LOCATION_RADIUS } from "@/constant/locationConstant";
import { cn } from "@/lib/utils";
import { CartItem, useCartStore } from "@/store/cartStore";
import { useUserAddressStore } from "@/store/userAddressStore";
import { ProductDetail, ProductSummary } from "@/types/models/products";
import { formatDimension, formatPrice, formatWeight } from "@/utils/formatter";
import { useQuery } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const InventoryPage: FC = () => {
  const session = useSession();
  const { productId } = useParams();
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const { userAddress } = useUserAddressStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const {
    data: productDetail,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["productDetail", productId],
    queryFn: () =>
      getProductDetailById({
        productId: Number(productId),
        longitude: userAddress?.longitude,
        latitude: userAddress?.latitude,
        radius: LOCATION_RADIUS,
      }),
  });

  const handleAddToCart = (product: ProductDetail | undefined) => {
    if (session.status === "unauthenticated") {
      redirect("/login");
    }

    if (!product) return;

    const productItem: ProductSummary = {
      id: product.id,
      name: product.name,
      price: product.price,
      totalStock: product.totalStock,
      thumbnail: product.images?.find((image) => image.position === 1)?.url,
      categoryName: product.category.name,
    };

    const cartItem: CartItem = {
      product: productItem,
      cartQuantity: cartQuantity,
    };
    addToCart(cartItem);
  };

  return (
    <div className="flex flex-col p-5 md:p-0">
      <div className="mx-auto px-4 md:pt-16 pt-0 max-w-7xl">
        {!productDetail || isLoading || isFetching ? (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:min-h-screen">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-md">
                <div className="w-full h-64 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-6 w-full bg-gray-300 rounded"></div>
              <div className="h-10 w-1/2 bg-gray-300 rounded"></div>
              <div className="space-y-4">
                <div>
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                </div>
                <div>
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 py-6">
                <div className="flex items-center border border-gray-300 rounded-md h-12 w-full md:w-24"></div>
                <div className="flex-1 bg-gray-300 h-12 rounded-md"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-md">
                {productDetail && (
                  <ProductCarousel
                    productName={productDetail.name ?? "product"}
                    images={productDetail.images ?? []}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h1 className="text-2xl md:text-4xl font-poppins font-semibold">
                {productDetail?.name}
              </h1>
              <p className="text-gray-600 text-base md:text-lg">
                {productDetail?.description}
              </p>
              <h2
                className={cn(
                  "text-2xl md:text-3xl font-poppins font-medium",
                  productDetail.totalStock > 0
                    ? ""
                    : "text-red-500 font-semibold"
                )}
              >
                {productDetail.totalStock > 0
                  ? formatPrice(String(productDetail.price))
                  : "Out of Stock"}
              </h2>

              <div className="space-y-4">
                <div>
                  <h2 className="text-gray-700 font-semibold mb-1">
                    Dimensions
                  </h2>
                  <div className="flex gap-2">
                    <p>{formatDimension(productDetail.length)} x</p>
                    <p>{formatDimension(productDetail.width)} x</p>
                    <p>{formatDimension(productDetail.height)}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-gray-700 font-semibold mb-1">Weight</h2>
                  <p>{formatWeight(productDetail.weight)}</p>
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
                      if (session.status === "unauthenticated") {
                        redirect("/login");
                      }
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
                      cartQuantity >= productDetail.totalStock
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                    disabled={cartQuantity >= productDetail.totalStock}
                    onClick={(e) => {
                      if (session.status === "unauthenticated") {
                        redirect("/login");
                      }
                      e.preventDefault();
                      setCartQuantity(cartQuantity + 1);
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  className={cn(
                    "flex-1 bg-black text-white rounded-md px-6 py-3 text-base font-medium hover:bg-gray-800 transition-colors"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(productDetail);
                  }}
                  disabled={cartQuantity >= productDetail.totalStock}
                >
                  Add to Cart
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <p className="text-gray-600">Remaining stock</p>
                <p>{productDetail.totalStock}</p>
                <p className="text-gray-600">Category</p>
                <p>{productDetail.category.name}</p>
                <p className="text-gray-600">Send from</p>
                <p>{productDetail.nearestWarehouse.name}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
