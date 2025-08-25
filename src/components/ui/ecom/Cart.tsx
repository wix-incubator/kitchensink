import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Cart as CartPrimitive } from '@wix/headless-ecom/react';

export const Cart = CartPrimitive.Root;

// Cart Totals Components
const cartTotalVariants = cva('flex justify-between', {
  variants: {
    variant: {
      default: 'text-lg text-content-primary',
      subtotal: 'text-lg text-content-primary font-semibold',
      discount: 'text-lg text-status-success',
      shipping: 'text-lg text-content-primary',
      tax: 'text-lg text-content-primary',
      total: 'text-xl font-bold text-content-primary',
    },
    size: {
      default: 'text-lg',
      sm: 'text-sm',
      lg: 'text-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface CartTotalProps
  extends React.ComponentPropsWithoutRef<typeof CartPrimitive.Totals.Price>,
    VariantProps<typeof cartTotalVariants> {}

export const CartTotalsPrice = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Totals.Price>,
  CartTotalProps
>(({ variant = 'subtotal', size, className, ...props }, ref) => {
  return (
    <CartPrimitive.Totals.Price
      {...props}
      ref={ref}
      className={cn(cartTotalVariants({ variant, size }), className)}
    >
      {props.children}
    </CartPrimitive.Totals.Price>
  );
});

CartTotalsPrice.displayName = 'CartTotalsPrice';

export interface CartTotalDiscountProps
  extends React.ComponentPropsWithoutRef<typeof CartPrimitive.Totals.Discount>,
    VariantProps<typeof cartTotalVariants> {}

export const CartTotalsDiscount = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Totals.Discount>,
  CartTotalDiscountProps
>(({ variant = 'discount', size, className, ...props }, ref) => {
  return (
    <CartPrimitive.Totals.Discount
      {...props}
      ref={ref}
      className={cn(cartTotalVariants({ variant, size }), className)}
    >
      {props.children}
    </CartPrimitive.Totals.Discount>
  );
});

CartTotalsDiscount.displayName = 'CartTotalsDiscount';

export interface CartTotalShippingProps
  extends React.ComponentPropsWithoutRef<typeof CartPrimitive.Totals.Shipping>,
    VariantProps<typeof cartTotalVariants> {}

export const CartTotalsShipping = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Totals.Shipping>,
  CartTotalShippingProps
>(({ variant = 'shipping', size, className, ...props }, ref) => {
  return (
    <CartPrimitive.Totals.Shipping
      {...props}
      ref={ref}
      className={cn(cartTotalVariants({ variant, size }), className)}
    >
      {props.children}
    </CartPrimitive.Totals.Shipping>
  );
});

CartTotalsShipping.displayName = 'CartTotalsShipping';

export interface CartTotalTaxProps
  extends React.ComponentPropsWithoutRef<typeof CartPrimitive.Totals.Tax>,
    VariantProps<typeof cartTotalVariants> {}

export const CartTotalsTax = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Totals.Tax>,
  CartTotalTaxProps
>(({ variant = 'tax', size, className, ...props }, ref) => {
  return (
    <CartPrimitive.Totals.Tax
      {...props}
      ref={ref}
      className={cn(cartTotalVariants({ variant, size }), className)}
    >
      {props.children}
    </CartPrimitive.Totals.Tax>
  );
});

CartTotalsTax.displayName = 'CartTotalsTax';

export interface CartTotalTotalProps
  extends React.ComponentPropsWithoutRef<typeof CartPrimitive.Totals.Total>,
    VariantProps<typeof cartTotalVariants> {}

export const CartTotalsTotal = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Totals.Total>,
  CartTotalTotalProps
>(({ variant = 'total', size, className, ...props }, ref) => {
  return (
    <CartPrimitive.Totals.Total
      {...props}
      ref={ref}
      className={cn(cartTotalVariants({ variant, size }), className)}
    >
      {props.children}
    </CartPrimitive.Totals.Total>
  );
});

CartTotalsTotal.displayName = 'CartTotalsTotal';

// Cart Summary Component
export const CartSummary = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Summary>,
  React.ComponentPropsWithoutRef<typeof CartPrimitive.Summary>
>((props, ref) => {
  return (
    <CartPrimitive.Summary
      {...props}
      ref={ref}
      className={cn('text-content-secondary', props.className)}
    >
      {props.children}
    </CartPrimitive.Summary>
  );
});

CartSummary.displayName = 'CartSummary';

// Cart LineItems Component
export const CartLineItems = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.LineItems>,
  React.ComponentPropsWithoutRef<typeof CartPrimitive.LineItems>
>((props, ref) => {
  return (
    <CartPrimitive.LineItems {...props} ref={ref}>
      {props.children}
    </CartPrimitive.LineItems>
  );
});

CartLineItems.displayName = 'CartLineItems';

// Cart LineItem Repeater Component
export const CartLineItemRepeater = CartPrimitive.LineItemRepeater;
CartLineItemRepeater.displayName = 'CartLineItemRepeater';

// Cart Clear Component
export const CartClear = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Clear>,
  React.ComponentPropsWithoutRef<typeof CartPrimitive.Clear>
>((props, ref) => {
  return (
    <CartPrimitive.Clear
      {...props}
      ref={ref}
      className={cn(
        'text-status-error hover:text-status-error/80 text-sm font-medium transition-colors duration-200 disabled:opacity-50',
        props.className
      )}
    >
      {props.children}
    </CartPrimitive.Clear>
  );
});

CartClear.displayName = 'CartClear';

// Cart Notes Component
export const CartNotes = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Notes>,
  React.ComponentPropsWithoutRef<typeof CartPrimitive.Notes>
>((props, ref) => {
  return (
    <CartPrimitive.Notes
      {...props}
      ref={ref}
      className={cn(
        '[&_textarea]:focus:border-surface-interactive [&_textarea]:focus:ring-0 [&_textarea]:focus:outline-none',
        props.className
      )}
    >
      {props.children}
    </CartPrimitive.Notes>
  );
});

CartNotes.displayName = 'CartNotes';

// Cart Coupon Components
export const CartCoupon = CartPrimitive.Coupon.Root;
CartCoupon.displayName = 'CartCoupon';

export const CartCouponInput = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Coupon.Input>,
  React.ComponentPropsWithoutRef<typeof CartPrimitive.Coupon.Input>
>((props, ref) => {
  return (
    <CartPrimitive.Coupon.Input
      {...props}
      ref={ref}
      className={cn(
        'w-full px-3 py-2 bg-surface-interactive border border-surface-interactive rounded-lg text-content-primary placeholder:text-content-muted focus:border-surface-interactive focus:ring-0 focus:outline-none transition-colors duration-200',
        props.className
      )}
    >
      {props.children}
    </CartPrimitive.Coupon.Input>
  );
});

CartCouponInput.displayName = 'CartCouponInput';

export const CartCouponTrigger = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Coupon.Trigger>,
  React.ComponentPropsWithoutRef<typeof CartPrimitive.Coupon.Trigger>
>((props, ref) => {
  return (
    <CartPrimitive.Coupon.Trigger
      {...props}
      ref={ref}
      className={cn(
        'w-full text-content-primary font-medium py-2 px-6 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-center text-sm btn-primary',
        props.className
      )}
    >
      {props.children}
    </CartPrimitive.Coupon.Trigger>
  );
});

CartCouponTrigger.displayName = 'CartCouponTrigger';

export const CartCouponClear = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Coupon.Clear>,
  React.ComponentPropsWithoutRef<typeof CartPrimitive.Coupon.Clear>
>((props, ref) => {
  return (
    <CartPrimitive.Coupon.Clear
      {...props}
      ref={ref}
      className={cn(
        'text-status-error hover:text-status-error/80 text-sm',
        props.className
      )}
    >
      {props.children}
    </CartPrimitive.Coupon.Clear>
  );
});

CartCouponClear.displayName = 'CartCouponClear';

export const CartCouponRaw = CartPrimitive.Coupon.Raw;
CartCouponRaw.displayName = 'CartCouponRaw';

// Cart Errors Component
export const CartErrors = React.forwardRef<
  React.ElementRef<typeof CartPrimitive.Errors>,
  React.ComponentPropsWithoutRef<typeof CartPrimitive.Errors>
>((props, ref) => {
  return (
    <CartPrimitive.Errors
      {...props}
      ref={ref}
      className={cn(
        'w-full bg-surface-error border border-status-error rounded-lg p-3 text-status-error text-xs',
        props.className
      )}
    >
      {props.children}
    </CartPrimitive.Errors>
  );
});

CartErrors.displayName = 'CartErrors';
