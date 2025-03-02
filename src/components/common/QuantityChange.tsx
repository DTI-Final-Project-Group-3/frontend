import { cn } from "@/lib/utils";
import { FC } from "react";

interface QuantityChangeProps {
  lowerLimit?: number;
  higherLimit?: number;
  itemQuantity: number;
  setItemQuantity: (quantity: number) => void;
}

const QuantityChange: FC<QuantityChangeProps> = ({
  lowerLimit,
  higherLimit,
  itemQuantity,
  setItemQuantity,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      if (higherLimit !== undefined && value >= higherLimit) {
        setItemQuantity(higherLimit);
      } else if (lowerLimit !== undefined && value <= lowerLimit) {
        setItemQuantity(lowerLimit);
      } else {
        setItemQuantity(value);
      }
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex h-12 items-center rounded-md border border-gray-300">
        <button
          className={cn(
            "px-4 py-1 text-xl transition-colors",
            lowerLimit !== undefined && itemQuantity <= lowerLimit
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-600 hover:bg-gray-50",
          )}
          disabled={lowerLimit !== undefined && itemQuantity <= lowerLimit}
          onClick={(e) => {
            e.preventDefault();
            setItemQuantity(itemQuantity - 1);
          }}
        >
          -
        </button>

        <input
          type="text"
          value={itemQuantity}
          onChange={handleInputChange}
          className="w-12 border-x border-gray-300 text-center"
        />

        <button
          className={cn(
            "px-4 py-1 text-xl transition-colors",
            higherLimit !== undefined && itemQuantity >= higherLimit
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-600 hover:bg-gray-50",
          )}
          disabled={higherLimit !== undefined && itemQuantity >= higherLimit}
          onClick={(e) => {
            e.preventDefault();
            setItemQuantity(itemQuantity + 1);
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityChange;
