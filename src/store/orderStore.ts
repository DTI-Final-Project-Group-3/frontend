import { create } from "zustand";
import { persist } from "zustand/middleware";

type OrderState = {
  page: number;
  limit: number;
  statusId?: number;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  warehouseId?: number;
  setFilters: (filters: Partial<OrderState>) => void;
  resetFilters: () => void;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      page: 0, // Default
      limit: 10, // Default
      statusId: 0,

      setFilters: (filters) => set((state) => ({ ...state, ...filters })),

      resetFilters: () =>
        set({
          page: 0,
          limit: 10,
          statusId: 0,
          search: "",
          startDate: undefined,
          endDate: undefined,
          warehouseId: undefined,
        }),
    }),
    { name: "order-list-filters" }
  )
);
