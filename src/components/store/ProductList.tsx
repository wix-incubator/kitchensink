import React from "react";
import { productsV3 } from "@wix/stores";
import ProductFilters from "./ProductFilters";
import StoreHeader from "./StoreHeader";
import { WixMediaImage } from "../../headless/media/components";
import {
  FilteredCollection,
  ProductVariantSelector,
} from "../../headless/store/components";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  ProductService,
  ProductServiceDefinition,
} from "../../headless/store/services/product-service";
import {
  SelectedVariantService,
  SelectedVariantServiceDefinition,
} from "../../headless/store/services/selected-variant-service";
import {
  CurrentCartService,
  CurrentCartServiceDefinition,
} from "../../headless/ecom/services/current-cart-service";
import {
  MediaGalleryService,
  MediaGalleryServiceDefinition,
} from "../../headless/media/services/media-gallery-service";
import { useState } from "react";
import { useService } from "@wix/services-manager-react";
import { useNavigation } from "../NavigationContext";

// Variants are now handled automatically by the SelectedVariantService

// Enhanced Product Item component - variants are now handled by the service
const ProductItemWithVariants = ({
  product,
  productPageRoute,
}: {
  product: productsV3.V3Product;
  productPageRoute: string;
}) => {
  const Navigation = useNavigation();
  const currentCartService = useService(CurrentCartServiceDefinition);

  // Create services for each product - the SelectedVariantService will handle variant fetching
  const servicesMap = createServicesMap()
    .addService(ProductServiceDefinition, ProductService, {
      product: product,
    })
    .addService(
      CurrentCartServiceDefinition,
      CurrentCartService,
      currentCartService
    )
    .addService(SelectedVariantServiceDefinition, SelectedVariantService)
    .addService(MediaGalleryServiceDefinition, MediaGalleryService, {
      media: product?.media?.itemsInfo?.items ?? [],
    });
  const [servicesManager] = useState(() => createServicesManager(servicesMap));

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <FilteredCollection.Item product={product}>
        {({
          title,
          image,
          price,
          compareAtPrice,
          available,
          slug,
          description,
        }) => (
          <div className="bg-surface-card backdrop-blur-sm rounded-xl p-4 border border-surface-primary hover:border-surface-hover transition-all duration-200 hover:scale-105 group h-full flex flex-col">
            <div className="aspect-square bg-surface-primary rounded-lg mb-4 overflow-hidden relative">
              {image ? (
                <WixMediaImage
                  media={{ image: image }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
            </div>

            {product.ribbon?.name && (
              <div className="absolute top-2 left-2">
                <span className="bg-gradient-ribbon text-content-primary text-xs px-2 py-1 rounded-full font-medium">
                  {product.ribbon.name}
                </span>
              </div>
            )}

            <h3 className="text-content-primary font-semibold mb-2 line-clamp-2">
              {title}
            </h3>

            {/* Interactive Product Variant Selection */}
            <div className="mb-4 space-y-3">
              <ProductVariantSelector.Options>
                {({ options, hasOptions, selectedChoices }) => (
                  <>
                    {hasOptions &&
                      options.map((option: any) => (
                        <ProductVariantSelector.Option
                          key={option.name}
                          option={option}
                        >
                          {({ name, choices, hasChoices }) => (
                            <div className="space-y-2">
                              <h4 className="text-content-primary text-sm font-medium">
                                {String(name)}
                              </h4>
                              {hasChoices && (
                                <div className="flex flex-wrap gap-2">
                                  {choices.map((choice: any) => {
                                    const isColorOption =
                                      String(name)
                                        .toLowerCase()
                                        .includes("color") ||
                                      option.optionRenderType ===
                                        "SWATCH_CHOICES";

                                    return (
                                      <ProductVariantSelector.Choice
                                        key={choice.choiceId || choice.name}
                                        option={option}
                                        choice={choice}
                                      >
                                        {({
                                          value,
                                          isSelected,
                                          isVisible,
                                          isInStock,
                                          onSelect,
                                        }) => {
                                          if (
                                            isColorOption &&
                                            choice.colorCode
                                          ) {
                                            return (
                                              <div className="relative">
                                                <button
                                                  onClick={onSelect}
                                                  className={`w-8 h-8 rounded-full border-4 transition-all duration-200 ${
                                                    isSelected
                                                      ? "border-brand-primary shadow-lg scale-110 ring-2 ring-brand-primary/30"
                                                      : "border-brand-light hover:border-brand-medium hover:scale-105"
                                                  }`}
                                                  style={{
                                                    backgroundColor:
                                                      choice.colorCode,
                                                  }}
                                                  title={`${String(
                                                    value || choice.name
                                                  )} ${
                                                    !isInStock
                                                      ? "(Out of Stock)"
                                                      : ""
                                                  }`}
                                                />
                                                {!isInStock && (
                                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <svg
                                                      className="w-4 h-4 text-status-error"
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
                                            );
                                          }

                                          return (
                                            <div className="relative">
                                              <button
                                                onClick={onSelect}
                                                disabled={!isInStock}
                                                className={`px-3 py-1.5 border rounded-lg transition-all duration-200 text-sm ${
                                                  isSelected
                                                    ? "product-option-active"
                                                    : "product-option-inactive"
                                                } ${
                                                  !isInStock
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                }`}
                                              >
                                                {String(value || choice.name)}
                                              </button>
                                              {!isInStock && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                  <svg
                                                    className="w-4 h-4 text-status-error"
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
                                          );
                                        }}
                                      </ProductVariantSelector.Choice>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </ProductVariantSelector.Option>
                      ))}
                  </>
                )}
              </ProductVariantSelector.Options>
            </div>

            {/* Variant loading is now handled by the service */}

            {/* Real-time Stock Status */}
            <ProductVariantSelector.Stock>
              {({ inStock, isPreOrderEnabled, status }) => (
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      inStock
                        ? "bg-status-success"
                        : isPreOrderEnabled
                        ? "bg-status-warning"
                        : "bg-status-error"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      inStock
                        ? "text-status-success"
                        : isPreOrderEnabled
                        ? "text-status-warning"
                        : "text-status-error"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              )}
            </ProductVariantSelector.Stock>

            {description && (
              <p className="text-content-muted text-sm mb-3 line-clamp-2">
                {description}
              </p>
            )}

            {/* Dynamic Pricing based on selected variant */}
            <div className="mt-auto mb-3">
              <ProductVariantSelector.Trigger>
                {({ price: variantPrice }) => (
                  <div className="space-y-1">
                    {compareAtPrice &&
                    parseFloat(compareAtPrice.replace(/[^\d.]/g, "")) > 0 ? (
                      <>
                        <div className="text-xl font-bold text-content-primary">
                          {variantPrice || price}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-content-faded line-through">
                            {compareAtPrice}
                          </div>
                          {variantPrice && variantPrice !== price && (
                            <div className="text-xs text-brand-primary">
                              Selected variant
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-content-primary">
                          {variantPrice || price}
                        </div>
                        {variantPrice && variantPrice !== price && (
                          <div className="text-xs text-brand-primary">
                            Selected variant
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </ProductVariantSelector.Trigger>
            </div>

            <div className="space-y-2">
              {/* Enhanced Add to Cart Button with variant selection */}
              <ProductVariantSelector.Trigger>
                {({
                  onAddToCart,
                  canAddToCart,
                  isLoading,
                  inStock,
                  isPreOrderEnabled,
                  error,
                  availableQuantity,
                }) => (
                  <div className="space-y-1">
                    <button
                      onClick={onAddToCart}
                      disabled={!canAddToCart || isLoading}
                      className={`w-full py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
                        !inStock && isPreOrderEnabled
                          ? "bg-status-warning text-content-primary hover:bg-status-warning-hover"
                          : "btn-primary"
                      }`}
                      title={
                        !canAddToCart && !isLoading
                          ? "Please select all required options"
                          : ""
                      }
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </div>
                      ) : !inStock && isPreOrderEnabled ? (
                        "Pre Order"
                      ) : (
                        "Add to Cart"
                      )}
                    </button>

                    {/* Show error if any */}
                    {error && (
                      <div className="text-xs text-status-error text-center">
                        {error}
                      </div>
                    )}

                    {/* Show available quantity if limited */}
                    {availableQuantity !== null &&
                      availableQuantity < 10 &&
                      availableQuantity > 0 && (
                        <div className="text-xs text-status-warning text-center">
                          Only {availableQuantity} left
                        </div>
                      )}
                  </div>
                )}
              </ProductVariantSelector.Trigger>

              {/* Keep existing View Product button */}
              <Navigation
                route={`${productPageRoute}/${slug}`}
                className="w-full text-content-secondary hover:text-content-primary font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 btn-secondary text-sm"
              >
                View Details
                <svg
                  className="w-3 h-3"
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
        )}
      </FilteredCollection.Item>
    </ServicesManagerProvider>
  );
};

export const ProductGridContent = ({
  productPageRoute,
}: {
  productPageRoute: string;
}) => {
  const currentCartService = useService(CurrentCartServiceDefinition);

  return (
    <FilteredCollection.Provider>
      <FilteredCollection.Grid>
        {({
          products,
          isLoading,
          error,
          isEmpty,
          totalProducts,
        }: {
          products: productsV3.V3Product[];
          isLoading: boolean;
          error: string | null;
          isEmpty: boolean;
          totalProducts: number;
          hasMoreProducts: boolean;
        }) => (
          <FilteredCollection.Filters>
            {({
              currentFilters,
              applyFilters,
              clearFilters,
              availableOptions,
              isFiltered,
            }: {
              currentFilters: import("../../headless/store/services/filter-service").Filter;
              applyFilters: (
                filters: import("../../headless/store/services/filter-service").Filter
              ) => void;
              clearFilters: () => void;
              availableOptions: import("../../headless/store/services/filter-service").AvailableOptions;
              isFiltered: boolean;
              allProducts: productsV3.V3Product[];
            }) => {
              return (
                <div className="min-h-screen">
                  <StoreHeader className="mb-6" />

                  {/* Main Layout with Sidebar and Content */}
                  <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-80 flex-shrink-0">
                      <div className="sticky top-6">
                        <FilteredCollection.FiltersLoading>
                          {({ isFullyLoaded }) => (
                            <div className="relative">
                              <ProductFilters
                                availableOptions={availableOptions}
                                onFiltersChange={applyFilters}
                                clearFilters={clearFilters}
                                currentFilters={currentFilters}
                                isFiltered={isFiltered}
                              />

                              {/* Pulse Loading Overlay */}
                              {!isFullyLoaded && (
                                <div className="absolute inset-0 bg-surface-primary backdrop-blur-sm rounded-xl">
                                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-bg-surface-card via-bg-surface-primary to-bg-surface-card rounded-xl">
                                    <div className="p-6 space-y-4">
                                      <div className="h-6 bg-brand-medium rounded w-32"></div>
                                      <div className="space-y-3">
                                        <div className="h-10 bg-surface-loading rounded"></div>
                                        <div className="h-10 bg-surface-loading rounded"></div>
                                        <div className="h-16 bg-surface-loading rounded"></div>
                                      </div>
                                      <div className="h-6 bg-brand-medium rounded w-24"></div>
                                      <div className="space-y-2">
                                        <div className="h-8 bg-surface-loading rounded"></div>
                                        <div className="h-8 bg-surface-loading rounded"></div>
                                        <div className="h-8 bg-surface-loading rounded"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </FilteredCollection.FiltersLoading>
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                      {error && (
                        <div className="bg-surface-error border border-status-error rounded-xl p-4 mb-6">
                          <p className="text-status-error">{error}</p>
                        </div>
                      )}

                      {/* Filter Status Bar */}
                      {isFiltered && (
                        <div className="flex items-center justify-between filter-status-bar rounded-xl p-4 mb-6">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-brand-primary"
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
                            <span className="text-brand-light">
                              Showing {String(products.length)} of{" "}
                              {totalProducts} products
                            </span>
                          </div>
                          <button
                            onClick={clearFilters}
                            className="text-brand-primary hover:text-brand-light transition-colors text-sm"
                          >
                            Clear Filters
                          </button>
                        </div>
                      )}

                      {isLoading && products.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      ) : isEmpty ? (
                        <div className="text-center py-16">
                          <div className="w-24 h-24 bg-surface-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                              className="w-12 h-12 text-content-muted"
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
                          <h2 className="text-2xl font-bold text-content-primary mb-4">
                            {isFiltered
                              ? "No Products Match Your Filters"
                              : "No Products Found"}
                          </h2>
                          <p className="text-content-light">
                            {isFiltered
                              ? "Try adjusting your filters to see more products."
                              : "We couldn't find any products to display."}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {products.map((product) => (
                            <ProductItemWithVariants
                              key={product._id}
                              product={product}
                              productPageRoute={productPageRoute}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          </FilteredCollection.Filters>
        )}
      </FilteredCollection.Grid>
    </FilteredCollection.Provider>
  );
};

export const LoadMoreSection = () => {
  return (
    <FilteredCollection.Provider>
      <FilteredCollection.LoadMore>
        {({
          loadMore,
          refresh,
          isLoading,
          hasProducts,
          totalProducts,
          hasMoreProducts,
        }: {
          loadMore: () => Promise<void>;
          refresh: () => Promise<void>;
          isLoading: boolean;
          hasProducts: boolean;
          totalProducts: number;
          hasMoreProducts: boolean;
        }) =>
          hasMoreProducts ? (
            <>
              {hasProducts && totalProducts > 0 && (
                <div className="text-center mt-12">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={loadMore}
                      disabled={isLoading}
                      className={`text-content-primary font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                        isLoading ? "bg-surface-loading" : "btn-primary"
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
                        "Load More Products"
                      )}
                    </button>

                    <button
                      onClick={refresh}
                      disabled={isLoading}
                      className="text-content-primary font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed btn-secondary"
                    >
                      Refresh Products
                    </button>
                  </div>
                  <p className="text-content-muted text-sm mt-4">
                    {totalProducts} products loaded
                  </p>
                </div>
              )}
            </>
          ) : null
        }
      </FilteredCollection.LoadMore>
    </FilteredCollection.Provider>
  );
};

export default function ProductList({
  productPageRoute,
}: {
  productPageRoute: string;
}) {
  return (
    <div>
      <ProductGridContent productPageRoute={productPageRoute} />
      <LoadMoreSection />
    </div>
  );
}
