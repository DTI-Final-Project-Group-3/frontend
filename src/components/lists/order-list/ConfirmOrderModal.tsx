"use client";

import React, { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { confirmOrder } from "@/app/api/transaction/confirmOrder";
import { Loader2, TriangleAlert } from "lucide-react";

type ConfirmOrderModalProps = {
  orderStatusId: number;
  orderId: number;
  accessToken: string | undefined;
};

const ConfirmOrderModal: FC<ConfirmOrderModalProps> = ({
  orderStatusId,
  orderId,
  accessToken,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmOrder = useMutation({
    mutationFn: () => confirmOrder(orderId, accessToken),
    onSuccess: () => {
      setIsOpen(false);
      // window.location.reload();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="text-md font-semibold"
          disabled={orderStatusId !== 4}
          onClick={() => setIsOpen(true)}
        >
          Confirm Order
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 sm:min-w-[400px]">
        <DialogHeader className="flex w-full flex-col gap-2">
          <DialogTitle className="m-0 flex items-center gap-2 p-0 text-3xl font-semibold text-red-700">
            <TriangleAlert className="mr-2 h-6 w-6 text-red-500" />
            Confirm this order ?
          </DialogTitle>
          <Separator />
        </DialogHeader>
        <>
          <p className="py-4 text-[16px] font-medium text-black">
            This action cannot be undone. Please make sure you already receive
            the order and you are ready to confirm this order.
          </p>
        </>
        {/* Checkbox Confirmation */}
        <div className="mt-2 flex items-center gap-2">
          <Checkbox
            id="confirm"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          />
          <label htmlFor="confirm" className="text-sm text-gray-600">
            I understand that this order is final and cannot be undone.
          </label>
        </div>

        <Separator className="mt-4" />

        <DialogFooter className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => {
                setIsChecked(false);
                setIsOpen(false);
              }}
            >
              close
            </Button>
          </DialogClose>
          <Button
            variant="green"
            disabled={!isChecked || handleConfirmOrder.isPending}
            className="px-6"
            onClick={() => handleConfirmOrder.mutate()}
          >
            {handleConfirmOrder.isPending ? (
              <div className="flex items-center gap-4">
                <Loader2 size={36} className="animate-spin" />
                Confirming...
              </div>
            ) : (
              "Confirm order"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmOrderModal;
