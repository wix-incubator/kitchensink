import {
  LineItem,
  Cart,
  Commerce,
  Quantity,
  SelectedOption,
} from '@wix/headless-ecom/react';
import { useNavigation } from '../NavigationContext';
import { Button } from '@/components/ui/button';

export default function CartContent() {
  return (
    <div data-testid="cart-summary">
      <>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-content-primary mb-4">
            Shopping Cart
          </h1>
          <Cart.Summary asChild>
            {({ totalItems }, ref) => (
              <p
                ref={ref as React.Ref<HTMLParagraphElement>}
                className="text-content-secondary text-xl"
              >
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            )}
          </Cart.Summary>
        </div>

        {/* Cart with Items */}
        <Cart.LineItems emptyState={emptyCartState}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-surface-primary backdrop-blur-sm rounded-xl border border-surface-subtle p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-content-primary">
                    Cart Items
                  </h2>
                  <Cart.Clear className="text-status-error hover:text-status-error/80 text-sm font-medium transition-colors duration-200 disabled:opacity-50">
                    Clear all items
                  </Cart.Clear>
                </div>

                <div className="space-y-6">
                  <Cart.LineItemRepeater>
                    <div className="flex gap-4 p-4 border border-brand-light rounded-lg">
                      <LineItem.Image className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 space-y-2">
                        <LineItem.Title className="text-lg font-semibold text-content-primary" />
                        <LineItem.SelectedOptions>
                          <div className="flex flex-wrap gap-2">
                            <LineItem.SelectedOptionRepeater>
                              <SelectedOption.Text className="text-sm text-content-secondary" />
                              <SelectedOption.Color className="flex items-center gap-2 text-sm text-content-secondary" />
                            </LineItem.SelectedOptionRepeater>
                          </div>
                        </LineItem.SelectedOptions>

                        {/* Quantity Controls */}
                        <LineItem.Quantity steps={1}>
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center border border-brand-light rounded-lg">
                              <Quantity.Decrement className="px-3 py-1 hover:bg-surface-primary transition-colors" />
                              <Quantity.Input
                                disabled={true}
                                className="w-16 text-center py-1 border-x border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary"
                              />
                              <Quantity.Increment className="px-3 py-1 hover:bg-surface-primary transition-colors" />
                            </div>
                            <Quantity.Reset className="px-2 py-1 text-xs text-status-danger hover:text-status-danger/80 hover:bg-status-danger/10 rounded transition-colors">
                              Remove
                            </Quantity.Reset>
                          </div>
                        </LineItem.Quantity>
                      </div>
                    </div>
                  </Cart.LineItemRepeater>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface-primary backdrop-blur-sm rounded-xl border border-surface-subtle p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-content-primary mb-6">
                  Order Summary
                </h2>

                {/* Order Notes */}
                <div className="mb-6">
                  <Cart.Notes className="[&_textarea]:focus:border-surface-interactive [&_textarea]:focus:ring-0 [&_textarea]:focus:outline-none" />
                </div>

                {/* Coupon Section */}
                <>
                  <label className="block text-sm font-medium text-content-primary mb-2">
                    Coupon Code:
                  </label>
                  <Cart.Coupon.Root>
                    <div className="space-y-2 mb-6">
                      <Cart.Coupon.Input
                        placeholder="Enter coupon code"
                        className="w-full px-3 py-2 bg-surface-interactive border border-surface-interactive rounded-lg text-content-primary placeholder:text-content-muted focus:border-surface-interactive focus:ring-0 focus:outline-none transition-colors duration-200"
                      />
                      <Cart.Coupon.Trigger className="w-full text-content-primary font-medium py-2 px-6 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-center text-sm btn-primary">
                        Apply Coupon
                      </Cart.Coupon.Trigger>
                      <Cart.Coupon.Clear>Remove</Cart.Coupon.Clear>
                    </div>
                  </Cart.Coupon.Root>
                </>

                <div className="w-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg text-content-primary">
                      <Cart.Summary asChild>
                        {({ totalItems }) => (
                          <span>
                            Subtotal ({totalItems}{' '}
                            {totalItems === 1 ? 'item' : 'items'})
                          </span>
                        )}
                      </Cart.Summary>

                      <Cart.Totals.Price className="font-semibold" />
                    </div>
                    <Cart.Totals.Discount
                      className="flex justify-between text-lg text-status-success"
                      label="Discount"
                    />
                    <Cart.Totals.Shipping
                      className="flex justify-between text-lg text-content-primary"
                      label="Shipping"
                    />
                    <Cart.Totals.Tax
                      className="flex justify-between text-lg text-content-primary"
                      label="Tax"
                    />
                  </div>

                  <div className="border-t border-surface-interactive pt-4">
                    <Cart.Totals.Total
                      className="flex justify-between text-xl font-bold text-content-primary"
                      label="Total"
                    />
                  </div>
                  <Cart.Errors className="w-full bg-surface-error border border-status-error rounded-lg p-3 text-status-error text-xs" />

                  <Commerce.Actions.Checkout
                    className="btn-primary w-full text-content-primary font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    label="Proceed to Checkout"
                    loadingState="Processing..."
                  />

                  <div className="text-center pt-4">
                    <a
                      href="/"
                      className="text-brand-primary hover:text-brand-light font-medium transition-colors duration-200 flex items-center justify-center gap-2"
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
              </div>
            </div>
          </div>
        </Cart.LineItems>
      </>
    </div>
  );
}

const emptyCartState = () => {
  const Navigation = useNavigation();

  return (
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
  );
};
