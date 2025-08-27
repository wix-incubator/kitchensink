import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Product as ProductPrimitive } from '@wix/headless-stores/react';
import { Button } from '../button';

/**
 * Root component for product display and interaction.
 * Provides context for all product-related components like name, price, variants, etc.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 *     <ProductMediaGallery />
 *     <div>
 *       <ProductName />
 *       <ProductPrice />
 *       <ProductDescription />
 *       <ProductVariants>
 *         <ProductVariantOptions>
 *           <Option>
 *             <OptionName>Size</OptionName>
 *           </Option>
 *         </ProductVariantOptions>
 *       </ProductVariants>
 *     </div>
 *   </div>
 * </Product>
 * ```
 */
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

/**
 * Displays the product name/title.
 * Can be rendered as different heading levels or paragraph text.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <ProductName variant="heading" asChild>
 *     <h1 className="mb-4" />
 *   </ProductName>
 *
 *   <ProductName variant="paragraph" className="text-lg" />
 * </Product>
 * ```
 */
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

/**
 * Displays the product description.
 * Supports both plain text and HTML content rendering.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <ProductName />
 *
 *   <ProductDescription className="mt-4 text-gray-600" />
 *
 *   <ProductDescription as="html" className="prose max-w-none" />
 * </Product>
 * ```
 */
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

/**
 * Displays the current product price.
 * Automatically handles currency formatting and price ranges.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <ProductName />
 *   <div className="flex items-center gap-3 mt-2">
 *     <ProductPrice className="text-2xl font-bold" />
 *     <ProductCompareAtPrice />
 *   </div>
 * </Product>
 * ```
 */
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

/**
 * Displays the original/compare-at price (usually crossed out).
 * Only shows when the product is on sale and has a compare-at price.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <div className="flex items-baseline gap-2">
 *     <ProductPrice className="text-2xl font-bold text-red-600" />
 *     <ProductCompareAtPrice className="text-sm text-gray-500" />
 *   </div>
 * </Product>
 * ```
 */
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

/**
 * Displays the product slug/URL identifier.
 * Typically used for SEO or debugging purposes.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <ProductName />
 *   <ProductSlug className="text-xs text-gray-400 mt-1" />
 * </Product>
 * ```
 */
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

/**
 * Container for product media gallery functionality.
 * Integrates with media gallery components for image/video display.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 *     <div>
 *       <ProductMediaGallery>
 *         <MediaGalleryViewport />
 *       </ProductMediaGallery>
 *     </div>
 *     <div>
 *       <ProductName />
 *       <ProductPrice />
 *     </div>
 *   </div>
 * </Product>
 * ```
 */
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

/**
 * Container for product variants (size, color, style, etc.).
 * Wraps all variant options and provides proper spacing.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <ProductVariants className="mt-6">
 *     <ProductVariantOptions>
 *       <ProductVariantOptionRepeater>
 *         <Option>
 *           <OptionName>Size</OptionName>
 *           <OptionChoices>
 *             <OptionChoiceRepeater>
 *               <Choice>
 *                 <ChoiceText>Large</ChoiceText>
 *               </Choice>
 *             </OptionChoiceRepeater>
 *           </OptionChoices>
 *         </Option>
 *       </ProductVariantOptionRepeater>
 *     </ProductVariantOptions>
 *   </ProductVariants>
 * </Product>
 * ```
 */
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

/**
 * Container for product modifiers (add-ons, customizations, etc.).
 * Wraps all modifier options and provides proper spacing.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <ProductVariants>
 *     <ProductVariantOptions>
 *       <Option>
 *         <OptionName>Size</OptionName>
 *       </Option>
 *     </ProductVariantOptions>
 *   </ProductVariants>
 *
 *   <ProductModifiers className="mt-6">
 *     <ProductModifierOptions>
 *       <ProductModifierOptionRepeater>
 *         <Option>
 *           <OptionName>Gift Wrapping</OptionName>
 *           <OptionChoices>
 *             <OptionChoiceRepeater>
 *               <Choice>
 *                 <ChoiceText>Yes (+$5)</ChoiceText>
 *               </Choice>
 *             </OptionChoiceRepeater>
 *           </OptionChoices>
 *         </Option>
 *       </ProductModifierOptionRepeater>
 *     </ProductModifierOptions>
 *   </ProductModifiers>
 * </Product>
 * ```
 */
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

/**
 * Displays the product stock status with appropriate styling.
 * Shows different states: in stock, limited stock, or out of stock.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <div className="flex items-center gap-4 mt-4">
 *     <ProductPrice />
 *     <ProductStock className="text-sm font-medium">
 *       {({ stockStatus }) => (
 *         <span className={`px-2 py-1 rounded ${
 *           stockStatus === 'in-stock' ? 'bg-green-100' :
 *           stockStatus === 'limited-stock' ? 'bg-yellow-100' : 'bg-red-100'
 *         }`}>
 *           {stockStatus === 'in-stock' ? 'In Stock' :
 *            stockStatus === 'limited-stock' ? 'Limited Stock' : 'Out of Stock'}
 *         </span>
 *       )}
 *     </ProductStock>
 *   </div>
 * </Product>
 * ```
 */
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

/**
 * Add to cart button with loading states and automatic cart integration.
 * Handles product variants, quantities, and cart updates automatically.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <div className="flex gap-3 mt-6">
 *     <ProductActionAddToCart
 *       label="Add to Cart"
 *       loadingState="Adding..."
 *       className="flex-1"
 *     />
 *     <ProductActionBuyNow
 *       label="Buy Now"
 *       loadingState="Processing..."
 *       className="flex-1"
 *     />
 *   </div>
 * </Product>
 * ```
 */
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

/**
 * Buy now button that redirects directly to checkout.
 * Bypasses the cart and goes straight to the purchase flow.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <div className="flex gap-3 mt-6">
 *     <ProductActionAddToCart label="Add to Cart" />
 *     <ProductActionBuyNow
 *       label="Buy Now"
 *       loadingState="Redirecting..."
 *       className="bg-orange-600 hover:bg-orange-700"
 *     />
 *   </div>
 * </Product>
 * ```
 */
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

/**
 * Pre-order button for products not yet available.
 * Automatically shows when product is in pre-order status.
 *
 * @component
 * @example
 * ```tsx
 * <Product product={productData}>
 *   <div className="space-y-3">
 *     <ProductStock />
 *     <ProductActionPreOrder
 *       label="Pre-Order Now"
 *       loadingState="Processing Pre-Order..."
 *       className="w-full"
 *     />
 *   </div>
 * </Product>
 * ```
 */
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
