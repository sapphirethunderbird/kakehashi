// src/lib/icons.tsx
import { 
  GlassWater, Utensils, Moon, ShieldAlert, Smile, Frown, Hand, 
  ThumbsUp, ThumbsDown, Laptop, Gamepad2, Sun, Heart, Star, 
  LucideIcon 
} from 'lucide-react';

// A registry of all icons the user can choose from
export const ICON_MAP: Record<string, LucideIcon> = {
  GlassWater, Utensils, Moon, ShieldAlert, Smile, Frown, Hand,
  ThumbsUp, ThumbsDown, Laptop, Gamepad2, Sun, Heart, Star
};

// Helper to get the component safely
export const getIcon = (name: string) => {
  return ICON_MAP[name] || Smile; // Default to Smile if not found
};