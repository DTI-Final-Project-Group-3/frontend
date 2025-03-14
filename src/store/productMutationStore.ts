import { create } from "zustand";

type ProductMutationState = {
  warehouseInventoryId: number | undefined;
  productId: number | undefined;
  originWarehouseId: number | undefined;
  destinationWarehouseId: number | undefined;
  submitMutation: boolean;

  originWarehouseQuantity: number | undefined;

  productMutationPage: number;
  setProductMutationPage: (val: number) => void;

  setWarehouseInventoryId: (val: number | undefined) => void;
  setProductId: (val: number | undefined) => void;
  setOriginWarehouseId: (val: number | undefined) => void;
  setDestinationWarehouseId: (val: number | undefined) => void;
  setSubmitMutation: (val: boolean) => void;

  setOriginWarehouseQuantity: (val: number | undefined) => void;
};
export const useProductMutation = create<ProductMutationState>((set) => ({
  warehouseInventoryId: undefined,
  productId: undefined,
  originWarehouseId: undefined,
  destinationWarehouseId: undefined,
  submitMutation: false,

  originWarehouseQuantity: undefined,

  productMutationPage: 0,

  setProductMutationPage: (val: number) => {
    set({ productMutationPage: val });
  },

  setWarehouseInventoryId: (val: number | undefined) => {
    set({ warehouseInventoryId: val });
  },

  setProductId: (val: number | undefined) => {
    set({ productId: val });
  },

  setOriginWarehouseId: (val: number | undefined) => {
    set({ originWarehouseId: val });
  },

  setDestinationWarehouseId: (val: number | undefined) => {
    set({ destinationWarehouseId: val });
  },

  setSubmitMutation: (val: boolean) => {
    set({ submitMutation: val });
  },

  setOriginWarehouseQuantity: (val: number | undefined) => {
    set({ originWarehouseQuantity: val });
  },
}));
