import { create } from "zustand";

interface ProductMutationManual {
  productId: number;
  quantity: number;
  notes: string;
  requesterId: number;
  originWarehouseId: number;
  destinationWarehouseId: number;
}

type ProductMutationState = {
  productMutatationManual: ProductMutationManual | null;
  setProductMutation: (mutation: ProductMutationManual) => void;
};

export const useProductMutation = create<ProductMutationState>((set) => ({
  productMutatationManual: null,
  setProductMutation: (mutation: ProductMutationManual) => {
    set({ productMutatationManual: mutation });
  },
}));
