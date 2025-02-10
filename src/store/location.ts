import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocationState = {
  location: { latitude: number; longitude: number } | null;
  setLocation: (
    location: { latitude: number; longitude: number } | null
  ) => void;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (location) => set({ location }),
    }),
    { name: "location" }
  )
);
