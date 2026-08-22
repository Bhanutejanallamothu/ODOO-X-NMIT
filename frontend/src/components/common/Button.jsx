import React from 'react';

const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, danger, success
  size = 'md', // sm, md, lg
  type = 'button',
  icon: Icon,
  disabled = false,
  loading = false,
  onClick,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 outline-none focus:outline-none';
  
  const variants = {
    primary: 'bg-paper-surface border border-brand-300 text-brand-600 shadow-paper hover:bg-brand-50 hover:text-brand-700 active:shadow-paper-inset active:bg-brand-100',
    secondary: 'bg-paper-surface border border-paper-border text-paper-text shadow-paper hover:bg-paper-raised active:shadow-paper-inset',
    outline: 'bg-transparent border border-paper-border text-paper-text hover:bg-paper-surface',
    danger: 'bg-paper-surface border border-rose-200 text-rose-600 shadow-paper hover:bg-rose-50 hover:text-rose-700 active:shadow-paper-inset active:bg-rose-100',
    success: 'bg-paper-surface border border-emerald-200 text-emerald-600 shadow-paper hover:bg-emerald-50 hover:text-emerald-700 active:shadow-paper-inset active:bg-emerald-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-[13px]',
    lg: 'px-5 py-2.5 text-[14px]',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && <Icon className="mr-2 h-4 w-4 shrink-0" />}
      {children}
    </button>
  );
};

export default Button;
