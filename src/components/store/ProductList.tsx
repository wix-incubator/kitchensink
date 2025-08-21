import React, { useState } from 'react';
import { WixMediaImage } from '../../headless/media/components';
import {
  ProductListCore as PrimitiveProductList,
  ProductVariantSelector,
  SelectedVariant,
  ProductListFilters,
  ProductListPagination,
  ProductCore,
} from '@wix/headless-stores/react';
import { Product, ProductDescription } from '../ui/store/Product';
import {
  type ProductsListServiceConfig,
  type CategoriesListServiceConfig,
} from '@wix/headless-stores/services';
import { useNavigation } from '../NavigationContext';
import QuickViewModal from './QuickViewModal';
import { ProductActionButtons } from './ProductActionButtons';
import { CurrentCart } from '@wix/headless-ecom/react';
import type { LineItem } from '@wix/headless-ecom/services';
import { productsV3 } from '@wix/stores';
import { SortDropdown } from './SortDropdown';
import CategoryPicker from './CategoryPicker';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MediaGallery } from '@wix/headless-media/react';
import ProductFiltersSidebar from './ProductFiltersSidebar';
import * as ProductListUI from './ui/ProductList';

interface ProductListProps {
  productsListConfig: ProductsListServiceConfig;
  productPageRoute: string;
  categoriesListConfig: CategoriesListServiceConfig;
  currentCategorySlug: string;
}

export const ProductList: React.FC<ProductListProps> = ({
  productsListConfig,
  productPageRoute,
  categoriesListConfig,
}) => {
  const [quickViewProduct, setQuickViewProduct] =
    useState<productsV3.V3Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product: productsV3.V3Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setQuickViewProduct(null), 300);
  };

  return (
    <TooltipProvider>
      <ProductListUI.ProductList productsListConfig={productsListConfig}>
        <div className="min-h-screen">
          {/* Error State */}
          <PrimitiveProductList.Error>
            {({ error }) => (
              <div className="bg-surface-error border border-status-error rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-status-error flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-status-error text-sm sm:text-base font-medium">
                    {error}
                  </p>
                </div>
              </div>
            )}
          </PrimitiveProductList.Error>

          {/* Header Controls */}
          <Card className="border-surface-subtle mb-6 bg-surface-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CategoryPicker categoriesListConfig={categoriesListConfig} />
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
              <ProductGrid
                productPageRoute={productPageRoute}
                openQuickView={openQuickView}
              />
            </div>
          </div>

          {/* Load More Section */}
          <LoadMoreSection />
        </div>

        {/* Quick View Modal */}
        {quickViewProduct && (
          <ProductCore.Root
            productServiceConfig={{ productSlug: quickViewProduct.slug! }}
          >
            <ProductCore.Loading>
              {({ isLoading }) => (
                <ProductCore.Content>
                  {({ product }) => (
                    <QuickViewModal
                      product={product}
                      isLoading={isLoading}
                      isOpen={isQuickViewOpen}
                      onClose={closeQuickView}
                      productPageRoute={productPageRoute}
                    />
                  )}
                </ProductCore.Content>
              )}
            </ProductCore.Loading>
          </ProductCore.Root>
        )}
      </ProductListUI.ProductList>
    </TooltipProvider>
  );
};

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

