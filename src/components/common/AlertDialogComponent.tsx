import React, { FC } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface AlertDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const MyAlertDialog: FC<AlertDialogProps> = ({
  open,
  setOpen,
  title,
  description,
  cancelText,
  confirmText,
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <div className="grid grid-cols-3 justify-end space-x-2">
          {cancelText && !confirmText && (
            <AlertDialogCancel onClick={onCancel} className="col-start-3">
              {cancelText}
            </AlertDialogCancel>
          )}
          {confirmText && !cancelText && (
            <AlertDialogAction onClick={onConfirm} className="col-start-3">
              {confirmText}
            </AlertDialogAction>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MyAlertDialog;
