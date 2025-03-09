import React, { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { ProductCategory } from "@/types/models/products";
import { updateProductCategoryById } from "@/app/api/product/putProducts";
import { useSession } from "next-auth/react";
import { PenSquare } from "lucide-react";
import { Input } from "@/components/ui/input";

const EditProductCategoryDialog: FC<ProductCategory> = ({ id, name }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [productCategoryName, setProductCategoryName] = useState<string>();
  const [submitProductCategory, setSubmitProductCategory] =
    useState<boolean>(false);
  const { data } = useSession();

  useEffect(() => {
    setProductCategoryName(name);
  }, []);

  const handleDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleOnSubmit = () => {
    setSubmitProductCategory(true);
    if (!productCategoryName || !data?.accessToken) return;

    updateProductCategoryById({
      id,
      name: productCategoryName,
      accessToken: data?.accessToken,
    }).then(() => setSubmitProductCategory(false));
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <PenSquare
          className="h-5 w-5 cursor-pointer text-gray-600"
          onClick={handleDialog}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-5">
          <DialogTitle>Edit Product Category</DialogTitle>
          <DialogDescription>
            Edit name for this product category
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Name
          </Label>
          <Input
            className="col-span-3 resize-none"
            onChange={(e) => setProductCategoryName(e.target.value)}
            required
          />
        </div>

        <DialogFooter>
          <Button onClick={handleOnSubmit} disabled={!productCategoryName}>
            {submitProductCategory ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductCategoryDialog;
