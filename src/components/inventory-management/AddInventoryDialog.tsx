"use client";

import { FC, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "@radix-ui/react-label";
import ProductSelection from "../product/ProductSelection";
import QuantityChange from "../common/QuantityChange";
import { useProductMutation } from "@/store/productMutationStore";
import { createWarehouseInventory } from "@/app/api/warehouse-inventories/postWarehouseInventories";
import { toast } from "@/hooks/use-toast";

const AddInventoryDialog: FC = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [ItemQuantity, setItemQuantity] = useState<number>(0);
  const [productId, setProductId] = useState<number>();
  const { destinationWarehouseId, submitMutation, setSubmitMutation } =
    useProductMutation();

  const handleOnSubmit = () => {
    if (!productId || !destinationWarehouseId || !ItemQuantity) return;

    setSubmitMutation(true);
    createWarehouseInventory({
      productId,
      warehouseId: destinationWarehouseId,
      quantity: ItemQuantity,
    })
      .then(() => {
        setSubmitMutation(false);
        handleDialog();
        toast({
          title: "Create Inventory",
          description: "Create new inventory success!",
          duration: 2000,
        });
      })
      .catch(() => {
        setSubmitMutation(false);
        toast({
          title: "Error",
          description: "Failed to create new inventory.",
          duration: 2000,
        });
      });
  };

  const handleDialog = () => {
    setDialogOpen(!dialogOpen);
    setProductId(undefined);
    setItemQuantity(0);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="hover:bg-warehub-green-light h-full bg-warehub-green text-white hover:text-gray-50"
          onClick={handleDialog}
        >
          Add Inventory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-5">
          <DialogTitle>Create New Inventory</DialogTitle>
          <DialogDescription>
            Add new inventory for this warehouse
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product" className="grid-cols-1 text-right">
              Product
            </Label>
            <div className="col-span-3">
              <ProductSelection
                filter="exclude"
                productId={productId}
                setProductId={setProductId}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="grid-cols-1 text-right">
              Quantity
            </Label>
            <div className="col-span-3">
              <QuantityChange
                itemQuantity={ItemQuantity}
                lowerLimit={0}
                setItemQuantity={setItemQuantity}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleOnSubmit}
            disabled={
              !productId ||
              ItemQuantity === 0 ||
              submitMutation ||
              !destinationWarehouseId
            }
          >
            {submitMutation ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryDialog;
