import { UserAddress } from "@/types/models/users";
import { create } from "zustand";

type UserAddressState = {
  userAddress: UserAddress | null;
  setUserAddress: (userAddress: UserAddress) => void;
};

export const useUserAddressStore = create<UserAddressState>((set) => ({
  userAddress: null,
  setUserAddress: (address) => set({ userAddress: address }),
}));
