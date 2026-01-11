'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Settings2, Save } from 'lucide-react';
import { useCardStore, Card } from '@/lib/store';
import { getIcon, ICON_MAP } from '@/lib/icons';

export default function CardsPage() {
  const { cards, addCard, removeCard } = useCardStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [mounted, setMounted] = useState(false); // To prevent hydration mismatch

  // Form State for new card
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('Smile');
  const [newColor, setNewColor] = useState('bg-slate-100 text-slate-800 border-slate-200');

  // Prevent hydration errors
  useEffect(() => setMounted(true), []);

  const speak = (text: string) => {
    if (isEditMode) return; // Don't speak while editing
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleAddCard = () => {
    if (!newLabel) return;
    addCard({
      id: Date.now().toString(), // Simple unique ID
      label: newLabel,
      iconName: newIcon,
      color: newColor,
    });
    setNewLabel(''); // Reset form
  };

  if (!mounted) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Navbar with Edit Toggle */}
      <div className={`p-4 shadow-sm border-b sticky top-0 z-10 flex items-center justify-between transition-colors ${isEditMode ? 'bg-amber-100 border-amber-200' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-white/50 rounded-xl hover:bg-white active:scale-95 transition">
                <ArrowLeft size={28} className="text-slate-700" />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">
                {isEditMode ? 'Editing Mode' : 'Quick Cards'}
            </h1>
        </div>
        
        <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`p-3 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 ${
                isEditMode 
                ? 'bg-amber-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600'
            }`}
        >
            {isEditMode ? <Save size={24} /> : <Settings2 size={24} />}
            <span className="hidden sm:inline">{isEditMode ? 'Done' : 'Edit'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-grow p-4 overflow-y-auto pb-40">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* Render Existing Cards */}
          {cards.map((card) => {
            const Icon = getIcon(card.iconName);
            return (
              <div key={card.id} className="relative group">
                <button
                    onClick={() => speak(card.label)}
                    disabled={isEditMode}
                    className={`
                      w-full aspect-square rounded-3xl border-4 
                      flex flex-col items-center justify-center 
                      transition-all shadow-sm
                      ${card.color}
                      ${isEditMode ? 'opacity-80 scale-95 cursor-default' : 'active:scale-95 hover:shadow-md hover:-translate-y-1'}
                    `}
                >
                    <Icon size={48} className="mb-2 opacity-90" />
                    <span className="text-xl font-bold text-center leading-tight px-2">{card.label}</span>
                </button>

                {/* Delete Button (Only in Edit Mode) */}
                {isEditMode && (
                    <button 
                        onClick={() => removeCard(card.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 active:scale-90 transition animate-in zoom-in"
                    >
                        <X size={20} />
                    </button>
                )}
              </div>
            );
          })}
        </div>

        {/* "Add New Card" Section (Only in Edit Mode) */}
        {isEditMode && (
            <div className="mt-8 p-6 bg-white rounded-3xl border-4 border-dashed border-slate-300 animate-in slide-in-from-bottom-4">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Plus className="text-slate-400"/> Add New Card
                </h3>
                
                <div className="space-y-4">
                    {/* 1. Label Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-1">Label</label>
                        <input 
                            type="text" 
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            placeholder="e.g. iPad"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 2. Color Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-1">Color</label>
                        <div className="flex gap-2 overflow-x-auto py-2">
                            {[
                                'bg-blue-100 text-blue-800 border-blue-200',
                                'bg-red-100 text-red-800 border-red-200',
                                'bg-green-100 text-green-800 border-green-200',
                                'bg-yellow-100 text-yellow-800 border-yellow-200',
                                'bg-purple-100 text-purple-800 border-purple-200',
                            ].map(colorClass => (
                                <button
                                    key={colorClass}
                                    onClick={() => setNewColor(colorClass)}
                                    className={`w-10 h-10 rounded-full border-2 ${colorClass} ${newColor === colorClass ? 'ring-2 ring-slate-800 ring-offset-2' : ''}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 3. Icon Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-1">Icon</label>
                        <div className="grid grid-cols-6 gap-2 bg-slate-50 p-3 rounded-xl h-32 overflow-y-auto border border-slate-200">
                            {Object.keys(ICON_MAP).map((iconName) => {
                                const IconComp = ICON_MAP[iconName];
                                return (
                                    <button
                                        key={iconName}
                                        onClick={() => setNewIcon(iconName)}
                                        className={`p-2 rounded-lg flex items-center justify-center transition-all ${newIcon === iconName ? 'bg-white shadow-sm ring-2 ring-blue-500' : 'hover:bg-slate-200'}`}
                                    >
                                        <IconComp size={24} className="text-slate-600" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <button 
                        onClick={handleAddCard}
                        disabled={!newLabel}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition"
                    >
                        Add Card
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}