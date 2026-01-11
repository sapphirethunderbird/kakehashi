import { 
  // Base icons
  GlassWater, Utensils, Moon, ShieldAlert, Smile, Frown, Hand, 
  ThumbsUp, ThumbsDown, Laptop, Gamepad2, Sun, Heart, Star, 
  
  // NEW ICONS START HERE
  Home, Car, Bus, Plane, 
  Apple, Pizza, IceCream, Cake, 
  Tv, Music, Book, Tablet, Bike, Palette, 
  Cat, Dog, Fish,
  Bath, Shirt, Bed, 
  Phone, Users, 
  LucideIcon 
} from 'lucide-react';

// A registry of all icons the user can choose from
export const ICON_MAP: Record<string, LucideIcon> = {
  // Existing
  GlassWater, Utensils, Moon, ShieldAlert, Smile, Frown, Hand,
  ThumbsUp, ThumbsDown, Laptop, Gamepad2, Sun, Heart, Star,

  // New Additions
  Home, Car, Bus, Plane,
  Apple, Pizza, IceCream, Cake,
  Tv, Music, Book, Tablet, Bike, Palette,
  Cat, Dog, Fish,
  Bath, Shirt, Bed,
  Phone, Users,
};

// Helper to get the component safely
export const getIcon = (name: string) => {
  return ICON_MAP[name] || Smile; 
};