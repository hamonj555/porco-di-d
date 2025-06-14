import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Definizione dei tipi per lo store
type UserSettings = {
  nickname: string;
  avatar: string | null;
  theme: 'LIGHT' | 'DARK';
  notificationsEnabled: boolean;
  soundEffectsEnabled: boolean;
};

type UserStoreState = {
  settings: UserSettings;
  setNickname: (nickname: string) => void;
  setAvatar: (avatarUri: string) => void;
  setTheme: (theme: 'LIGHT' | 'DARK') => void;
  toggleNotifications: () => void;
  toggleSoundEffects: () => void;
  resetSettings: () => void;
  initialized: boolean;
  initialize: () => Promise<void>;
};

// Default settings
const defaultSettings: UserSettings = {
  nickname: 'User',
  avatar: null,
  theme: 'DARK',
  notificationsEnabled: true,
  soundEffectsEnabled: true,
};

// Key per salvare i dati in AsyncStorage
const STORAGE_KEY = 'mocked_user_settings';

// Creazione dello store
export const useUserStore = create<UserStoreState>((set, get) => ({
  settings: { ...defaultSettings },
  initialized: false,

  // Inizializza lo store caricando i dati da AsyncStorage
  initialize: async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedSettings) {
        set({
          settings: JSON.parse(storedSettings),
          initialized: true,
        });
      } else {
        set({
          settings: { ...defaultSettings },
          initialized: true,
        });
      }
    } catch (error) {
      console.error('Errore nel caricamento delle impostazioni:', error);
      set({
        settings: { ...defaultSettings },
        initialized: true,
      });
    }
  },

  // Imposta il nickname
  setNickname: (nickname: string) => {
    const newSettings = {
      ...get().settings,
      nickname,
    };
    set({ settings: newSettings });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings)).catch(err => 
      console.error('Errore nel salvataggio del nickname:', err)
    );
  },

  // Imposta l'avatar
  setAvatar: (avatarUri: string) => {
    const newSettings = {
      ...get().settings,
      avatar: avatarUri,
    };
    set({ settings: newSettings });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings)).catch(err => 
      console.error('Errore nel salvataggio dell\'avatar:', err)
    );
  },

  // Imposta il tema
  setTheme: (theme: 'LIGHT' | 'DARK') => {
    const newSettings = {
      ...get().settings,
      theme,
    };
    set({ settings: newSettings });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings)).catch(err => 
      console.error('Errore nel salvataggio del tema:', err)
    );
  },

  // Toggle notifiche
  toggleNotifications: () => {
    const newSettings = {
      ...get().settings,
      notificationsEnabled: !get().settings.notificationsEnabled,
    };
    set({ settings: newSettings });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings)).catch(err => 
      console.error('Errore nel salvataggio delle notifiche:', err)
    );
  },

  // Toggle effetti sonori
  toggleSoundEffects: () => {
    const newSettings = {
      ...get().settings,
      soundEffectsEnabled: !get().settings.soundEffectsEnabled,
    };
    set({ settings: newSettings });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings)).catch(err => 
      console.error('Errore nel salvataggio degli effetti sonori:', err)
    );
  },

  // Reset impostazioni
  resetSettings: () => {
    set({ settings: { ...defaultSettings } });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings)).catch(err => 
      console.error('Errore nel reset delle impostazioni:', err)
    );
  },
}));

// Inizializza lo store automaticamente
if (typeof window !== 'undefined' || Platform.OS !== 'web') {
  useUserStore.getState().initialize();
}
