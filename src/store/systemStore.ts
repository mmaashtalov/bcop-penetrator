import { create } from "zustand";
export const useSystem = create<{
  online: boolean;
  lastUpdate: string;
  setOnline: (o: boolean) => void;
  ping: () => void;
}>((set) => ({
  online: window.navigator.onLine,
  lastUpdate: new Date().toLocaleTimeString(),
  setOnline: (o) => set({ online: o }),
  ping: () =>
    set({ lastUpdate: new Date().toLocaleTimeString(), online: window.navigator.onLine }),
})); 