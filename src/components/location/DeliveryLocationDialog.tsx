import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getUserAddress } from "@/app/api/user/getUsers";
import UserAddressCard from "@/components/location/UserAddressCard";
import { useUserAddressStore } from "@/store/userAddressStore";
import { toast } from "@/hooks/use-toast";
import { ChevronDown } from "lucide-react";

const DeliveryLocationDialog: FC = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedUserAddressId, setSelectedUserAddressId] = useState<number>();
  const { setUserAddress } = useUserAddressStore();

  const { data: userAddresses } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: getUserAddress,
  });

  const handleDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleOnSubmit = () => {
    const selectedDetailAddress = userAddresses?.data.find(
      (userAddress) => userAddress.id === selectedUserAddressId,
    );
    if (selectedDetailAddress) {
      setUserAddress(selectedDetailAddress);
      toast({
        title: "Delivery Location Changed !",
        description: `Location changed to ${selectedDetailAddress.name}`,
        duration: 2000,
      });
    }
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button className="flex justify-between rounded-lg p-2">
          <span>Select Delivery Address</span>
          <ChevronDown className="text-gray-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-5">
          <DialogTitle>Select Delivery Address</DialogTitle>
          <DialogDescription>
            Product showcase will be based on this selection
          </DialogDescription>
        </DialogHeader>

        <div>
          {userAddresses &&
            userAddresses.data.map((userAddress) => (
              <div
                onClick={() => setSelectedUserAddressId(userAddress.id)}
                key={`user-address-selected-${userAddress.id}`}
              >
                <UserAddressCard
                  id={userAddress.id}
                  name={userAddress.name}
                  detailAddress={userAddress.detailAddress}
                  primary={userAddress.primary}
                  isSelected={selectedUserAddressId === userAddress.id}
                />
              </div>
            ))}
        </div>

        <DialogFooter>
          <Button
            onClick={handleOnSubmit}
            disabled={!selectedUserAddressId}
            className="max-w-[50%]"
          >
            Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryLocationDialog;
