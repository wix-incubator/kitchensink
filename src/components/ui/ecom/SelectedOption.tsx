import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SelectedOption as SelectedOptionPrimitive } from '@wix/headless-ecom/react';

export const SelectedOption = SelectedOptionPrimitive;

// SelectedOption Text Component
const selectedOptionTextVariants = cva('text-content-secondary', {
  variants: {
    size: {
      default: 'text-sm',
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface SelectedOptionTextProps
  extends React.ComponentPropsWithoutRef<typeof SelectedOptionPrimitive.Text>,
    VariantProps<typeof selectedOptionTextVariants> {}

export const SelectedOptionText = React.forwardRef<
  React.ElementRef<typeof SelectedOptionPrimitive.Text>,
  SelectedOptionTextProps
>(({ size, className, ...props }, ref) => {
  return (
    <SelectedOptionPrimitive.Text
      {...props}
      ref={ref}
      className={cn(selectedOptionTextVariants({ size }), className)}
    >
      {props.children}
    </SelectedOptionPrimitive.Text>
  );
});

SelectedOptionText.displayName = 'SelectedOptionText';

// SelectedOption Color Component
const selectedOptionColorVariants = cva(
  'flex items-center text-content-secondary',
  {
    variants: {
      size: {
        default: 'gap-2 text-sm',
        xs: 'gap-1 text-xs',
        sm: 'gap-2 text-sm',
        base: 'gap-2 text-base',
        lg: 'gap-3 text-lg',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface SelectedOptionColorProps
  extends React.ComponentPropsWithoutRef<typeof SelectedOptionPrimitive.Color>,
    VariantProps<typeof selectedOptionColorVariants> {}

export const SelectedOptionColor = React.forwardRef<
  React.ElementRef<typeof SelectedOptionPrimitive.Color>,
  SelectedOptionColorProps
>(({ size, className, ...props }, ref) => {
  return (
    <SelectedOptionPrimitive.Color
      {...props}
      ref={ref}
      className={cn(selectedOptionColorVariants({ size }), className)}
    >
      {props.children}
    </SelectedOptionPrimitive.Color>
  );
});

SelectedOptionColor.displayName = 'SelectedOptionColor';
