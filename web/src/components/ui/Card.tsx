import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: 'primary' | 'accent' | 'none';
}

export default function Card({
  children,
  className = '',
  hover = false,
  gradient = 'none',
}: CardProps) {
  const baseStyles =
    'bg-dark-card rounded-xl shadow-card border border-dark-border overflow-hidden transition-all duration-200';
  
  const hoverStyles = hover
    ? 'hover:shadow-card-elevated hover:-translate-y-1 cursor-pointer hover:border-primary-600/50'
    : '';
  
  const gradientStyles = {
    primary: 'bg-gradient-to-br from-primary-600 to-primary-700 text-text-primary border-primary-600 shadow-primary',
    accent: 'bg-gradient-to-br from-accent-500 to-accent-600 text-text-primary border-accent-500',
    none: '',
  };
  
  const isGradient = gradient !== 'none';
  const finalBaseStyles = isGradient
    ? 'rounded-xl shadow-lg overflow-hidden transition-all duration-200'
    : baseStyles;
  
  return (
    <div className={`${finalBaseStyles} ${hoverStyles} ${gradientStyles[gradient]} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-dark-border ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-dark-border bg-dark-backgroundSecondary ${className}`}>
      {children}
    </div>
  );
}

