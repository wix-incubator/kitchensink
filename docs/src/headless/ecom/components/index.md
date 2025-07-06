# Ecom Components Index

This module exports all the headless components for e-commerce functionality.

## Overview

The ecom components provide headless functionality for shopping cart and e-commerce operations. These components are designed to be framework-agnostic and use render props patterns for maximum flexibility.

## Exports

### CurrentCart

The main e-commerce component namespace providing cart functionality.

**Signature:**
```tsx
export * as CurrentCart from "./CurrentCart";
```

The CurrentCart namespace includes:
- `Trigger` - Cart trigger/icon with item count
- `Content` - Cart modal/drawer content
- `Items` - Cart items collection
- `Item` - Individual cart item
- `Summary` - Cart totals and summary
- `Clear` - Clear cart functionality
- `Checkout` - Checkout initiation
- `Notes` - Buyer notes management
- `Coupon` - Coupon code management

**Example:**
```tsx
import { CurrentCart } from "../../headless/ecom/components";

// Use any of the CurrentCart components
<CurrentCart.Trigger>
  {({ itemCount, hasItems, onOpen }) => (
    <button onClick={onOpen}>
      Cart ({itemCount})
    </button>
  )}
</CurrentCart.Trigger>
```

## Usage Examples

The ecom components are used throughout the application:

### In WixServicesProvider
```tsx
// src/providers/WixServicesProvider.tsx
import { CurrentCart } from "../headless/ecom/components";

export default function WixServicesProvider({ children, showCartIcon = false }) {
  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      {showCartIcon ? (
        <StoreLayout currentCartServiceConfig={null}>
          {children}
        </StoreLayout>
      ) : (
        children
      )}
    </ServicesManagerProvider>
  );
}
```

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
import { MiniCartContent, MiniCartIcon } from "../components/ecom/MiniCart";

export function StoreLayout({ children, currentCartServiceConfig }) {
  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <MiniCartIcon />
      {children}
      <MiniCartContent />
    </ServicesManagerProvider>
  );
}
```

### In Product Details
```tsx
// src/components/store/ProductDetails.tsx
import { CurrentCart } from "../../headless/ecom/components";

export default function ProductDetails() {
  return (
    <div>
      {/* Product information */}
      <CurrentCart.Trigger>
        {({ itemCount }) => (
          <span>Items in cart: {itemCount}</span>
        )}
      </CurrentCart.Trigger>
    </div>
  );
}
```

### In React Router App
```tsx
// src/react-pages/react-router/[...path].tsx
import { WixServicesProvider } from "../../providers/WixServicesProvider";

export default function ReactRouterApp() {
  return (
    <WixServicesProvider showCartIcon={true}>
      <GlobalCartLoader>
        <Routes>
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </GlobalCartLoader>
    </WixServicesProvider>
  );
}
``` 