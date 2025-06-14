import { create } from 'zustand';

type SettingsStore = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  darkMode: false,

  toggleDarkMode: () =>
    set((state) => ({
      darkMode: !state.darkMode,
    })),
}));
