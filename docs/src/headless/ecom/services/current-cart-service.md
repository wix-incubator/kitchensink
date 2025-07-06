# Current Cart Service

The Current Cart Service provides reactive state management for shopping cart functionality in e-commerce applications. It handles cart operations, loading states, and provides signals for cart data.

## Overview

The Current Cart Service is a headless service that manages:
- Cart state and line items
- Loading states for various operations
- Cart totals and calculations
- Buyer notes and coupon codes
- Cart modal state (open/closed)
- Checkout flow initiation

## API Interface

### CurrentCartServiceAPI

The main interface defining all available cart operations and state signals.

**Signature:**
```tsx
interface CurrentCartServiceAPI {
  // State signals
  cart: Signal<currentCart.Cart | null>;
  isOpen: Signal<boolean>;
  isLoading: Signal<boolean>;
  isTotalsLoading: Signal<boolean>;
  isCouponLoading: Signal<boolean>;
  error: Signal<string | null>;
  cartCount: ReadOnlySignal<number>;
  buyerNotes: Signal<string>;
  cartTotals: Signal<any | null>;

  // Cart operations
  addToCart: (lineItems: currentCart.AddToCurrentCartRequest["lineItems"]) => Promise<void>;
  removeLineItem: (lineItemId: string) => Promise<void>;
  updateLineItemQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  increaseLineItemQuantity: (lineItemId: string) => Promise<void>;
  decreaseLineItemQuantity: (lineItemId: string) => Promise<void>;
  
  // Cart management
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => Promise<void>;
  
  // Additional features
  setBuyerNotes: (notes: string) => Promise<void>;
  proceedToCheckout: () => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  reloadCart: () => Promise<void>;
}
```

## Exports

### CurrentCartServiceDefinition

The service definition for dependency injection.

**Signature:**
```tsx
export const CurrentCartServiceDefinition = defineService<CurrentCartServiceAPI>("currentCart");
```

**Example:**
```tsx
import { CurrentCartServiceDefinition } from "../headless/ecom/services/current-cart-service";

// Use in services manager
const servicesManager = createServicesManager(
  createServicesMap()
    .addService(CurrentCartServiceDefinition, CurrentCartService)
);
```

### CurrentCartService

The service implementation with reactive state management.

**Signature:**
```tsx
export const CurrentCartService = implementService.withConfig<{
  initialCart?: currentCart.Cart | null;
}>()(CurrentCartServiceDefinition, ({ getService, config }) => {
  // Implementation details
});
```

**Example:**
```tsx
import { CurrentCartService, CurrentCartServiceDefinition } from "../headless/ecom/services/current-cart-service";

// Configure service with initial state
const currentCartConfig = {
  initialCart: null
};

const servicesManager = createServicesManager(
  createServicesMap()
    .addService(CurrentCartServiceDefinition, CurrentCartService, currentCartConfig)
);
```

### loadCurrentCartServiceConfig

Utility function to load the current cart service configuration.

**Signature:**
```tsx
export async function loadCurrentCartServiceConfig(): Promise<
  ServiceFactoryConfig<typeof CurrentCartService>
>
```

**Example:**
```tsx
import { loadCurrentCartServiceConfig } from "../headless/ecom/services/current-cart-service";

// Load configuration
const currentCartServiceConfig = await loadCurrentCartServiceConfig();

// Use in Astro page or component
export { currentCartServiceConfig };
```

## State Signals

### cart
Current cart data including line items, totals, and metadata.

**Type:** `Signal<currentCart.Cart | null>`

### isOpen
Whether the cart modal/drawer is currently open.

**Type:** `Signal<boolean>`

### isLoading
General loading state for cart operations.

**Type:** `Signal<boolean>`

### isTotalsLoading
Loading state specifically for cart totals calculation.

**Type:** `Signal<boolean>`

### isCouponLoading
Loading state for coupon operations.

**Type:** `Signal<boolean>`

### error
Error message from cart operations.

**Type:** `Signal<string | null>`

### cartCount
Computed read-only signal for total item count in cart.

**Type:** `ReadOnlySignal<number>`

### buyerNotes
Customer notes for the order.

**Type:** `Signal<string>`

### cartTotals
Calculated cart totals including tax, shipping, and discounts.

**Type:** `Signal<any | null>`

## Cart Operations

### addToCart
Adds products to the cart.

