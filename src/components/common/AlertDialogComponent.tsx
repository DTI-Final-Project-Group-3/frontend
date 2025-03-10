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
        <div className="mt-4 flex justify-end gap-2">
          {cancelText && (
            <AlertDialogCancel onClick={onCancel} className="w-32">
              {cancelText}
            </AlertDialogCancel>
          )}
          {confirmText && (
            <AlertDialogAction onClick={onConfirm} className="w-32">
              {confirmText}
            </AlertDialogAction>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MyAlertDialog;
