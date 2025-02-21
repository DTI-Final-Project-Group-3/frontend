"use client";

import { useEffect, useState } from "react";
import { INVENTORY_PER_PAGE } from "@/constant/warehouseInventoryConstant";
import LoadingCard from "@/components/ui/loadingCard";
import { toast } from "@/hooks/use-toast";

import { CartItem, useCartStore } from "@/store/cartStore";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/pagination/Pagination";
import Filtering from "@/components/product/FilterCategory";
import LocationSelector from "@/components/product/FilterLocation";
import { useUserAddressStore } from "@/store/userAddressStore";
import { useSearchStore } from "@/store/searchStore";
import { getNearbyProduct } from "@/api/getProducts";
import { ProductSummary } from "@/types/models/products";
import { LOCATION_RADIUS } from "@/constant/locationConstant";
import ProductCard from "@/components/product/ProductCard";
import { cookies } from "next/headers";

export default function Home() {
  const [productCategoryId, setProductCategoryId] = useState<number | null>(
    null
  );
  const [page, setPage] = useState<number>(0);
  const addToCart = useCartStore((state) => state.addToCart);
  const { setCartItems } = useCartStore();
  useCartStore.getState().isUserVerified = true;
  useCartStore.getState().isUserRegistered = true;
  const { userAddress } = useUserAddressStore();
  const { searchQuery } = useSearchStore();

  const handlePageChange = (
    pageChange: number,
    isDirectPage: boolean = false
  ) => {
    const pageRequest = isDirectPage ? pageChange : page + pageChange;
    if (pageRequest >= 0 && pageRequest < (products?.totalPages || 0)) {
      setPage(pageRequest);
    }
  };

  const handleAddToCart = (product: ProductSummary) => {
    const cartItem: CartItem = {
      product: product,
      cartQuantity: 1,
    };
    addToCart(cartItem);
  };

  const {
    data: products,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useQuery({
    queryKey: [
      "nearby-products",
      page,
      productCategoryId,
      searchQuery,
      userAddress,
    ],
    queryFn: () =>
      getNearbyProduct({
        page,
        limit: INVENTORY_PER_PAGE,
        longitude: userAddress?.longitude,
        latitude: userAddress?.latitude,
        radius: LOCATION_RADIUS,
        productCategoryId: productCategoryId || undefined,
        searchQuery: searchQuery,
      }),
    staleTime: 120000,
  });

  useEffect(() => {
    const currentCart = localStorage.getItem("cart-storage");
    if (currentCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(currentCart);

        if (Array.isArray(parsedCart) && products?.content) {
          const updatedCart: CartItem[] = parsedCart.map((item) => {
            const updatedProduct = products.content.find(
              (product) => product.id === item.product.id
            );
            if (updatedProduct) {
              return { ...item, product: updatedProduct };
            }
            return { ...item, product: { ...item.product, totalStock: 0 } };
          });
          setCartItems(updatedCart);
        }
      } catch (err) {
        console.error("Error parsing cart-storage:", err);
      }
    }
  }, [products]);

  return (
    <>
      <div className="min-h-[calc(100vh-70px)] mt-6 mb-12 w-full">
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
                {productsLoading || productsFetching
                  ? [...Array(INVENTORY_PER_PAGE)].map((_, index) => (
                      <LoadingCard key={index} />
                    ))
                  : products?.content.map((product) => (
                      <div key={product.id}>
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          thumbnail={product.thumbnail ?? "/no-image-icon.jpg"}
                          totalStock={product.totalStock}
                          onAddToCart={() => handleAddToCart(product)}
                        />
                      </div>
                    ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={products?.totalPages || 0}
                onPageChange={handlePageChange}
                hasNext={products?.hasNext || false}
                hasPrev={products?.hasPrev || false}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
