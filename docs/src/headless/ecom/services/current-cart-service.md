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

### Basic Service Registration
```typescript
import { CurrentCartService, CurrentCartServiceDefinition } from './headless/ecom/services/current-cart-service';

// Register with services manager
const servicesMap = createServicesMap()
  .addService(CurrentCartServiceDefinition, CurrentCartService);
```

### Using Cart in React Components
```tsx
import { useService } from '@wix/services-manager-react';
import { CurrentCartServiceDefinition } from './headless/ecom/services/current-cart-service';

function CartComponent() {
  const cartService = useService(CurrentCartServiceDefinition);
  
  // Access reactive cart state
  const cart = cartService.cart.use();
  const isLoading = cartService.isLoading.use();
  const cartCount = cartService.cartCount.use();
  
  const handleAddToCart = async () => {
    await cartService.addToCart([{
      catalogReference: {
        appId: 'app-id',
        catalogItemId: 'product-id',
        options: {
          variantId: 'variant-id'
        }
      },
      quantity: 1
    }]);
  };
  
  return (
    <div>
      <p>Items in cart: {cartCount}</p>
      {isLoading && <p>Loading...</p>}
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

### Cart Management Operations
```typescript
const cartService = useService(CurrentCartServiceDefinition);

// Add items to cart
await cartService.addToCart([{
  catalogReference: {
    appId: 'stores-app-id',
    catalogItemId: 'product-123',
    options: { variantId: 'variant-456' }
  },
  quantity: 2
}]);

// Update item quantity
await cartService.updateLineItemQuantity('line-item-id', 3);

// Remove item from cart
await cartService.removeLineItem('line-item-id');

// Apply coupon
await cartService.applyCoupon('DISCOUNT10');

// Proceed to checkout
await cartService.proceedToCheckout();
```

### Cart State Monitoring
```tsx
function CartStatus() {
  const cartService = useService(CurrentCartServiceDefinition);
  
  const cart = cartService.cart.use();
  const cartTotals = cartService.cartTotals.use();
  const error = cartService.error.use();
  const isCouponLoading = cartService.isCouponLoading.use();
  
  return (
    <div>
      {error && <div className="error">{error}</div>}
      
      {cart?.lineItems?.map(item => (
        <div key={item._id}>
          {item.name} - Quantity: {item.quantity}
          <button onClick={() => cartService.increaseLineItemQuantity(item._id!)}>
            +
          </button>
          <button onClick={() => cartService.decreaseLineItemQuantity(item._id!)}>
            -
          </button>
        </div>
      ))}
      
      {cartTotals && (
        <div>
          Subtotal: {cartTotals.priceSummary?.subtotal?.amount}
          {cartTotals.appliedDiscounts && <p>Discounts applied!</p>}
        </div>
      )}
      
      {isCouponLoading && <p>Applying coupon...</p>}
    </div>
  );
}
```

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
            value={buyerNotes}
            onChange={(e) => cartService.setBuyerNotes(e.target.value)}
            placeholder="Special instructions..."
          />
          
          {/* Totals and Checkout */}
          {cartTotals && (
            <div>
              <p>Subtotal: {cartTotals.priceSummary?.subtotal?.formattedAmount}</p>
              <p>Total: {cartTotals.priceSummary?.total?.formattedAmount}</p>
            </div>
          )}
          
          <button onClick={() => cartService.proceedToCheckout()}>
            Checkout
          </button>
        </div>
      )}
    </>
  );
}
```
