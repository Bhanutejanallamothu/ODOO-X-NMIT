import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col space-y-1 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-[12px] font-semibold text-paper-text tracking-tight">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-3.5 py-2.5 rounded-[6px] text-[13px] text-paper-text bg-[#E7EAF1] shadow-paper-inset transition-all duration-200 border disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-brand-400 focus:border-brand-400 ${
          error
            ? 'border-rose-300 focus:ring-rose-400 focus:border-rose-400'
            : 'border-transparent'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      {!error && helperText && <span className="text-[11px] text-paper-muted">{helperText}</span>}
    </div>
  );
};

export default Input;
