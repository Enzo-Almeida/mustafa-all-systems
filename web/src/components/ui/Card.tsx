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
    'bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-200';
  
  const hoverStyles = hover
    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
    : '';
  
  const gradientStyles = {
    primary: 'bg-gradient-to-br from-violet-600 to-violet-700 text-white border-0',
    accent: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0',
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
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
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
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}

