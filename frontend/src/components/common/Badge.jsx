import React from 'react';

const Badge = ({
  children,
  type = 'default', // default, success, info, warning, danger
  size = 'md', // sm, md
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full uppercase tracking-wider';
  
  const types = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    info: 'bg-blue-50 text-blue-700 border border-blue-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border border-rose-100',
    brand: 'bg-brand-50 text-brand-700 border border-brand-100',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
  };

  return (
    <span className={`${baseStyles} ${types[type]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
