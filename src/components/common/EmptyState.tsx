// src/components/common/EmptyState.tsx
import React from 'react';
import { type LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-lg border border-[#262C34] bg-[#111418] ${className}`}>
      <div className="p-3 rounded-md bg-[#171B21] border border-[#262C34] text-[#8B9CF6] mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-[#F3F4F6] mb-1">{title}</h3>
      <p className="text-xs text-[#9CA3AF] max-w-sm mb-4 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
