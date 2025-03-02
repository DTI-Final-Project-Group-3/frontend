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
import { cancelOrder } from "@/app/api/transaction/cancelOrder";
import { Loader2, TriangleAlert } from "lucide-react";

type CancelOrderModalProps = {
  orderId: number;
  orderStatusId: number;
};

const CancelOrderModal: FC<CancelOrderModalProps> = ({
  orderId,
  orderStatusId,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCancelOrder = useMutation({
    mutationFn: () => cancelOrder(orderId),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="font-semibold text-md text-red-500 border-red-500"
          disabled={orderStatusId !== 1}
        >
          Cancel Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[400px] p-6">
        <DialogHeader className="flex flex-col gap-2 w-full">
          <DialogTitle className="text-3xl font-semibold m-0 p-0 text-red-700 flex items-center gap-2">
            <TriangleAlert className="w-6 h-6 text-red-500 mr-2" />
            Cancel this order ?
          </DialogTitle>
          <Separator />
        </DialogHeader>
        <>
          <p className="text-black font-medium text-[16px] py-4">
            This action cannot be undone. Please make sure you already receive
            the order and you are ready to cancel this order.
          </p>
        </>
        {/* Checkbox Confirmation */}
        <div className="flex items-center gap-2 mt-2">
          <Checkbox
            id="confirm"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          />
          <label htmlFor="confirm" className="text-gray-600 text-sm">
            I understand that this order is final and cannot be undone.
          </label>
        </div>

        <Separator className="mt-4" />

        <DialogFooter className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => setIsChecked(false)}
            >
              close
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={!isChecked || handleCancelOrder.isPending}
            className="px-6"
            onClick={() => handleCancelOrder.mutate()}
          >
            {handleCancelOrder.isPending ? (
              <div className="flex items-center gap-4">
                <Loader2 size={36} className="animate-spin" />
                <span>Cancelling...</span>
              </div>
            ) : (
              <span>Cancel order</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderModal;
