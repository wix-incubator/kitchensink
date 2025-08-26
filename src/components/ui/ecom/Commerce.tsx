import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Commerce as CommercePrimitive } from '@wix/headless-ecom/react';

export const Commerce = CommercePrimitive;

// Commerce Actions Checkout Component
const commerceCheckoutVariants = cva(
  'font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'btn-primary text-content-primary',
        primary: 'btn-primary text-content-primary',
        secondary:
          'bg-surface-secondary text-content-primary hover:bg-surface-secondary/90',
      },
      size: {
        default: 'py-4 px-6 rounded-xl',
        sm: 'py-2 px-4 rounded-lg text-sm',
        lg: 'py-4 px-6 rounded-xl text-lg',
        xl: 'py-6 px-8 rounded-2xl text-xl',
      },
      width: {
        default: '',
        full: 'w-full',
      },
      animation: {
        default: '',
        scale: 'transform hover:scale-105',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      width: 'full',
      animation: 'scale',
    },
  }
);

export interface CommerceCheckoutProps
  extends React.ComponentPropsWithoutRef<
      typeof CommercePrimitive.Actions.Checkout
    >,
    VariantProps<typeof commerceCheckoutVariants> {}

export const CommerceActionsCheckout = React.forwardRef<
  React.ElementRef<typeof CommercePrimitive.Actions.Checkout>,
  CommerceCheckoutProps
>(({ variant, size, width, animation, className, ...props }, ref) => {
  return (
    <CommercePrimitive.Actions.Checkout
      {...props}
      ref={ref}
      className={cn(
        commerceCheckoutVariants({ variant, size, width, animation }),
        className
      )}
    >
      {props.children}
    </CommercePrimitive.Actions.Checkout>
  );
});

CommerceActionsCheckout.displayName = 'CommerceActionsCheckout';

// Commerce Actions namespace for better organization
export const CommerceActions = {
  Checkout: CommerceActionsCheckout,
};
