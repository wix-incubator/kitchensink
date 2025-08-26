import * as StyledMediaGallery from '@/components/media/MediaGallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ProductListFilters as ProductListFiltersPrimitive,
  ProductListCore as ProductListPrimitive,
  ProductVariantSelector as ProductVariantSelectorPrimitive,
} from '@wix/headless-stores/react';
import {
  type CategoriesListServiceConfig,
  type ProductsListServiceConfig,
} from '@wix/headless-stores/services';

import React from 'react';
import { useNavigation } from '../NavigationContext';
import { Badge } from '../ui/badge';
import {
  ProductCompareAtPrice,
  ProductDescription,
  ProductMediaGallery,
  ProductName,
  ProductPrice,
  ProductRaw,
  ProductSlug,
  ProductStock,
} from '../ui/store/Product';
import {
  LoadMoreTrigger,
  ProductList,
  ProductRepeater,
  Products,
  TotalsDisplayed,
} from '../ui/store/ProductList';
import CategoryPicker from './CategoryPicker';
import { ProductActionButtons } from './ProductActionButtons';
import ProductFiltersSidebar from './ProductFiltersSidebar';
import { SortDropdown } from './SortDropdown';

interface ProductListProps {
  productsListConfig: ProductsListServiceConfig;
  productPageRoute: string;
  categoriesListConfig: CategoriesListServiceConfig;
  currentCategorySlug: string;
}

