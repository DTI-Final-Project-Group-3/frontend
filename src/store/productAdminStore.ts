import { create } from "zustand";

type ProductAdminStore = {
  updateProductCategory: boolean;
  setUpdateProductCategory: (productCategory: boolean) => void;

  productPage: number;
  setProductPage: (productPage: number) => void;

  productCategoryId: number | undefined;
  setProductCategoryId: (productCategoryId: number | undefined) => void;

  searchQuery: string | undefined;
  setSearchQuery: (searchQuery: string | undefined) => void;
};

export const useProductAdmin = create<ProductAdminStore>((set) => ({
  updateProductCategory: false,
  setUpdateProductCategory: (val: boolean) => {
    set({ updateProductCategory: val });
  },

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
