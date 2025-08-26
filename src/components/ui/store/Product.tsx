import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Product as ProductPrimitive } from '@wix/headless-stores/react';
import { Button } from '../button';

export const Product = ProductPrimitive.Root;

const productNameVariants = cva('font-theme-heading', {
  variants: {
    variant: {
      heading: 'text-4xl font-bold text-content-primary mb-4',
      paragraph: '',
    },
  },
  defaultVariants: {
    variant: 'heading',
  },
});

export interface ProductNameProps
  extends React.ComponentPropsWithoutRef<typeof ProductPrimitive.Name>,
    VariantProps<typeof productNameVariants> {}

export const ProductName = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Name>,
  ProductNameProps
>(({ variant, className, ...props }, ref) => {
  return (
    <ProductPrimitive.Name
      {...props}
      ref={ref}
      className={cn(productNameVariants({ variant }), className)}
    >
      {props.children}
    </ProductPrimitive.Name>
  );
});

ProductName.displayName = 'ProductName';

export const ProductDescription = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Description>
>((props, ref) => {
  return (
    <ProductPrimitive.Description
      {...props}
      ref={ref}
      className={cn('text-content-secondary leading-relaxed', props.className)}
    >
      {props.children}
    </ProductPrimitive.Description>
  );
});

ProductDescription.displayName = 'ProductDescription';

export const ProductPrice = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Price>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Price>
>((props, ref) => {
  return (
    <ProductPrimitive.Price
      {...props}
      ref={ref}
      className={cn(
        'text-3xl font-bold text-content-primary font-theme-heading',
        props.className
      )}
    >
      {props.children}
    </ProductPrimitive.Price>
  );
});

ProductPrice.displayName = 'ProductPrice';

export const ProductCompareAtPrice = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.CompareAtPrice>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.CompareAtPrice>
>((props, ref) => {
  return (
    <ProductPrimitive.CompareAtPrice
      {...props}
      ref={ref}
      className={cn(
        'text-lg font-medium text-content-faded line-through',
        props.className
      )}
    >
      {props.children}
    </ProductPrimitive.CompareAtPrice>
  );
});

ProductCompareAtPrice.displayName = 'ProductCompareAtPrice';

export const ProductSlug = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Slug>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Slug>
>((props, ref) => {
  return (
    <ProductPrimitive.Slug
      {...props}
      ref={ref}
      className={cn('text-content-secondary text-sm', props.className)}
    >
      {props.children}
    </ProductPrimitive.Slug>
  );
});

ProductSlug.displayName = 'ProductSlug';

export const ProductRaw = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Raw>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Raw>
>((props, ref) => {
  return (
    <ProductPrimitive.Raw
      {...props}
      ref={ref}
      className={cn('block', props.className)}
    >
      {props.children}
    </ProductPrimitive.Raw>
  );
});

ProductRaw.displayName = 'ProductRaw';

export const ProductMediaGallery = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.ProductMediaGallery>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.ProductMediaGallery>
>((props, ref) => {
  return (
    <ProductPrimitive.ProductMediaGallery {...props} ref={ref}>
      {props.children}
    </ProductPrimitive.ProductMediaGallery>
  );
});

ProductMediaGallery.displayName = 'ProductMediaGallery';

export const ProductVariants = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Variants>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Variants>
>((props, ref) => {
  return (
    <ProductPrimitive.Variants
      {...props}
      ref={ref}
      className={cn('space-y-4', props.className)}
    >
      {props.children}
    </ProductPrimitive.Variants>
  );
});

ProductVariants.displayName = 'ProductVariants';

export const ProductModifiers = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Modifiers>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Modifiers>
>((props, ref) => {
  return (
    <ProductPrimitive.Modifiers
      {...props}
      ref={ref}
      className={cn('space-y-4', props.className)}
    >
      {props.children}
    </ProductPrimitive.Modifiers>
  );
});

ProductModifiers.displayName = 'ProductModifiers';

