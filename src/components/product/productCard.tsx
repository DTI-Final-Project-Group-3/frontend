import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/formatter";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

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
      : "/images/no-image-icon.jpg"
  );
  const session = useSession();

  const handleImageError = () => {
    setImgSrc("/images/no-image-icon.jpg");
  };

  return (
    <div className="flex flex-col gap-5 p-4 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300">
      <div className="group relative w-full h-[300px] overflow-hidden rounded-md">
        <Image
          src={imgSrc}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={name}
          onError={handleImageError}
          className="object-cover"
        />
        {totalStock > 0 && (
          <div className="absolute inset-0 flex items-end pb-4 justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 active:opacity-100 md:active:opacity-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (session.status !== "authenticated") {
                  redirect("/login");
                }
                onAddToCart?.();
              }}
              className="bg-black text-white rounded-md h-9 w-3/4 leading-9 text-center"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
      <Link href={`/product/${id}`}>
        <div className="flex flex-col gap-2 text-black font-inter">
          <p className="font-bold line-clamp-2">{name}</p>
          {totalStock !== 0 ? (
            <p className="font-bold text-xl">{formatPrice(String(price))}</p>
          ) : (
            <p className="font-bold text-xl text-red-500">Out of Stock</p>
          )}
          <div className="flex flex-col gap-1 mt-2 text-gray-600"></div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
