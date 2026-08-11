import React from 'react';
import { clsx } from 'clsx';
import Spinner from '../Spinner/Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 outline-none border border-transparent cursor-pointer gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed";

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm h-8",
  md: "px-4 py-2 text-sm h-10",
  lg: "px-6 py-3 text-base h-12",
};

const variantStyles = {
  primary: "bg-primary text-white shadow-sm hover:bg-blue-700",
  secondary: "bg-white text-text-main border-border shadow-sm hover:bg-background",
  ghost: "bg-transparent text-text-main hover:bg-border",
  danger: "bg-error text-white hover:bg-red-700",
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Spinner size="sm" variant={variant === 'primary' || variant === 'danger' ? 'white' : 'primary'} />
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;
