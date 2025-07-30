import { useState } from 'react';
import { CurrentCart } from '@wix/headless-ecom/react';
import { WixMediaImage } from '../../headless/media/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// Mini coupon form for the cart sidebar
const CouponFormMini = ({
  apply,
  isLoading,
}: {
  apply: (code: string) => void;
  isLoading: boolean;
}) => {
  const [code, setCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      apply(code.trim());
      setCode('');
    }
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        variant="link"
        size="sm"
        className="text-accent hover:text-brand-light text-xs font-medium h-auto p-0"
      >
        Have a promo code?
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-1 pt-4">
        <Input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Promo code"
          className="h-7 bg-surface-interactive border border-surface-interactive text-content-primary placeholder:text-content-muted focus:border-brand-primary"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!code.trim() || isLoading}
          className="px-2 py-1 text-xs font-medium h-auto"
          size="sm"
          variant="secondary"
        >
          {isLoading ? '...' : 'Apply'}
        </Button>
      </div>
      <Button
        type="button"
        onClick={() => setIsExpanded(false)}
        variant="link"
        size="sm"
        className="text-content-muted hover:text-content-secondary"
      >
        Cancel
      </Button>
    </form>
  );
};

const DefaultMiniCartIcon = () => (
  <div className="p-2 text-content-primary ">
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
  </div>
);

export function MiniCartIcon({
  Icon = DefaultMiniCartIcon,
  className = 'fixed top-6 right-6 z-50',
}: {
  Icon?: React.ComponentType;
  className?: string;
}) {
  return (
    <>
      {/* Fixed Cart Icon */}
      <div className={className}>
        <CurrentCart.OpenTrigger>
          {({ open, totalItems }) => (
            <Button
              onClick={open}
              variant="link"
              size="icon"
              className="relative [&_svg]:pointer-events-none [&_svg]:size-6"
            >
              <Icon />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-medium text-content-primary text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          )}
        </CurrentCart.OpenTrigger>
      </div>
    </>
  );
}

export function MiniCartContent() {
  return (
    <>
      {/* Cart Modal */}
      <CurrentCart.Content>
        {({ isOpen, close }) => {
          // Lock body scroll when modal is open
          if (typeof document !== 'undefined') {
            if (isOpen) {
              document.body.style.overflow = 'hidden';
            } else {
              document.body.style.overflow = 'unset';
            }
          }

          return (
            <div className="wix-verticals-container">
              {isOpen && (
                <div
                  className="fixed inset-0 z-50 bg-surface-overlay backdrop-blur-sm"
                  onClick={close}
                >
                  <div
                    className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-modal shadow-xl flex flex-col"
                    onClick={e => e.stopPropagation()}
                  >
                    <CurrentCart.Summary>
                      {({ totalItems }) => (
                        <div className="flex items-center justify-between p-6 border-b border-surface-subtle flex-shrink-0">
                          <h2 className="text-xl font-bold text-content-primary">
                            Shopping Cart ({totalItems})
                          </h2>
                          <Button
                            onClick={close}
                            variant="link"
                            size="icon"
                            className="text-content-primary [&_svg]:size-6"
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
                          </Button>
                        </div>
                      )}
                    </CurrentCart.Summary>

                    <div className="flex-1 overflow-y-auto p-6 min-h-0">
                      <CurrentCart.EmptyState>
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
                      </CurrentCart.EmptyState>
                      <CurrentCart.LineItemsList>
                        {({ totalItems, items }) =>
                          totalItems > 0 && (
                            <div className="space-y-4">
                              {items.map(item => (
                                <CurrentCart.Item key={item._id} item={item}>
                                  {({
                                    title,
                                    image,
                                    price,
                                    quantity,
                                    selectedOptions,
                                    increaseQuantity,
                                    decreaseQuantity,
                                    remove,
                                  }) => (
                                    <Card className="bg-surface-card border-surface-subtle">
                                      <CardContent className="flex gap-4 pt-6">
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
                                              <Button
                                                onClick={decreaseQuantity}
                                                variant="outline"
                                                size="icon"
                                                className="bg-surface-card border-surface-subtle text-content-primary w-7 h-7"
                                              >
                                                -
                                              </Button>
                                              <span className="text-content-primary text-sm w-6 text-center">
                                                {quantity}
                                              </span>
                                              <Button
                                                onClick={increaseQuantity}
                                                variant="outline"
                                                size="icon"
                                                className="bg-surface-card border-surface-subtle text-content-primary w-7 h-7"
                                              >
                                                +
                                              </Button>
                                            </div>

                                            <Button
                                              onClick={remove}
                                              variant="link"
                                              size="sm"
                                              className="text-status-danger hover:text-status-error"
                                            >
                                              Remove
                                            </Button>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </CurrentCart.Item>
                              ))}
                            </div>
                          )
                        }
                      </CurrentCart.LineItemsList>
                    </div>

                    <div className="border-t border-surface-subtle p-6 flex-shrink-0">
                      <CurrentCart.Notes>
                        {({ notes, updateNotes }) => (
                          <div className="mb-2">
                            <Label className="text-content-secondary text-sm">
                              Notes:
                            </Label>
                            <Textarea
                              value={notes}
                              onChange={e => updateNotes(e.target.value)}
                              placeholder="Special instructions for your order (e.g., gift wrap, delivery notes)"
                              rows={2}
                              className="resize-vertical bg-surface-interactive border border-surface-interactive text-content-primary placeholder:text-content-muted focus:border-brand-primary mt-2"
                            />
                          </div>
                        )}
                      </CurrentCart.Notes>

                      {/* Coupon Code */}
                      <CurrentCart.Coupon>
                        {({
                          appliedCoupon,
                          apply,
                          remove,
                          isLoading,
                          error,
                        }) => (
                          <div className="mb-4">
                            {appliedCoupon ? (
                              <div className="flex items-center justify-between p-2 bg-status-success-light border border-status-success rounded">
                                <Label className="text-status-success text-sm font-medium">
                                  Coupon: {appliedCoupon}
                                </Label>
                                <Button
                                  onClick={remove}
                                  disabled={isLoading}
                                  variant="link"
                                  size="sm"
                                  className="text-status-danger hover:text-status-error text-xs h-auto p-0"
                                >
                                  {isLoading ? 'Removing...' : 'Remove'}
                                </Button>
                              </div>
                            ) : (
                              <CouponFormMini
                                apply={apply}
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
                          totalItems,
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
                                    Subtotal ({totalItems}{' '}
                                    {totalItems === 1 ? 'item' : 'items'})
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
                                {({ proceedToCheckout, canCheckout }) => (
                                  <Button
                                    onClick={proceedToCheckout}
                                    disabled={!canCheckout}
                                    className="w-full font-semibold py-3 px-6"
                                    size="lg"
                                  >
                                    Proceed to Checkout
                                  </Button>
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
            </div>
          );
        }}
      </CurrentCart.Content>
    </>
  );
}
