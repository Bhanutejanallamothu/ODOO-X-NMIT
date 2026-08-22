import React from 'react';
import { buttonVariants } from '../ui/button';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({
  children,
  variant = 'primary', // mapping legacy variants to new ones
  size = 'md',
  type = 'button',
  icon: Icon,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}, ref) => {
  // Map legacy variants to brutalist variants
  let brutalistVariant = 'default';
  if (variant === 'secondary' || variant === 'outline') brutalistVariant = 'neutral';
  
  // Custom text colors for danger/success
  const extraClasses = variant === 'danger' ? 'text-rose-600' : (variant === 'success' ? 'text-emerald-600' : '');

  // Map sizes
  let brutalistSize = 'default';
  if (size === 'sm') brutalistSize = 'sm';
  if (size === 'lg') brutalistSize = 'lg';

  return (
    <button
      type={type}
      ref={ref}
      className={cn(buttonVariants({ variant: brutalistVariant, size: brutalistSize }), extraClasses, className)}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
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
});

Button.displayName = 'Button';
export default Button;
