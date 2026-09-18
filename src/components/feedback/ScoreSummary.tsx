// src/components/feedback/ScoreSummary.tsx
import React from 'react';
import type { Evaluation } from '../../types/domain';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface ScoreSummaryProps {
  evaluation: Evaluation;
  attemptNumber: number;
  problemTitle: string;
}

export const ScoreSummary: React.FC<ScoreSummaryProps> = ({ evaluation, attemptNumber, problemTitle }) => {
  const score = evaluation.overallScore;

  const getScoreStyle = (val: number) => {
    if (val >= 80) return 'text-[#35C98B] border-[#35C98B]/30 bg-[#35C98B]/10';
    if (val >= 60) return 'text-[#E7B65B] border-[#E7B65B]/30 bg-[#E7B65B]/10';
    return 'text-[#F07070] border-[#F07070]/30 bg-[#F07070]/10';
  };

  return (
    <div className="bg-[#111418] border border-[#262C34] rounded-lg p-5 mb-6 space-y-5">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 border-b border-[#262C34]">
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8B9CF6]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Design Review Executive Summary &bull; Attempt #{attemptNumber}</span>
          </div>
          <h1 className="text-xl font-bold text-[#F3F4F6] tracking-tight">{problemTitle}</h1>
          <p className="text-[#9CA3AF] text-xs leading-relaxed max-w-3xl pt-1">{evaluation.overallSummary}</p>
        </div>

        <div className={`flex flex-col items-center justify-center p-4 rounded-lg border font-mono min-w-[140px] text-center ${getScoreStyle(score)}`}>
          <span className="text-[10px] uppercase font-semibold tracking-wider opacity-80 mb-0.5">Design Score</span>
          <span className="text-3xl font-extrabold tracking-tight">{score}</span>
          <span className="text-[10px] opacity-60">/ 100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Strengths */}
        <div className="bg-[#35C98B]/5 border border-[#35C98B]/20 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center space-x-2 text-[#35C98B] font-semibold text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Architectural Strengths</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#9CA3AF]">
            {evaluation.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-[#35C98B] font-bold">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Improvements */}
        <div className="bg-[#E7B65B]/5 border border-[#E7B65B]/20 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center space-x-2 text-[#E7B65B] font-semibold text-xs font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Priority Areas for Improvement</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#9CA3AF]">
            {evaluation.priorityImprovements.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-[#E7B65B] font-bold">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
