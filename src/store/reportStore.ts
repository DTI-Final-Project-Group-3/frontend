import { create } from "zustand";
import { DateRange } from "react-day-picker";
import { ProductMutationConstant } from "@/constant/productMutationConstant";

type ReportStoreProps = {
  productId?: number;
  productCategoryId?: number;
  dateRange: DateRange;
  productMutationTypeId?: number;
  productMutationStatusId?: number;

  setProductId: (val: number | undefined) => void;
  setProductCategoryId: (val: number | undefined) => void;
  setDateRange: (val: DateRange | undefined) => void;
  setProductMutationTypeId: (val: number | undefined) => void;
  setProductMutationStatusId: (val: number | undefined) => void;
};

export const useReport = create<ReportStoreProps>((set) => ({
  productId: undefined,
  productCategoryId: undefined,
  dateRange: {
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  },
  productMutationTypeId: undefined,
  productMutationStatusId: ProductMutationConstant.STATUS_COMPLETED,

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
}));
