import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavedContentType = 'AUDIO' | 'VIDEO' | 'MEME' | 'AI';

export type SavedContent = {
  id: string;
  name: string;
  type: SavedContentType;
  path: string;
  thumbnail?: string;
  effects?: string[];
  dateCreated: number;
  duration?: number;
  size?: number;
};

type SavedContentsStore = {
  contents: SavedContent[];
  isHydrated: boolean;
  addContent: (content: SavedContent) => void;
  removeContent: (id: string) => void;
  clearContents: () => void;
  getContentsByType: (type: SavedContentType) => SavedContent[];
  setHydrated: () => void;
};

export const useSavedContentsStore = create<SavedContentsStore>()(
  persist(
    (set, get) => ({
      contents: [],
      isHydrated: false,

      addContent: (content) => {
        console.log('🎯 Store: aggiungendo contenuto', content.name);
        set((state) => ({
          contents: [content, ...state.contents],
        }));
        console.log('✅ Store: contenuti totali', get().contents.length);
      },

      removeContent: (id) =>
        set((state) => ({
          contents: state.contents.filter((content) => content.id !== id),
        })),

      clearContents: () => set({ contents: [] }),

      getContentsByType: (type) => {
        return get().contents.filter(content => content.type === type);
      },

      setHydrated: () => {
        set({ isHydrated: true });
      }
    }),
    {
      name: 'mocked-saved-contents',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ contents: state.contents }), // Solo contents persistente
      onRehydrateStorage: () => {
        console.log('💧 Hydration started');
        return (state, error) => {
          if (error) {
            console.log('❌ Hydration error:', error);
          } else {
            console.log('✅ Hydration completed. Contents loaded:', state?.contents?.length || 0);
            // Imposta hydrated flag
            useSavedContentsStore.getState().setHydrated();
          }
        };
      },
    }
  )
);
