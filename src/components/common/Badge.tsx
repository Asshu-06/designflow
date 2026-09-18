// src/components/common/Badge.tsx
import React from 'react';
import type { DifficultyLevel, AttemptStatus } from '../../types/domain';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className = '' }) => {
  const styles = {
    Easy: 'bg-[#35C98B]/10 text-[#35C98B] border-[#35C98B]/30',
    Medium: 'bg-[#E7B65B]/10 text-[#E7B65B] border-[#E7B65B]/30',
    Hard: 'bg-[#F07070]/10 text-[#F07070] border-[#F07070]/30',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium font-mono border ${styles[difficulty]} ${className}`}>
      {difficulty}
    </span>
  );
};

interface StatusBadgeProps {
  status: AttemptStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config: Record<AttemptStatus, { label: string; style: string }> = {
    DRAFT: { label: 'Draft', style: 'bg-[#171B21] text-[#9CA3AF] border-[#262C34]' },
    SUBMITTED: { label: 'Submitted', style: 'bg-[#8B9CF6]/10 text-[#8B9CF6] border-[#8B9CF6]/30' },
    EVALUATING: { label: 'Evaluating...', style: 'bg-[#E7B65B]/10 text-[#E7B65B] border-[#E7B65B]/30 animate-pulse' },
    COMPLETED: { label: 'Completed', style: 'bg-[#35C98B]/10 text-[#35C98B] border-[#35C98B]/30' },
    FAILED: { label: 'Failed', style: 'bg-[#F07070]/10 text-[#F07070] border-[#F07070]/30' },
  };

  const item = config[status] || { label: status, style: 'bg-[#171B21] text-[#9CA3AF] border-[#262C34]' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${item.style} ${className}`}>
      {item.label}
    </span>
  );
};
