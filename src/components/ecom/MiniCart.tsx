import { useState, type ReactNode } from 'react';
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from '../../headless/ecom/services/current-cart-service';
import { CurrentCart } from '../../headless/ecom/components';
import { WixMediaImage } from '../../headless/media/components';

// Mini coupon form for the cart sidebar
const CouponFormMini = ({
  onApply,
  isLoading,
}: {
  onApply: (code: string) => void;
  isLoading: boolean;
}) => {
  const [code, setCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onApply(code.trim());
      setCode('');
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="text-accent hover:text-brand-light text-xs font-medium"
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
          onChange={e => setCode(e.target.value)}
          placeholder="Promo code"
          className="flex-1 px-2 py-1 text-xs bg-surface-interactive border border-surface-interactive rounded text-content-primary placeholder:text-content-muted focus:border-brand-light focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!code.trim() || isLoading}
          className="btn-accent px-2 py-1 disabled:opacity-50 text-content-primary text-xs font-medium rounded"
        >
          {isLoading ? '...' : 'Apply'}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setIsExpanded(false)}
        className="text-content-muted hover:text-content-secondary text-xs"
      >
        Cancel
      </button>
    </form>
  );
};

export function MiniCartIcon() {
  return (
    <>
      {/* Fixed Cart Icon */}
      <div className="fixed top-6 right-6 z-50">
        <CurrentCart.Trigger>
          {({ onOpen, itemCount }) => (
            <button
              onClick={onOpen}
              className="relative p-2 text-content-primary hover:text-brand-light transition-colors"
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
                <span className="absolute -top-1 -right-1 bg-accent-medium text-content-primary text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          )}
        </CurrentCart.Trigger>
      </div>
    </>
  );
}

export function MiniCartContent() {
  return (
    <>
      {/* Cart Modal */}
      <CurrentCart.Content>
        {({ isOpen, onClose }) => (
          <>
            {isOpen && (
              <div className="fixed inset-0 z-50 bg-surface-overlay backdrop-blur-sm">
                <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-modal shadow-xl">
                  <CurrentCart.Summary>
                    {({ itemCount }) => (
                      <div className="flex items-center justify-between p-6 border-b border-surface-subtle">
                        <h2 className="text-xl font-bold text-content-primary">
                          Shopping Cart ({itemCount})
                        </h2>
                        <button
                          onClick={onClose}
                          className="p-2 text-content-primary hover:text-brand-light transition-colors"
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
                              {items.map(item => (
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
                                    <div className="flex gap-4 p-4 bg-surface-card rounded-xl border border-surface-subtle">
                                      <div className="w-16 h-16 bg-surface-interactive rounded-lg overflow-hidden flex-shrink-0">
                                        {image && (
                                          <WixMediaImage
                                            media={{ image: image }}
                                            width={64}
                                            height={64}
                                          />
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-content-primary font-medium text-sm truncate">
                                          {title}
                                        </h3>
                                        {selectedOptions.length > 0 && (
                                          <div className="mt-1 mb-2">
                                            <div className="flex flex-wrap gap-1">
                                              {selectedOptions.map(
                                                (option, index) => {
                                                  const isColor =
                                                    typeof option.value ===
                                                    'object';
                                                  const text = isColor
                                                    ? (option.value as any).name
                                                    : option.value;
                                                  const color = isColor
                                                    ? (option.value as any).code
                                                    : null;

                                                  return (
                                                    <div
                                                      key={index}
                                                      className="flex items-center gap-1 text-xs text-content-light"
                                                    >
                                                      <span>
                                                        {option.name}:
                                                      </span>
                                                      <div className="flex items-center gap-1">
                                                        {color && (
                                                          <div
                                                            className="w-3 h-3 rounded-full border border-surface-strong"
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
                                                        <span className="text-content-subtle">
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
                                        <p className="text-accent font-semibold text-sm mt-1">
                                          {price}
                                        </p>

                                        <div className="flex items-center justify-between mt-3">
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={onDecrease}
                                              className="w-6 h-6 rounded bg-surface-interactive text-content-primary text-sm hover:bg-surface-interactive-hover transition-colors"
                                            >
                                              -
                                            </button>
                                            <span className="text-content-primary text-sm w-6 text-center">
                                              {quantity}
                                            </span>
                                            <button
                                              onClick={onIncrease}
                                              className="w-6 h-6 rounded bg-surface-interactive text-content-primary text-sm hover:bg-surface-interactive-hover transition-colors"
                                            >
                                              +
                                            </button>
                                          </div>

                                          <button
                                            onClick={onRemove}
                                            className="text-status-danger hover:text-status-error text-xs transition-colors"
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
                              <div className="w-16 h-16 bg-surface-interactive rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                  className="w-8 h-8 text-content-muted"
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
                              <p className="text-content-muted">
                                Your cart is empty
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </CurrentCart.Items>
                  </div>

                  <div className="border-t border-surface-subtle p-6">
                    <CurrentCart.Notes>
                      {({ notes, onNotesChange }) => (
                        <div>
                          <label className="block text-xs font-medium text-content-secondary mb-2">
                            Notes:
                          </label>
                          <textarea
                            value={notes}
                            onChange={e => onNotesChange(e.target.value)}
                            placeholder="Special instructions for your order (e.g., gift wrap, delivery notes)"
                            rows={2}
                            className="w-full px-2 py-1 text-xs bg-surface-interactive border border-surface-interactive rounded text-content-primary placeholder:text-content-muted focus:border-brand-light focus:outline-none transition-colors duration-200 resize-vertical mb-4"
                          />
                        </div>
                      )}
                    </CurrentCart.Notes>

                    {/* Coupon Code */}
                    <CurrentCart.Coupon>
                      {({
                        appliedCoupon,
                        onApply,
                        onRemove,
                        isLoading,
                        error,
                      }) => (
                        <div className="mb-4">
                          {appliedCoupon ? (
                            <div className="flex items-center justify-between p-2 bg-status-success-light border border-status-success rounded">
                              <span className="text-status-success text-xs font-medium">
                                Coupon: {appliedCoupon}
                              </span>
                              <button
                                onClick={onRemove}
                                disabled={isLoading}
                                className="text-status-danger hover:text-status-error text-xs disabled:opacity-50"
                              >
                                {isLoading ? 'Removing...' : 'Remove'}
                              </button>
                            </div>
                          ) : (
                            <CouponFormMini
                              onApply={onApply}
                              isLoading={isLoading}
                            />
                          )}
                          {error && error.includes('coupon') && (
                            <div className="bg-status-danger-light border border-status-danger rounded p-2 mt-2">
                              <p className="text-status-danger text-xs">
                                {error}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CurrentCart.Coupon>
                    <CurrentCart.Summary>
                      {({
                        subtotal,
                        discount,
                        appliedCoupon,
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
                            <span className="text-content-muted">
                              Calculating...
                            </span>
                          ) : (
                            children
                          );

                        return (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-content-secondary">
                                  Subtotal ({itemCount}{' '}
                                  {itemCount === 1 ? 'item' : 'items'})
                                </span>
                                <span className="text-content-primary font-semibold">
                                  <LoadingOrValue>{subtotal}</LoadingOrValue>
                                </span>
                              </div>
                              {appliedCoupon && discount && (
                                <div className="flex justify-between">
                                  <span className="text-status-success">
                                    Discount
                                  </span>
                                  <span className="text-status-success font-semibold">
                                    {isTotalsLoading ? (
                                      <span className="text-content-muted">
                                        Calculating...
                                      </span>
                                    ) : (
                                      `-${discount}`
                                    )}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-content-secondary">
                                  Shipping
                                </span>
                                <span className="text-content-primary font-semibold">
                                  <LoadingOrValue>{shipping}</LoadingOrValue>
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-content-secondary">
                                  Tax
                                </span>
                                <span className="text-content-primary font-semibold">
                                  <LoadingOrValue>{tax}</LoadingOrValue>
                                </span>
                              </div>
                              <div className="border-t border-surface-interactive pt-2">
                                <div className="flex justify-between">
                                  <span className="text-content-primary font-bold">
                                    Total
                                  </span>
                                  <span className="text-content-primary font-bold text-lg">
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
                                  className="w-full bg-gradient-primary bg-gradient-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-content-primary font-semibold py-3 px-6 rounded-lg transition-all duration-200"
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
    </>
  );
}
