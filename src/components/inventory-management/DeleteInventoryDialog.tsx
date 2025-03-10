import { deleteWarehouseInventoryById } from "@/app/api/warehouse-inventories/deleteWarehouseInventories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useProductMutation } from "@/store/productMutationStore";
import { Label } from "@radix-ui/react-label";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { Textarea } from "../ui/textarea";
import DeleteIcon from "@/components/icon/DeleteIcon";

export const DeleteInventoryDialog: FC<{ warehouseInventoryId: number }> = ({
  warehouseInventoryId,
}) => {
  const { submitMutation, destinationWarehouseId, setSubmitMutation } =
    useProductMutation();
  const { data } = useSession();
  const [notes, setNotes] = useState<string>();
  const requesterId = data?.userDetail?.id;

  const handleOnConfirm = () => {
    if (!requesterId || !destinationWarehouseId) return;

    setSubmitMutation(true);
    deleteWarehouseInventoryById({
      warehouseInventoryId,
      userId: requesterId,
      notes,
    }).finally(() => setSubmitMutation(false));
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DeleteIcon />
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-7">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will delete inventory item in
            this warehouse and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Notes
          </Label>
          <Textarea
            placeholder="Type your notes here"
            className="col-span-3 resize-none"
            onChange={(e) => setNotes(e.target.value)}
            required
          />
        </div>
        <AlertDialogFooter className="grid grid-cols-2">
          <AlertDialogCancel disabled={submitMutation}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleOnConfirm}
            disabled={submitMutation}
          >
            {submitMutation ? "Confirming..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
