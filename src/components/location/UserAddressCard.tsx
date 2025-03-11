import { FC } from "react";
import { UserAddress } from "@/types/models/users";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
        "flex w-full cursor-pointer flex-col gap-2 rounded-lg border-2 px-4 py-2 md:max-h-24",
        isSelected
          ? "border-warehub-green bg-green-50"
          : "border-gray-200 bg-white",
      )}
    >
      <div className="flex gap-2">
        <MapPin className="text-gray-800" />
        <div className="flex w-full justify-between">
          <h2 className="font-semibold">{name}</h2>
          {primary && (
            <Badge className="hover-text-white bg-warehub-green-light hover:bg-warehub-green-light">
              Primary
            </Badge>
          )}
        </div>
      </div>

      <p className="overflow-hidden text-ellipsis text-sm text-gray-700">
        {detailAddress}
      </p>
    </div>
  );
};

export default UserAddressCard;
