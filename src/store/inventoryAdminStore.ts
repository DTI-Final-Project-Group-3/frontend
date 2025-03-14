import { create } from "zustand";

type InventoryAdminStore = {
  inventoryPage: number;
  setInventoryPage: (val: number) => void;

  productCategoryId: number | undefined;
  setProductCategoryId: (val: number | undefined) => void;

  searchQuery: string | undefined;
  setSearchQuery: (searchQuery: string | undefined) => void;
};

export const useInventoryAdmin = create<InventoryAdminStore>((set) => ({
  inventoryPage: 0,
  productCategoryId: undefined,

  setInventoryPage: (val: number) => {
    set({ inventoryPage: val });
  },

  setProductCategoryId: (val: number | undefined) => {
    set({ productCategoryId: val });
  },

  searchQuery: "",
  setSearchQuery: (val: string | undefined) => {
    set({ searchQuery: val });
  },
}));
