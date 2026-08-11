import React from 'react';
import { clsx } from 'clsx';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white';
}

const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-[3px]',
  lg: 'w-8 h-8 border-4',
};

const variantStyles = {
  primary: 'border-t-primary border-r-primary',
  white: 'border-t-white border-r-white',
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', variant = 'primary', className, ...props }) => {
  return (
    <div
      className={clsx(
        "inline-block rounded-full border-transparent animate-spin",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};

export default Spinner;
