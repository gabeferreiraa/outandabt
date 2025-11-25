// hooks/useActivitySheet.ts
import { Activity } from "@/lib/supabase";
import { create } from "zustand";

interface ActivitySheetStore {
  activity: Activity | null;
  isOpen: boolean;
  open: (activity: Activity) => void;
  close: () => void;
}

export const useActivitySheet = create<ActivitySheetStore>((set) => ({
  activity: null,
  isOpen: false,
  open: (activity) => set({ activity, isOpen: true }),
  close: () => set({ activity: null, isOpen: false }),
}));
