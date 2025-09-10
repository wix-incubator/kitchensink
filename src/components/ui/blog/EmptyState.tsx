import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const emptyStateVariants = cva(
  'bg-surface-card border border-surface-subtle rounded-xl shadow-sm text-center px-6 py-12',
  {
    variants: {
      size: {
        sm: 'py-8',
        md: 'py-12',
        lg: 'py-16',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { className, size, title, subtitle, icon, showIcon = true, ...props },
    ref
  ) => {
    const defaultIcon = (
      <div className="w-24 h-24 text-content-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-12 h-12 "
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
    );

    return (
      <div
        className={cn(emptyStateVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        {showIcon && (icon || defaultIcon)}

        <h3 className="text-2xl font-semibold text-content-primary mb-4">
          {title}
        </h3>

        {subtitle && <p className="text-content-muted">{subtitle}</p>}
      </div>
    );
  }
);

export { EmptyState, emptyStateVariants };
