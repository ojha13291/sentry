import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("sentry-theme") || "synthwave",
  setTheme: (theme) => {
    localStorage.setItem("sentry-theme", theme);
    set({ theme });
  },
}));