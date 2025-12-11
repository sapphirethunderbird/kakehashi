'use client';

import { ArrowLeft, GlassWater, Utensils, Moon, ShieldAlert, Frown, Smile, Hand } from 'lucide-react';
import Link from 'next/link';

// 1. Define our "Deck" of cards
// We keep the data separate so it's easy to add new ones later
const CARDS = [
  { id: 'water', label: 'Water', icon: GlassWater, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'food', label: 'Hungry', icon: Utensils, color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'rest', label: 'Tired', icon: Moon, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'help', label: 'Help', icon: ShieldAlert, color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'happy', label: 'Happy', icon: Smile, color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 'stop', label: 'Stop', icon: Hand, color: 'bg-red-50 text-red-900 border-red-300' },
  { id: 'yes', label: 'Yes', icon: Smile, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }, 
];

export default function CardsPage() {
  
  // 2. The Speak Function
  const speak = (text: string) => {
    // Cancel any current speech so they don't overlap
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // You can adjust rate/pitch here if needed
    utterance.rate = 0.9; 
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Navbar */}
      <div className="p-4 bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10 flex items-center">
        <Link href="/" className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 active:scale-95 transition">
          <ArrowLeft size={28} className="text-slate-700" />
        </Link>
        <h1 className="ml-4 text-xl font-bold text-slate-800">Quick Cards</h1>
      </div>

      {/* Grid */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 h-full content-start pb-20">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => speak(card.label)}
                className={`
                  ${card.color} 
                  flex flex-col items-center justify-center 
                  aspect-square rounded-3xl border-4 
                  shadow-sm active:scale-95 transition-all
                  hover:shadow-md
                `}
              >
                <Icon size={64} className="mb-2 opacity-90" />
                <span className="text-2xl font-bold">{card.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}