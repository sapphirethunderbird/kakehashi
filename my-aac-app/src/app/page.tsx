import Link from "next/link";
import { PenTool, LayoutGrid, Info } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-6 bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Communication Board</h1>
      
      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        
        {/* Draw Button */}
        <Link 
          href="/draw" 
          className="flex flex-col items-center justify-center h-48 bg-white border-4 border-blue-200 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all active:scale-95"
        >
          <PenTool size={48} className="text-blue-500 mb-4" />
          <span className="text-2xl font-bold text-slate-700">Draw</span>
        </Link>

        {/* Cards Button */}
        <Link 
          href="/cards" 
          className="flex flex-col items-center justify-center h-48 bg-white border-4 border-emerald-200 rounded-2xl shadow-sm hover:border-emerald-400 hover:shadow-md transition-all active:scale-95"
        >
          <LayoutGrid size={48} className="text-emerald-500 mb-4" />
          <span className="text-2xl font-bold text-slate-700">Cards</span>
        </Link>

        {/* NEW: Info / Emergency Button (Spans full width on mobile) */}
        <Link 
          href="/info" 
          className="md:col-span-2 flex items-center justify-center gap-4 h-24 bg-amber-50 border-4 border-amber-200 rounded-2xl shadow-sm hover:border-amber-400 hover:shadow-md transition-all active:scale-95"
        >
          <Info size={32} className="text-amber-600" />
          <span className="text-xl font-bold text-slate-700">Who am I?</span>
        </Link>

      </div>
    </main>
  );
}