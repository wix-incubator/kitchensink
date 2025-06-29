import { useState, type ReactNode } from "react";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import "../styles/theme-1.css";
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
        <div className="fixed top-4 right-4 z-50 backdrop-blur-sm text-[var(--theme-text-content)] px-6 py-3 rounded-xl shadow-lg border border-[var(--theme-border-primary-30)] animate-pulse"
             style={{ background: 'var(--theme-text-success)' }}>
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
              className="relative p-2 text-[var(--theme-text-content)] hover:text-[var(--theme-text-primary-300)] transition-colors"
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
                <span className="absolute -top-1 -right-1 text-[var(--theme-text-content)] text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      style={{ background: 'var(--theme-primary-500)' }}>
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
              <div className="fixed inset-0 z-50 bg-[var(--theme-bg-tooltip)] backdrop-blur-sm">
                <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--theme-bg-mini-cart)] shadow-xl">
                  <CurrentCart.Summary>
                    {({ itemCount }) => (
                      <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border-card)]">
                        <h2 className="text-xl font-bold text-[var(--theme-text-content)]">
                          Shopping Cart ({itemCount})
                        </h2>
                        <button
                          onClick={onClose}
                          className="p-2 text-[var(--theme-text-content)] hover:text-[var(--theme-text-primary-300)] transition-colors"
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
                                    <div className="flex gap-4 p-4 bg-[var(--theme-bg-card)] rounded-xl border border-[var(--theme-border-card)]">
                                      <div className="w-16 h-16 bg-[var(--theme-bg-options)] rounded-lg overflow-hidden flex-shrink-0">
                                        {image && (
                                          <WixMediaImage
                                            media={{ image: image }}
                                            width={64}
                                            height={64}
                                          />
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-[var(--theme-text-content)] font-medium text-sm truncate">
                                          {title}
                                        </h3>
                                        <p className="text-[var(--theme-text-primary-400)] font-semibold text-sm mt-1">
                                          {price}
                                        </p>

                                        <div className="flex items-center justify-between mt-3">
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={onDecrease}
                                              className="w-6 h-6 rounded bg-[var(--theme-bg-options)] text-[var(--theme-text-content)] text-sm hover:bg-[var(--theme-bg-primary-20)] transition-colors"
                                            >
                                              -
                                            </button>
                                            <span className="text-[var(--theme-text-content)] text-sm w-6 text-center">
                                              {quantity}
                                            </span>
                                            <button
                                              onClick={onIncrease}
                                              className="w-6 h-6 rounded bg-[var(--theme-bg-options)] text-[var(--theme-text-content)] text-sm hover:bg-[var(--theme-bg-primary-20)] transition-colors"
                                            >
                                              +
                                            </button>
                                          </div>

                                          <button
                                            onClick={onRemove}
                                            className="text-[var(--theme-text-error)] hover:text-[var(--theme-text-error)]/80 text-xs transition-colors"
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
                              <div className="w-16 h-16 bg-[var(--theme-bg-options)] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                  className="w-8 h-8 text-[var(--theme-text-content-60)]"
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
                              <p className="text-[var(--theme-text-content-60)]">
                                Your cart is empty
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </CurrentCart.Items>
                  </div>

                  <div className="border-t border-[var(--theme-border-card)] p-6">
                    <CurrentCart.Summary>
                      {({ subtotal, itemCount }) => (
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-[var(--theme-text-content-80)]">
                              Items ({itemCount})
                            </span>
                            <span className="text-[var(--theme-text-content)] font-semibold">
                              {subtotal}
                            </span>
                          </div>

                          <CurrentCart.Checkout>
                            {({ onProceed, canCheckout }) => (
                              <button
                                onClick={onProceed}
                                disabled={!canCheckout}
                                className="w-full text-[var(--theme-text-content)] font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                  background: canCheckout ? 'var(--theme-btn-primary)' : 'var(--theme-bg-options)',
                                  cursor: !canCheckout ? 'not-allowed' : 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  if (canCheckout) {
                                    e.currentTarget.style.background = 'var(--theme-btn-primary-hover)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (canCheckout) {
                                    e.currentTarget.style.background = 'var(--theme-btn-primary)';
                                  }
                                }}
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
