import { FC } from "react";
import Link from "next/link";
import { formatPrice } from "@/utils/formatter";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import ImageComponent from "@/components/common/ImageComponent";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  thumbnail: string;
  totalStock: number;
  nearestWarehouseName: string;
  onAddToCart?: () => void;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  price,
  thumbnail,
  totalStock,
  nearestWarehouseName,
  onAddToCart,
}) => {
  const session = useSession();

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-white p-4 transition-shadow duration-300 hover:shadow-lg">
      <div className="group relative h-[300px] w-full overflow-hidden rounded-md">
        <ImageComponent
          src={thumbnail}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          alt={name}
          className="object-contain transition-all"
        />

        {totalStock <= 5 && totalStock > 0 && (
          <div className="absolute right-0 top-0 m-2 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
            Only {totalStock} left!
          </div>
        )}

        {totalStock > 0 && (
          <div className="absolute inset-0 flex items-end justify-center pb-8 transition-opacity duration-300 active:opacity-100 md:opacity-0 md:active:opacity-0 md:group-hover:opacity-100">
            <Button
              onClick={(e) => {
                e.preventDefault();
                if (session.status !== "authenticated") {
                  redirect("/login");
                }
                onAddToCart?.();
              }}
              className="h-9 w-3/4 rounded-md text-center leading-9 text-white"
            >
              Add to Cart
            </Button>
          </div>
        )}
      </div>
      <Link href={`/product/${id}`}>
        <div className="flex flex-col gap-2 font-inter text-black">
          <p className="line-clamp-2 font-bold">{name}</p>
          {totalStock !== 0 ? (
            <p className="text-xl font-bold">{formatPrice(String(price))}</p>
          ) : (
            <p className="text-xl font-bold text-red-500">Out of Stock</p>
          )}
          <div className="text-sm text-gray-600">{nearestWarehouseName}</div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
