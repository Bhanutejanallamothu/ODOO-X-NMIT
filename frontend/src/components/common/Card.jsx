import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  bodyClassName = 'p-5 lg:p-6',
  headerClassName = 'px-5 lg:px-6 py-4 border-b border-white/40',
}) => {
  return (
    <div className={`bg-paper-surface rounded-[10px] border border-paper-border shadow-paper overflow-hidden ${className}`}>
      {(title || subtitle || actions) && (
        <div className={`flex items-center justify-between flex-wrap gap-4 ${headerClassName}`}>
          <div>
            {title && <h3 className="text-[16px] font-bold text-paper-text tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-paper-muted mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
};

export default Card;
