import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import "../styles/theme-2.css";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../headless/ecom/services/current-cart-service";
import { CurrentCart } from "../headless/ecom/components";
import { KitchensinkLayout } from "../layouts/KitchensinkLayout";
import { WixMediaImage } from "../headless/media/components";

interface CartPageProps {
  data?: any;
}

const CartContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <CurrentCart.Content>
          {({ cart, isLoading, error }) => (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-[var(--theme-text-content)] mb-4">
                  Shopping Cart
                </h1>
                <CurrentCart.Trigger>
                  {({ itemCount }) => (
                    <p className="text-[var(--theme-text-content-80)] text-xl">
                      {itemCount} {itemCount === 1 ? "item" : "items"} in your
                      cart
                    </p>
                  )}
                </CurrentCart.Trigger>
              </div>

              {/* Loading State */}
              {isLoading && !cart && (
                <div className="flex justify-center items-center min-h-64">
                  <div className="flex items-center gap-3">
                    <svg
                      className="animate-spin w-8 h-8 text-[var(--theme-text-content)]"
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
                    <span className="text-[var(--theme-text-content)] text-lg">
                      Loading your cart...
                    </span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-[var(--theme-bg-error)] border border-[var(--theme-border-error)] rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-semibold text-[var(--theme-text-error)] mb-2">
                    Error
                  </h2>
                  <p className="text-[var(--theme-text-error)]">{error}</p>
                </div>
              )}

              {/* Empty Cart */}
              <CurrentCart.Items>
                {({ hasItems, items }) => (
                  <>
                    {!hasItems && !isLoading && (
                      <div className="text-center py-16">
                        <div className="w-32 h-32 bg-[var(--theme-bg-options)] rounded-full flex items-center justify-center mx-auto mb-8">
                          <svg
                            className="w-16 h-16 text-[var(--theme-text-content-60)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h9M7 13l-1.5 6m0 0h9m-9 0a1 1 0 100 2 1 1 0 000-2zm9 0a1 1 0 100 2 1 1 0 000-2z"
                            />
                          </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--theme-text-content)] mb-4">
                          Your cart is empty
                        </h2>
                        <p className="text-[var(--theme-text-content-70)] text-lg mb-8">
                          Start shopping to add items to your cart
                        </p>
                        <a
                          href="/store"
                          className="inline-flex items-center gap-2 text-[var(--theme-text-content)] font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
                          style={{ background: "var(--theme-btn-primary)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "var(--theme-btn-primary-hover)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "var(--theme-btn-primary)";
                          }}
                        >
                          Continue Shopping
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>
                    )}

                    {/* Cart with Items */}
                    {hasItems && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                          <div className="bg-[var(--theme-bg-options)] backdrop-blur-sm rounded-xl border border-[var(--theme-border-primary-10)] p-6">
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-2xl font-bold text-[var(--theme-text-content)]">
                                Cart Items
                              </h2>
                              <CurrentCart.Clear>
                                {({ onClear, hasItems, isLoading }) =>
                                  hasItems && (
                                    <button
                                      onClick={onClear}
                                      disabled={isLoading}
                                      className="text-[var(--theme-text-error)] hover:text-[var(--theme-text-error)]/80 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                                    >
                                      Clear all items
                                    </button>
                                  )
                                }
                              </CurrentCart.Clear>
                            </div>

                            <div className="space-y-6">
                              {items.map((item: any) => (
                                <CurrentCart.Item key={item._id} item={item}>
                                  {({
                                    title,
                                    image,
                                    price,
                                    quantity,
                                    onIncrease,
                                    onDecrease,
                                    onRemove,
                                    isLoading: itemLoading,
                                  }) => (
                                    <div className="flex items-center space-x-6 p-4 bg-[var(--theme-bg-options)] rounded-lg border border-[var(--theme-border-primary-10)] hover:border-[var(--theme-border-primary-20)] transition-all duration-200">
                                      {/* Product Image */}
                                      <div className="flex-shrink-0">
                                        {image ? (
                                          <WixMediaImage
                                            media={{
                                              image,
                                            }}
                                            width={96}
                                            height={96}
                                            alt={title}
                                            className="h-24 w-24 rounded-lg object-cover border border-[var(--theme-border-primary-20)]"
                                          />
                                        ) : (
                                          <div className="h-24 w-24 bg-[var(--theme-bg-options)] rounded-lg flex items-center justify-center border border-[var(--theme-border-primary-20)]">
                                            <svg
                                              className="w-8 h-8 text-[var(--theme-text-content-40)]"
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

                                      {/* Product Details */}
                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-semibold text-[var(--theme-text-content)] mb-2">
                                          {title}
                                        </h3>
                                        <p className="text-2xl font-bold text-[var(--theme-text-content)]">
                                          {price}
                                        </p>
                                      </div>

                                      {/* Quantity Controls */}
                                      <div className="flex items-center space-x-3">
                                        <button
                                          onClick={onDecrease}
                                          disabled={
                                            itemLoading || quantity <= 1
                                          }
                                          className="p-2 rounded-lg bg-[var(--theme-bg-options)] hover:bg-[var(--theme-bg-primary-10)] border border-[var(--theme-border-primary-20)] hover:border-[var(--theme-border-primary-30)] text-[var(--theme-text-content)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M20 12H4"
                                            />
                                          </svg>
                                        </button>

                                        <span className="text-xl font-bold text-[var(--theme-text-content)] min-w-12 text-center bg-[var(--theme-bg-options)] rounded-lg py-2 px-3 border border-[var(--theme-border-primary-20)]">
                                          {quantity}
                                        </span>

                                        <button
                                          onClick={onIncrease}
                                          disabled={itemLoading}
                                          className="p-2 rounded-lg bg-[var(--theme-bg-options)] hover:bg-[var(--theme-bg-primary-10)] border border-[var(--theme-border-primary-20)] hover:border-[var(--theme-border-primary-30)] text-[var(--theme-text-content)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                          </svg>
                                        </button>
                                      </div>

                                      {/* Remove Button */}
                                      <button
                                        onClick={onRemove}
                                        disabled={itemLoading}
                                        className="text-[var(--theme-text-error)] hover:text-[var(--theme-text-error)]/80 p-2 rounded-lg hover:bg-[var(--theme-bg-error)] transition-all duration-200 disabled:opacity-50"
                                      >
                                        <svg
                                          className="h-5 w-5"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  )}
                                </CurrentCart.Item>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                          <div className="bg-[var(--theme-bg-options)] backdrop-blur-sm rounded-xl border border-[var(--theme-border-primary-10)] p-6 sticky top-6">
                            <h2 className="text-2xl font-bold text-[var(--theme-text-content)] mb-6">
                              Order Summary
                            </h2>

                            <CurrentCart.Summary>
                              {({
                                subtotal,
                                total,
                                itemCount,
                                canCheckout,
                              }) => (
                                <div className="space-y-4">
                                  <div className="flex justify-between text-lg text-[var(--theme-text-content)]">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span className="font-semibold">
                                      {subtotal}
                                    </span>
                                  </div>

                                  <div className="border-t border-[var(--theme-border-primary-20)] pt-4">
                                    <div className="flex justify-between text-xl font-bold text-[var(--theme-text-content)]">
                                      <span>Total</span>
                                      <span>{total}</span>
                                    </div>
                                  </div>

                                  <CurrentCart.Checkout>
                                    {({
                                      onProceed,
                                      canCheckout: canProceed,
                                      isLoading: checkoutLoading,
                                      error: checkoutError,
                                    }) => (
                                      <div className="space-y-4">
                                        {checkoutError && (
                                          <div className="bg-[var(--theme-bg-error)] border border-[var(--theme-border-error)] rounded-lg p-3">
                                            <p className="text-[var(--theme-text-error)] text-sm">
                                              {checkoutError}
                                            </p>
                                          </div>
                                        )}

                                        <button
                                          onClick={onProceed}
                                          disabled={
                                            !canProceed || checkoutLoading
                                          }
                                          className="w-full text-[var(--theme-text-content)] font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                          style={{
                                            background: canProceed
                                              ? "var(--theme-btn-primary)"
                                              : "var(--theme-bg-options)",
                                            cursor: !canProceed
                                              ? "not-allowed"
                                              : "pointer",
                                          }}
                                          onMouseEnter={(e) => {
                                            if (canProceed) {
                                              e.currentTarget.style.background =
                                                "var(--theme-btn-primary-hover)";
                                            }
                                          }}
                                          onMouseLeave={(e) => {
                                            if (canProceed) {
                                              e.currentTarget.style.background =
                                                "var(--theme-btn-primary)";
                                            }
                                          }}
                                        >
                                          {checkoutLoading ? (
                                            <span className="flex items-center justify-center gap-2">
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
                                              Processing...
                                            </span>
                                          ) : (
                                            "Proceed to Checkout"
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </CurrentCart.Checkout>

                                  <div className="text-center pt-4">
                                    <a
                                      href="/store"
                                      className="text-[var(--theme-text-primary-400)] hover:text-[var(--theme-text-primary-300)] font-medium transition-colors duration-200 flex items-center justify-center gap-2"
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
                                          strokeWidth={2}
                                          d="M15 19l-7-7 7-7"
                                        />
                                      </svg>
                                      Continue Shopping
                                    </a>
                                  </div>
                                </div>
                              )}
                            </CurrentCart.Summary>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CurrentCart.Items>
            </>
          )}
        </CurrentCart.Content>
      </div>
    </div>
  );
};

export default function CartPage({ data }: CartPageProps) {
  // Create services manager with cart service
  const servicesManager = createServicesManager(
    createServicesMap().addService(
      CurrentCartServiceDefinition,
      CurrentCartService,
      data || { initialCart: null }
    )
  );

  return (
    <KitchensinkLayout>
      <ServicesManagerProvider servicesManager={servicesManager}>
        <CartContent />
      </ServicesManagerProvider>
    </KitchensinkLayout>
  );
}