export const ProductVariantOptions = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.VariantOptions>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.VariantOptions>
>((props, ref) => {
  return (
    <ProductPrimitive.VariantOptions {...props} ref={ref}>
      {props.children}
    </ProductPrimitive.VariantOptions>
  );
});

ProductVariantOptions.displayName = 'ProductVariantOptions';

export const ProductVariantOptionRepeater =
  ProductPrimitive.VariantOptionRepeater;

ProductVariantOptionRepeater.displayName = 'ProductVariantOptionRepeater';

export const ProductModifierOptions = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.ModifierOptions>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.ModifierOptions>
>((props, ref) => {
  return (
    <ProductPrimitive.ModifierOptions {...props} ref={ref}>
      {props.children}
    </ProductPrimitive.ModifierOptions>
  );
});

ProductModifierOptions.displayName = 'ProductModifierOptions';

export const ProductModifierOptionRepeater =
  ProductPrimitive.ModifierOptionRepeater;

ProductModifierOptionRepeater.displayName = 'ProductModifierOptionRepeater';

export const ProductStock = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Stock>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Stock>
>((props, ref) => {
  return (
    <ProductPrimitive.Stock
      {...props}
      ref={ref}
      labels={{
        inStock: 'In Stock',
        limitedStock: 'Limited Stock',
        outOfStock: 'Out of Stock',
        ...props.labels,
      }}
      className={cn(
        'data-[state="out-of-stock"]:text-status-error data-[state="in-stock"]:text-status-success data-[state="limited-stock"]:text-status-success',
        props.className
      )}
      asChild
    >
      {props.children}
    </ProductPrimitive.Stock>
  );
});

ProductStock.displayName = 'ProductStock';

export const ProductActionAddToCart = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.ProductActionAddToCart>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.ProductActionAddToCart>
>((props, ref) => {
  return (
    <ProductPrimitive.ProductActionAddToCart
      {...props}
      ref={ref}
      className={props.className}
      asChild
    >
      {React.forwardRef(({ isLoading, ...restProps }, ref) => {
        return (
          <Button
            ref={ref as React.RefObject<HTMLButtonElement>}
            variant="default"
            size="lg"
            className="flex-1 relative"
            {...restProps}
          >
            {!isLoading ? props.label : props.loadingState}
          </Button>
        );
      })}
    </ProductPrimitive.ProductActionAddToCart>
  );
});

ProductActionAddToCart.displayName = 'ProductActionAddToCart';

export const ProductActionBuyNow = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.ProductActionBuyNow>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.ProductActionBuyNow>
>((props, ref) => {
  return (
    <ProductPrimitive.ProductActionBuyNow
      {...props}
      ref={ref}
      className={props.className}
      asChild
    >
      {React.forwardRef(({ isLoading, ...restProps }, ref) => {
        return (
          <Button
            ref={ref as React.RefObject<HTMLButtonElement>}
            variant="secondary"
            size="lg"
            className={cn(
              'flex-1 transform hover:scale-105 disabled:hover:scale-100',
              props.className
            )}
            {...restProps}
          >
            {!isLoading ? props.label : props.loadingState}
          </Button>
        );
      })}
    </ProductPrimitive.ProductActionBuyNow>
  );
});

ProductActionBuyNow.displayName = 'ProductActionBuyNow';

export const ProductActionPreOrder = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.ProductActionPreOrder>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.ProductActionPreOrder>
>((props, ref) => {
  return (
    <ProductPrimitive.ProductActionPreOrder
      {...props}
      ref={ref}
      className={props.className}
      asChild
    >
      {React.forwardRef(({ isLoading, ...restProps }, ref) => {
        return (
          <Button
            ref={ref as React.RefObject<HTMLButtonElement>}
            variant="default"
            size="lg"
            className="flex-1 relative"
            {...restProps}
          >
            {!isLoading ? props.label : props.loadingState}
          </Button>
        );
      })}
    </ProductPrimitive.ProductActionPreOrder>
  );
});

ProductActionPreOrder.displayName = 'ProductActionPreOrder';
