import React from "react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../headless/store/services/current-cart-service";
import { CurrentCart } from "../headless/store/components/CurrentCart";
import { KitchensinkLayout } from "../layouts/KitchensinkLayout";

interface CartPageProps {
  data?: any;
}

const CartContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <CurrentCart.Content>
          {({ cart, isLoading, error }) => (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-white mb-4">
                  Shopping Cart
                </h1>
                <CurrentCart.Trigger>
                  {({ itemCount }) => (
                    <p className="text-white/80 text-xl">
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
                      className="animate-spin w-8 h-8 text-white"
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
                    <span className="text-white text-lg">
                      Loading your cart...
                    </span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-semibold text-red-400 mb-2">
                    Error
                  </h2>
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {/* Empty Cart */}
              <CurrentCart.Items>
                {({ hasItems, items }) => (
                  <>
                    {!hasItems && !isLoading && (
                      <div className="text-center py-16">
                        <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                          <svg
                            className="w-16 h-16 text-white/60"
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
                        <h2 className="text-3xl font-bold text-white mb-4">
                          Your cart is empty
                        </h2>
                        <p className="text-white/70 text-lg mb-8">
                          Start shopping to add items to your cart
                        </p>
                        <a
                          href="/store"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
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
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-2xl font-bold text-white">
                                Cart Items
                              </h2>
                              <CurrentCart.Clear>
                                {({ onClear, hasItems, isLoading }) =>
                                  hasItems && (
                                    <button
                                      onClick={onClear}
                                      disabled={isLoading}
                                      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                                    >
                                      Clear all items
                                    </button>
                                  )
                                }
                              </CurrentCart.Clear>
                            </div>

                            <div className="space-y-6">
                              {items.map((item: any) => (
                                <CurrentCart.Item
                                  key={item._id}
                                  lineItemId={item._id}
                                >
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
                                    <div className="flex items-center space-x-6 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200">
                                      {/* Product Image */}
                                      <div className="flex-shrink-0">
                                        {image ? (
                                          <img
                                            className="h-24 w-24 rounded-lg object-cover border border-white/20"
                                            src={image}
                                            alt={title}
                                          />
                                        ) : (
                                          <div className="h-24 w-24 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                                            <svg
                                              className="w-8 h-8 text-white/40"
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
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                          {title}
                                        </h3>
                                        <p className="text-2xl font-bold text-white">
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
                                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

                                        <span className="text-xl font-bold text-white min-w-12 text-center bg-white/10 rounded-lg py-2 px-3 border border-white/20">
                                          {quantity}
                                        </span>

                                        <button
                                          onClick={onIncrease}
                                          disabled={itemLoading}
                                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
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
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sticky top-6">
                            <h2 className="text-2xl font-bold text-white mb-6">
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
                                  <div className="flex justify-between text-lg text-white">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span className="font-semibold">
                                      {subtotal}
                                    </span>
                                  </div>

                                  <div className="border-t border-white/20 pt-4">
                                    <div className="flex justify-between text-xl font-bold text-white">
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
                                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                            <p className="text-red-400 text-sm">
                                              {checkoutError}
                                            </p>
                                          </div>
                                        )}

                                        <button
                                          onClick={onProceed}
                                          disabled={
                                            !canProceed || checkoutLoading
                                          }
                                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
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
                                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
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
