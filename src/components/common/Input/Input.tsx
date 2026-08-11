import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    // Generate a unique ID if one isn't provided but we have a label
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
      <div className={clsx("flex flex-col gap-1 w-full", className)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-main">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && <span className="absolute left-3 text-text-muted pointer-events-none">{leftIcon}</span>}
          
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              "w-full px-3 py-2 text-sm border rounded-md bg-white text-text-main transition-colors outline-none placeholder:text-text-muted disabled:bg-background disabled:text-text-muted disabled:cursor-not-allowed",
              error 
                ? "border-error focus:border-error focus:ring-2 focus:ring-error/20" 
                : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
              leftIcon ? "pl-9" : "",
              rightIcon ? "pr-9" : ""
            )}
            {...props}
          />
          
          {rightIcon && <span className="absolute right-3 text-text-muted">{rightIcon}</span>}
        </div>

        {error && <span className="text-xs text-error">{error}</span>}
        {!error && helpText && <span className="text-xs text-text-muted">{helpText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
