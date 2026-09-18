// src/components/layout/Footer.tsx
import React from 'react';
import { Layers, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm gap-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-300">DesignLoop</span>
          <span>&mdash; CipherSchools Hiring Assignment MVP</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gemini AI Structured Evaluation</span>
          </span>
          <span className="flex items-center space-x-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase Edge Functions</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
