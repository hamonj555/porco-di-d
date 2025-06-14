import { create } from 'zustand';

export type FavoriteItemType = 'AUDIO' | 'VIDEO' | 'MEME' | 'AI';

export type FavoriteItem = {
  id: string;
  type: FavoriteItemType;
  name: string;
  thumbnail?: string;
  effectsApplied?: string[];
  createdAt: number;
};

type FavoritesStore = {
  items: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  getFavoritesByType: (type: FavoriteItemType) => FavoriteItem[];
};

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  items: [],

  addFavorite: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeFavorite: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearFavorites: () => set({ items: [] }),
  
  getFavoritesByType: (type) => {
    return get().items.filter(item => item.type === type);
  }
}));
