import React from 'react';
import { cn } from '@/lib/utils';
import {
  ProductList as ProductListPrimitive,
  ProductListCore as ProductListCorePrimitive,
  ProductListPagination as ProductListPaginationPrimitive,
} from '@wix/headless-stores/react';
import { Button } from '@/components/ui/button';

// Root wrapper for the ProductList
export const ProductList = ProductListPrimitive.Root;

// Products wrapper component
export const Products = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <ProductListPrimitive.Products
      emptyState={
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
      }
      {...props}
      ref={ref}
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6',
        className
      )}
    >
      {props.children}
    </ProductListPrimitive.Products>
  );
});
Products.displayName = 'Products';

export const ProductRepeater = ProductListPrimitive.ProductRepeater;

export const LoadMoreTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ProductListPaginationPrimitive.LoadMoreTrigger>
    {({ loadMore, hasMoreProducts, isLoading }) =>
      hasMoreProducts ? (
        <ProductListPrimitive.LoadMoreTrigger
          className={cn('font-semibold transform hover:scale-105', className)}
          asChild
        >
          <Button
            variant="default"
            size="lg"
            onClick={() => loadMore(10)}
            disabled={isLoading}
            className={`font-semibold transform hover:scale-105 ${
              isLoading
                ? 'bg-surface-loading animate-pulse'
                : 'shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Load More Products'
            )}
          </Button>
        </ProductListPrimitive.LoadMoreTrigger>
      ) : null
    }
  </ProductListPaginationPrimitive.LoadMoreTrigger>
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
