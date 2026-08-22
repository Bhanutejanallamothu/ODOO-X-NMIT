import React from 'react';

const Badge = ({
  children,
  type = 'default', // default, success, info, warning, danger
  size = 'md', // sm, md
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-md uppercase tracking-wider';
  
  const types = {
    default: 'bg-paper-raised text-paper-muted border border-paper-border shadow-sm',
    success: 'bg-[#E6F4EA] text-[#16805C] border border-[#CEEAD6]',
    info: 'bg-[#E8F0FE] text-[#1967D2] border border-[#D2E3FC]',
    warning: 'bg-[#FEF7E0] text-[#B7791F] border border-[#FEEFC3]',
    danger: 'bg-[#FCE8E8] text-[#D6455D] border border-[#FAD2D2]',
    brand: 'bg-brand-50 text-brand-700 border border-brand-100',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[9px]',
    md: 'px-2 py-0.5 text-[10px]',
  };

  return (
    <span className={`${baseStyles} ${types[type]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