// Product Grid Component
interface ProductGridProps {
  productPageRoute: string;
  openQuickView: (product: productsV3.V3Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  productPageRoute,
  openQuickView,
}) => {
  return (
    <>
      {/* Enhanced Loading State */}
      <PrimitiveProductList.Loading>
        <ProductListSkeleton />
      </PrimitiveProductList.Loading>

      {/* Enhanced Empty State */}
      <PrimitiveProductList.EmptyState>
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
          <ProductListFilters.ResetTrigger>
            {({ isFiltered }) => (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-content-primary mb-3 sm:mb-4">
                  {isFiltered
                    ? 'No Products Match Your Filters'
                    : 'No Products Found'}
                </h2>
                <p className="text-content-muted text-sm sm:text-base max-w-md mx-auto">
                  {isFiltered
                    ? 'Try adjusting your filters to see more products.'
                    : "We couldn't find any products to display."}
                </p>
              </>
            )}
          </ProductListFilters.ResetTrigger>
        </div>
      </PrimitiveProductList.EmptyState>

      {/* Filter Status Bar */}
      <ProductListFilters.ResetTrigger>
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
                <span className="text-brand-light text-sm sm:text-base">
                  <PrimitiveProductList.Items>
                    {({ products }) =>
                      `Showing ${String(products.length)} product${
                        products.length === 1 ? '' : 's'
                      }`
                    }
                  </PrimitiveProductList.Items>
                </span>
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
      </ProductListFilters.ResetTrigger>

      {/* Products Grid */}
      <ProductListUI.Products>
        <ProductListUI.ProductRepeater>
          {/* <PrimitiveProductList.ItemContent>
            {({ product }) => (
              <ProductItem
                product={product}
                productPageRoute={productPageRoute}
                openQuickView={openQuickView}
              />
            )}
          </PrimitiveProductList.ItemContent> */}
        </ProductListUI.ProductRepeater>
      </ProductListUI.Products>
    </>
  );
};

