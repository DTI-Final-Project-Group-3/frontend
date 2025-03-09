import { create } from "zustand";

type ProductAdminStore = {
  updateProductCategory: boolean;
  setUpdateProductCategory: (productCategory: boolean) => void;
};

export const useProductAdmin = create<ProductAdminStore>((set) => ({
  updateProductCategory: false,

  setUpdateProductCategory: (val: boolean) => {
    set({ updateProductCategory: val });
  },
}));
