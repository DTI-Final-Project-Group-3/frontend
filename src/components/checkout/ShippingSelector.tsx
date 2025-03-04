import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShippingDetail, ShippingList } from "@/types/models/shippingList";

import { useEffect, useState } from "react";

interface SelectShippingProps {
  shippingList: ShippingList | null;
  selectedShippingIndex: number | null;
  setSelectedShippingIndex: (index: number | null) => void;
  setDialogOpen: (value: boolean) => void;
}

function SelectShipping({
    shippingList,
    selectedShippingIndex,
    setSelectedShippingIndex,
    setDialogOpen,
  }: SelectShippingProps) {
    const [tempSelectedIndex, setTempSelectedIndex] = useState<number | null>(selectedShippingIndex);
  
    return (
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Shipping Method</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {shippingList &&
            shippingList.details.map((item, index) => (
              <label
                key={index}
                className={`flex flex-col p-3 border rounded-md cursor-pointer transition ${
                  tempSelectedIndex === index ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
                <div className="flex justify-between items-center">
                  <p className="font-medium text-lg">{item.name}</p>
                  <p className="text-green-600 font-semibold">Rp {item.cost.toLocaleString()}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {item.code} - {item.service}
                </p>
                <p className="text-sm text-gray-500">Estimated time delivery: {item.etd}</p>
                <p className="text-sm text-gray-700 mt-1">{item.description}</p>
              </label>
            ))}
        </div>
        <DialogFooter>
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
  }
  
  

interface ShippingSelectorProps {
    shippingList : ShippingList | null,
    setShippingMethod : (method: ShippingDetail | null) => void;
}

export default function ShippingSelector({shippingList, setShippingMethod} : ShippingSelectorProps) {
    const [selectedShippingIndex, setSelectedShippingIndex] = useState<number | null>(null);
    const [selectedShipping, setSelectedShipping] = useState<ShippingDetail | null>(null);
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
                className="cursor-pointer border p-2 rounded-md w-full bg-green-50 border border-green-500"
                value={
                    selectedShipping
                    ? `${selectedShipping.code} - ${selectedShipping.service}\n${selectedShipping.etd}`
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
  