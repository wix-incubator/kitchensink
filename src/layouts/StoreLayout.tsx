import { useState, type ReactNode } from "react";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../headless/store/current-cart-service";
import { CurrentCart } from "../headless/store/CurrentCart";
import { withDocsWrapper } from "../components/DocsMode";

interface StoreLayoutProps {
  children: ReactNode;
  currentCartServiceConfig: any;
  servicesManager?: any; // Allow passing an existing services manager
  showSuccessMessage?: boolean;
  onSuccessMessageChange?: (show: boolean) => void;
}

export function StoreLayout({
  children,
  currentCartServiceConfig,
  servicesManager: externalServicesManager,
  showSuccessMessage = false,
  onSuccessMessageChange,
}: StoreLayoutProps) {
  const [internalShowSuccess, setInternalShowSuccess] = useState(false);

  // Use external services manager if provided, otherwise create one with just cart service
  const servicesManager =
    externalServicesManager ||
    createServicesManager(
      createServicesMap().addService(
        CurrentCartServiceDefinition,
        CurrentCartService,
        currentCartServiceConfig
      )
    );

  const actualShowSuccess = onSuccessMessageChange
    ? showSuccessMessage
    : internalShowSuccess;
  const setShowSuccess = onSuccessMessageChange || setInternalShowSuccess;

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      {/* Success Message */}
      {actualShowSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg border border-green-400/30 animate-pulse">
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
            Added to cart successfully!
          </div>
        </div>
      )}

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
      {children}

      {/* Cart Modal */}
      <CurrentCart.CartModal>
        {withDocsWrapper(
          ({ isOpen, closeCart, error }) => (
            <>
              {isOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
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
                                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
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
    </ServicesManagerProvider>
  );
}
