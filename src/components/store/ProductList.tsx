import { CurrentCart } from '@wix/headless-ecom/react';
import type { LineItem } from '@wix/headless-ecom/services';
import {
  MediaGalleryService,
  MediaGalleryServiceDefinition,
} from '@wix/headless-media/services';
import {
  Product,
  ProductActions,
  ProductVariantSelector,
  SelectedVariant,
} from '@wix/headless-stores/react';
import {
  SelectedVariantService,
  SelectedVariantServiceDefinition,
} from '@wix/headless-stores/services';
import { createServicesMap } from '@wix/services-manager';
import { WixServices } from '@wix/services-manager-react';
import { productsV3 } from '@wix/stores';
import { useEffect, useState } from 'react';
import { WixMediaImage } from '../../headless/media/components';
import type { CategoriesListServiceConfig } from '../../pages/store/example-1/categories-list';
import { ProductsList } from '../../pages/store/example-1/products-list-components';
import { ProductsListFilters } from '../../pages/store/example-1/products-list-filters-components';
import { ProductsListPagination } from '../../pages/store/example-1/products-list-pagination-components';
import { useNavigation } from '../NavigationContext';
import { ProductActionButtons } from './ProductActionButtons';
import ProductFilters from './ProductFilters';
import QuickViewModal from './QuickViewModal';
import StoreHeader from './StoreHeader';

