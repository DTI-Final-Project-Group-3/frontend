import { create } from "zustand";

type InventoryAdminStore = {
  inventoryPage: number;
  setInventoryPage: (val: number) => void;

  productCategoryId: number | undefined;
  setProductCategoryId: (val: number) => void;
};

export const useInventoryAdmin = create<InventoryAdminStore>((set) => ({
  inventoryPage: 0,
  productCategoryId: undefined,

  setInventoryPage: (val: number) => {
    set({ inventoryPage: val });
  },

  setProductCategoryId: (val: number) => {
    set({ productCategoryId: val });
  },
}));
