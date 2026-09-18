// src/components/feedback/RubricCard.tsx
import React, { useState } from 'react';
import type { FeedbackItem } from '../../types/domain';
import { ChevronDown, ChevronUp, Terminal, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RubricCardProps {
  item: FeedbackItem;
}

export const RubricCard: React.FC<RubricCardProps> = ({ item }) => {
  const [showEvidence, setShowEvidence] = useState(true);

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'bg-[#35C98B]/10 text-[#35C98B] border-[#35C98B]/30';
    if (score === 3) return 'bg-[#E7B65B]/10 text-[#E7B65B] border-[#E7B65B]/30';
    return 'bg-[#F07070]/10 text-[#F07070] border-[#F07070]/30';
  };

  return (
    <div className="bg-[#111418] border border-[#262C34] rounded-lg p-4 space-y-3">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262C34] pb-3">
        <div className="flex items-center space-x-2.5">
          <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getScoreColor(item.score)}`}>
            {item.score} / 5
          </span>
          <h3 className="font-semibold text-[#F3F4F6] text-sm">{item.criterionName}</h3>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#9CA3AF]">
          <span className="flex items-center space-x-1 bg-[#171B21] px-2 py-0.5 rounded border border-[#262C34]">
            <ShieldCheck className="w-3 h-3 text-[#8B9CF6]" />
            <span>{(item.confidence * 100).toFixed(0)}% Confidence</span>
          </span>
        </div>
      </div>

      {/* Collapsible Evidence Section */}
      <div className="bg-[#0B0D0F] border border-[#262C34] rounded">
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-mono text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 text-[#8B9CF6]" />
            <span>Submission Evidence Snippet</span>
          </div>
          {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showEvidence && (
          <div className="px-3 pb-3 pt-1 border-t border-[#262C34]">
            <p className="text-[11px] text-[#F3F4F6] font-mono leading-relaxed bg-[#111418] p-2.5 rounded border border-[#262C34]">
              "{item.evidence}"
            </p>
          </div>
        )}
      </div>

      {/* Concern & Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Identified Concern */}
        <div className="bg-[#F07070]/5 border border-[#F07070]/20 rounded-md p-3 space-y-1">
          <div className="flex items-center space-x-1.5 text-[#F07070] font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Identified Concern / Risk</span>
          </div>
          <p className="text-[#9CA3AF] text-xs leading-relaxed">{item.concern}</p>
        </div>

        {/* Actionable Improvement */}
        <div className="bg-[#35C98B]/5 border border-[#35C98B]/20 rounded-md p-3 space-y-1">
          <div className="flex items-center space-x-1.5 text-[#35C98B] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Suggested Improvement</span>
          </div>
          <p className="text-[#9CA3AF] text-xs leading-relaxed">{item.suggestion}</p>
        </div>
      </div>
    </div>
  );
};
