# Current Cart Service

## Overview

The CurrentCartService is a comprehensive headless service that manages shopping cart functionality in a Wix e-commerce application. It provides reactive state management for cart operations including adding/removing items, quantity updates, coupon management, and checkout flow initiation. The service uses Wix's signals system for reactive updates and handles all the complexity of cart state management.

This service follows the Wix services pattern, providing a clean API for cart operations while handling loading states, error management, and automatic cart totals estimation. It integrates with Wix's e-commerce APIs and redirect services to provide a complete shopping cart experience.

## Exports

### `CurrentCartServiceAPI`
**Type**: `interface`

TypeScript interface defining the complete API surface for cart operations, including reactive signals for state and methods for cart manipulation.

### `CurrentCartServiceDefinition`
**Type**: `ServiceDefinition<CurrentCartServiceAPI>`

Service definition that identifies and types the current cart service within Wix's service manager system.

### `CurrentCartService`
**Type**: `ServiceImplementation<CurrentCartServiceAPI>`

Main service implementation that provides all cart functionality including state management, CRUD operations, and checkout flow integration.

### `loadCurrentCartServiceConfig`
**Type**: `() => Promise<ServiceFactoryConfig<typeof CurrentCartService>>`

Async function that loads the initial cart configuration from Wix APIs, handling cases where no cart exists yet.

## Usage Examples

### Complete Cart Integration
```tsx
import { useState } from 'react';

function ShoppingCart() {
  const cartService = useService(CurrentCartServiceDefinition);
  const [couponCode, setCouponCode] = useState('');
  
  const cart = cartService.cart.use();
  const isOpen = cartService.isOpen.use();
  const cartTotals = cartService.cartTotals.use();
  const buyerNotes = cartService.buyerNotes.use();
  
  return (
    <>
      {/* Cart Toggle */}
      <button onClick={() => cartService.openCart()}>
        Cart ({cartService.cartCount.use()})
      </button>
      
      {/* Cart Drawer */}
      {isOpen && (
        <div className="cart-drawer">
          <button onClick={() => cartService.closeCart()}>Close</button>
          
          {/* Cart Items */}
          {cart?.lineItems?.map(item => (
            <div key={item._id} className="cart-item">
              <span>{item.name}</span>
              <div>
                <button onClick={() => cartService.decreaseLineItemQuantity(item._id!)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => cartService.increaseLineItemQuantity(item._id!)}>
                  +
                </button>
              </div>
              <button onClick={() => cartService.removeLineItem(item._id!)}>
                Remove
              </button>
            </div>
          ))}
          
          {/* Coupon Section */}
          <div>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
            />
            <button onClick={() => cartService.applyCoupon(couponCode)}>
              Apply
            </button>
            {cart?.coupon && (
              <button onClick={() => cartService.removeCoupon()}>
                Remove Coupon
              </button>
            )}
          </div>
          
          {/* Buyer Notes */}
          <textarea
            value={buyerNotes || ''}
            onChange={(e) => cartService.updateBuyerNote(e.target.value)}
            placeholder="Add a note..."
          />
          
          {/* Checkout */}
          <button onClick={() => cartService.proceedToCheckout()}>
            Checkout
          </button>
        </div>
      )}
    </>
  );
}
```
