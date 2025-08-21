import React from 'react';
import { cn } from '@/lib/utils';
import { ProductList as ProductListPrimitive } from '@wix/headless-stores/react';

// Root wrapper for the ProductList
export const ProductList = ProductListPrimitive.Root;

// Products wrapper component
export const Products = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6',
      className
    )}
    {...props}
  />
));
Products.displayName = 'Products';

export const ProductRepeater = ProductListPrimitive.ProductRepeater;

export const LoadMoreTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <ProductListPrimitive.LoadMoreTrigger
    {...props}
    ref={ref}
    className={cn('font-semibold transform hover:scale-105', className)}
    asChild
  >
    {props.children}
  </ProductListPrimitive.LoadMoreTrigger>
));

LoadMoreTrigger.displayName = 'LoadMoreTrigger';

export const TotalsDisplayed = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ProductListPrimitive.TotalsDisplayed ref={ref} asChild {...props}>
    {({ displayedProducts }) => (
      <p className={cn('text-content-muted text-sm mt-4', className)}>
        {displayedProducts} products loaded
      </p>
    )}
  </ProductListPrimitive.TotalsDisplayed>
));

TotalsDisplayed.displayName = 'TotalsDisplayed';
