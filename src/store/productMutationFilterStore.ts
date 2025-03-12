import { create } from "zustand";
import { DateRange } from "react-day-picker";
import { ProductMutationConstant } from "@/constant/productMutationConstant";

type ReportStoreProps = {
  productId?: number;
  productCategoryId?: number;
  dateRange: DateRange;
  productMutationTypeId?: number;
  productMutationStatusId?: number;
  isRequest: boolean;

  setProductId: (val: number | undefined) => void;
  setProductCategoryId: (val: number | undefined) => void;
  setDateRange: (val: DateRange | undefined) => void;
  setProductMutationTypeId: (val: number | undefined) => void;
  setProductMutationStatusId: (val: number | undefined) => void;
  setIsRequest: (val: boolean | undefined) => void;
};

export const useProductMutationFilter = create<ReportStoreProps>((set) => ({
  productId: undefined,
  productCategoryId: undefined,
  dateRange: {
    from: undefined,
    to: undefined,
  },
  productMutationTypeId: undefined,
  productMutationStatusId: ProductMutationConstant.STATUS_PENDING,
  isRequest: true,

  setProductId: (val) => set({ productId: val }),

  setProductCategoryId: (val) => set({ productCategoryId: val }),

  setDateRange: (val) =>
    set({
      dateRange: val || { from: undefined, to: undefined },
    }),

  setProductMutationStatusId: (val) => {
    set({ productMutationStatusId: val });
  },
  setProductMutationTypeId: (val) => {
    set({ productMutationTypeId: val });
  },
  setIsRequest: (val) => {
    set({ isRequest: val });
  },
}));
