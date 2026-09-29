import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'surface' | 'glass' | 'interactive';
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#11141D] border border-white/[0.07]',
    surface: 'bg-[#0D0F16] border border-white/[0.05]',
    glass: 'bg-[#11141D]/90 backdrop-blur-sm border border-white/[0.08]',
    interactive: 'bg-[#11141D] border border-white/[0.07] hover:border-white/20 transition-colors cursor-pointer',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-5',
    lg: 'p-7',
  };

  const hoverClass = hoverEffect && variant !== 'interactive'
    ? 'hover:border-white/20 transition-colors'
    : '';

  return (
    <div
      className={`rounded-xl relative overflow-hidden ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