**Signature:**
```tsx
addToCart: (lineItems: currentCart.AddToCurrentCartRequest["lineItems"]) => Promise<void>
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

await service.addToCart([
  {
    catalogReference: {
      appId: "app-id",
      catalogItemId: "product-id",
      options: {
        variantId: "variant-id"
      }
    },
    quantity: 1
  }
]);
```

### removeLineItem
Removes a specific line item from the cart.

**Signature:**
```tsx
removeLineItem: (lineItemId: string) => Promise<void>
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

await service.removeLineItem("line-item-id");
```

### updateLineItemQuantity
Updates the quantity of a specific line item.

**Signature:**
```tsx
updateLineItemQuantity: (lineItemId: string, quantity: number) => Promise<void>
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

await service.updateLineItemQuantity("line-item-id", 3);
```

### increaseLineItemQuantity
Increases the quantity of a line item by 1.

**Signature:**
```tsx
increaseLineItemQuantity: (lineItemId: string) => Promise<void>
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

await service.increaseLineItemQuantity("line-item-id");
```

### decreaseLineItemQuantity
Decreases the quantity of a line item by 1.

**Signature:**
```tsx
decreaseLineItemQuantity: (lineItemId: string) => Promise<void>
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

await service.decreaseLineItemQuantity("line-item-id");
```

## Cart Management

### openCart
Opens the cart modal/drawer.

**Signature:**
```tsx
openCart: () => void
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

service.openCart();
```

### closeCart
Closes the cart modal/drawer.

**Signature:**
```tsx
closeCart: () => void
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

service.closeCart();
```

### clearCart
Removes all items from the cart.

**Signature:**
```tsx
clearCart: () => Promise<void>
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

await service.clearCart();
```

## Additional Features

### setBuyerNotes
Sets customer notes for the order.

**Signature:**
```tsx
setBuyerNotes: (notes: string) => Promise<void>
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

await service.setBuyerNotes("Please handle with care");
```

### proceedToCheckout
Initiates the checkout flow.

**Signature:**
```tsx
proceedToCheckout: () => Promise<void>
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

await service.proceedToCheckout();
```

### applyCoupon
Applies a coupon code to the cart.

**Signature:**
```tsx
applyCoupon: (couponCode: string) => Promise<void>
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

await service.applyCoupon("SAVE20");
```

### removeCoupon
Removes the applied coupon from the cart.

**Signature:**
```tsx
removeCoupon: () => Promise<void>
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

await service.removeCoupon();
```

### reloadCart
Refreshes the cart data from the server.

**Signature:**
```tsx
reloadCart: () => Promise<void>
```

**Example:**
```tsx
const service = useService(CurrentCartServiceDefinition);

await service.reloadCart();
```

## Usage Examples

The Current Cart Service is used throughout the application:

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../headless/ecom/services/current-cart-service";

export function StoreLayout({ currentCartServiceConfig }) {
  const servicesManager = createServicesManager(
    createServicesMap()
      .addService(CurrentCartServiceDefinition, CurrentCartService, currentCartServiceConfig)
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <MiniCartIcon />
      {children}
      <MiniCartContent />
    </ServicesManagerProvider>
  );
}
```

### In Product Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
import { CurrentCartServiceDefinition } from "../../../headless/ecom/services/current-cart-service";

export default function ProductDetailPage({ currentCartServiceConfig }) {
  const servicesManager = createServicesManager(
    createServicesMap()
      .addService(CurrentCartServiceDefinition, CurrentCartService, currentCartServiceConfig)
  );

  return (
    <StoreLayout
      currentCartServiceConfig={currentCartServiceConfig}
      servicesManager={servicesManager}
    >
      <ProductDetails />
    </StoreLayout>
  );
}
```

### In WixServicesProvider
```tsx
// src/providers/WixServicesProvider.tsx
import { CurrentCartServiceDefinition, CurrentCartService } from "../headless/ecom/services/current-cart-service";

export default function WixServicesProvider({ children }) {
  const servicesMap = createServicesMap()
    .addService(CurrentCartServiceDefinition, CurrentCartService);

  const servicesManager = createServicesManager(servicesMap);

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      {children}
    </ServicesManagerProvider>
  );
}
```

### In React Router App
```tsx
// src/react-pages/react-router/Routes.tsx
import { CurrentCartServiceDefinition } from "../../headless/ecom/services/current-cart-service";

function ProductDetailsRoute() {
  const cartService = useService(CurrentCartServiceDefinition);
  
  return (
    <ProductDetails 
      onAddToCart={cartService.addToCart}
      cartCount={cartService.cartCount.get()}
    />
  );
}
``` 