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
import {
  ProductMutationManual,
  ProductMutationQuantity,
} from "@/types/models/productMutation";
import { updateQuantityWarehouseInventoryById } from "@/app/api/warehouse-inventories/putWarehouseInventoris";
import { useProductMutation } from "@/store/productMutationStore";
import { toast } from "@/hooks/use-toast";

interface ProductMutationProps {
  warehouseInventoryId: number;
  productId: number;
  warehouseId: number;
  totalQuantity: number;
}

const MutationDialog: FC<ProductMutationProps> = ({
  warehouseInventoryId,
  productId,
  warehouseId,
  totalQuantity,
}) => {
  const { data } = useSession();
  const [isMutation, setIsMutation] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [selectedProductId, setSelectedProductId] = useState<number>();
  const [ItemQuantity, setItemQuantity] = useState<number>(0);
  const [notes, setNotes] = useState<string>();
  const requsterId = data?.userDetail?.id;
  const [destinationWarehouseId, setDestinationWarehouseId] =
    useState<number>();
  const [submitIsLoading, setSubmitIsLoading] = useState<boolean>(false);
  const { setProductMutationQuantity } = useProductMutation();

  useEffect(() => {
    if (productId) {
      setSelectedProductId(productId);
    }
    if (warehouseId) {
      setDestinationWarehouseId(warehouseId);
    }
  }, [productId, warehouseId]);

  const handleProductMutationQuantity = (
    newMutation: ProductMutationQuantity
  ) => {
    setSubmitIsLoading(true);
    updateQuantityWarehouseInventoryById(warehouseInventoryId, newMutation)
      .then(() => {
        setProductMutationQuantity(newMutation);
        setDialogOpen(false);
        toast({
          title: `Update Product Quantity`,
          description: `Successfully update ${ItemQuantity} quantity`,
          duration: 20000,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setSubmitIsLoading(false);
      });
  };

  const handleProductMutationManual = (newMutation: ProductMutationManual) => {
    setSubmitIsLoading(true);
    updateQuantityWarehouseInventoryById(warehouseInventoryId, newMutation)
      .then(() => {
        setProductMutationQuantity(newMutation);
        setDialogOpen(false);
        toast({
          title: "Update product quantity",
          description: "Success",
          duration: 20000,
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
      !destinationWarehouseId
    )
      return;

    const newMutation: ProductMutationQuantity = {
      productId: selectedProductId,
      quantity: ItemQuantity,
      notes: notes,
      requesterId: requsterId,
      destinationWarehouseId: destinationWarehouseId,
    };

    if (isMutation) {
    } else {
      handleProductMutationQuantity(newMutation);
    }
  };

  const handelOpenChange = () => {
    setDialogOpen(true);
    setIsMutation(false);
    setItemQuantity(0);
    setNotes(undefined);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handelOpenChange}>
          Change Quantity
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
