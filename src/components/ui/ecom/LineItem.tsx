import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LineItem as LineItemPrimitive } from '@wix/headless-ecom/react';

export const LineItem = LineItemPrimitive;

// LineItem Image Component
const lineItemImageVariants = cva('rounded-lg object-cover', {
  variants: {
    size: {
      default: 'w-16 h-16',
      sm: 'w-12 h-12',
      lg: 'w-24 h-24',
      xl: 'w-32 h-32',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface LineItemImageProps
  extends React.ComponentPropsWithoutRef<typeof LineItemPrimitive.Image>,
    VariantProps<typeof lineItemImageVariants> {}

export const LineItemImage = React.forwardRef<
  React.ElementRef<typeof LineItemPrimitive.Image>,
  LineItemImageProps
>(({ size, className, ...props }, ref) => {
  return (
    <LineItemPrimitive.Image
      {...props}
      ref={ref}
      className={cn(lineItemImageVariants({ size }), className)}
    />
  );
});

LineItemImage.displayName = 'LineItemImage';

// LineItem Title Component
const lineItemTitleVariants = cva('font-semibold text-content-primary', {
  variants: {
    size: {
      default: 'text-lg',
      sm: 'text-base',
      lg: 'text-xl',
      xl: 'text-2xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface LineItemTitleProps
  extends React.ComponentPropsWithoutRef<typeof LineItemPrimitive.Title>,
    VariantProps<typeof lineItemTitleVariants> {}

export const LineItemTitle = React.forwardRef<
  React.ElementRef<typeof LineItemPrimitive.Title>,
  LineItemTitleProps
>(({ size, className, ...props }, ref) => {
  return (
    <LineItemPrimitive.Title
      {...props}
      ref={ref}
      className={cn(lineItemTitleVariants({ size }), className)}
    >
      {props.children}
    </LineItemPrimitive.Title>
  );
});

LineItemTitle.displayName = 'LineItemTitle';

// LineItem SelectedOptions Component
export const LineItemSelectedOptions = React.forwardRef<
  React.ElementRef<typeof LineItemPrimitive.SelectedOptions>,
  React.ComponentPropsWithoutRef<typeof LineItemPrimitive.SelectedOptions>
>((props, ref) => {
  return (
    <LineItemPrimitive.SelectedOptions {...props} ref={ref}>
      {props.children}
    </LineItemPrimitive.SelectedOptions>
  );
});

LineItemSelectedOptions.displayName = 'LineItemSelectedOptions';

// LineItem SelectedOption Repeater Component
export const LineItemSelectedOptionRepeater =
  LineItemPrimitive.SelectedOptionRepeater;
LineItemSelectedOptionRepeater.displayName = 'LineItemSelectedOptionRepeater';

// LineItem Quantity Component
export const LineItemQuantity = React.forwardRef<
  React.ElementRef<typeof LineItemPrimitive.Quantity>,
  React.ComponentPropsWithoutRef<typeof LineItemPrimitive.Quantity>
>((props, ref) => {
  return (
    <LineItemPrimitive.Quantity {...props} ref={ref}>
      {props.children}
    </LineItemPrimitive.Quantity>
  );
});

LineItemQuantity.displayName = 'LineItemQuantity';
