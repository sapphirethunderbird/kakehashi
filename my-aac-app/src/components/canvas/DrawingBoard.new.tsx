'use client';

import { useRef, useState, useEffect } from 'react'; // Added useEffect
import { ReactSketchCanvas, ReactSketchCanvasRef, CanvasPath } from 'react-sketch-canvas'; // Added CanvasPath
import { Eraser, Undo, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { saveDrawing, getSavedDrawing } from '@/lib/storage'; // Import our new utility

export default function DrawingBoard() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [penColor, setPenColor] = useState("black");
  const [isEraser, setIsEraser] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // New state to prevent flickering

  // 1. LOAD: When the component mounts, load the drawing
  useEffect(() => {
    getSavedDrawing().then((savedPaths) => {
      if (savedPaths && canvasRef.current) {
        // We need a small timeout to ensure the canvas is ready
        setTimeout(() => {
          canvasRef.current?.loadPaths(savedPaths);
        }, 100);
      }
      setIsLoaded(true);
    });
  }, []);

  // 2. SAVE: Triggered automatically whenever the user draws a line
  const handleStroke = (paths: CanvasPath[]) => {
    saveDrawing(paths);
  };

  // Helper to handle clearing (we must also clear the database!)
  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    saveDrawing([]); // Save empty array to DB
  };

  const colors = [
    { name: 'Black', value: 'black' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Green', value: '#16a34a' }
  ];

  const handleColorClick = (color: string) => {
    setIsEraser(false);
    setPenColor(color);
  };

  const handleEraserClick = () => {
    setIsEraser(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setIsEraser(false);
    canvasRef.current?.eraseMode(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50"> 
      
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-slate-200">
        <Link href="/" className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 active:scale-95 transition">
          <ArrowLeft size={28} className="text-slate-700" />
        </Link>
        
        <div className="flex gap-3">
            <button 
                onClick={() => canvasRef.current?.undo()}
                className="flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold active:scale-95 transition"
            >
                <Undo size={24} />
                <span className="hidden sm:inline">Undo</span>
            </button>
            <button 
                onClick={handleClear} // UPDATED: Use our custom clear function
                className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-xl font-bold active:scale-95 transition"
            >
                <Trash2 size={24} />
                <span className="hidden sm:inline">Clear</span>
            </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-grow relative touch-none"> 
         {/* Only show canvas once we have checked for saved data to prevent "pop-in" */}
         {isLoaded && (
            <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={5}
                strokeColor={penColor}
                eraserWidth={30}
                canvasColor="white"
                style={{ border: 'none' }}
                onChange={handleStroke} // UPDATED: This triggers the save!
            />
         )}
      </div>

      {/* Bottom Bar: Tools & Colors */}
      <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center max-w-lg mx-auto">
            
            <div className="flex gap-4">
                {colors.map((c) => (
                    <button
                        key={c.value}
                        onClick={() => handleColorClick(c.value)}
                        className={`w-12 h-12 rounded-full border-4 transition-transform active:scale-90 ${
                            !isEraser && penColor === c.value 
                            ? 'border-slate-800 scale-110 shadow-md' 
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.value }}
                        aria-label={`Select ${c.name}`}
                    />
                ))}
            </div>

            <div className="h-10 w-px bg-slate-300 mx-2"></div>

            <button
                onClick={isEraser ? handlePenClick : handleEraserClick}
                className={`p-3 rounded-xl transition-all active:scale-95 ${
                    isEraser 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-500'
                }`}
            >
                <Eraser size={28} />
            </button>
        </div>
      </div>
    </div>
  );
}