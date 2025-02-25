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
      setItemQuantity(value);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex items-center border border-gray-300 rounded-md h-12">
        <button
          className={cn(
            "px-4 py-1 text-xl transition-colors",
            lowerLimit && itemQuantity <= lowerLimit
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-50"
          )}
          disabled={lowerLimit ? itemQuantity <= lowerLimit : false}
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
          className="w-12 text-center border-x border-gray-300"
        />

        <button
          className={cn(
            "px-4 py-1 text-xl transition-colors",
            higherLimit && itemQuantity >= higherLimit
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-50"
          )}
          disabled={higherLimit ? itemQuantity >= higherLimit : false}
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
