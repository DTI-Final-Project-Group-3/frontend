import { FC } from "react";
import Card from "../common/Card";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  onAddToCart?: () => void;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  onAddToCart,
}) => {
  return (
    <Card
      id={id}
      name={name}
      price={price}
      imageUrl={imageUrl}
      linkPath={`/products/${id}`}
      onAddToCart={onAddToCart}
      showAddToCart={true}
    />
  );
};

export default ProductCard;
