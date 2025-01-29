"use client";

import { Button } from "@/components/ui/button";
import { mockProducts } from "@/constant/DummyProductsData";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

export default function Home() {
  const addToCart = useCartStore((state) => state.addToCart);
  const isUserVerified = (useCartStore.getState().isUserVerified = true);
  const isUserRegistred = (useCartStore.getState().isUserRegistered = true);

  return (
    <div className="min-h-[calc(100vh-70px)] mt-[24px] w-full">
      <div className="h-[540px] md:max-w-4xl lg:max-w-7xl mx-auto w-full px-6 relative bg-slate-50 rounded-md">
        <Image
          src="/images/WareHub.png"
          alt="hero images"
          height={200}
          width={200}
          className="h-full w-full object-contain rounded-md"
        />
      </div>
      <main className="mt-[24px] md:max-w-4xl lg:max-w-7xl mx-auto w-full px-6 md:px-0">
        <h1 className="text-2xl font-semibold mb-4">Product List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="h-48 w-full relative bg-gray-100 rounded-md">
                <Image
                  src="/images/WareHub.png"
                  alt={product.name}
                  height={200}
                  width={200}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
              <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {product.description}
              </p>
              <p className="text-gray-800 font-bold mt-2">${product.price}</p>
              <p className="text-green-600 my-4">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>

              <Button
                onClick={() => {
                  if (product.stock > 0) {
                    addToCart(product);
                  } else alert("Product out of stock!");
                }}
                disabled={product.stock <= 0}
              >
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </main>
      <footer className=""></footer>
    </div>
  );
}
