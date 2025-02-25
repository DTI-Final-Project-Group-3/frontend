import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import WarehouseSelection from "../warehouse/WarehouseSelection";
import ProductSelection from "../product/ProductSelection";
import QuantityChange from "../common/QuantityChange";
import { WarehouseInventory } from "@/types/models/warehouseInventories";
import { useSession } from "next-auth/react";
import { Checkbox } from "../ui/checkbox";
import { updateQuantityWarehouseInventoryById } from "@/app/api/warehouse-inventories/putWarehouseInventoris";
import { ProductMuationQuantity } from "@/types/models/productMutation";

interface ProductMutationProps {
  productId: number;
  warehouseId: number;
}

const MutationDialog: FC<Partial<WarehouseInventory>> = ({
  productId,
  warehouseId,
}) => {
  const { data } = useSession();
  const [isMutation, setIsMutation] = useState<boolean>(false);

  const [selectedProductId, setSelectedProductId] = useState<number>();
  const [ItemQuantity, setItemQuantity] = useState<number>(0);
  const [notes, setNotes] = useState<string>();
  const requsterId = data?.userDetail?.id;
  const [destinationWarehouseId, setDestinationWarehouseId] =
    useState<number>();

  const handleOnSubmit = () => {
    if (
      !selectedProductId ||
      !ItemQuantity ||
      !requsterId ||
      !destinationWarehouseId
    )
      return;

    const newQuantity: ProductMuationQuantity = {
      productId: selectedProductId,
      quantity: ItemQuantity,
      notes: notes,
      requesterId: requsterId,
      destinationWarehouseId: destinationWarehouseId,
    };
    const response = updateQuantityWarehouseInventoryById(
      selectedProductId,
      newQuantity
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Mutation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-5">
          <DialogTitle>Inventory Quantity</DialogTitle>
          <DialogDescription>
            Increase or decrease the quantity
          </DialogDescription>
        </DialogHeader>

        <div className="flex item-center justify-center gap-2 mb-4">
          <label
            htmlFor="productMutation"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Product Mutation
          </label>
          <Checkbox
            id="productMutation"
            checked={isMutation}
            onCheckedChange={(checked) =>
              setIsMutation(checked === "indeterminate" ? false : checked)
            }
          />
        </div>

        {isMutation && (
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right grid-cols-1">
                Product
              </Label>
              <div className="col-span-3">
                <ProductSelection
                  productId={selectedProductId}
                  setProductId={setSelectedProductId}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right grid-cols-1">
                Warehouse
              </Label>
              <div className="col-span-3">
                <WarehouseSelection
                  warehouseId={destinationWarehouseId}
                  setWarehouseId={setDestinationWarehouseId}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right grid-cols-1">
            Quantity
          </Label>
          <div className="col-span-3">
            <QuantityChange
              itemQuantity={ItemQuantity}
              setItemQuantity={setItemQuantity}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Notes
          </Label>
          <Textarea
            placeholder="Type your notes here"
            className="col-span-3 resize-none"
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MutationDialog;
