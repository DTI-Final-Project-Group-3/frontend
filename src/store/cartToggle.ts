import { create } from "zustand";

type CartState = {
  showCart: boolean;
  toggleShowCart: () => void;
};

export const useCartToggleStore = create<CartState>((set) => ({
  showCart: false,
  toggleShowCart: () => set((state) => ({ showCart: !state.showCart })),
}));
