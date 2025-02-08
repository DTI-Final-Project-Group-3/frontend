import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import usePriceFormatter from "@/hooks/usePriceFormatter";

interface ProductCardProps {
  warehouseInventoryId: number;
  productName: string;
  price: number;
  imageUrl?: string;
  statusId?: number;
  statusName?: string;
  productCategoryName: string;
  warehouseName?: string;
}

const ProductCard: FC<ProductCardProps> = ({
  warehouseInventoryId,
  productName,
  price,
  imageUrl,
  statusId,
  statusName,
  productCategoryName,
  warehouseName,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    imageUrl && imageUrl.trim() !== "" ? imageUrl : "/images/no-image-icon.jpg"
  );

  const handleImageError = () => {
    setImgSrc("/images/no-image-icon.jpg");
  };

  return (
    <Link href={`/inventories/${warehouseInventoryId}`}>
      <div className="flex flex-col gap-5 p-4 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300">
        <div className="relative w-full h-[300px] overflow-hidden rounded-md">
          <Image
            src={imgSrc}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={productName}
            onError={handleImageError}
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col gap-2 text-black font-inter">
          <p className="font-bold line-clamp-2 ">{productName}</p>
          <p className="font-bold text-xl ">
            {statusId === 1 ? (
              `Rp. ${usePriceFormatter(price)}`
            ) : (
              <span className="text-red-500">{statusName}</span>
            )}
          </p>
          <div className="flex flex-col gap-1 mt-2 text-gray-600">
            <p className="text-sm">{warehouseName}</p>
            <p className="text-sm">{productCategoryName}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
