import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  rightElement,
  className = '',
  disabled,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-slate-400 pointer-events-none shrink-0 flex items-center">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full bg-[#0D0F14] text-slate-100 placeholder-slate-500 text-sm rounded-xl border border-white/10 px-3.5 py-2.5 transition-all duration-200 outline-none
            focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 focus:bg-[#11131A]
            hover:border-white/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${rightElement ? 'pr-10' : ''}
            ${error ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20' : ''}
            ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 text-slate-400 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
