import { create } from "zustand";

type LocationState = {
  location: { latitude: number; longitude: number } | null;
  setLocation: (
    location: { latitude: number; longitude: number } | null
  ) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  setLocation: (location) => set({ location }),
}));
