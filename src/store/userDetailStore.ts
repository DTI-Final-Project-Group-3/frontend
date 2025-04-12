import { UserDetail } from "@/types/models/userDetail";
import { create } from "zustand";

type UserDetailState = {
  userDetail: UserDetail | null;
  setUserDetail: (userDetail: UserDetail) => void;
};

export const useUserDetailStore = create<UserDetailState>((set) => ({
  userDetail: null,
  setUserDetail: (detail) => set({ userDetail: detail }),
}));
