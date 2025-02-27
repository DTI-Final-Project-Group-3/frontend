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
import ProductSelection from "../product/ProductSelection";
import QuantityChange from "../common/QuantityChange";
import { useSession } from "next-auth/react";
import { Checkbox } from "../ui/checkbox";
import { ProductMutationRequest } from "@/types/models/productMutation";
import { updateQuantityWarehouseInventoryById } from "@/app/api/warehouse-inventories/putWarehouseInventoris";
import { useProductMutation } from "@/store/productMutationStore";
import { toast } from "@/hooks/use-toast";
import { createProductMutationManual } from "@/app/api/product-mutation/postProductMutation";
import AvailableWarehouseSelection from "../warehouse/AvailableWarehouseSelection";

interface ProductMutationProps {
  isProductMutation?: boolean;
  buttonName: string;
  onClick?: () => void;
}

const MutationDialog: FC<ProductMutationProps> = ({
  isProductMutation,
  buttonName,
  onClick,
}) => {
  const { data } = useSession();
  const requsterId = data?.userDetail?.id;
  const [isMutation, setIsMutation] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [ItemQuantity, setItemQuantity] = useState<number>(0);
  const [requesterNotes, setRequesterNotes] = useState<string>();
  const [submitIsLoading, setSubmitIsLoading] = useState<boolean>(false);
  const {
    warehouseInventoryId,
    productId,
    originWarehouseId,
    destinationWarehouseId,
    setProductId,
    setSubmitMutation,
  } = useProductMutation();

  useEffect(() => {
    if (isProductMutation) {
      setIsMutation(isProductMutation);
    }
  }, [isProductMutation]);

  useEffect(() => {
    setItemQuantity(0);
  }, [isMutation]);

  const handleProductMutationQuantity = (
    newMutation: ProductMutationRequest,
  ) => {
    if (!warehouseInventoryId) return;
    setSubmitIsLoading(true);
    updateQuantityWarehouseInventoryById(warehouseInventoryId, newMutation)
      .then(() => {
        setDialogOpen(false);
        setSubmitMutation(true);

        toast({
          title: `Update Product Quantity`,
          description: `Successfully update ${ItemQuantity} quantity`,
          duration: 5000,
        });
      })
      .finally(() => {
        setSubmitMutation(false);
        setSubmitIsLoading(false);
      });
  };

  const handleProductMutationManual = (newMutation: ProductMutationRequest) => {
    setSubmitIsLoading(true);
    createProductMutationManual(newMutation)
      .then(() => {
        setDialogOpen(false);
        setSubmitMutation(true);

        toast({
          title: "Manual Product Mutation",
          description: "Successfully create new request",
          duration: 5000,
        });
      })
      .finally(() => {
        setSubmitMutation(false);
        setSubmitIsLoading(false);
      });
  };

  const handleOnSubmit = () => {
    if (!productId || !ItemQuantity || !requsterId || !destinationWarehouseId)
      return;

    const newProductMutation: ProductMutationRequest = {
      productId: productId,
      quantity: ItemQuantity,
      requesterNotes: requesterNotes,
      requesterId: requsterId,
      originWarehouseId: originWarehouseId,
      destinationWarehouseId: destinationWarehouseId,
    };

    if (isMutation) {
      handleProductMutationManual(newProductMutation);
    } else {
      handleProductMutationQuantity(newProductMutation);
    }
  };

  const handleOpenChange = () => {
    setDialogOpen(true);
    setIsMutation(false);
    setItemQuantity(0);
    setRequesterNotes(undefined);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            handleOpenChange();
            if (onClick) onClick();
          }}
          className="h-full"
        >
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

        <div className="item-center mb-4 flex justify-center gap-2">
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
              <Label htmlFor="name" className="grid-cols-1 text-right">
                Product
              </Label>
              <div className="col-span-3">
                <ProductSelection
                  productId={productId}
                  setProductId={setProductId}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="grid-cols-1 text-right">
                Request from
              </Label>
              <div className="col-span-3">
                <AvailableWarehouseSelection />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="grid-cols-1 text-right">
            Quantity
          </Label>
          <div className="col-span-3">
            <QuantityChange
              itemQuantity={ItemQuantity}
              lowerLimit={isMutation ? 0 : undefined}
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
