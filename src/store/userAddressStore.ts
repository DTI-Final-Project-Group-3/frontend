import { UserAddress } from "@/types/models/users";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserAddressState = {
  userAddress: UserAddress | null;
  setUserAddress: (userAddress: UserAddress) => void;
};

export const useUserAddressStore = create<UserAddressState>()(
  persist(
    (set) => ({
      userAddress: null,
      setUserAddress: (address) => set({ userAddress: address }),
    }),
    { name: "userAddress" }
  )
);
