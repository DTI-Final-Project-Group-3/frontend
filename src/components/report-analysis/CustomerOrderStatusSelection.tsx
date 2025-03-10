import React, { FC } from "react";
import { trxStatuses } from "@/constant/orderStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReport } from "@/store/reportStore";

const CustomerOrderStatusSelection: FC = () => {
  const { customerOrderStatusId, setCustomerOrderStatusId } = useReport();
  return (
    <div className="w-full">
      <Select
        value={customerOrderStatusId ? customerOrderStatusId.toString() : "all"}
        onValueChange={(value) => {
          if (value === "all") {
            setCustomerOrderStatusId(undefined);
          } else {
            setCustomerOrderStatusId(Number(value));
          }
        }}
      >
        <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white text-gray-500 shadow-sm transition-all hover:border-green-500 focus:ring-2 focus:ring-green-500">
          <SelectValue placeholder="Select Warehouse" />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          <SelectItem value="all">All Status</SelectItem>
          {trxStatuses
            ?.filter((status) => status.id !== 0)
            .map((status) => (
              <SelectItem key={status.id} value={status.id.toString()}>
                {status.text}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomerOrderStatusSelection;
