import { FC } from "react";
import { UserAddress } from "@/types/models/users";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAddressCardProps extends UserAddress {
  isSelected?: boolean;
}

const UserAddressCard: FC<Partial<UserAddressCardProps>> = ({
  name,
  detailAddress,
  primary,
  isSelected,
}) => {
  return (
    <div
      className={cn(
        "flex w-full cursor-pointer flex-col gap-2 rounded-lg border-2 px-4 py-2",
        isSelected
          ? "border-warehub-green bg-green-50"
          : "border-gray-200 bg-white",
      )}
    >
      <div className="flex gap-2">
        <MapPin className="text-gray-800" />
        <h2 className="font-bold">
          {name} <span>{primary ? "Primary" : ""}</span>
        </h2>
      </div>

      <p className="text-sm">{detailAddress}</p>
    </div>
  );
};

export default UserAddressCard;
