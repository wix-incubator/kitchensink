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

// Mini coupon form for the cart sidebar
const CouponFormMini = ({
  onApply,
  isLoading,
}: {
  onApply: (code: string) => void;
  isLoading: boolean;
}) => {
  const [code, setCode] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onApply(code.trim());
      setCode("");
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="text-teal-400 hover:text-teal-300 text-xs font-medium"
      >
        Have a promo code?
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-1">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Promo code"
          className="flex-1 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white placeholder-white/60 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!code.trim() || isLoading}
          className="px-2 py-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-medium rounded"
        >
          {isLoading ? "..." : "Apply"}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setIsExpanded(false)}
        className="text-white/60 hover:text-white/80 text-xs"
      >
        Cancel
      </button>
    </form>
  );
};

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
                                    selectedOptions,
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
                                        {selectedOptions.length > 0 && (
                                            <div className="mt-1 mb-2">
                                              <div className="flex flex-wrap gap-1">
                                                {selectedOptions.map(
                                                  (option, index) => {
                                                    const isColor =
                                                      typeof option.value ===
                                                      "object";
                                                    const text = isColor
                                                      ? (option.value as any)
                                                          .name
                                                      : option.value;
                                                    const color = isColor
                                                      ? (option.value as any)
                                                          .code
                                                      : null;

                                                    return (
                                                      <div
                                                        key={index}
                                                        className="flex items-center gap-1 text-xs text-white/70"
                                                      >
                                                        <span>
                                                          {option.name}:
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                          {color && (
                                                            <div
                                                              className="w-3 h-3 rounded-full border border-white/30"
                                                              style={{
                                                                backgroundColor:
                                                                  color,
                                                              }}
                                                              title={text}
                                                            />
                                                          )}
                                                          <span className="font-medium">
                                                            {text}
                                                          </span>
                                                        </div>
                                                        {index <
                                                          selectedOptions.length -
                                                            1 && (
                                                          <span className="text-white/40">
                                                            ,
                                                          </span>
                                                        )}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            </div>
                                          )}
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
                    <CurrentCart.Notes>
                      {({ notes, onNotesChange }) => (
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-2">
                            Notes:
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => onNotesChange(e.target.value)}
                            placeholder="Special instructions for your order (e.g., gift wrap, delivery notes)"
                            rows={2}
                            className="w-full px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white placeholder-white/60 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors duration-200 resize-vertical mb-4"
                          />
                        </div>
                      )}
                    </CurrentCart.Notes>
                    <CurrentCart.Summary>
                      {({
                        subtotal,
                        shipping,
                        tax,
                        total,
                        itemCount,
                        isTotalsLoading,
                      }) => {
                        const LoadingOrValue = ({
                          children,
                        }: {
                          children: string;
                        }) =>
                          isTotalsLoading ? (
                            <span className="text-white/60">
                              Calculating...
                            </span>
                          ) : (
                            children
                          );

                        return (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-white/80">
                                  Subtotal ({itemCount}{" "}
                                  {itemCount === 1 ? "item" : "items"})
                                </span>
                                <span className="text-white font-semibold">
                                  <LoadingOrValue>
                                    {subtotal}
                                  </LoadingOrValue>
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/80">
                                  Shipping
                                </span>
                                <span className="text-white font-semibold">
                                  <LoadingOrValue>
                                    {shipping}
                                  </LoadingOrValue>
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/80">Tax</span>
                                <span className="text-white font-semibold">
                                  <LoadingOrValue>{tax}</LoadingOrValue>
                                </span>
                              </div>
                              <div className="border-t border-white/20 pt-2">
                                <div className="flex justify-between">
                                  <span className="text-white font-bold">
                                    Total
                                  </span>
                                  <span className="text-white font-bold text-lg">
                                    <LoadingOrValue>{total}</LoadingOrValue>
                                  </span>
                                </div>
                              </div>
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
                        );
                      }}
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
