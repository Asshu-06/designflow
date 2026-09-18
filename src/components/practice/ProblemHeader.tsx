// src/components/practice/ProblemHeader.tsx
import React, { useState } from 'react';
import type { Problem } from '../../types/domain';
import { DifficultyBadge } from '../common/Badge';
import { CheckCircle2, AlertTriangle, Cpu, FileText } from 'lucide-react';

interface ProblemHeaderProps {
  problem: Problem;
  compact?: boolean;
}

export const ProblemHeader: React.FC<ProblemHeaderProps> = ({ problem, compact = false }) => {
  const [activeTab, setActiveTab] = useState<'statement' | 'requirements' | 'constraints' | 'areas'>('statement');

  return (
    <div className={`bg-[#111418] border border-[#262C34] rounded-lg ${compact ? 'p-3.5 space-y-2' : 'p-4 sm:p-5 space-y-3'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#262C34]">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className={`${compact ? 'text-base' : 'text-lg'} font-bold text-[#F3F4F6] tracking-tight`}>{problem.title}</h1>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          <p className="text-[#9CA3AF] text-xs leading-relaxed">{problem.shortDescription}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 border-b border-[#262C34] pb-1 overflow-x-auto text-xs">
        {[
          { key: 'statement', label: 'Problem Brief', icon: FileText },
          { key: 'requirements', label: `Requirements (${problem.functionalRequirements.length})`, icon: CheckCircle2 },
          { key: 'constraints', label: `Constraints (${problem.constraints.length})`, icon: AlertTriangle },
          { key: 'areas', label: 'Design Areas', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer text-[11px] ${
                isActive
                  ? 'bg-[#171B21] text-[#F3F4F6] border border-[#262C34] border-b-[#8B9CF6]'
                  : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#171B21]/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="text-xs text-[#F3F4F6] leading-relaxed">
        {activeTab === 'statement' && (
          <p className="whitespace-pre-line text-[#9CA3AF] font-sans leading-relaxed">{problem.problemStatement}</p>
        )}

        {activeTab === 'requirements' && (
          <ul className="space-y-1.5">
            {problem.functionalRequirements.map((req, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-[#171B21] p-2.5 rounded border border-[#262C34] text-[#F3F4F6]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#35C98B] mt-0.5 flex-shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'constraints' && (
          <ul className="space-y-1.5">
            {problem.constraints.map((c, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-[#E7B65B]/10 p-2.5 rounded border border-[#E7B65B]/20 text-[#E7B65B]">
                <AlertTriangle className="w-3.5 h-3.5 text-[#E7B65B] mt-0.5 flex-shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'areas' && (
          <div className="grid grid-cols-1 gap-2">
            {problem.expectedDesignAreas.map((area, idx) => (
              <div key={idx} className="flex items-center space-x-2 bg-[#171B21] p-2 rounded border border-[#262C34] text-[#8B9CF6] font-mono text-[11px]">
                <Cpu className="w-3.5 h-3.5 flex-shrink-0 text-[#8B9CF6]" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
