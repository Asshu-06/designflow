// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label = 'Loading...', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-2">
      <Loader2 className={`${sizeMap[size]} text-[#8B9CF6] animate-spin`} />
      {label && <p className="text-xs font-mono text-[#9CA3AF]">{label}</p>}
    </div>
  );
};
