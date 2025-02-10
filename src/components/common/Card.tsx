import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/formatter";

interface BaseCardProps {
  id: string | number;
  name: string;
  price?: number;
  imageUrl?: string;
  linkPath: string;
  onAddToCart?: () => void;
  showAddToCart?: boolean;
  statusId?: number;
  statusName?: string;
  category?: string;
  warehouse?: string;
}

const Card: FC<BaseCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  linkPath,
  onAddToCart,
  showAddToCart = false,
  statusId,
  statusName,
  category,
  warehouse,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    imageUrl && imageUrl.trim() !== "" ? imageUrl : "/images/no-image-icon.jpg"
  );

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
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {showAddToCart && (
          <div className="absolute inset-0 flex items-end pb-4 justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 active:opacity-100 md:active:opacity-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.();
              }}
              className="bg-black text-white rounded-md h-9 w-3/4 leading-9 text-center"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
      <Link href={linkPath}>
        <div className="flex flex-col gap-2 text-black font-inter">
          <p className="font-bold line-clamp-2">{name}</p>
          {statusId === 1 ? (
            <p className="font-bold text-xl">{formatPrice(String(price))}</p>
          ) : (
            <p className="font-bold text-xl text-red-500">{statusName}</p>
          )}
          <div className="flex flex-col gap-1 mt-2 text-gray-600">
            <p>{warehouse}</p>
            {/* <p>{category}</p> */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
