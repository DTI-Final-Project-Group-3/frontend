"use client";

import { getUserAddress } from "@/app/api/user/getUsers";
import { toast } from "@/hooks/use-toast";
import { UserAddress } from "@/types/models/users";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useUserAddressStore } from "@/store/userAddressStore";
import {
  getDetailAddress,
  LocationCoordinate,
} from "@/app/api/common/getLocation";
import { useSession } from "next-auth/react";

export default function FilterLocation() {
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinate>({
    latitude: 0,
    longitude: 0,
  });
  const setUserAddress = useUserAddressStore((state) => state.setUserAddress);
  const session = useSession();

  const { data: userAddresses, isLoading: addressesLoading } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: getUserAddress,
    enabled: session.status === "authenticated",
  });

  const { data: currentLocationDetail, isLoading: locationLoading } = useQuery({
    queryKey: ["currentLocationDetail", currentLocation],
    queryFn: () => getDetailAddress(currentLocation),
    enabled: currentLocation.latitude !== 0 && currentLocation.longitude !== 0,
  });

  // Watch for changes in currentLocationDetail and update the address
  useEffect(() => {
    if (currentLocationDetail && currentLocation.latitude !== 0) {
      const currentLocationAddress: UserAddress = {
        id: 0,
        name: "Current Location",
        detailAddress: currentLocationDetail.display_name ?? "Unknown",
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };
      setUserAddress(currentLocationAddress);
      toast({
        title: "Location updated",
        description: `Current location: ${currentLocationDetail.display_name}`,
      });
    }
  }, [currentLocationDetail, currentLocation, setUserAddress]);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(location);
          toast({
            title: "Location detected",
            description: "Getting address details...",
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

  const handleAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === "currentLocation") {
      getCurrentLocation();
    } else {
      const selectedAddress = userAddresses?.data.find(
        (address) => address.detailAddress === value
      );
      if (selectedAddress) {
        setUserAddress(selectedAddress);
        toast({
          title: "Location changed",
          description: `Delivery address: ${selectedAddress.name}`,
        });
      }
    }
  };

  return (
    <div className="font-inter">
      <label
        htmlFor="address-select"
        className="text-lg font-semibold mb-2 block"
      >
        Delivery Address
      </label>
      <select
        id="address-select"
        className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        onChange={handleAddressChange}
        disabled={addressesLoading}
      >
        <option value="" disabled>
          Select location
        </option>
        <option value="currentLocation">Use Current Location</option>
        {addressesLoading ? (
          <option value="loading" disabled>
            Loading addresses...
          </option>
        ) : userAddresses?.data && userAddresses.data.length > 0 ? (
          userAddresses.data.map((address: UserAddress) => (
            <option key={address.id} value={address.detailAddress}>
              {address.detailAddress}
            </option>
          ))
        ) : (
          <option value="no-addresses" disabled>
            No saved addresses available.
          </option>
        )}
      </select>
      {locationLoading && (
        <p className="mt-2 text-sm text-gray-500">
          Getting current location details...
        </p>
      )}
    </div>
  );
}
