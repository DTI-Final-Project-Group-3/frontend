import React, { FC, useState } from "react";
import AlertDialogComponent from "@/components/common/AlertDialogComponent";
import { deleteProductCategoryById } from "@/app/api/product/deleteProducts";
import { ProductCategory } from "@/types/models/products";
import { useProductAdmin } from "@/store/productAdminStore";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import DeleteIcon from "@/components/icon/DeleteIcon";

const DeleteProductCategoryAlert: FC<ProductCategory> = ({ id, name }) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const { setUpdateProductCategory } = useProductAdmin();
  const { data } = useSession();

  const handleConfirmDelete = () => {
    setUpdateProductCategory(true);

    if (!id || !data?.accessToken) {
      setOpenAlert(false);
      setUpdateProductCategory(false);
      return;
    }

    deleteProductCategoryById({ id, accessToken: data?.accessToken })
      .then(() =>
        toast({
          title: "Success",
          description: "Successfully deleted product",
          duration: 2000,
        }),
      )
      .finally(() => {
        setOpenAlert(false);
        setUpdateProductCategory(false);
      });
  };

  return (
    <>
      <DeleteIcon onClick={() => setOpenAlert(true)} />
      <AlertDialogComponent
        open={openAlert}
        setOpen={setOpenAlert}
        title="Are You Sure?"
        description={`All data related to product category ${name} will be deleted from database`}
        onCancel={() => setOpenAlert(false)}
        onConfirm={handleConfirmDelete}
        cancelText="Cancel"
        confirmText="Confirm"
      />
    </>
  );
};

export default DeleteProductCategoryAlert;
