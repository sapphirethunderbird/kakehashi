'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Settings2, Save, GripVertical } from 'lucide-react';
import { useCardStore, Card } from '@/lib/store';
import { getIcon, ICON_MAP } from '@/lib/icons';

// --- DND IMPORTS ---
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- SUB-COMPONENT: Sortable Card ---
// This handles the drag logic for each individual button
function SortableCard({ card, isEditMode, speak, removeCard }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: !isEditMode }); // Only drag in Edit Mode!

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto', // Pop to top when dragging
    opacity: isDragging ? 0.8 : 1,
  };

  const Icon = getIcon(card.iconName);

  return (
    <div ref={setNodeRef} style={style} className="relative group touch-none">
       {/* The Card Button */}
      <button
        onClick={() => {
            // Prevent clicking while dragging
            if (!isDragging) speak(card.label);
        }}
        disabled={isEditMode}
        className={`
          w-full aspect-square rounded-3xl border-4 
          flex flex-col items-center justify-center 
          transition-all shadow-sm
          ${card.color}
          ${isEditMode ? 'cursor-grab active:cursor-grabbing' : 'active:scale-95 hover:shadow-md hover:-translate-y-1'}
        `}
        // Attach drag listeners here
        {...attributes} 
        {...listeners} 
      >
        <Icon size={48} className="mb-2 opacity-90" />
        <span className="text-xl font-bold text-center leading-tight px-2 select-none">
          {card.label}
        </span>
        
        {/* Visual Grip Handle (Only visible in Edit Mode) */}
        {isEditMode && (
             <div className="absolute top-2 left-2 text-black/20">
                <GripVertical size={20} />
             </div>
        )}
      </button>

      {/* Delete Button (Only in Edit Mode) */}
      {isEditMode && (
        <button 
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking delete
            onClick={() => removeCard(card.id)}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 active:scale-90 transition animate-in zoom-in z-10"
        >
            <X size={20} />
        </button>
      )}
    </div>
  );
}

// --- MAIN PAGE ---
export default function CardsPage() {
  const { cards, addCard, removeCard, reorderCards } = useCardStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('Smile');
  const [newColor, setNewColor] = useState('bg-slate-100 text-slate-800 border-slate-200');

  useEffect(() => setMounted(true), []);

  // Configure Sensors (How we detect drags)
  const sensors = useSensors(
    useSensor(PointerSensor, {
        // Require moving 8px before a drag starts (prevents accidental drags on touch)
        activationConstraint: { distance: 8 } 
    }), 
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      reorderCards(active.id as string, over?.id as string);
    }
  };

  const speak = (text: string) => {
    if (isEditMode) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleAddCard = () => {
    if (!newLabel) return;
    addCard({
      id: Date.now().toString(),
      label: newLabel,
      iconName: newIcon,
      color: newColor,
    });
    setNewLabel('');
  };

  if (!mounted) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Navbar */}
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

      {/* Main Content */}
      <div className="flex-grow p-4 overflow-y-auto pb-40">
        
        {/* DND Context Wrapper */}
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
        >
            <SortableContext 
                items={cards.map(c => c.id)} 
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cards.map((card) => (
                        <SortableCard 
                            key={card.id} 
                            card={card} 
                            isEditMode={isEditMode} 
                            speak={speak}
                            removeCard={removeCard}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>

        {/* Add New Card Form (Same as before) */}
        {isEditMode && (
            <div className="mt-8 p-6 bg-white rounded-3xl border-4 border-dashed border-slate-300 animate-in slide-in-from-bottom-4">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Plus className="text-slate-400"/> Add New Card
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-1">Label</label>
                        <input 
                            type="text" 
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            placeholder="e.g. iPad"
                            className="w-full p-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
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