export const ProductGridContent = ({
  productPageRoute,
  categoriesListConfig,
  currentCategorySlug,
}: {
  productPageRoute: string;
  categoriesListConfig: CategoriesListServiceConfig;
  currentCategorySlug: string;
}) => {
  const Navigation = useNavigation();
  const [quickViewProduct, setQuickViewProduct] =
    useState<productsV3.V3Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product: productsV3.V3Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setQuickViewProduct(null), 300); // Allow animation to complete
  };

  const ProductItem = ({ product }: { product: productsV3.V3Product }) => {
    // Create services for each product - reuse the parent's CurrentCartService instance
    const servicesMap = createServicesMap()
      .addService(SelectedVariantServiceDefinition, SelectedVariantService, {
        fetchInventoryData: false,
      })
      .addService(MediaGalleryServiceDefinition, MediaGalleryService, {
        media: product?.media?.itemsInfo?.items ?? [],
      });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const availabilityStatus = product.inventory?.availabilityStatus;
    const available =
      availabilityStatus === productsV3.InventoryAvailabilityStatus.IN_STOCK ||
      availabilityStatus ===
        productsV3.InventoryAvailabilityStatus.PARTIALLY_OUT_OF_STOCK;

    return (
      <WixServices servicesMap={servicesMap}>
        <div
          data-testid="product-item"
          data-product-id={product._id}
          data-product-available={available}
          className="relative bg-surface-card backdrop-blur-sm rounded-xl p-4 border border-surface-primary hover:border-surface-hover transition-all duration-200 hover:scale-105 group h-full flex flex-col relative"
        >
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-status-success-light/90 backdrop-blur-sm border border-status-success rounded-lg px-4 py-2 text-status-success text-base font-bold text-center shadow-md animate-bounce">
                Added to Cart!
              </div>
            </div>
          )}

          <CurrentCart.LineItemAdded>
            {({ onAddedToCart }) => {
              useEffect(() => {
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

            {/* Quick View Button - appears on hover */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-2 group-hover:translate-y-0">
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  openQuickView(product);
                }}
                className="bg-gradient-primary text-white px-4 py-2 rounded-lg border border-surface-primary shadow-lg flex items-center gap-2 font-medium bg-gradient-primary-hover transition-all duration-200 whitespace-nowrap"
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
              </button>
            </div>
          </div>

          {product.ribbon?.name && (
            <div className="absolute top-2 left-2">
              <span className="bg-gradient-ribbon text-content-primary text-xs px-2 py-1 rounded-full font-medium">
                {product.ribbon.name}
              </span>
            </div>
          )}

          <Navigation
            data-testid="title-navigation"
            route={`${productPageRoute}/${product.slug}`}
          >
            <h3 className="text-content-primary font-semibold mb-2 line-clamp-2">
              {product.name}
            </h3>
          </Navigation>

          {/* Product Options */}
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
                          <div className="space-y-1">
                            <span className="text-content-secondary text-xs font-medium">
                              {String(name)}:
                            </span>
                            <div className="flex flex-wrap gap-1">
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
                                    onSelect,
                                  }) => {
                                    // Check if this is a color option and if choice has color data
                                    const isColorOption = String(name)
                                      .toLowerCase()
                                      .includes('color');
                                    const hasColorCode =
                                      choice.colorCode || choice.media?.image;

                                    // Only render if visible
                                    if (!isVisible) return null;

                                    if (
                                      isColorOption &&
                                      (choice.colorCode || hasColorCode)
                                    ) {
                                      return (
                                        <div className="relative group/color">
                                          <div
                                            className={`w-6 h-6 rounded-full border-2 transition-colors cursor-pointer ${
                                              isSelected
                                                ? 'border-brand-primary shadow-md ring-1 ring-brand-primary/30'
                                                : 'border-color-swatch hover:border-color-swatch-hover'
                                            } ${
                                              !isInStock && !isPreOrderEnabled
                                                ? 'grayscale opacity-50'
                                                : ''
                                            }`}
                                            style={{
                                              backgroundColor:
                                                choice.colorCode ||
                                                'var(--theme-fallback-color)',
                                            }}
                                            onClick={onSelect}
                                          />
                                          {/* Stock indicator for color swatches */}
                                          {!isInStock && !isPreOrderEnabled && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                              <svg
                                                className="w-3 h-3 text-status-error"
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
                                          {/* Tooltip */}
                                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-surface-tooltip text-content-primary text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                            {String(value)}
                                            {!isInStock &&
                                              !isPreOrderEnabled &&
                                              ' (Out of Stock)'}
                                          </div>
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <span
                                          className={`inline-flex items-center px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
                                            isSelected
                                              ? 'bg-brand-primary text-content-primary border-brand-primary'
                                              : 'bg-surface-primary text-content-secondary border-brand-medium hover:border-brand-primary'
                                          } ${
                                            !isInStock && !isPreOrderEnabled
                                              ? 'opacity-50 line-through'
                                              : ''
                                          }`}
                                          onClick={onSelect}
                                        >
                                          {String(value)}
                                        </span>
                                      );
                                    }
                                  }}
                                </ProductVariantSelector.Choice>
                              ))}
                              {choices?.length > 3 && (
                                <span className="text-content-muted text-xs">
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

          <ProductVariantSelector.Reset>
            {({ onReset, hasSelections }) =>
              hasSelections && (
                <div className="pt-4">
                  <button
                    onClick={onReset}
                    className="text-sm text-brand-primary hover:text-brand-light transition-colors"
                  >
                    Reset Selections
                  </button>
                </div>
              )
            }
          </ProductVariantSelector.Reset>

          <Product.Description>
            {({ plainDescription }) => (
              <>
                {plainDescription && (
                  <p
                    className="text-content-muted text-sm mb-3 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: plainDescription,
                    }}
                  />
                )}
              </>
            )}
          </Product.Description>

          <div className="mt-auto mb-3">
            <div className="space-y-1">
              <SelectedVariant.Price>
                {({ price, compareAtPrice }) => {
                  return compareAtPrice &&
                    parseFloat(compareAtPrice.replace(/[^\d.]/g, '')) > 0 ? (
                    <>
                      <div className="text-xl font-bold text-content-primary">
                        {price}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-content-faded line-through">
                          {compareAtPrice}
                        </div>
                        <div className="flex items-center gap-2">
                          {available ? (
                            <span className="text-status-success text-sm">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-status-error text-sm">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-content-primary">
                        {price}
                      </div>
                      <div className="flex items-center gap-2">
                        {available ? (
                          <span className="text-status-success text-sm">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-status-error text-sm">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }}
              </SelectedVariant.Price>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Add to Cart Button */}
            <ProductActions.Actions>
              {({ error }) => (
                <div className="space-y-2">
                  {error && (
                    <div className="bg-status-danger-light border border-status-danger rounded-lg p-2">
                      <p className="text-status-error text-xs">{error}</p>
                    </div>
                  )}

                  <ProductActionButtons
                    isQuickView={true} // This will hide the Buy Now button for list items
                  />
                </div>
              )}
            </ProductActions.Actions>

            {/* View Product Button */}
            <Navigation
              data-testid="view-product-button"
              route={`${productPageRoute}/${product.slug}`}
              className="w-full text-content-primary font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 btn-secondary"
            >
              View Product
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Navigation>
          </div>
        </div>
      </WixServices>
    );
  };

  return (
    <div className="min-h-screen">
      <StoreHeader
        className="mb-6"
        categoriesListConfig={categoriesListConfig}
        currentCategorySlug={currentCategorySlug}
      />

      {/* Main Layout with Sidebar and Content */}
      <ProductsListFilters.Root>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <div className="relative">
                <ProductFilters />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <ProductsList.Error>
              {({ error }) => (
                <div className="bg-surface-error border border-status-error rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-status-error text-sm sm:text-base">
                    {error}
                  </p>
                </div>
              )}
            </ProductsList.Error>

            {/* Filter Status Bar */}
            <ProductsListFilters.ResetTrigger>
              {({ resetFilters, isFiltered }) =>
                isFiltered && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 filter-status-bar rounded-xl p-4 mb-6">
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
                        <ProductsList.Items>
                          {({ products }) =>
                            `Showing ${String(products.length)}`
                          }
                        </ProductsList.Items>
                      </span>
                    </div>
                    <button
                      onClick={resetFilters}
                      className="text-brand-primary hover:text-brand-light transition-colors text-sm self-start sm:self-auto"
                    >
                      Clear Filters
                    </button>
                  </div>
                )
              }
            </ProductsListFilters.ResetTrigger>

            <ProductsList.Loading>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-surface-card rounded-xl p-4 animate-pulse"
                  >
                    <div className="aspect-square bg-surface-primary rounded-lg mb-4"></div>
                    <div className="h-4 bg-surface-primary rounded mb-2"></div>
                    <div className="h-3 bg-surface-primary rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </ProductsList.Loading>

            <ProductsList.EmptyState>
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-surface-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
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
                <ProductsListFilters.ResetTrigger>
                  {({ isFiltered }) => (
                    <>
                      <h2 className="text-xl sm:text-2xl font-bold text-content-primary mb-3 sm:mb-4">
                        {isFiltered
                          ? 'No Products Match Your Filters'
                          : 'No Products Found'}
                      </h2>
                      <p className="text-content-light text-sm sm:text-base">
                        {isFiltered
                          ? 'Try adjusting your filters to see more products.'
                          : "We couldn't find any products to display."}
                      </p>
                    </>
                  )}
                </ProductsListFilters.ResetTrigger>
              </div>
            </ProductsList.EmptyState>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <ProductsList.ItemContent>
                {({ product }) => <ProductItem product={product} />}
              </ProductsList.ItemContent>
            </div>
          </div>
        </div>
      </ProductsListFilters.Root>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={closeQuickView}
          productPageRoute={productPageRoute}
        />
      )}
    </div>
  );
};

export const LoadMoreSection = () => {
  return (
    <ProductsListPagination.LoadMore>
      {({ loadMore, hasMoreProducts, isLoading }) => (
        <ProductsList.Items>
          {({ products }) =>
            hasMoreProducts ? (
              <>
                {products.length > 0 && (
                  <div className="text-center mt-12">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => loadMore(10)}
                        disabled={isLoading}
                        className={`text-content-primary font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                          isLoading ? 'bg-surface-loading' : 'btn-primary'
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
                      </button>
                    </div>
                    <p className="text-content-muted text-sm mt-4">
                      {products.length} products loaded
                    </p>
                  </div>
                )}
              </>
            ) : null
          }
        </ProductsList.Items>
      )}
    </ProductsListPagination.LoadMore>
  );
};
