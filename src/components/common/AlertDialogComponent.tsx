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
        <div className="mt-4 grid grid-cols-2 gap-2">
          {confirmText && (
            <AlertDialogAction onClick={onConfirm}>
              {confirmText}
            </AlertDialogAction>
          )}
          {cancelText && (
            <AlertDialogCancel onClick={onCancel}>
              {cancelText}
            </AlertDialogCancel>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MyAlertDialog;
