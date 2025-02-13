import { cn } from "@/lib/utils";
import { Address } from "@/types/models/checkout/userAddresses";
import { MapPin } from "lucide-react";
import React, { FC } from "react";

type ShippingAddressProps = {
  userAddress: Address[];
};

const ShippingAddress: FC<ShippingAddressProps> = ({ userAddress }) => {
  return (
    <div className="bg-white p-8 rounded-xl">
      <h3 className="text-[22px] font-bold">Shipping address</h3>

      <div className="pt-6">
        {userAddress.length > 0 ? (
          <div className="space-y-4 flex flex-col gap-2">
            {userAddress.map((address) => (
              <div
                key={address.id}
                className={cn(
                  "flex justify-between w-full p-4 rounded-lg shadow-sm transition-all",
                  address.primary
                    ? "bg-green-50 border border-green-500"
                    : "bg-white border border-gray-200"
                )}
              >
                <div className="flex flex-col gap-2">
                  <h3 className="flex gap-2 items-center text-lg font-semibold">
                    <MapPin size={18} className="text-green-600" />
                    {address.name}
                  </h3>
                  <p className="text-gray-700">{address.detailAddress}</p>
                </div>
                <div>
                  <span
                    className={cn(
                      "flex items-center mt-2 px-4 py-1 text-sm font-medium rounded-full",
                      address.primary && "bg-green-500 text-white"
                    )}
                  >
                    {address.primary && "Active"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No addresses found.</p>
        )}
      </div>
    </div>
  );
};

export default ShippingAddress;
