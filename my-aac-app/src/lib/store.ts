// src/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Define what a Card looks like
export type Card = {
  id: string;
  label: string;
  iconName: string; // We save the name (e.g., 'smile'), not the component code
  color: string;
};

// 2. The default cards (if the user hasn't customized anything yet)
const DEFAULT_CARDS: Card[] = [
  { id: 'water', label: 'Water', iconName: 'GlassWater', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'food', label: 'Hungry', iconName: 'Utensils', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'rest', label: 'Tired', iconName: 'Moon', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'help', label: 'Help', iconName: 'ShieldAlert', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'yes', label: 'Yes', iconName: 'ThumbsUp', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'no', label: 'No', iconName: 'ThumbsDown', color: 'bg-rose-100 text-rose-800 border-rose-200' },
];

interface CardState {
  cards: Card[];
  addCard: (card: Card) => void;
  removeCard: (id: string) => void;
  resetCards: () => void;
}

// 3. Create the store with "persist" (Auto-saves to localStorage)
export const useCardStore = create<CardState>()(
  persist(
    (set) => ({
      cards: DEFAULT_CARDS,
      addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
      removeCard: (id) => set((state) => ({ cards: state.cards.filter((c) => c.id !== id) })),
      resetCards: () => set({ cards: DEFAULT_CARDS }),
    }),
    {
      name: 'aac-cards-storage', // unique name for localStorage
    }
  )
);