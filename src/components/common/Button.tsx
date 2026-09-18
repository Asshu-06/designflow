// src/components/common/Button.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-1 focus:ring-[#8B9CF6] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none text-xs';

  const variantStyles = {
    primary:
      'bg-[#8B9CF6] hover:bg-[#7A8BEA] text-[#0B0D0F] font-semibold border border-[#8B9CF6]/80 shadow-xs',
    secondary:
      'bg-[#171B21] hover:bg-[#20252D] text-[#F3F4F6] border border-[#262C34]',
    outline:
      'bg-[#111418] hover:bg-[#171B21] text-[#9CA3AF] hover:text-[#F3F4F6] border border-[#262C34]',
    ghost:
      'bg-transparent hover:bg-[#171B21] text-[#9CA3AF] hover:text-[#F3F4F6]',
    danger:
      'bg-[#F07070]/10 hover:bg-[#F07070]/20 text-[#F07070] border border-[#F07070]/30',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
    md: 'text-xs px-3.5 py-2 gap-2 h-9',
    lg: 'text-sm px-4 py-2.5 gap-2 h-10 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
