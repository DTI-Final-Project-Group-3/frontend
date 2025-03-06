import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShippingDetail, ShippingList } from "@/types/models/shippingList";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";

interface SelectShippingProps {
  shippingList: ShippingList | null;
  selectedShippingIndex: number | null;
  setSelectedShippingIndex: (index: number | null) => void;
  setDialogOpen: (value: boolean) => void;
}

const SelectShipping = ({
  shippingList,
  selectedShippingIndex,
  setSelectedShippingIndex,
  setDialogOpen,
}: SelectShippingProps) => {
  const [tempSelectedIndex, setTempSelectedIndex] = useState<number | null>(
    selectedShippingIndex,
  );

  return (
    <DialogContent className="max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          <span className="text-xl">Select Shipping Method</span>
          <Separator className="my-4" />
        </DialogTitle>
      </DialogHeader>
      <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-4">
        {shippingList &&
          shippingList.details.map((item, index) => (
            <label
              key={index}
              className={`flex cursor-pointer flex-col rounded-md border p-2 transition ${
                tempSelectedIndex === index
                  ? "border-green-700 bg-green-50"
                  : "border-green-300"
              }`}
            >
              <input
                type="radio"
                name="shippingMethod"
                value={index}
                checked={tempSelectedIndex === index}
                onChange={() => setTempSelectedIndex(index)}
                className="hidden"
              />
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium">{item.name}</p>
                <p className="font-semibold text-green-600">
                  Rp {item.cost.toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {item.code} - {item.service}
              </p>
              <p className="text-sm text-gray-500">
                Estimated time delivery: {item.etd}
              </p>
              <p className="mt-1 text-sm text-gray-700">{item.description}</p>
            </label>
          ))}
      </div>
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={() => setDialogOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            setSelectedShippingIndex(tempSelectedIndex);
            setDialogOpen(false);
          }}
          disabled={tempSelectedIndex === null}
        >
          Select
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

interface ShippingSelectorProps {
  shippingList: ShippingList | null;
  setShippingMethod: (method: ShippingDetail | null) => void;
}

export default function ShippingSelector({
  shippingList,
  setShippingMethod,
}: ShippingSelectorProps) {
  const [selectedShippingIndex, setSelectedShippingIndex] = useState<
    number | null
  >(null);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingDetail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!shippingList) {
      setSelectedShippingIndex(null);
      setSelectedShipping(null);
    }
    if (shippingList && selectedShippingIndex !== null) {
      setSelectedShipping(shippingList.details[selectedShippingIndex]);
      setShippingMethod(shippingList.details[selectedShippingIndex]);
    } else {
      setShippingMethod(null);
    }
  }, [selectedShippingIndex, shippingList, setShippingMethod]);

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <input
            readOnly
            className="w-full cursor-pointer border border-green-700 bg-green-50 p-4 text-[16px]"
            value={
              selectedShipping
                ? `${selectedShipping.code} - ${selectedShipping.service} (${selectedShipping.etd})`
                : "Choose Shipping Method"
            }
            onClick={() => setDialogOpen(true)}
          />
        </DialogTrigger>
        {dialogOpen && (
          <SelectShipping
            shippingList={shippingList}
            selectedShippingIndex={selectedShippingIndex}
            setSelectedShippingIndex={setSelectedShippingIndex}
            setDialogOpen={setDialogOpen}
          />
        )}
      </Dialog>
    </div>
  );
}
