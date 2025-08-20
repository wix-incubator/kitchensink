import React from 'react';
import { cn } from '@/lib/utils';
import { Product as ProductPrimitive } from '@wix/headless-stores/react';

export const Product = ProductPrimitive.Root;

export const ProductName = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Name>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Name>
>((props, ref) => {
  return (
    <ProductPrimitive.Name
      {...props}
      ref={ref}
      className={cn(
        'text-4xl font-bold text-content-primary mb-4 font-theme-heading',
        props.className
      )}
    >
      {props.children}
    </ProductPrimitive.Name>
  );
});

ProductName.displayName = 'ProductName';
