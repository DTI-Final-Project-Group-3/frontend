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
import ProductSelection from "../product-management/products/ProductSelection";
import QuantityChange from "../common/QuantityChange";
import { useProductMutation } from "@/store/productMutationStore";
import { createWarehouseInventory } from "@/app/api/warehouse-inventories/postWarehouseInventories";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";

const AddInventoryDialog: FC = () => {
  const { data } = useSession();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [ItemQuantity, setItemQuantity] = useState<number>(0);
  const [productId, setProductId] = useState<number>();
  const [requesterNotes, setRequesterNotes] = useState<string>();
  const { destinationWarehouseId, submitMutation, setSubmitMutation } =
    useProductMutation();

  const handleOnSubmit = () => {
    if (
      !productId ||
      !destinationWarehouseId ||
      !ItemQuantity ||
      !data?.userDetail?.id
    )
      return;

    setSubmitMutation(true);
    createWarehouseInventory({
      productId,
      quantity: ItemQuantity,
      requesterId: data?.userDetail?.id,
      requesterNotes,
      destinationWarehouseId,
    })
      .then(() => {
        setSubmitMutation(false);
        handleDialog();
      })
      .catch(() => {
        setSubmitMutation(false);
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
          className="h-full bg-warehub-green text-white hover:bg-warehub-green-light hover:text-gray-50"
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Notes
            </Label>
            <Textarea
              placeholder="Type your notes here"
              className="col-span-3 resize-none"
              onChange={(e) => setRequesterNotes(e.target.value)}
              required
            />
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
