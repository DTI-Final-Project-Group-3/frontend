import { ProductMutationRequest } from "@/types/models/productMutation";
import { create } from "zustand";

type ProductMutationState = {
  productMutatationRequest: ProductMutationRequest | null;

  setProductMutationRequest: (mutation: ProductMutationRequest) => void;
};

export const useProductMutation = create<ProductMutationState>((set) => ({
  productMutatationRequest: null,
  setProductMutationRequest: (mutation: ProductMutationRequest) => {
    set({ productMutatationRequest: mutation });
  },
}));
