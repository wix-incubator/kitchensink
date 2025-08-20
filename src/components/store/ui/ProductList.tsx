import React from 'react';
import { cn } from '@/lib/utils';
import { ProductList as HeadlessProductList } from '@wix/headless-stores/react';

// Root wrapper for the ProductList
export const ProductList = HeadlessProductList.Root;

// Products wrapper component
export const ProductListProducts = React.forwardRef<
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
ProductListProducts.displayName = 'ProductListProducts';
