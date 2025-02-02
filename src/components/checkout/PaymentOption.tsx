import { cn } from "@/lib/utils";
import React, { FC } from "react";

type PaymentOption = {
  id: string;
  label: string;
};

type PaymentOptionProps = {
  options: PaymentOption[];
  selectedOption: string;
  onSelect: (value: string) => void;
};

const PaymentOption: FC<PaymentOptionProps> = ({
  selectedOption,
  options,
  onSelect,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => (
        <label
          key={option.id}
          htmlFor={option.id}
          className={cn(
            "flex items-center justify-between gap-2 p-4 border cursor-pointer hover:bg-gray-100 transition-colors",
            selectedOption === option.id
              ? "border-green-600 bg-green-50"
              : "border-gray-300"
          )}
        >
          <span className="text-[16px] cursor-pointer">{option.label}</span>
          <input
            type="radio"
            id={option.id}
            name="paymentMethod"
            value={option.id}
            checked={selectedOption === option.id}
            onChange={(e) => onSelect(e.target.value)}
            className="h-[20px] w-[20px] checked:accent-green-600 text-green-700 cursor-pointer"
          />
        </label>
      ))}
    </div>
  );
};

export default PaymentOption;
