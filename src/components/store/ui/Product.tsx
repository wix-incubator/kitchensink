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

export const ProductDescription = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Description>
>((props, ref) => {
  return (
    <ProductPrimitive.Description
      {...props}
      ref={ref}
      className={cn(
        'text-content-secondary text-base leading-relaxed mb-6',
        props.className
      )}
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
        'text-3xl font-bold text-content-primary data-[discounted]:text-status-success',
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
        'text-lg text-content-muted line-through hidden data-[discounted]:inline',
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
      className={cn(
        'text-content-secondary font-mono text-sm',
        props.className
      )}
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

export const ProductVariantOptionRepeater = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.VariantOptionRepeater>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.VariantOptionRepeater>
>((props, ref) => {
  return (
    <ProductPrimitive.VariantOptionRepeater {...props} ref={ref}>
      {props.children}
    </ProductPrimitive.VariantOptionRepeater>
  );
});

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

export const ProductModifierOptionRepeater = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.ModifierOptionRepeater>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.ModifierOptionRepeater>
>((props, ref) => {
  return (
    <ProductPrimitive.ModifierOptionRepeater {...props} ref={ref}>
      {props.children}
    </ProductPrimitive.ModifierOptionRepeater>
  );
});

ProductModifierOptionRepeater.displayName = 'ProductModifierOptionRepeater';
