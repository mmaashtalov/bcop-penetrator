import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'icon';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "primary", size, ...rest }) => (
  <button
    {...rest}
    className={clsx(
      "px-4 py-2 rounded font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition",
      variant === "primary" && "bg-primary text-white hover:bg-primary-dark",
      variant === "ghost" && "bg-transparent text-primary hover:bg-primary/10",
      variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
      variant === "outline" && "border border-primary text-primary bg-white hover:bg-primary/10",
      size === "sm" && "px-2 py-1 text-sm",
      size === "icon" && "p-2 w-9 h-9 flex items-center justify-center",
      rest.className
    )}
  >
    {children}
  </button>
);