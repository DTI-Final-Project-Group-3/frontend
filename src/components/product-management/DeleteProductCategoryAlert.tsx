import React, { FC, useState } from "react";
import AlertDialogComponent from "@/components/common/AlertDialogComponent";
import { Trash2 } from "lucide-react";
import { deleteProductCategoryById } from "@/app/api/product/deleteProducts";
import { ProductCategory } from "@/types/models/products";
import { useProductAdmin } from "@/store/productAdminStore";
import { useSession } from "next-auth/react";

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

    deleteProductCategoryById({ id, accessToken: data?.accessToken }).finally(
      () => {
        setOpenAlert(false);
        setUpdateProductCategory(false);
      },
    );
  };

  return (
    <>
      <Trash2
        className="h-5 w-5 cursor-pointer text-gray-600"
        onClick={() => setOpenAlert(true)}
      />
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
