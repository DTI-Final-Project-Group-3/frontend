"use client";

import { getUserAddress } from "@/api/getUsers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { UserAddress } from "@/types/models/users";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocationStore } from "@/store/location";

interface LocationSelectorProps {
  onAddressChange?: (addressId: string | null) => void;
  onLocationChange?: (
    location: { latitude: number; longitude: number } | null
  ) => void;
}

export default function LocationSelector({
  onAddressChange,
  onLocationChange,
}: LocationSelectorProps) {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { data: userAddresses, isLoading: addressesLoading } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: getUserAddress,
    staleTime: 5 * 60 * 1000,
  });

  const setLocation = useLocationStore((state) => state.setLocation);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(location);
          onLocationChange?.(location);
          setLocation(location);
          toast({
            title: "Location detected",
            description: "Your current location has been set.",
          });
        },
        (error) => {
          toast({
            title: "Error",
            description: "Unable to get your location. Please try again.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    }
  };

  const handleAddressChange = (value: string) => {
    if (value === "current-location") {
      getCurrentLocation();
      setSelectedAddress(null);
      onAddressChange?.(null);
    } else {
      setSelectedAddress(value);
      onAddressChange?.(value);
      setCurrentLocation(null);
      onLocationChange?.(null);
      setLocation(null);
    }
  };

  return (
    <div className="mb-6 gap-4 font-inter">
      <div className="flex-1">
        <label className="block text-xl font-bold mb-4">Delivery Address</label>
        <div className="p-2">
          <Select
            value={selectedAddress ?? ""}
            onValueChange={handleAddressChange}
          >
            <SelectTrigger className="w-full" disabled={addressesLoading}>
              <SelectValue
                placeholder={
                  currentLocation
                    ? "Using current location"
                    : "Select delivery address"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-location">
                Use current location
              </SelectItem>
              {addressesLoading ? (
                <SelectItem value="loading" disabled>
                  Loading addresses...
                </SelectItem>
              ) : (
                userAddresses?.data?.map((address: UserAddress) => (
                  <SelectItem key={address.id} value={address.id.toString()}>
                    {address.address}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
