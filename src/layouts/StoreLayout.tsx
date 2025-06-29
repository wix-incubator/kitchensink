import { useState, type ReactNode } from "react";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../headless/ecom/services/current-cart-service";
import { CurrentCart } from "../headless/ecom/components/CurrentCart";
import WixMediaImage from "../headless/media/components/Image";

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
        <CurrentCart.Trigger>
          {({ onOpen, itemCount }) => (
            <button
              onClick={onOpen}
              className="relative p-2 text-white hover:text-teal-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h12"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          )}
        </CurrentCart.Trigger>
      </div>

      {/* Main Content */}
      {children}

      {/* Cart Modal */}
      <CurrentCart.Content>
        {({ isOpen, onClose }) => (
          <>
            {isOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
                <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 shadow-xl">
                  <CurrentCart.Summary>
                    {({ itemCount }) => (
                      <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white">
                          Shopping Cart ({itemCount})
                        </h2>
                        <button
                          onClick={onClose}
                          className="p-2 text-white hover:text-teal-300 transition-colors"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </CurrentCart.Summary>

                  <div className="flex-1 overflow-y-auto p-6">
                    <CurrentCart.Items>
                      {({ hasItems, items }) => (
                        <>
                          {hasItems ? (
                            <div className="space-y-4">
                              {items.map((item) => (
                                <CurrentCart.Item key={item._id} item={item}>
                                  {({
                                    title,
                                    image,
                                    price,
                                    quantity,
                                    onIncrease,
                                    onDecrease,
                                    onRemove,
                                  }) => (
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                      <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                                        {image && (
                                          <WixMediaImage
                                            media={{ image: image }}
                                            width={64}
                                            height={64}
                                          />
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium text-sm truncate">
                                          {title}
                                        </h3>
                                        <p className="text-teal-400 font-semibold text-sm mt-1">
                                          {price}
                                        </p>

                                        <div className="flex items-center justify-between mt-3">
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={onDecrease}
                                              className="w-6 h-6 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                                            >
                                              -
                                            </button>
                                            <span className="text-white text-sm w-6 text-center">
                                              {quantity}
                                            </span>
                                            <button
                                              onClick={onIncrease}
                                              className="w-6 h-6 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                                            >
                                              +
                                            </button>
                                          </div>

                                          <button
                                            onClick={onRemove}
                                            className="text-red-400 hover:text-red-300 text-xs transition-colors"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </CurrentCart.Item>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                  className="w-8 h-8 text-white/60"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                                  />
                                </svg>
                              </div>
                              <p className="text-white/60">
                                Your cart is empty
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </CurrentCart.Items>
                  </div>

                  <div className="border-t border-white/10 p-6">
                    <CurrentCart.Summary>
                      {({ subtotal, itemCount }) => (
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-white/80">
                              Items ({itemCount})
                            </span>
                            <span className="text-white font-semibold">
                              {subtotal}
                            </span>
                          </div>

                          <CurrentCart.Checkout>
                            {({ onProceed, canCheckout }) => (
                              <button
                                onClick={onProceed}
                                disabled={!canCheckout}
                                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                              >
                                Proceed to Checkout
                              </button>
                            )}
                          </CurrentCart.Checkout>
                        </div>
                      )}
                    </CurrentCart.Summary>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CurrentCart.Content>
    </ServicesManagerProvider>
  );
}
