import Link from "next/link";
import { ArrowLeft, Phone, User } from "lucide-react";

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-amber-50 p-6 flex flex-col items-center justify-center text-center">
      
      {/* Back Button (Top Left) */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="p-4 bg-white rounded-full shadow-md block">
            <ArrowLeft size={32} className="text-slate-800" />
        </Link>
      </div>

      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Icon / Image */}
        <div className="mx-auto w-32 h-32 bg-amber-200 rounded-full flex items-center justify-center mb-4">
            <User size={64} className="text-amber-800" />
        </div>

        {/* The Core Message */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-4 border-amber-200 space-y-4">
            <h1 className="text-3xl font-extrabold text-slate-900">Hello!</h1>
            <p className="text-xl leading-relaxed text-slate-700 font-medium">
                I use this device to communicate. 
            </p>
            <p className="text-xl leading-relaxed text-slate-700 font-medium">
                Please be patient while I type or draw my thoughts.
            </p>
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
                <Phone size={32} className="text-green-700" />
            </div>
            <div className="text-left">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">In case of emergency</p>
                <p className="text-2xl font-bold text-slate-900">000-000-0000</p>
                <p className="text-sm text-slate-400">Mom / Carer</p>
            </div>
        </div>

      </div>
    </div>
  );
}