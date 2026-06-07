import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

/**
 * Componente Button reutilizable
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, children, className, disabled, ...props }, ref) => {
    const baseClasses = 'font-semibold rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-brand-primary text-white hover:bg-brand-secondary',
      secondary: 'bg-brand-secondary text-white hover:bg-brand-primary',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
    };

    const sizeClasses = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
        {...props}
      >
        {isLoading ? '⏳ Cargando...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Componente Input reutilizable
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 border border-gray-300 rounded
            focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className || ''}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Componente Card para contenedor estándar
 */
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className || ''}`}>
      {children}
    </div>
  );
};
