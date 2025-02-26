"use client";

import { FC, useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { Checkbox } from "../ui/checkbox";
import { ProductMutationRequest } from "@/types/models/productMutation";
import { updateQuantityWarehouseInventoryById } from "@/app/api/warehouse-inventories/putWarehouseInventoris";
import { useProductMutation } from "@/store/productMutationStore";
import { toast } from "@/hooks/use-toast";
import { createProductMutationManual } from "@/app/api/product-mutation/postProductMutation";

interface ProductMutationProps {
  isProductMutation?: boolean;
  warehouseInventoryId?: number;
  productId?: number;
  buttonName: string;
}

const MutationDialog: FC<ProductMutationProps> = ({
  isProductMutation,
  warehouseInventoryId,
  productId,
  buttonName,
}) => {
  const { data } = useSession();
  const [isMutation, setIsMutation] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [selectedProductId, setSelectedProductId] = useState<number>();
  const [ItemQuantity, setItemQuantity] = useState<number>(0);
  const [notes, setNotes] = useState<string>();
  const requsterId = data?.userDetail?.id;
  const [selectedOriginWarehouseId, setSelectedOriginWarehouseId] =
    useState<number>();
  const [submitIsLoading, setSubmitIsLoading] = useState<boolean>(false);
  const { productMutatationRequest, setProductMutationRequest } =
    useProductMutation();

  useEffect(() => {
    if (isProductMutation) {
      setIsMutation(isProductMutation);
    }
    if (productId) {
      setSelectedProductId(productId);
    }
  }, [productId, isProductMutation]);

  const handleProductMutationQuantity = (
    newMutation: ProductMutationRequest
  ) => {
    if (!warehouseInventoryId) return;
    setSubmitIsLoading(true);
    updateQuantityWarehouseInventoryById(warehouseInventoryId, newMutation)
      .then(() => {
        setProductMutationRequest(newMutation);
        setDialogOpen(false);
        toast({
          title: `Update Product Quantity`,
          description: `Successfully update ${ItemQuantity} quantity`,
          duration: 5000,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setSubmitIsLoading(false);
      });
  };

  const handleProductMutationManual = (newMutation: ProductMutationRequest) => {
    setSubmitIsLoading(true);
    createProductMutationManual(newMutation)
      .then(() => {
        setProductMutationRequest(newMutation);
        setDialogOpen(false);
        toast({
          title: "Manual Product Mutation",
          description: "Successfully create new request",
          duration: 5000,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setSubmitIsLoading(false);
      });
  };

  const handleOnSubmit = () => {
    if (
      !selectedProductId ||
      !ItemQuantity ||
      !requsterId ||
      !productMutatationRequest?.destinationWarehouseId
    )
      return;

    const newProductMutation: ProductMutationRequest = {
      productId: selectedProductId,
      quantity: ItemQuantity,
      notes: notes,
      requesterId: requsterId,
      originWarehouseId: selectedOriginWarehouseId,
      destinationWarehouseId: productMutatationRequest?.destinationWarehouseId,
    };

    if (isMutation) {
      handleProductMutationManual(newProductMutation);
    } else {
      handleProductMutationQuantity(newProductMutation);
    }
  };

  const handelOpenChange = () => {
    setSelectedOriginWarehouseId(undefined);
    setDialogOpen(true);
    setIsMutation(false);
    setItemQuantity(0);
    setNotes(undefined);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handelOpenChange} className="h-full">
          {buttonName}
        </Button>
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
                Request from
              </Label>
              <div className="col-span-3">
                <WarehouseSelection
                  warehouseId={selectedOriginWarehouseId}
                  setWarehouseId={setSelectedOriginWarehouseId}
                  excludeFromSelection={
                    productMutatationRequest?.destinationWarehouseId
                  }
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
          <Button
            onClick={handleOnSubmit}
            disabled={ItemQuantity === 0 || submitIsLoading}
          >
            {submitIsLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MutationDialog;
