import { CurrentCart } from '@wix/headless-ecom/react';
import { WixMediaImage } from '../../headless/media/components';
import { useNavigation } from '../NavigationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CartContent() {
  const Navigation = useNavigation();
  return (
    <div data-testid="cart-summary">
      <CurrentCart.Content>
        {({ cart, isLoading }) => (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <CurrentCart.OpenTrigger>
                {({ totalItems }) => (
                  <p className="text-content-secondary text-xl">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in your
                    cart
                  </p>
                )}
              </CurrentCart.OpenTrigger>
            </div>

            {/* Loading State */}
            {isLoading && !cart && (
              <div className="flex justify-center items-center min-h-64">
                <div className="flex items-center gap-3">
                  <svg
                    className="animate-spin w-8 h-8 text-content-primary"
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
                  <span className="text-content-primary text-lg">
                    Loading your cart...
                  </span>
                </div>
              </div>
            )}

            {/* Empty Cart */}
            <CurrentCart.EmptyState>
              <div className="text-center py-16">
                <div className="w-32 h-32 bg-surface-primary rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg
                    className="w-16 h-16 text-content-muted"
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
                <h2 className="text-3xl font-bold text-content-primary mb-4">
                  Your cart is empty
                </h2>
                <p className="text-content-light text-lg mb-8">
                  Start shopping to add items to your cart
                </p>
                <Navigation route="/store">
                  <Button size="lg" className="p-6 text-md">
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
                  </Button>
                </Navigation>
              </div>
            </CurrentCart.EmptyState>

            {/* Cart with Items */}
            <CurrentCart.LineItemsList>
              {({ totalItems, items }) =>
                totalItems > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                      <Card className="bg-surface-card border-surface-subtle">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl text-content-primary font-theme-heading">
                              Cart Items
                            </CardTitle>
                            <CurrentCart.Clear>
                              {({ clear, totalItems, isLoading }) =>
                                totalItems > 0 && (
                                  <Button
                                    onClick={clear}
                                    disabled={isLoading}
                                    variant="ghost"
                                    size="sm"
                                    className="text-status-error hover:text-status-error/80"
                                  >
                                    Clear all items
                                  </Button>
                                )
                              }
                            </CurrentCart.Clear>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-6">
                            {items.map((item: any) => (
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
                                  isLoading: itemLoading,
                                }) => (
                                  <Card className="bg-surface-card border-surface-subtle">
                                    <CardContent className="flex items-center space-x-6 pt-6">
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
                                            className="h-24 w-24 rounded-lg border-surface-interactive overflow-hidden"
                                          />
                                        ) : (
                                          <div className="h-24 w-24 bg-surface-primary rounded-lg flex items-center justify-center border border-surface-interactive">
                                            <svg
                                              className="w-8 h-8 text-content-subtle"
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

                                      {/* Product Details */}
                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-semibold text-content-primary mb-2">
                                          {title}
                                        </h3>

                                        {/* Selected Options */}
                                        {selectedOptions.length > 0 && (
                                          <div className="mb-3">
                                            <div className="flex flex-wrap gap-2">
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
                                                      className="flex items-center gap-2 px-3 py-1 bg-surface-interactive rounded-full border border-surface-interactive"
                                                    >
                                                      <span className="text-sm text-content-secondary font-medium">
                                                        {option.name}:
                                                      </span>
                                                      <div className="flex items-center gap-1">
                                                        {color && (
                                                          <div
                                                            className="w-4 h-4 rounded-full border border-color-swatch"
                                                            style={{
                                                              backgroundColor:
                                                                color,
                                                            }}
                                                            title={text}
                                                          />
                                                        )}
                                                        <span className="text-sm text-content-primary font-medium">
                                                          {text}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        <p className="text-2xl font-bold text-content-primary">
                                          {price}
                                        </p>
                                      </div>

                                      {/* Quantity Controls */}
                                      <div className="flex items-center space-x-3">
                                        <Button
                                          onClick={decreaseQuantity}
                                          disabled={
                                            itemLoading || quantity <= 1
                                          }
                                          variant="outline"
                                          size="icon"
                                          className="bg-surface-card border-surface-subtle text-content-primary"
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
                                        </Button>

                                        <span className="text-xl font-bold text-content-primary min-w-12 text-center bg-surface-primary rounded-lg py-2 px-3 border border-surface-interactive">
                                          {quantity}
                                        </span>

                                        <Button
                                          onClick={increaseQuantity}
                                          disabled={itemLoading}
                                          variant="outline"
                                          size="icon"
                                          className="bg-surface-card border-surface-subtle text-content-primary"
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
                                        </Button>
                                      </div>

                                      {/* Remove Button */}
                                      <Button
                                        onClick={remove}
                                        disabled={itemLoading}
                                        variant="ghost"
                                        size="icon"
                                        className="text-status-error hover:text-status-error/80 hover:bg-surface-error"
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
                                      </Button>
                                    </CardContent>
                                  </Card>
                                )}
                              </CurrentCart.Item>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                      <Card className="bg-surface-card border-surface-subtle">
                        <CardHeader>
                          <CardTitle className="text-2xl text-content-primary font-theme-heading">
                            Order Summary
                          </CardTitle>
                        </CardHeader>

                        <CardContent>
                          {/* Order Notes */}
                          <div className="mb-6">
                            <CurrentCart.Notes>
                              {({ notes, updateNotes }) => (
                                <div>
                                  <label className="block text-sm font-medium text-content-primary mb-2">
                                    Notes:
                                  </label>
                                  <Textarea
                                    value={notes}
                                    onChange={e => updateNotes(e.target.value)}
                                    placeholder="Special instructions for your order (e.g., gift wrap, delivery notes)"
                                    rows={3}
                                    className="resize-vertical bg-surface-interactive border border-surface-interactive text-content-primary placeholder:text-content-muted focus:border-brand-primary"
                                  />
                                </div>
                              )}
                            </CurrentCart.Notes>
                          </div>

                          {/* Coupon Code */}
                          <div className="mb-6">
                            <CurrentCart.Coupon>
                              {({
                                appliedCoupon,
                                apply,
                                remove,
                                isLoading,
                              }) => (
                                <div>
                                  {appliedCoupon ? (
                                    <div className="flex items-center justify-between p-3 bg-status-success-light border border-status-success rounded-lg">
                                      <span className="text-status-success text-sm font-medium">
                                        Coupon: {appliedCoupon}
                                      </span>
                                      <Button
                                        onClick={remove}
                                        disabled={isLoading}
                                        variant="link"
                                        size="sm"
                                        className="text-status-error hover:text-status-error/80"
                                      >
                                        {isLoading ? 'Removing...' : 'Remove'}
                                      </Button>
                                    </div>
                                  ) : (
                                    <form
                                      onSubmit={e => {
                                        e.preventDefault();
                                        const formData = new FormData(
                                          e.currentTarget
                                        );
                                        const code = formData.get(
                                          'couponCode'
                                        ) as string;
                                        if (code?.trim()) {
                                          apply(code.trim());
                                        }
                                      }}
                                      className="space-y-3"
                                    >
                                      <Input
                                        type="text"
                                        name="couponCode"
                                        placeholder="Enter promo code"
                                        disabled={isLoading}
                                        className="bg-surface-interactive border border-surface-interactive text-content-primary placeholder:text-content-muted focus:border-brand-primary"
                                      />
                                      <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full"
                                        size="sm"
                                      >
                                        {isLoading
                                          ? 'Applying...'
                                          : 'Apply Coupon'}
                                      </Button>
                                    </form>
                                  )}
                                </div>
                              )}
                            </CurrentCart.Coupon>
                          </div>

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
                                  <div className="space-y-3">
                                    <div className="flex justify-between text-lg text-content-primary">
                                      <span>
                                        Subtotal ({totalItems}{' '}
                                        {totalItems === 1 ? 'item' : 'items'})
                                      </span>
                                      <span className="font-semibold">
                                        <LoadingOrValue>
                                          {subtotal}
                                        </LoadingOrValue>
                                      </span>
                                    </div>
                                    {appliedCoupon && discount && (
                                      <div className="flex justify-between text-lg text-status-success">
                                        <span>Discount</span>
                                        <span className="font-semibold">
                                          -
                                          <LoadingOrValue>
                                            {discount}
                                          </LoadingOrValue>
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between text-lg text-content-primary">
                                      <span>Shipping</span>
                                      <span className="font-semibold">
                                        <LoadingOrValue>
                                          {shipping}
                                        </LoadingOrValue>
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-lg text-content-primary">
                                      <span>Tax</span>
                                      <span className="font-semibold">
                                        <LoadingOrValue>{tax}</LoadingOrValue>
                                      </span>
                                    </div>
                                  </div>

                                  <div className="border-t border-surface-interactive pt-4">
                                    <div className="flex justify-between text-xl font-bold text-content-primary">
                                      <span>Total</span>
                                      <span>
                                        <LoadingOrValue>{total}</LoadingOrValue>
                                      </span>
                                    </div>
                                  </div>

                                  <CurrentCart.Checkout>
                                    {({
                                      proceedToCheckout,
                                      canCheckout: canProceed,
                                      isLoading: checkoutLoading,
                                      error: checkoutError,
                                    }) => (
                                      <div className="space-y-4">
                                        {checkoutError && (
                                          <div className="bg-status-danger-light border border-status-danger rounded p-2 mt-2">
                                            <p className="text-status-danger text-xs">
                                              {checkoutError}
                                            </p>
                                          </div>
                                        )}

                                        <Button
                                          data-testid="proceed-to-checkout-button"
                                          onClick={proceedToCheckout}
                                          disabled={
                                            !canProceed || checkoutLoading
                                          }
                                          className="w-full py-4 px-6 transform hover:scale-105 font-bold"
                                          variant={
                                            canProceed ? 'default' : 'secondary'
                                          }
                                          size="lg"
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
                                            'Proceed to Checkout'
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                  </CurrentCart.Checkout>

                                  <div className="text-center pt-4">
                                    <Navigation route="/store">
                                      <Button
                                        variant="link"
                                        className="text-brand-primary hover:text-brand-light font-medium"
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
                                      </Button>
                                    </Navigation>
                                  </div>
                                </div>
                              );
                            }}
                          </CurrentCart.Summary>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )
              }
            </CurrentCart.LineItemsList>
          </>
        )}
      </CurrentCart.Content>
    </div>
  );
}
