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
import { TriangleAlert } from "lucide-react";

type ConfirmOrderModalProps = {
  orderStatusId: number;
};

export const confirmOrder = async () => {

}

const ConfirmOrderModal: FC<ConfirmOrderModalProps> = ({ orderStatusId }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="font-semibold text-md"
          disabled={orderStatusId !== 4}
        >
          Confirm Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[400px] p-6">
        <DialogHeader className="flex flex-col gap-2 w-full">
          <DialogTitle className="text-3xl font-semibold m-0 p-0 text-red-700 flex items-center gap-2">
            <TriangleAlert className="w-6 h-6 text-red-500 mr-2" />
            Confirm this order ?
          </DialogTitle>
          <Separator />
        </DialogHeader>
        <>
          <p className="text-black font-medium text-[16px] py-4">
            This action cannot be undone. Please make sure you already receive
            the order and you are ready to confirm this order.
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
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            disabled={!isChecked}
            className="px-6"
          >
            Confirm Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmOrderModal;
