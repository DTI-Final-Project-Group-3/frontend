"use client";

import { Button } from "@/components/ui/button";
import { mockProducts } from "@/constant/DummyProductsData";
import { toast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  productImage: string;
  description: string;
  stock: number;
  quantity: number;
  price: number;
};

export default function Home() {
  const addToCart = useCartStore((state) => state.addToCart);
  useCartStore.getState().isUserVerified = true;
  useCartStore.getState().isUserRegistered = true;

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      duration: 2000,
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

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
        <h1 className="text-2xl font-semibold mb-4">Product List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="h-48 w-full relative bg-gray-100 rounded-md">
                <Image
                  src="/images/dummy-hero-img.png"
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
                variant={"default"}
                size={"sm"}
                onClick={() => {
                  if (product.stock > 0) {
                    handleAddToCart(product);
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
