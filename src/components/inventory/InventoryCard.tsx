import { FC } from "react";
import Card from "../common/Card";
import { WarehouseInventorySummary } from "@/types/models/warehouseInventories";
import { Warehouse } from "@/types/models/warehouses";

interface InventoryCardProps extends WarehouseInventorySummary {
  onAddToCart?: () => void;
  warehouse: Warehouse;
}

const InventoryCard: FC<InventoryCardProps> = ({
  id,
  product,
  status,
  onAddToCart,
  warehouse,
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
      warehouse={warehouse.name}
      category={product.category.name}
    />
  );
};

export default InventoryCard;
