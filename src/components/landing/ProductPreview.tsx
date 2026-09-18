// src/components/landing/ProductPreview.tsx
import React from 'react';
import { Terminal, ShieldCheck, CheckCircle2, Code2, Cpu } from 'lucide-react';

export const ProductPreview: React.FC = () => {
  return (
    <div className="bg-[#111418] border border-[#262C34] rounded-lg overflow-hidden shadow-2xl font-mono text-xs select-none">
      {/* Product Window Header */}
      <div className="h-8 bg-[#171B21] border-b border-[#262C34] px-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F07070]/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#E7B65B]/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#35C98B]/80"></span>
          </div>
          <span className="text-[11px] text-[#667085] ml-2">lld-lab // workspace // parking-lot.spec</span>
        </div>

        <div className="flex items-center space-x-2 text-[10px] text-[#A3B0FF]">
          <span className="flex items-center space-x-1 bg-[#0B0D0F] px-2 py-0.5 rounded border border-[#262C34]">
            <Terminal className="w-3 h-3" />
            <span>Structured Spec</span>
          </span>
        </div>
      </div>

      {/* Product Preview Body */}
      <div className="p-4 space-y-3 bg-[#0B0D0F]">
        {/* Active Spec Bar */}
        <div className="flex items-center justify-between bg-[#111418] border border-[#262C34] p-2.5 rounded-md">
          <div className="flex items-center space-x-2 font-sans">
            <span className="text-xs font-bold text-[#F3F4F6]">Multi-Level Parking Lot System</span>
            <span className="text-[10px] font-mono bg-[#E7B65B]/10 text-[#E7B65B] px-1.5 py-0.5 rounded border border-[#E7B65B]/30">
              Medium
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#35C98B] flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Draft Saved</span>
          </span>
        </div>

        {/* Dual Column Snippet Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          {/* Class Abstraction Snippet */}
          <div className="bg-[#111418] border border-[#262C34] rounded-md p-3 space-y-2">
            <div className="text-[#A3B0FF] font-semibold text-[11px] flex items-center justify-between border-b border-[#262C34] pb-1.5">
              <span className="flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Interfaces &amp; Abstractions</span>
              </span>
              <span className="text-[9px] text-[#667085]">TypeScript</span>
            </div>
            <pre className="text-[#F3F4F6] text-[10.5px] leading-relaxed overflow-x-auto">
{`interface IPricingStrategy {
  calculateFee(t: Ticket): number;
}

class HourlyPricing implements IPricingStrategy {
  calculateFee(t: Ticket): number {
    return t.durationHours * 5.00;
  }
}`}
            </pre>
          </div>

          {/* Design Review Summary Snippet */}
          <div className="bg-[#111418] border border-[#262C34] rounded-md p-3 space-y-2">
            <div className="text-[#35C98B] font-semibold text-[11px] flex items-center justify-between border-b border-[#262C34] pb-1.5">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Design Review Output</span>
              </span>
              <span className="text-[10px] font-bold text-[#35C98B]">88 / 100</span>
            </div>

            <div className="space-y-1.5 text-[10.5px]">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">SRP Cohesion</span>
                <span className="text-[#35C98B]">5 / 5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Strategy Swapping</span>
                <span className="text-[#35C98B]">5 / 5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Concurrency Lock</span>
                <span className="text-[#E7B65B]">4 / 5</span>
              </div>
              <div className="mt-2 pt-1 border-t border-[#262C34] text-[10px] text-[#A3B0FF] italic">
                "High SRP cohesion. Spot allocation is cleanly decoupled from pricing."
              </div>
            </div>
          </div>
        </div>

        {/* Structured Spec Inputs Mock Bar */}
        <div className="bg-[#111418] border border-[#262C34] p-2.5 rounded-md flex items-center justify-between text-[10px] font-mono text-[#667085]">
          <span className="flex items-center space-x-1 text-[#9CA3AF]">
            <Cpu className="w-3 h-3 text-[#A3B0FF]" />
            <span>7 Architecture Spec Sections Completed</span>
          </span>
          <span>1,240 chars written</span>
        </div>
      </div>
    </div>
  );
};
