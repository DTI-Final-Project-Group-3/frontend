import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/formatter";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  thumbnail: string;
  totalStock: number;
  onAddToCart?: () => void;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  price,
  thumbnail,
  totalStock,
  onAddToCart,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    thumbnail && thumbnail.trim() !== ""
      ? thumbnail
      : "/images/no-image-icon.jpg",
  );
  const session = useSession();

  const handleImageError = () => {
    setImgSrc("/images/no-image-icon.jpg");
  };

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-white p-4 transition-shadow duration-300 hover:shadow-lg">
      <div className="group relative h-[300px] w-full overflow-hidden rounded-md">
        <Image
          src={imgSrc}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          alt={name}
          onError={handleImageError}
          className="object-contain transition-all"
        />

        {/* Stock indicator */}
        {totalStock <= 5 && totalStock > 0 && (
          <div className="absolute right-0 top-0 m-2 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
            Only {totalStock} left!
          </div>
        )}

        {totalStock > 0 && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 transition-opacity duration-300 active:opacity-100 md:opacity-0 md:active:opacity-0 md:group-hover:opacity-100">
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
          <div className="mt-2 flex flex-col gap-1 text-gray-600"></div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
