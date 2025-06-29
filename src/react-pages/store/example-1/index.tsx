import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { productsV3 } from "@wix/stores";
import { PageDocsRegistration } from "../../../components/DocsMode";
import ProductFilters from "../../../components/ProductFilters";
import StoreHeader from "../../../components/StoreHeader";
import { WixMediaImage } from "../../../headless/media/components";
import {
  FilteredCollection,
} from "../../../headless/store/components";
import {
  CatalogOptionsService,
  CatalogOptionsServiceDefinition,
} from "../../../headless/store/services/catalog-options-service";
import {
  CatalogPriceRangeService,
  CatalogPriceRangeServiceDefinition,
} from "../../../headless/store/services/catalog-price-range-service";
import {
  CategoryService,
  CategoryServiceDefinition,
} from "../../../headless/store/services/category-service";
import {
  CollectionService,
  CollectionServiceDefinition,
} from "../../../headless/store/services/collection-service";
import {
  CurrentCartService,
  CurrentCartServiceDefinition,
} from "../../../headless/ecom/services/current-cart-service";
import {
  FilterService,
  FilterServiceDefinition,
} from "../../../headless/store/services/filter-service";
import {
  SortService,
  SortServiceDefinition,
} from "../../../headless/store/services/sort-service";
import { KitchensinkLayout } from "../../../layouts/KitchensinkLayout";
import { StoreLayout } from "../../../layouts/StoreLayout";
import "../../../styles/theme-1.css";

interface StoreCollectionPageProps {
  filteredCollectionServiceConfig: any;
  currentCartServiceConfig: any;
  categoriesConfig: any;
}

