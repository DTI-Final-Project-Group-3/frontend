import { create } from "zustand";

type ProductAdminStore = {
  productPage: number;
  setProductPage: (productPage: number) => void;

  productCategoryId: number | undefined;
  setProductCategoryId: (productCategoryId: number | undefined) => void;

  searchQuery: string | undefined;
  setSearchQuery: (searchQuery: string | undefined) => void;
};

export const useProductUser = create<ProductAdminStore>((set) => ({
  productPage: 0,
  setProductPage: (val: number) => {
    set({ productPage: val });
  },

  productCategoryId: undefined,
  setProductCategoryId: (val: number | undefined) => {
    set({ productCategoryId: val });
  },

  searchQuery: undefined,
  setSearchQuery: (val: string | undefined) => {
    set({ searchQuery: val });
  },
}));
