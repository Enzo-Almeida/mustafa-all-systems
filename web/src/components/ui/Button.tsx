import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary:
      'bg-gradient-to-r from-primary-600 to-primary-700 text-text-primary hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-primary hover:shadow-primary-glow glow-primary-hover',
    accent:
      'bg-gradient-to-r from-accent-500 to-accent-600 text-text-primary hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 shadow-lg shadow-accent-500/30',
    outline:
      'border-2 border-primary-600 text-primary-400 hover:bg-primary-600/10 focus:ring-primary-500 hover:glow-primary',
    ghost:
      'text-primary-400 hover:bg-primary-600/10 focus:ring-primary-500',
    danger:
      'bg-error-500 text-text-primary hover:bg-error-600 focus:ring-error-500 shadow-error hover:glow-error',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  );
}

