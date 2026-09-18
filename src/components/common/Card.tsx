// src/components/common/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div
      className={`bg-[#111418] border border-[#262C34] rounded-lg p-5 ${
        hoverEffect ? 'hover:border-[#38404B] transition-colors duration-150' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
