import React from "react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { KitchensinkLayout } from "../../../layouts/KitchensinkLayout";
import { StoreLayout } from "../../../layouts/StoreLayout";
import {
  withDocsWrapper,
  PageDocsRegistration,
} from "../../../components/DocsMode";
import {
  CollectionServiceDefinition,
  CollectionService,
} from "../../../headless/store/collection-service";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../../../headless/store/current-cart-service";
import { Collection } from "../../../headless/store/Collection";
import { CurrentCart } from "../../../headless/store/CurrentCart";

interface StoreExample2PageProps {
  collectionServiceConfig: any;
  currentCartServiceConfig: any;
}

const ProductGridContent = () => {
  return (
    <Collection.ProductGrid>
      {withDocsWrapper(
        ({ products, isLoading, error, isEmpty }) => (
          <div className="min-h-screen">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {isLoading && products.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  No Products Found
                </h2>
                <p className="text-white/70">
                  We couldn't find any products to display.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Collection.ProductCard key={product._id} product={product}>
                    {withDocsWrapper(
                      ({
                        name,
                        imageUrl,
                        price,
                        inStock,
                        productUrl,
                        description,
                      }) => (
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 group">
                          <div className="aspect-square bg-white/10 rounded-lg mb-4 overflow-hidden relative">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={name}
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

                            {/* Enhanced badges */}
                            <div className="absolute top-2 left-2">
                              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                New
                              </span>
                            </div>
                          </div>

                          <h3 className="text-white font-semibold mb-2 line-clamp-2">
                            {name}
                          </h3>

                          {description && (
                            <p className="text-white/60 text-sm mb-3 line-clamp-2">
                              {description}
                            </p>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xl font-bold text-white">
                              {price}
                            </span>
                            <div className="flex items-center gap-2">
                              {inStock ? (
                                <span className="text-green-400 text-sm flex items-center gap-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  In Stock
                                </span>
                              ) : (
                                <span className="text-red-400 text-sm flex items-center gap-1">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <a
                              href={productUrl.replace(
                                "/store/",
                                "/store/example-2/"
                              )}
                              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
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

                            {/* Quick wishlist button */}
                            <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ),
                      "Collection.ProductCard",
                      "/docs/components/collection#productcard"
                    )}
                  </Collection.ProductCard>
                ))}
              </div>
            )}
          </div>
        ),
        "Collection.ProductGrid",
        "/docs/components/collection#productgrid"
      )}
    </Collection.ProductGrid>
  );
};

const LoadMoreSection = () => {
  return (
    <Collection.LoadMoreProducts>
      {withDocsWrapper(
        ({ loadMore, refresh, isLoading, hasProducts, totalProducts }) => (
          <>
            {hasProducts && totalProducts > 0 && (
              <div className="text-center mt-12">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
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
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Refresh Products
                  </button>
                </div>

                <p className="text-white/60 text-sm mt-4">
                  Advanced store experience • {totalProducts} products loaded
                </p>
              </div>
            )}
          </>
        ),
        "Collection.LoadMoreProducts",
        "/docs/components/collection#loadmoreproducts"
      )}
    </Collection.LoadMoreProducts>
  );
};

export default function StoreExample2Page({
  collectionServiceConfig,
  currentCartServiceConfig,
}: StoreExample2PageProps) {
  // Create services manager with collection and current cart services
  const servicesManager = createServicesManager(
    createServicesMap()
      .addService(
        CollectionServiceDefinition,
        CollectionService,
        collectionServiceConfig
      )
      .addService(
        CurrentCartServiceDefinition,
        CurrentCartService,
        currentCartServiceConfig
      )
  );

  return (
    <KitchensinkLayout>
      <StoreLayout
        currentCartServiceConfig={currentCartServiceConfig}
        servicesManager={servicesManager}
      >
        {/* Register page documentation */}
        <PageDocsRegistration
          title="Advanced Store Collection"
          description="Enhanced product collection interface with advanced product interactions, wishlist functionality, and modern design patterns using Collection and CurrentCart headless components."
          docsUrl="/docs/examples/advanced-store-collection"
        />

        {/* Main Content */}
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <div className="flex items-center gap-2 text-white/60">
                <a href="/store" className="hover:text-white transition-colors">
                  Store
                </a>
                <span>/</span>
                <span className="text-white">Example 2</span>
              </div>
            </nav>

            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Advanced Store
                </span>
              </h1>
              <p className="text-white/80 text-xl max-w-2xl mx-auto">
                Experience our next-generation e-commerce platform with enhanced
                interactions and modern design patterns
              </p>

              <Collection.CollectionHeader>
                {withDocsWrapper(
                  ({ totalProducts, isLoading, hasProducts }) => (
                    <div className="mt-6">
                      {!isLoading && hasProducts && (
                        <p className="text-white/60">
                          Showing {totalProducts} product
                          {totalProducts !== 1 ? "s" : ""} with enhanced
                          features
                        </p>
                      )}
                    </div>
                  ),
                  "Collection.CollectionHeader",
                  "/docs/components/collection#collectionheader"
                )}
              </Collection.CollectionHeader>
            </div>

            {/* Features Banner */}
            <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">Enhanced UI</h3>
                  <p className="text-white/60 text-sm">
                    Modern design patterns
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">
                    Smart Interactions
                  </h3>
                  <p className="text-white/60 text-sm">Advanced user flows</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">
                    Headless Components
                  </h3>
                  <p className="text-white/60 text-sm">
                    Built with Collection & CurrentCart
                  </p>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <ProductGridContent />

            {/* Load More */}
            <LoadMoreSection />
          </div>
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
