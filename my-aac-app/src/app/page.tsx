import Link from "next/link";
import { PenTool, LayoutGrid } from "lucide-react"; // Icons we installed

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-8 bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-800">Communication Board</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        {/* Button to go to Drawing Mode */}
        <Link 
          href="/draw" 
          className="flex flex-col items-center justify-center h-48 bg-white border-4 border-blue-200 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all active:scale-95"
        >
          <PenTool size={48} className="text-blue-500 mb-4" />
          <span className="text-2xl font-bold text-slate-700">Draw</span>
        </Link>

        {/* Button to go to Cards Mode */}
        <Link 
          href="/cards" 
          className="flex flex-col items-center justify-center h-48 bg-white border-4 border-emerald-200 rounded-2xl shadow-sm hover:border-emerald-400 hover:shadow-md transition-all active:scale-95"
        >
          <LayoutGrid size={48} className="text-emerald-500 mb-4" />
          <span className="text-2xl font-bold text-slate-700">Cards</span>
        </Link>
      </div>
    </main>
  );
}