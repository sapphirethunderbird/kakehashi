'use client';

import { useRef, useState, useEffect } from 'react';
import { ReactSketchCanvasRef, CanvasPath } from 'react-sketch-canvas'; 
import dynamic from 'next/dynamic'; 
import { Eraser, Undo, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { saveDrawing, getSavedDrawing } from '@/lib/storage';

// Fix 1: Dynamic Import (You already have this)
const ReactSketchCanvas = dynamic(
  () => import('react-sketch-canvas').then((mod) => mod.ReactSketchCanvas),
  { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse" /> 
  }
);

export default function DrawingBoard() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  
  const [penColor, setPenColor] = useState("black");
  const [isEraser, setIsEraser] = useState(false);
  
  const [dataLoaded, setDataLoaded] = useState(false); 
  const [initialPaths, setInitialPaths] = useState<CanvasPath[]>([]);

  // 1. Fetch data from DB
  useEffect(() => {
    getSavedDrawing().then((savedPaths) => {
      if (savedPaths && savedPaths.length > 0) {
        setInitialPaths(savedPaths);
        console.log("Found saved drawing:", savedPaths.length, "paths");
      }
      setDataLoaded(true);
    });
  }, []);

  // 2. Fix 2: The "Retry" Loader
  useEffect(() => {
    if (!dataLoaded) return;

    // We set up a small timer to check for the canvas repeatedly
    const intervalId = setInterval(() => {
      if (canvasRef.current) {
        // FOUND IT!
        console.log("Canvas is ready. Loading paths...");
        
        // Only load if we actually have paths
        if (initialPaths.length > 0) {
             canvasRef.current.loadPaths(initialPaths);
        }
        
        // Stop checking
        clearInterval(intervalId);
      }
    }, 100); // Check every 100ms

    // Safety: Stop checking after 3 seconds so we don't run forever
    const timeoutId = setTimeout(() => clearInterval(intervalId), 3000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [dataLoaded, initialPaths]);

  // 3. Save Function (With Safety Guard)
  const handleStroke = async () => {
    // Don't save if we are still initializing!
    if (!dataLoaded || !canvasRef.current) return;

    try {
      const paths = await canvasRef.current.exportPaths();
      saveDrawing(paths);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    saveDrawing([]); 
    setInitialPaths([]); // Clear our local state too
  };

  // --- UI Helpers ---
  const colors = [
    { name: 'Black', value: 'black' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Indigo', value: '#6366f1' }
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
                onClick={handleClear} 
                className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-xl font-bold active:scale-95 transition"
            >
                <Trash2 size={24} />
                <span className="hidden sm:inline">Clear</span>
            </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-grow relative touch-none"> 
         {dataLoaded && (
            <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={5}
                strokeColor={penColor}
                eraserWidth={30}
                canvasColor="white"
                style={{ border: 'none' }}
                onChange={handleStroke} 
            />
         )}
      </div>
      {/* Bottom Bar: Tools & Colors */}
      <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] safe-area-bottom">
        
        {/* We use 'max-w-full' to ensure it never exceeds the screen width */}
        <div className="flex items-center justify-between max-w-lg mx-auto w-full gap-4">
            
            {/* COLOR SCROLLER: 
                1. flex-1: Take up all available space
                2. overflow-x-auto: Scroll sideways if needed
                3. no-scrollbar: Hide the ugly grey bar (see CSS below)
            */}
            <div className="flex-1 overflow-x-auto no-scrollbar">
                <div className="flex gap-3 px-1 py-1 min-w-max"> 
                    {colors.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => handleColorClick(c.value)}
                            className={`w-12 h-12 rounded-full border-4 transition-transform active:scale-90 flex-shrink-0 ${
                                !isEraser && penColor === c.value 
                                ? 'border-slate-800 scale-110 shadow-md' 
                                : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c.value }}
                            aria-label={`Select ${c.name}`}
                        />
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-slate-300 flex-shrink-0"></div>

            {/* Eraser (Fixed position on the right) */}
            <button
                onClick={isEraser ? handlePenClick : handleEraserClick}
                className={`p-3 rounded-xl transition-all active:scale-95 flex-shrink-0 ${
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