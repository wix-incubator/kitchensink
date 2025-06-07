import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { KitchensinkLayout } from "../../layouts/KitchensinkLayout";
import {
  CollectionServiceDefinition,
  CollectionService,
} from "../../headless/store/collection-service";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../../headless/store/current-cart-service";
import { Collection } from "../../headless/store/Collection";
import { CurrentCart } from "../../headless/store/CurrentCart";
import {
  withDocsWrapper,
  PageDocsRegistration,
} from "../../components/DocsMode";

interface StoreCollectionPageProps {
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
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
                          <div className="aspect-square bg-white/10 rounded-lg mb-4 overflow-hidden">
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
                          </div>

                          <h3 className="text-white font-semibold mb-2 line-clamp-2">
                            {name}
                          </h3>

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
                              {inStock ? (
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
                            href={productUrl}
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
        ({ loadMore, hasMore, isLoading }) => (
          <>
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
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

export default function StoreCollectionPage({
  collectionServiceConfig,
  currentCartServiceConfig,
}: StoreCollectionPageProps) {
  // Create services manager with both collection and cart services
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
    <ServicesManagerProvider servicesManager={servicesManager}>
      <KitchensinkLayout>
        {/* Register page documentation */}
        <PageDocsRegistration
          title="Store Collection Page"
          description="A complete product collection interface showcasing Collection and CurrentCart headless components working together."
          docsUrl="/docs/examples/store-collection-overview"
        />

        {/* Fixed Cart Icon */}
        <div className="fixed top-6 right-6 z-50">
          <CurrentCart.CartIcon>
            {withDocsWrapper(
              ({ itemCount, hasItems, openCart, isLoading }) => (
                <button
                  onClick={openCart}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 relative"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                  {hasItems && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                      <svg
                        className="animate-spin w-4 h-4 text-white"
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
                    </div>
                  )}
                </button>
              ),
              "CurrentCart.CartIcon",
              "/docs/components/current-cart#carticon"
            )}
          </CurrentCart.CartIcon>
        </div>

        {/* Main Content */}
        <div className="min-h-screen p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">Our Store</h1>
              <p className="text-white/80 text-xl max-w-2xl mx-auto">
                Discover amazing products crafted with care and attention to
                detail
              </p>

              <Collection.CollectionHeader>
                {withDocsWrapper(
                  ({ totalProducts, isLoading, hasProducts }) => (
                    <div className="mt-6">
                      {!isLoading && hasProducts && (
                        <p className="text-white/60">
                          Showing {totalProducts} product
                          {totalProducts !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  ),
                  "Collection.CollectionHeader",
                  "/docs/components/collection#collectionheader"
                )}
              </Collection.CollectionHeader>
            </div>

            {/* Product Grid */}
            <ProductGridContent />

            {/* Load More */}
            <LoadMoreSection />
          </div>
        </div>

        {/* Cart Modal */}
        <CurrentCart.CartModal>
          {withDocsWrapper(
            ({ isOpen, closeCart, cart, isLoading, error }) => (
              <>
                {isOpen && (
                  <div className="fixed inset-0 z-50 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                      onClick={closeCart}
                    ></div>
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white/10 backdrop-blur-lg border-l border-white/20 p-6 overflow-y-auto">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">
                          Shopping Cart
                        </h2>
                        <button
                          onClick={closeCart}
                          className="text-white/60 hover:text-white transition-colors"
                        >
                          <svg
                            className="w-6 h-6"
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
                        </button>
                      </div>

                      {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                          <p className="text-red-400">{error}</p>
                        </div>
                      )}

                      <CurrentCart.CartLineItems>
                        {withDocsWrapper(
                          ({ lineItems, hasItems }) => (
                            <>
                              {hasItems ? (
                                <div className="space-y-4 mb-6">
                                  {lineItems.map((item: any) => (
                                    <CurrentCart.CartLineItem
                                      key={item._id}
                                      lineItemId={item._id}
                                    >
                                      {withDocsWrapper(
                                        ({
                                          productName,
                                          quantity,
                                          price,
                                          increaseQuantity,
                                          decreaseQuantity,
                                          removeItem,
                                          imageUrl,
                                        }) => (
                                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex gap-4">
                                              <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden">
                                                {imageUrl ? (
                                                  <img
                                                    src={imageUrl}
                                                    alt={productName}
                                                    className="w-full h-full object-cover"
                                                  />
                                                ) : (
                                                  <div className="w-full h-full flex items-center justify-center">
                                                    <svg
                                                      className="w-6 h-6 text-white/40"
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
                                              <div className="flex-1">
                                                <h3 className="text-white font-medium mb-2">
                                                  {productName}
                                                </h3>
                                                <p className="text-white/80 font-semibold">
                                                  {price}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                  <button
                                                    onClick={decreaseQuantity}
                                                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                                  >
                                                    <svg
                                                      className="w-4 h-4 text-white"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M20 12H4"
                                                      />
                                                    </svg>
                                                  </button>
                                                  <span className="text-white font-medium w-8 text-center">
                                                    {quantity}
                                                  </span>
                                                  <button
                                                    onClick={increaseQuantity}
                                                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                                  >
                                                    <svg
                                                      className="w-4 h-4 text-white"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                      />
                                                    </svg>
                                                  </button>
                                                  <button
                                                    onClick={removeItem}
                                                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
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
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                      />
                                                    </svg>
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ),
                                        "CurrentCart.CartLineItem",
                                        "/docs/components/current-cart#cartlineitem"
                                      )}
                                    </CurrentCart.CartLineItem>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                      className="w-8 h-8 text-white/60"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                                      />
                                    </svg>
                                  </div>
                                  <h3 className="text-white font-medium mb-2">
                                    Your cart is empty
                                  </h3>
                                  <p className="text-white/60 text-sm">
                                    Add some products to get started!
                                  </p>
                                </div>
                              )}
                            </>
                          ),
                          "CurrentCart.CartLineItems",
                          "/docs/components/current-cart#cartlineitems"
                        )}
                      </CurrentCart.CartLineItems>

                      <CurrentCart.CartSummary>
                        {withDocsWrapper(
                          ({ subtotal, total, itemCount, canCheckout }) => (
                            <>
                              {canCheckout && (
                                <div className="border-t border-white/20 pt-6">
                                  <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-white/80">
                                      <span>Subtotal ({itemCount} items)</span>
                                      <span>{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-white font-semibold text-lg">
                                      <span>Total</span>
                                      <span>{total}</span>
                                    </div>
                                  </div>
                                  <CurrentCart.CheckoutButton>
                                    {withDocsWrapper(
                                      ({
                                        proceedToCheckout,
                                        canCheckout: canProceed,
                                        isLoading,
                                      }) => (
                                        <button
                                          onClick={proceedToCheckout}
                                          disabled={!canProceed || isLoading}
                                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                        >
                                          {isLoading
                                            ? "Processing..."
                                            : "Proceed to Checkout"}
                                        </button>
                                      ),
                                      "CurrentCart.CheckoutButton",
                                      "/docs/components/current-cart#checkoutbutton"
                                    )}
                                  </CurrentCart.CheckoutButton>
                                </div>
                              )}
                            </>
                          ),
                          "CurrentCart.CartSummary",
                          "/docs/components/current-cart#cartsummary"
                        )}
                      </CurrentCart.CartSummary>
                    </div>
                  </div>
                )}
              </>
            ),
            "CurrentCart.CartModal",
            "/docs/components/current-cart#cartmodal"
          )}
        </CurrentCart.CartModal>
      </KitchensinkLayout>
    </ServicesManagerProvider>
  );
}
