import React from 'react';
import { cn } from '@/lib/utils';
import { ProductList as ProductListPrimitive } from '@wix/stores/components';
import { Button } from '@/components/ui/button';
import type { LayoutType } from '@wix/fast-gallery-ui';
import '@wix/fast-gallery-ui/styles.css';

/**
 * Root component for product list functionality.
 * Provides context for all product list related components like filters, pagination, etc.
 *
 * @component
 * @example
 * ```tsx
 * <ProductList productsListConfig={productsListConfig}>
 *   <div className="space-y-6">
 *     <Products>
 *       <ProductRepeater>
 *         <Product>
 *           <ProductName />
 *           <ProductPrice />
 *         </Product>
 *       </ProductRepeater>
 *     </Products>
 *     <LoadMoreTrigger />
 *     <TotalsDisplayed />
 *   </div>
 * </ProductList>
 * ```
 */
export const ProductList = ProductListPrimitive.Root;

/**
 * Container for the actual product grid/list display.
 * Handles empty states and provides responsive grid layout.
 * Now supports gallery layout variants via the variant prop.
 *
 * @component
 * @example
 * ```tsx
 * <ProductList>
 *   <Products variant="grid">
 *     <ProductRepeater>
 *       <div className="border rounded-lg p-4">
 *         <ProductName className="font-semibold" />
 *         <ProductPrice className="text-lg" />
 *       </div>
 *     </ProductRepeater>
 *   </Products>
 * </ProductList>
 *
 * // Or use alternating layout
 * <Products variant="alternating">
 *   <ProductRepeater>...</ProductRepeater>
 * </Products>
 * ```
 */
export const Products = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /**
     * Gallery layout variant
     * - grid: Standard responsive grid (default)
     * - alternating: 3-2-3-2 alternating pattern
     * - slider: Horizontal scrolling
     * - waterfall: Masonry/Pinterest-style columns
     * @default 'grid'
     */
    variant?: LayoutType;
    /**
     * Custom empty state to display when no products
     */
    emptyState?: React.ReactNode;
  }
>(({ className, variant = 'grid', emptyState, children, ...props }, ref) => {
  const defaultEmptyState = (
    <div className="text-center py-12 sm:py-16">
      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-surface-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm border border-surface-subtle">
        <svg
          className="w-8 h-8 sm:w-12 sm:h-12 text-content-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
    </div>
  );

  // Create a wrapper with gallery variant classes
  const galleryClasses = React.useMemo(() => {
    const variantMap = {
      grid: 'gallery-grid',
      alternating: 'gallery-alternating',
      slider: 'gallery-slider',
      waterfall: 'gallery-waterfall',
    };
    return `w-full gallery-layout ${variantMap[variant]}`;
  }, [variant]);

  return (
    <div
      ref={ref}
      className={cn(galleryClasses, className)}
      data-gallery-variant={variant}
      {...props}
    >
      <ProductListPrimitive.Products
        emptyState={emptyState || defaultEmptyState}
      >
        <div className="scroller">
          <div className="container">{children}</div>
        </div>
      </ProductListPrimitive.Products>
    </div>
  );
});
Products.displayName = 'Products';

/**
 * Repeater component that renders each product in the list.
 * Automatically iterates through all products using the Wix ProductRepeater.
 * Wraps each product with proper gallery item styling for layout compatibility.
 *
 * @component
 * @example
 * ```tsx
 * <Products variant="alternating">
 *   <ProductRepeater>
 *     <div className="product-card">
 *       <ProductName />
 *       <ProductPrice />
 *       <ProductDescription className="text-sm text-gray-600" />
 *     </div>
 *   </ProductRepeater>
 * </Products>
 * ```
 */
export const ProductRepeater = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <ProductListPrimitive.ProductRepeater>
      <div ref={ref} className={cn('item', className)} {...props}>
        {children}
      </div>
    </ProductListPrimitive.ProductRepeater>
  );
});
ProductRepeater.displayName = 'ProductRepeater';

/**
 * Load more trigger component that displays a button to load additional products.
 * Shows different states for loading and available products.
 *
 * @component
 * @example
 * ```tsx
 * <LoadMoreTrigger
 *   label="Load More Products"
 *   loadingState="Loading..."
 * />
 * ```
 */
export const ProductLoadMoreTrigger = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    /** Label text to display when more products are available */
    label?: React.ReactNode;
    /** Loading state content to display while loading */
    loadingState?: React.ReactNode;
  }
>(
  (
    {
      className,
      label = 'Load More Products',
      loadingState = 'Loading...',
      ...props
    },
    ref
  ) => (
    <ProductListPrimitive.LoadMoreTrigger
      className={cn('font-semibold transform hover:scale-105', className)}
      {...props}
      asChild
    >
      {({ loadMore, isLoading }) => (
        <Button
          ref={ref}
          variant="default"
          size="lg"
          onClick={() => loadMore()}
          className={`font-semibold transform hover:scale-105 ${
            isLoading
              ? 'bg-surface-loading animate-pulse'
              : 'shadow-md hover:shadow-lg'
          }`}
        >
          {!isLoading ? label : loadingState}
        </Button>
      )}
    </ProductListPrimitive.LoadMoreTrigger>
  )
);

ProductLoadMoreTrigger.displayName = 'ProductLoadMoreTrigger';

/**
 * Displays the total number of products currently shown in the product list.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage with default label
 * <TotalsDisplayed />
 *
 * // Custom label format
 * <TotalsDisplayed label="Showing {length} products" />
 *
 * // With custom styling
 * <TotalsDisplayed
 *   label="{length} items found"
 *   className="text-sm text-muted-foreground"
 * />
 * ```
 */
export const ProductTotalsDisplayed = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /**
     * Custom label format for displaying the product count.
     * Use `{length}` as a placeholder that will be replaced with the actual number of displayed products.
     *
     * @default '{length} products loaded'
     * @example 'Showing {length} products'
     * @example '{length} items found'
     * @example 'Displaying {length} of total products'
     */
    label?: string;
  }
>(({ className, label = '{length} products loaded', ...props }, ref) => (
  <ProductListPrimitive.TotalsDisplayed
    ref={ref}
    {...props}
    className={className}
    asChild
  >
    {({ displayedItems }) => (
      <span>{label.replace('{length}', displayedItems.toString())}</span>
    )}
  </ProductListPrimitive.TotalsDisplayed>
));

ProductTotalsDisplayed.displayName = 'ProductTotalsDisplayed';

// Export gallery types for convenience
export type { LayoutType as ProductGalleryVariant };
