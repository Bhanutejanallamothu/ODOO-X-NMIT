import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  bodyClassName = 'p-5 lg:p-6',
  headerClassName = 'px-5 lg:px-6 py-4 border-b-2 border-border',
}) => {
  return (
    <div className={cn("bg-paper-surface rounded-base border-2 border-border shadow-shadow overflow-hidden transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px]", className)}>
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
