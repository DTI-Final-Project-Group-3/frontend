import { cn } from "@/lib/utils";
import { Address } from "@/types/models/checkout/userAddresses";
import { MapPin } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";

type ShippingAddressProps = {
  userAddress: Address[];
  setSelectedShippingAddress: (selectedShippingAddress: Address) => void;
};

const ShippingAddress: FC<ShippingAddressProps> = ({ userAddress, setSelectedShippingAddress }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  useEffect(() => {
    if (userAddress) {
      const selectedAddressId = userAddress.find((address) => address.primary)?.id
      if (selectedAddressId) {
        setSelectedAddressId(selectedAddressId);
        const selectedAddress = userAddress.find((addr) => addr.id === selectedAddressId);
        if (selectedAddress) {
          setSelectedShippingAddress(selectedAddress);
        }
      }
    }
      
  },[userAddress, setSelectedShippingAddress]);

  const handleAddressChange = (address: Address) => {
    setSelectedAddressId(address.id);
    const selectedAddress = userAddress.find((addr) => addr.id === address.id);
    if (selectedAddress) {
      setSelectedShippingAddress(selectedAddress);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl">
      <h3 className="text-[22px] font-bold">Shipping address</h3>

      <div className="pt-6">
        {userAddress.length > 0 ? (
          <div className="space-y-4 flex flex-col gap-2">
            {userAddress.map((address) => (
              <label
                key={address.id}
                className={cn(
                  "flex justify-between w-full p-4 rounded-lg shadow-sm transition-all cursor-pointer",
                  selectedAddressId === address.id
                    ? "bg-green-50 border border-green-500"
                    : "bg-white border border-gray-200"
                )}
              >
                <div className="flex items-center gap-6">
                  <input
                    type="radio"
                    name="shippingAddress"
                    checked={selectedAddressId === address.id}
                    onChange={() => handleAddressChange(address)}
                    className="form-radio text-green-600 checked:accent-green-600 w-[20px] h-[20px]"
                  />
                  <div className="flex flex-col gap-2">
                    <h3 className="flex gap-2 items-center text-lg font-semibold">
                      <MapPin size={18} className="text-green-600" />
                      {address.name}
                    </h3>
                    <p className="text-gray-700">{address.detailAddress}</p>
                  </div>
                </div>
                <div>
                  <span
                    className={cn(
                      "flex items-center mt-2 px-4 py-1 text-sm font-medium rounded-full",
                      address.primary && "bg-green-500 text-white"
                    )}
                  >
                    {address.primary && "Main address"}
                  </span>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-gray-600 mb-4">No addresses found.</p>
            <Button
              className="font-semibold text-md"
              disabled={false}
              onClick={() => router.push(`/profile/create-address?origin=${encodeURIComponent(pathname)}`)}
            >
              Add a new address
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingAddress;
