import {
  ProductMutationManual,
  ProductMutationQuantity,
} from "@/types/models/productMutation";
import { create } from "zustand";

type ProductMutationState = {
  productMutationQuantity: ProductMutationQuantity | null;
  productMutatationManual: ProductMutationManual | null;

  setProductMutation: (mutation: ProductMutationManual) => void;
  setProductMutationQuantity: (mutation: ProductMutationQuantity) => void;
};

export const useProductMutation = create<ProductMutationState>((set) => ({
  productMutationQuantity: null,
  productMutatationManual: null,
  setProductMutation: (mutation: ProductMutationManual) => {
    set({ productMutatationManual: mutation });
  },
  setProductMutationQuantity: (mutation: ProductMutationQuantity) => {
    set({ productMutationQuantity: mutation });
  },
}));
