import { FC } from "react";
import Card from "../common/Card";
import { WarehouseInventorySummary } from "@/types/models/warehouseInventories";

interface InventoryCardProps extends WarehouseInventorySummary {
  onAddToCart?: () => void;
}

const InventoryCard: FC<InventoryCardProps> = ({
  id,
  product,
  status,
  onAddToCart,
}) => {
  return (
    <Card
      id={id}
      name={product.name}
      price={status.id === 1 ? product.price : undefined}
      imageUrl={product.thumbnail?.url}
      linkPath={`/inventories/${id}`}
      onAddToCart={onAddToCart}
      showAddToCart={status.id === 1}
    />
  );
};

export default InventoryCard;