// Individual Product Item Component
interface ProductItemProps {
  product: productsV3.V3Product;
  productPageRoute: string;
  openQuickView: (product: productsV3.V3Product) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  productPageRoute,
  openQuickView,
}) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const Navigation = useNavigation();

  const availabilityStatus = product.inventory?.availabilityStatus;
  const available =
    availabilityStatus === productsV3.InventoryAvailabilityStatus.IN_STOCK ||
    availabilityStatus ===
      productsV3.InventoryAvailabilityStatus.PARTIALLY_OUT_OF_STOCK;

  return (
    <Product product={product}>
      <MediaGallery.Root
        mediaGalleryServiceConfig={{
          media: product.media?.itemsInfo?.items ?? [],
        }}
      >
        <SelectedVariant.Root>
          <Card
            data-testid="product-item"
            data-product-id={product._id}
            data-product-available={available}
            className="relative hover:shadow-lg transition-all duration-200 hover:scale-105 group h-full flex flex-col bg-surface-card border-surface-subtle justify-between"
          >
            {/* Enhanced Success Message */}
            {showSuccessMessage && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="bg-status-success-light/95 backdrop-blur-sm border border-status-success rounded-lg px-4 py-2 text-status-success text-base font-bold text-center shadow-lg animate-bounce">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Added to Cart!
                  </div>
                </div>
              </div>
            )}

            {/* Cart Success Handler */}
            <CurrentCart.LineItemAdded>
              {({ onAddedToCart }) => {
                React.useEffect(() => {
                  return onAddedToCart((lineItems: LineItem[] | undefined) => {
                    if (!lineItems) return;
                    const myLineItemIsThere = lineItems.some(
                      lineItem =>
                        lineItem.catalogReference?.catalogItemId === product._id
                    );
                    if (!myLineItemIsThere) return;

                    setShowSuccessMessage(true);
                    setTimeout(() => {
                      setShowSuccessMessage(false);
                    }, 3000);
                  });
                }, [onAddedToCart]);

                return null;
              }}
            </CurrentCart.LineItemAdded>

            <CardContent className="p-4 pb-0">
              {/* Product Image */}
              <div className="aspect-square bg-surface-primary rounded-lg mb-4 overflow-hidden relative">
                {product.media?.main?.image ? (
                  <WixMediaImage
                    media={{ image: product.media.main.image }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    alt={product.media.main.altText || ''}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-content-subtle"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Enhanced Quick View Button */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-2 group-hover:translate-y-0">
                  <Button
                    variant="secondary"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      openQuickView(product);
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Quick View
                  </Button>
                </div>
              </div>

              {/* Product Ribbon */}
              {product.ribbon?.name && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge variant="secondary" className="hover:bg-secondary">
                    {product.ribbon.name}
                  </Badge>
                </div>
              )}

              {/* Product Title */}
              <Navigation
                data-testid="title-navigation"
                route={`${productPageRoute}/${product.slug}`}
              >
                <CardTitle className="text-primary mb-2 line-clamp-2 hover:text-brand-primary transition-colors font-theme-heading">
                  {product.name}
                </CardTitle>
              </Navigation>

              {/* Enhanced Product Variants */}
              <ProductVariantSelector.Options>
                {({ options, hasOptions }) => (
                  <>
                    {hasOptions && (
                      <div className="mb-3 space-y-2">
                        {options.map((option: any) => (
                          <ProductVariantSelector.Option
                            key={option._id}
                            option={option}
                          >
                            {({ name, choices }) => (
                              <div className="space-y-2">
                                <span className="text-content-secondary text-xs font-medium uppercase tracking-wide">
                                  {String(name)}:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {choices?.slice(0, 3).map((choice: any) => (
                                    <ProductVariantSelector.Choice
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
                                          !isInStock && !isPreOrderEnabled;

                                        const isColorOption = String(name)
                                          .toLowerCase()
                                          .includes('color');
                                        const hasColorCode =
                                          choice.colorCode ||
                                          choice.media?.image;

                                        if (
                                          isColorOption &&
                                          (choice.colorCode || hasColorCode)
                                        ) {
                                          return (
                                            <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
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
                                              disabled={nonSelectable}
                                            >
                                              {String(value)}
                                            </Button>
                                          );
                                        }
                                      }}
                                    </ProductVariantSelector.Choice>
                                  ))}
                                  {choices?.length > 3 && (
                                    <span className="text-content-muted text-xs self-center bg-surface-subtle px-2 py-1 rounded-full">
                                      +{choices.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </ProductVariantSelector.Option>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </ProductVariantSelector.Options>

              {/* Reset Selections */}
              <ProductVariantSelector.Reset>
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
              </ProductVariantSelector.Reset>

              {/* Product Description */}
              <ProductDescription>
                {({ description }) => (
                  <>
                    {description && (
                      <p
                        className="text-content-muted text-sm mb-3 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    )}
                  </>
                )}
              </ProductDescription>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex-col space-y-2">
              {/* Enhanced Price and Stock */}
              <div className="mt-auto w-full py-2">
                <div className="items-center flex justify-between">
                  <SelectedVariant.Price>
                    {({ price, compareAtPrice }) => {
                      return compareAtPrice &&
                        parseFloat(compareAtPrice.replace(/[^\d.]/g, '')) >
                          0 ? (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="text-xl font-bold text-content-primary">
                              {price}
                            </div>
                            <div className="text-sm font-medium text-content-faded line-through">
                              {compareAtPrice}
                            </div>
                          </div>
                          <div className="flex items-center justify-end">
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${available ? 'bg-status-success' : 'bg-status-error'}`}
                              ></div>
                              <span
                                className={`text-xs font-medium ${available ? 'text-status-success' : 'text-status-error'}`}
                              >
                                {available ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-between">
                          <div className="text-xl font-bold text-content-primary">
                            {price}
                          </div>
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${available ? 'bg-status-success' : 'bg-status-error'}`}
                            ></div>
                            <span
                              className={`text-xs font-medium ${available ? 'text-status-success' : 'text-status-error'}`}
                            >
                              {available ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  </SelectedVariant.Price>
                </div>
              </div>
              {/* Enhanced Action Buttons */}
              <ProductActionButtons isQuickView={true} />

              <Navigation
                data-testid="view-product-button"
                route={`${productPageRoute}/${product.slug}`}
                className="w-full"
              >
                <Button variant="secondary" size="lg" className="w-full">
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
            </CardFooter>
          </Card>
        </SelectedVariant.Root>
      </MediaGallery.Root>
    </Product>
  );
};

// Enhanced Load More Section Component
const LoadMoreSection: React.FC = () => {
  return (
    <ProductListPagination.LoadMoreTrigger>
      {({ loadMore, hasMoreProducts, isLoading }) => (
        <PrimitiveProductList.Items>
          {({ products }) =>
            hasMoreProducts ? (
              <>
                {products.length > 0 && (
                  <div className="text-center mt-12 mb-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                      </div>
                      <p className="text-content-muted text-sm mt-4">
                        {products.length} products loaded
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : null
          }
        </PrimitiveProductList.Items>
      )}
    </ProductListPagination.LoadMoreTrigger>
  );
};

export default ProductList;
