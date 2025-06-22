import { createServicesManager, createServicesMap } from "@wix/services-manager";
import { KitchensinkLayout } from "../../../layouts/KitchensinkLayout";
import { StoreLayout } from "../../../layouts/StoreLayout";
import { FilterServiceDefinition, FilterService } from "../../../headless/store/filter-service";
import { CollectionServiceDefinition, CollectionService } from "../../../headless/store/collection-service";
import { CurrentCartServiceDefinition, CurrentCartService } from "../../../headless/store/current-cart-service";
import { FilteredCollection } from "../../../headless/store/FilteredCollection";
import { withDocsWrapper } from "../../../components/DocsMode";
import WixMediaImage from "../../../headless/media/Image";
import ProductFilters from "../../../components/ProductFilters";
import StoreHeader from "../../../components/StoreHeader";
import { CategoryService, CategoryServiceDefinition } from "../../../headless/store/category-service";
import { SortService, SortServiceDefinition } from "../../../headless/store/sort-service";

interface StoreCollectionPageProps {
  filteredCollectionServiceConfig: any;
  currentCartServiceConfig: any;
  categoriesConfig: any;
}

const ProductGridContent = () => {
  return (
    <FilteredCollection.Provider>
      <FilteredCollection.Grid>
        {withDocsWrapper(
          ({ products, isLoading, error, isEmpty, totalProducts }) => (
            <FilteredCollection.Filters>
              {withDocsWrapper(
                ({ currentFilters, applyFilters, clearFilters, availableOptions, isFiltered }) => {

                  return (
                    <div className="min-h-screen">
                      <StoreHeader className="mb-6" />

                      {/* Main Layout with Sidebar and Content */}
                      <div className="flex gap-8">
                        {/* Filters Sidebar */}
                        <div className="w-80 flex-shrink-0">
                          <div className="sticky top-6">
                            <ProductFilters
                              onFiltersChange={applyFilters}
                              availableOptions={availableOptions}
                              clearFilters={clearFilters}
                              currentFilters={currentFilters}
                              isFiltered={isFiltered}
                            />
                          </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 min-w-0">
                          {/* Filter Status Bar */}
                          {isFiltered && (
                            <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-blue-400"
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
                                <span className="text-blue-300">
                                  Showing {String(products.length)} of {totalProducts} products
                                </span>
                              </div>
                              <button
                                onClick={clearFilters}
                                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                              >
                                Clear Filters
                              </button>
                            </div>
                          )}

                          {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                              <p className="text-red-400">{error}</p>
                            </div>
                          )}

                          {isLoading && products.length === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="bg-white/5 rounded-xl p-4 animate-pulse"
                                >
                                  <div className="aspect-square bg-white/10 rounded-lg mb-4"></div>
                                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                                </div>
                              ))}
                            </div>
                          ) : isEmpty ? (
                            <div className="text-center py-16">
                              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                  className="w-12 h-12 text-white/60"
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
                              <h2 className="text-2xl font-bold text-white mb-4">
                                {isFiltered ? "No Products Match Your Filters" : "No Products Found"}
                              </h2>
                              <p className="text-white/70">
                                {isFiltered
                                  ? "Try adjusting your filters to see more products."
                                  : "We couldn't find any products to display."
                                }
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {products.map((product) => (
                                <FilteredCollection.Item key={product._id} product={product}>
                                  {withDocsWrapper(
                                    ({
                                      title,
                                      image,
                                      price,
                                      available,
                                      href,
                                      description,
                                    }) => (
                                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 group">
                                        <div className="aspect-square bg-white/10 rounded-lg mb-4 overflow-hidden">
                                          {image ? (
                                            <WixMediaImage
                                              media={{ image: image }}
                                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                              <svg
                                                className="w-12 h-12 text-white/40"
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

                                        <h3 className="text-white font-semibold mb-2 line-clamp-2">
                                          {title}
                                        </h3>

                                        {/* Product Options */}
                                        {product.options && product.options.length > 0 && (
                                          <div className="mb-3 space-y-2">
                                            {product.options.map((option: any) => (
                                              <div key={option._id} className="space-y-1">
                                                <span className="text-white/80 text-xs font-medium">
                                                  {String(option.name)}:
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                  {option.choicesSettings?.choices?.slice(0, 3).map((choice: any) => {
                                                    // Check if this is a color option and if choice has color data
                                                    const isColorOption = String(option.name).toLowerCase().includes('color');
                                                    const hasColorCode = choice.colorCode || (choice.media?.image);

                                                    if (isColorOption && (choice.colorCode || hasColorCode)) {
                                                      return (
                                                        <div
                                                          key={choice.choiceId}
                                                          className="relative group/color"
                                                        >
                                                          <div
                                                            className="w-6 h-6 rounded-full border-2 border-white/30 hover:border-white/60 transition-colors cursor-pointer"
                                                            style={{
                                                              backgroundColor: choice.colorCode || '#000000'
                                                            }}
                                                          />
                                                          {/* Tooltip */}
                                                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                            {String(choice.name)}
                                                          </div>
                                                        </div>
                                                      );
                                                    } else {
                                                      return (
                                                        <span
                                                          key={choice.choiceId}
                                                          className="inline-flex items-center px-2 py-1 bg-white/10 text-white/90 text-xs rounded border border-white/20"
                                                        >
                                                          {String(choice.name)}
                                                        </span>
                                                      );
                                                    }
                                                  })}
                                                  {option.choicesSettings?.choices?.length > 3 && (
                                                    <span className="text-white/60 text-xs">
                                                      +{option.choicesSettings.choices.length - 3} more
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {description && (
                                          <p className="text-white/60 text-sm mb-3 line-clamp-2">
                                            {description}
                                          </p>
                                        )}

                                        <div className="flex items-center justify-between">
                                          <span className="text-xl font-bold text-white">
                                            {price}
                                          </span>
                                          <div className="flex items-center gap-2">
                                            {available ? (
                                              <span className="text-green-400 text-sm">
                                                In Stock
                                              </span>
                                            ) : (
                                              <span className="text-red-400 text-sm">
                                                Out of Stock
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        <a
                                          href={href.replace(
                                            "/store/products/",
                                            "/store/example-1/"
                                          )}
                                          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
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
                                    ),
                                    "FilteredCollection.Item",
                                    "/docs/components/filtered-collection#item"
                                  )}
                                </FilteredCollection.Item>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                },
                "FilteredCollection.Filters",
                "/docs/components/filtered-collection#filters"
              )}
            </FilteredCollection.Filters>
          ),
          "FilteredCollection.Grid",
          "/docs/components/filtered-collection#grid"
        )}
      </FilteredCollection.Grid>
    </FilteredCollection.Provider>
  );
};

const LoadMoreSection = () => {
  return (
    <FilteredCollection.Provider>
      <FilteredCollection.LoadMore>
        {withDocsWrapper(
          ({ loadMore, isLoading, totalProducts, hasMoreProducts }) => hasMoreProducts && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                  </>
                ) : (
                  <>
                    Load More Products
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
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </>
                )}
              </button>
              <p className="text-white/60 text-sm mt-4">
                {totalProducts} products loaded
              </p>
            </div>
          ),
          "FilteredCollection.LoadMore",
          "/docs/components/filtered-collection#loadmore"
        )}
      </FilteredCollection.LoadMore>
    </FilteredCollection.Provider>
  );
};

export default function StoreCollectionPage({
  filteredCollectionServiceConfig,
  currentCartServiceConfig,
  categoriesConfig,
}: StoreCollectionPageProps) {
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
      .addService(
        CategoryServiceDefinition,
        CategoryService,
        categoriesConfig
      )
      .addService(
        SortServiceDefinition,
        SortService,
        {}
      )
  );

  return (
    <KitchensinkLayout>
      <StoreLayout
        currentCartServiceConfig={currentCartServiceConfig}
        servicesManager={servicesManager}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Product Collection - Example 1
            </h1>
            <p className="text-white/70 text-lg">
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