export const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card
          key={i}
          className="overflow-hidden relative bg-surface-card border-surface-subtle"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-surface-loading/30 to-transparent"></div>

          {/* Content Skeleton */}
          <CardContent className="p-4">
            <div className="aspect-square bg-surface-loading rounded-lg mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 bg-surface-loading rounded animate-pulse"></div>
              <div className="h-3 bg-surface-loading rounded w-2/3 animate-pulse"></div>
              <div className="flex gap-2 mt-3">
                <div className="w-6 h-6 bg-surface-loading rounded-full animate-pulse"></div>
                <div className="w-6 h-6 bg-surface-loading rounded-full animate-pulse"></div>
                <div className="w-6 h-6 bg-surface-loading rounded-full animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-6 bg-surface-loading rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-surface-loading rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="space-y-2 w-full">
              <div className="h-10 bg-surface-loading rounded animate-pulse"></div>
              <div className="h-10 bg-surface-loading rounded animate-pulse"></div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export const ProductListWrapper: React.FC<ProductListProps> = ({
  productsListConfig,
  productPageRoute,
  categoriesListConfig,
}) => {
  const Navigation = useNavigation();

  return (
    <TooltipProvider>
      <ProductList productsListConfig={productsListConfig}>
        <div className="min-h-screen">
          {/* Header Controls */}
          <Card className="border-surface-subtle mb-6 bg-surface-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ProductListFiltersPrimitive.CategoryFilter>
                    <CategoryPicker
                      categoriesListConfig={categoriesListConfig}
                    />
                  </ProductListFiltersPrimitive.CategoryFilter>
                </div>
                <SortDropdown />
              </div>
            </CardContent>
          </Card>

          {/* Filters Section */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Filters Sidebar */}
            <ProductFiltersSidebar />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <>
                {/* Filter Status Bar */}
                <ProductListFiltersPrimitive.ResetTrigger>
                  {({ resetFilters, isFiltered }) =>
                    isFiltered && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 filter-status-bar border rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-brand-primary flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                          </svg>
                          <TotalsDisplayed
                            className="text-brand-light text-sm sm:text-base"
                            label="Showing {length} products"
                          />
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={resetFilters}
                          className="self-start sm:self-auto"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    )
                  }
                </ProductListFiltersPrimitive.ResetTrigger>

                {/* Products Grid */}
                <Products>
                  <ProductRepeater>
                    <Card className="relative hover:shadow-lg transition-all duration-200 hover:scale-105 group h-full flex flex-col bg-surface-card border-surface-subtle justify-between">
                      <CardContent className="p-4 pb-0">
                        {/* Product Image */}
                        <div className="aspect-square bg-surface-primary rounded-lg mb-4 overflow-hidden relative">
                          <ProductMediaGallery>
                            <StyledMediaGallery.Viewport className="object-cover group-hover:scale-110 transition-transform duration-300" />
                          </ProductMediaGallery>
                        </div>
                        {/* Product Ribbon */}
                        <ProductRaw asChild>
                          {({ product }) =>
                            product.ribbon?.name && (
                              <div className="absolute top-2 left-2 z-10">
                                <Badge
                                  variant="secondary"
                                  className="hover:bg-secondary"
                                >
                                  {product.ribbon.name}
                                </Badge>
                              </div>
                            )
                          }
                        </ProductRaw>
                        {/* Product Title */}
                        <ProductSlug asChild>
                          {({ slug }) => (
                            <Navigation
                              data-testid="title-navigation"
                              route={`${productPageRoute}/${slug}`}
                            >
                              <CardTitle className="text-primary mb-2 line-clamp-2 hover:text-brand-primary transition-colors">
                                <ProductName variant="paragraph" />
                              </CardTitle>
                            </Navigation>
                          )}
                        </ProductSlug>
                        {/* Enhanced Product Variants */}
                        <ProductVariantSelectorPrimitive.Options>
                          {({ options, hasOptions }) => (
                            <>
                              {hasOptions && (
                                <div className="mb-3 space-y-2">
                                  {options.map((option: any) => (
                                    <ProductVariantSelectorPrimitive.Option
                                      key={option._id}
                                      option={option}
                                    >
                                      {({ name, choices }) => (
                                        <div className="space-y-2">
                                          <span className="text-content-secondary text-xs font-medium uppercase tracking-wide">
                                            {String(name)}:
                                          </span>
                                          <div className="flex flex-wrap gap-1.5">
                                            {choices
                                              ?.slice(0, 3)
                                              .map((choice: any) => (
                                                <ProductVariantSelectorPrimitive.Choice
                                                  key={choice.choiceId}
                                                  option={option}
                                                  choice={choice}
                                                >
                                                  {({
                                                    value,
                                                    isSelected,
                                                    isVisible,
                                                    isInStock,
                                                    isPreOrderEnabled,
                                                    select,
                                                  }) => {
                                                    if (!isVisible) return null;
                                                    const nonSelectable =
                                                      !isInStock &&
                                                      !isPreOrderEnabled;

                                                    const isColorOption =
                                                      String(name)
                                                        .toLowerCase()
                                                        .includes('color');
                                                    const hasColorCode =
                                                      choice.colorCode ||
                                                      choice.media?.image;

                                                    if (
                                                      isColorOption &&
                                                      (choice.colorCode ||
                                                        hasColorCode)
                                                    ) {
                                                      return (
                                                        <Tooltip
                                                          delayDuration={0}
                                                        >
                                                          <TooltipTrigger
                                                            asChild
                                                          >
                                                            <div className="relative">
                                                              <div
                                                                className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer transform hover:scale-110 ${
                                                                  isSelected
                                                                    ? 'border-brand-primary shadow-lg ring-2 ring-brand-primary/30 scale-110'
                                                                    : 'border-color-swatch hover:border-color-swatch-hover hover:shadow-md'
                                                                } ${
                                                                  nonSelectable
                                                                    ? 'grayscale opacity-50'
                                                                    : ''
                                                                }`}
                                                                style={{
                                                                  backgroundColor:
                                                                    choice.colorCode ||
                                                                    'var(--theme-fallback-color)',
                                                                }}
                                                                onClick={select}
                                                              />
                                                              {nonSelectable && (
                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                  <svg
                                                                    className="w-3 h-3 text-status-error drop-shadow-sm"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                  >
                                                                    <path
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      strokeWidth="2"
                                                                      d="M6 18L18 6M6 6l12 12"
                                                                    />
                                                                  </svg>
                                                                </div>
                                                              )}
                                                            </div>
                                                          </TooltipTrigger>
                                                          <TooltipContent>
                                                            <p>
                                                              {String(value)}
                                                              {nonSelectable &&
                                                                ' (Out of Stock)'}
                                                            </p>
                                                          </TooltipContent>
                                                        </Tooltip>
                                                      );
                                                    } else {
                                                      return (
                                                        <Button
                                                          variant={
                                                            isSelected
                                                              ? 'default'
                                                              : 'outline'
                                                          }
                                                          onClick={select}
                                                          className={
                                                            isSelected
                                                              ? ''
                                                              : `text-content-primary border-surface-subtle hover:bg-primary/10 ${
                                                                  nonSelectable
                                                                    ? 'opacity-50 line-through'
                                                                    : ''
                                                                }`
                                                          }
                                                          disabled={
                                                            nonSelectable
                                                          }
                                                        >
                                                          {String(value)}
                                                        </Button>
                                                      );
                                                    }
                                                  }}
                                                </ProductVariantSelectorPrimitive.Choice>
                                              ))}
                                            {choices?.length > 3 && (
                                              <span className="text-content-muted text-xs self-center bg-surface-subtle px-2 py-1 rounded-full">
                                                +{choices.length - 3} more
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </ProductVariantSelectorPrimitive.Option>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </ProductVariantSelectorPrimitive.Options>
                        {/* Reset Selections */}
                        <ProductVariantSelectorPrimitive.Reset>
                          {({ reset, hasSelections }) =>
                            hasSelections && (
                              <div className="pt-2 pb-2">
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={reset}
                                  className="text-xs underline p-0"
                                >
                                  Reset Selections
                                </Button>
                              </div>
                            )
                          }
                        </ProductVariantSelectorPrimitive.Reset>
                        {/* Product Description */}
                        <ProductDescription
                          as="html"
                          className="text-content-muted text-sm mb-3 line-clamp-2 leading-relaxed"
                        />
                      </CardContent>

                      <CardFooter className="p-4 pt-0 flex-col space-y-2">
                        {/* Enhanced Price and Stock */}
                        <div className="mt-auto w-full py-2">
                          <div className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ProductPrice className="text-xl font-bold text-content-primary" />
                              <ProductCompareAtPrice className="text-sm font-medium text-content-faded line-through" />
                            </div>
                            <ProductStock
                              className="flex items-center gap-1 text-xs font-medium"
                              labels={{
                                inStock: 'In Stock',
                                limitedStock: 'In Stock',
                                outOfStock: 'Out of Stock',
                              }}
                            />
                          </div>
                        </div>
                        {/* Enhanced Action Buttons */}
                        <ProductActionButtons />

                        <ProductSlug asChild>
                          {({ slug }) => (
                            <Navigation
                              data-testid="view-product-button"
                              route={`${productPageRoute}/${slug}`}
                              className="w-full"
                            >
                              <Button
                                variant="secondary"
                                size="lg"
                                className="w-full"
                              >
                                View Product
                                <svg
                                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </Button>
                            </Navigation>
                          )}
                        </ProductSlug>
                      </CardFooter>
                    </Card>
                  </ProductRepeater>
                </Products>
              </>
            </div>
          </div>

          {/* Load More Section */}
          <div className="text-center mt-12 mb-8">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LoadMoreTrigger
                  label="Load More Products"
                  loadingState={
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
                  }
                />
              </div>
              <TotalsDisplayed
                className="text-content-muted text-sm mt-4"
                label={'{length} products loaded'}
              />
            </div>
          </div>
        </div>
      </ProductList>
    </TooltipProvider>
  );
};

export default ProductListWrapper;