const ProductGridContent = () => {
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
              currentFilters: import("../../../headless/store/services/filter-service").Filter;
              applyFilters: (
                filters: import("../../../headless/store/services/filter-service").Filter
              ) => void;
              clearFilters: () => void;
              availableOptions: import("../../../headless/store/services/filter-service").AvailableOptions;
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
                                <div className="absolute inset-0 bg-[var(--theme-bg-options)] backdrop-blur-sm rounded-xl">
                                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[var(--theme-bg-card)] via-[var(--theme-bg-options)] to-[var(--theme-bg-card)] rounded-xl">
                                    <div className="p-6 space-y-4">
                                      <div className="h-6 bg-[var(--theme-bg-primary-20)] rounded w-32"></div>
                                      <div className="space-y-3">
                                        <div className="h-10 bg-[var(--theme-bg-loading)] rounded"></div>
                                        <div className="h-10 bg-[var(--theme-bg-loading)] rounded"></div>
                                        <div className="h-16 bg-[var(--theme-bg-loading)] rounded"></div>
                                      </div>
                                      <div className="h-6 bg-[var(--theme-bg-primary-20)] rounded w-24"></div>
                                      <div className="space-y-2">
                                        <div className="h-8 bg-[var(--theme-bg-loading)] rounded"></div>
                                        <div className="h-8 bg-[var(--theme-bg-loading)] rounded"></div>
                                        <div className="h-8 bg-[var(--theme-bg-loading)] rounded"></div>
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
                        <div className="bg-[var(--theme-bg-error)] border border-[var(--theme-border-error)] rounded-xl p-4 mb-6">
                          <p className="text-[var(--theme-text-error)]">
                            {error}
                          </p>
                        </div>
                      )}

                      {/* Filter Status Bar */}
                      {isFiltered && (
                        <div className="flex items-center justify-between bg-[var(--theme-bg-primary-10)] border border-[var(--theme-border-primary-20)] rounded-xl p-4 mb-6">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-[var(--theme-text-primary-400)]"
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
                            <span className="text-[var(--theme-text-primary-300)]">
                              Showing {String(products.length)} of{" "}
                              {totalProducts} products
                            </span>
                          </div>
                          <button
                            onClick={clearFilters}
                            className="text-[var(--theme-text-primary-400)] hover:text-[var(--theme-text-primary-300)] transition-colors text-sm"
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
                              className="bg-[var(--theme-bg-card)] rounded-xl p-4 animate-pulse"
                            >
                              <div className="aspect-square bg-[var(--theme-bg-options)] rounded-lg mb-4"></div>
                              <div className="h-4 bg-[var(--theme-bg-options)] rounded mb-2"></div>
                              <div className="h-3 bg-[var(--theme-bg-options)] rounded w-2/3"></div>
                            </div>
                          ))}
                        </div>
                      ) : isEmpty ? (
                        <div className="text-center py-16">
                          <div className="w-24 h-24 bg-[var(--theme-bg-options)] rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                              className="w-12 h-12 text-[var(--theme-text-content-60)]"
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
                          <h2 className="text-2xl font-bold text-[var(--theme-text-content)] mb-4">
                            {isFiltered
                              ? "No Products Match Your Filters"
                              : "No Products Found"}
                          </h2>
                          <p className="text-[var(--theme-text-content-70)]">
                            {isFiltered
                              ? "Try adjusting your filters to see more products."
                              : "We couldn't find any products to display."}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {products.map((product: productsV3.V3Product) => (
                            <FilteredCollection.Item
                              key={product._id}
                              product={product}
                            >
                              {({
                                title,
                                image,
                                price,
                                compareAtPrice,
                                available,
                                href,
                                description,
                              }: {
                                title: string;
                                image: string | null;
                                price: string;
                                compareAtPrice: string | null;
                                available: boolean;
                                href: string;
                                description?: string;
                              }) => (
                                <div className="bg-[var(--theme-bg-card)] backdrop-blur-sm rounded-xl p-4 border border-[var(--theme-border-card)] hover:border-[var(--theme-border-card-hover)] transition-all duration-200 hover:scale-105 group h-full flex flex-col">
                                  <div className="aspect-square bg-[var(--theme-bg-options)] rounded-lg mb-4 overflow-hidden relative">
                                    {image ? (
                                      <WixMediaImage
                                        media={{ image: image }}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <svg
                                          className="w-12 h-12 text-[var(--theme-text-content-40)]"
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
                                      <span className="bg-[var(--theme-gradient-ribbon)] text-[var(--theme-text-content)] text-xs px-2 py-1 rounded-full font-medium">
                                        {product.ribbon.name}
                                      </span>
                                    </div>
                                  )}

                                  <h3 className="text-[var(--theme-text-content)] font-semibold mb-2 line-clamp-2">
                                    {title}
                                  </h3>

                                  {/* Product Options */}
                                  {product.options &&
                                    product.options.length > 0 && (
                                      <div className="mb-3 space-y-2">
                                        {product.options.map((option: any) => (
                                          <div
                                            key={option._id}
                                            className="space-y-1"
                                          >
                                            <span className="text-[var(--theme-text-content-80)] text-xs font-medium">
                                              {String(option.name)}:
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                              {option.choicesSettings?.choices
                                                ?.slice(0, 3)
                                                .map((choice: any) => {
                                                  // Check if this is a color option and if choice has color data
                                                  const isColorOption = String(
                                                    option.name
                                                  )
                                                    .toLowerCase()
                                                    .includes("color");
                                                  const hasColorCode =
                                                    choice.colorCode ||
                                                    choice.media?.image;

                                                  if (
                                                    isColorOption &&
                                                    (choice.colorCode ||
                                                      hasColorCode)
                                                  ) {
                                                    return (
                                                      <div
                                                        key={choice.choiceId}
                                                        className="relative group/color"
                                                      >
                                                        <div
                                                          className="w-6 h-6 rounded-full border-2 border-[var(--theme-color-border-40)] hover:border-[var(--theme-color-border-80)] transition-colors cursor-pointer"
                                                          style={{
                                                            backgroundColor:
                                                              choice.colorCode ||
                                                              "#000000",
                                                          }}
                                                        />
                                                        {/* Tooltip */}
                                                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[var(--theme-bg-tooltip)] text-[var(--theme-text-content)] text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                          {String(choice.name)}
                                                        </div>
                                                      </div>
                                                    );
                                                  } else {
                                                    return (
                                                      <span
                                                        key={choice.choiceId}
                                                        className="inline-flex items-center px-2 py-1 bg-[var(--theme-bg-options)] text-[var(--theme-text-content-80)] text-xs rounded border border-[var(--theme-border-primary-30)]"
                                                      >
                                                        {String(choice.name)}
                                                      </span>
                                                    );
                                                  }
                                                })}
                                              {option.choicesSettings?.choices
                                                ?.length > 3 && (
                                                <span className="text-[var(--theme-text-content-60)] text-xs">
                                                  +
                                                  {option.choicesSettings
                                                    .choices.length - 3}{" "}
                                                  more
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                  {description && (
                                    <p className="text-[var(--theme-text-content-60)] text-sm mb-3 line-clamp-2">
                                      {description}
                                    </p>
                                  )}

                                  <div className="mt-auto mb-3">
                                    <div className="space-y-1">
                                      {compareAtPrice &&
                                      parseFloat(
                                        compareAtPrice.replace(/[^\d.]/g, "")
                                      ) > 0 ? (
                                        <>
                                          <div className="text-xl font-bold text-[var(--theme-text-content)]">
                                            {price}
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-[var(--theme-text-content-50)] line-through">
                                              {compareAtPrice}
                                            </div>
                                            <div className="flex items-center gap-2">
                                              {available ? (
                                                <span className="text-[var(--theme-text-success)] text-sm">
                                                  In Stock
                                                </span>
                                              ) : (
                                                <span className="text-[var(--theme-text-error)] text-sm">
                                                  Out of Stock
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <div className="flex items-center justify-between">
                                          <div className="text-xl font-bold text-[var(--theme-text-content)]">
                                            {price}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {available ? (
                                              <span className="text-[var(--theme-text-success)] text-sm">
                                                In Stock
                                              </span>
                                            ) : (
                                              <span className="text-[var(--theme-text-error)] text-sm">
                                                Out of Stock
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <a
                                      href={href.replace(
                                        "/store/products/",
                                        "/store/example-1/"
                                      )}
                                      className="mt-4 w-full text-[var(--theme-text-content)] font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                      style={{
                                        background: "var(--theme-btn-primary)",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                          "var(--theme-btn-primary-hover)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                          "var(--theme-btn-primary)";
                                      }}
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
                                    </a>
                                  </div>
                                </div>
                              )}
                            </FilteredCollection.Item>
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

const LoadMoreSection = () => {
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
                      className="text-[var(--theme-text-content)] font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      style={{
                        background: isLoading
                          ? "linear-gradient(to right, #6b7280, #374151)"
                          : "var(--theme-btn-primary)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background =
                            "var(--theme-btn-primary-hover)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background =
                            "var(--theme-btn-primary)";
                        }
                      }}
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
                      className="text-[var(--theme-text-content)] font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "var(--theme-btn-secondary)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background =
                            "var(--theme-btn-secondary-hover)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background =
                            "var(--theme-btn-secondary)";
                        }
                      }}
                    >
                      Refresh Products
                    </button>
                  </div>
                  <p className="text-[var(--theme-text-content-60)] text-sm mt-4">
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

export default function StoreCollectionPage({
  filteredCollectionServiceConfig,
  currentCartServiceConfig,
  categoriesConfig,
}: StoreCollectionPageProps) {
  // Create navigation handler for example-1 specific URLs
  const handleCategoryChange = (categoryId: string | null, category: any) => {
    if (typeof window !== "undefined") {
      const basePath = "/store/example-1";
      let newPath;

      if (categoryId === null) {
        // No category selected - fallback to base path
        newPath = basePath;
      } else {
        // Use category slug for URL
        if (!category?.slug) {
          console.warn(
            `Category ${categoryId} has no slug, using category ID as fallback`
          );
        }
        const categorySlug = category?.slug || categoryId;
        newPath = `${basePath}/category/${categorySlug}`;
      }

      window.location.href = newPath;
    }
  };

  const servicesManager = createServicesManager(
    createServicesMap()
      .addService(
        CollectionServiceDefinition,
        CollectionService,
        filteredCollectionServiceConfig
      )
      .addService(
        FilterServiceDefinition,
        FilterService,
        filteredCollectionServiceConfig
      )
      .addService(
        CurrentCartServiceDefinition,
        CurrentCartService,
        currentCartServiceConfig
      )
      .addService(CategoryServiceDefinition, CategoryService, {
        ...categoriesConfig,
        onCategoryChange: handleCategoryChange,
      })
      .addService(SortServiceDefinition, SortService, {
        initialSort: filteredCollectionServiceConfig.initialSort,
      })
      .addService(
        CatalogPriceRangeServiceDefinition,
        CatalogPriceRangeService,
        {}
      )
      .addService(CatalogOptionsServiceDefinition, CatalogOptionsService, {})
  );

  return (
    <KitchensinkLayout>
      <PageDocsRegistration
        title="Product Collection - Example 1"
        description="Browse our collection of amazing products with advanced filtering."
        docsUrl="/docs/examples/store-collection-overview"
      />
      <StoreLayout
        currentCartServiceConfig={currentCartServiceConfig}
        servicesManager={servicesManager}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--theme-text-content)] mb-4">
              Product Collection - Example 1
            </h1>
            <p className="text-[var(--theme-text-content-70)] text-lg">
              Browse our collection of amazing products with advanced filtering
            </p>
          </div>

          <ProductGridContent />
          <LoadMoreSection />
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
