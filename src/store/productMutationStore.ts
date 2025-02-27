import { create } from "zustand";

type ProductMutationState = {
  warehouseInventoryId: number | undefined;
  productId: number | undefined;
  originWarehouseId: number | undefined;
  destinationWarehouseId: number | undefined;
  submitMutation: boolean;

  setWarehouseInventoryId: (val: number) => void;
  setProductId: (val: number) => void;
  setOriginWarehouseId: (val: number) => void;
  setDestinationWarehouseId: (val: number) => void;
  setSubmitMutation: (val: boolean) => void;
};

export const useProductMutation = create<ProductMutationState>((set) => ({
  warehouseInventoryId: undefined,
  productId: undefined,
  originWarehouseId: undefined,
  destinationWarehouseId: undefined,
  submitMutation: false,

  setWarehouseInventoryId: (val: number) => {
    set({ warehouseInventoryId: val });
  },

  setProductId: (val: number) => {
    set({ productId: val });
  },

  setOriginWarehouseId: (val: number) => {
    set({ originWarehouseId: val });
  },

  setDestinationWarehouseId: (val: number) => {
    set({ destinationWarehouseId: val });
  },

  setSubmitMutation: (val: boolean) => {
    set({ submitMutation: val });
  },
}));
