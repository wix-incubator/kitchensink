# CurrentCart Components

The `CurrentCart` components provide headless cart functionality for e-commerce applications. These components use render props to provide cart data and actions, making them perfect building blocks for creating custom cart UIs.

## Overview

The CurrentCart module exports several headless components that work together to provide comprehensive cart functionality:

- **Trigger** - Cart trigger/icon with item count
- **Content** - Cart modal/drawer content
- **Items** - Cart items collection
- **Item** - Individual cart item
- **Summary** - Cart totals and summary
- **Clear** - Clear cart functionality
- **Checkout** - Checkout initiation
- **Notes** - Buyer notes management
- **Coupon** - Coupon code management

## Exports

### Trigger

A headless component for cart trigger with item count.

**Signature:**
```tsx
interface TriggerProps {
  children: (props: TriggerRenderProps) => React.ReactNode;
}

interface TriggerRenderProps {
  itemCount: number;
  hasItems: boolean;
  onOpen: () => void;
  isLoading: boolean;
}

export const Trigger: React.FC<TriggerProps>
```

**Example:**
```tsx
import { CurrentCart } from "../../headless/ecom/components";

<CurrentCart.Trigger>
  {({ itemCount, hasItems, onOpen, isLoading }) => (
    <button
      onClick={onOpen}
      className="relative p-3 bg-blue-500 rounded-full"
    >
      <CartIcon />
      {hasItems && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2">
          {itemCount}
        </span>
      )}
    </button>
  )}
</CurrentCart.Trigger>
```

### Content

A headless component for cart content/modal.

**Signature:**
```tsx
interface ContentProps {
  children: (props: ContentRenderProps) => React.ReactNode;
}

interface ContentRenderProps {
  isOpen: boolean;
  onClose: () => void;
  cart: currentCart.Cart | null;
  isLoading: boolean;
  error: string | null;
}

export const Content: React.FC<ContentProps>
```

**Example:**
```tsx
<CurrentCart.Content>
  {({ isOpen, onClose, cart, isLoading, error }) => (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          {cart && <CartContent cart={cart} />}
        </div>
      </div>
    </div>
  )}
</CurrentCart.Content>
```

### Items

A headless component for cart items collection.

**Signature:**
```tsx
interface ItemsProps {
  children: (props: ItemsRenderProps) => React.ReactNode;
}

interface ItemsRenderProps {
  items: any[];
  hasItems: boolean;
  totalItems: number;
}

export const Items: React.FC<ItemsProps>
```

**Example:**
```tsx
<CurrentCart.Items>
  {({ items, hasItems, totalItems }) => (
    <div className="space-y-4">
      {hasItems ? (
        items.map((item) => (
          <CartItem key={item._id} item={item} />
        ))
      ) : (
        <p>Your cart is empty</p>
      )}
      <p className="text-sm text-gray-500">Total items: {totalItems}</p>
    </div>
  )}
</CurrentCart.Items>
```

### Item

A headless component for individual cart item.

**Signature:**
```tsx
interface ItemProps {
  item: any;
  children: (props: ItemRenderProps) => React.ReactNode;
}

interface ItemRenderProps {
  item: any | null;
  quantity: number;
  title: string;
  image: string | null;
  price: string;
  selectedOptions: Array<{
    name: string;
    value: string | { name: string; code: string };
  }>;
  onIncrease: () => Promise<void>;
  onDecrease: () => Promise<void>;
  onRemove: () => Promise<void>;
  isLoading: boolean;
}

export const Item: React.FC<ItemProps>
```

**Example:**
```tsx
<CurrentCart.Item item={lineItem}>
  {({ 
    title, 
    image, 
    price, 
    quantity, 
    selectedOptions, 
    onIncrease, 
    onDecrease, 
    onRemove 
  }) => (
    <div className="flex items-center space-x-4 p-4 border rounded">
      {image && <img src={image} alt={title} className="w-16 h-16 object-cover" />}
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-600">{price}</p>
        {selectedOptions.map((option) => (
          <p key={option.name} className="text-sm text-gray-500">
            {option.name}: {typeof option.value === 'string' ? option.value : option.value.name}
          </p>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onDecrease} className="px-2 py-1 border rounded">-</button>
        <span>{quantity}</span>
        <button onClick={onIncrease} className="px-2 py-1 border rounded">+</button>
      </div>
      <button onClick={onRemove} className="text-red-500">Remove</button>
    </div>
  )}
</CurrentCart.Item>
```

### Summary

A headless component for cart summary with totals.

**Signature:**
```tsx
interface SummaryProps {
  children: (props: SummaryRenderProps) => React.ReactNode;
}

interface SummaryRenderProps {
  subtotal: string;
  discount: string | null;
  appliedCoupon: string | null;
  shipping: string;
  tax: string;
  total: string;
  currency: string;
  itemCount: number;
  canCheckout: boolean;
  isTotalsLoading: boolean;
}

export const Summary: React.FC<SummaryProps>
```

**Example:**
```tsx
<CurrentCart.Summary>
  {({ 
    subtotal, 
    discount, 
    appliedCoupon, 
    shipping, 
    tax, 
    total, 
    itemCount, 
    canCheckout, 
    isTotalsLoading 
  }) => (
    <div className="border-t pt-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal ({itemCount} items)</span>
          <span>{subtotal}</span>
        </div>
        {discount && (
          <div className="flex justify-between text-green-600">
            <span>Discount {appliedCoupon && `(${appliedCoupon})`}</span>
            <span>-{discount}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{tax}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{total}</span>
        </div>
      </div>
      {isTotalsLoading && <div className="text-center py-2">Calculating...</div>}
    </div>
  )}
</CurrentCart.Summary>
```

### Clear

A headless component for clearing cart.

**Signature:**
```tsx
interface ClearProps {
  children: (props: ClearRenderProps) => React.ReactNode;
}

interface ClearRenderProps {
  onClear: () => Promise<void>;
  hasItems: boolean;
  isLoading: boolean;
}

export const Clear: React.FC<ClearProps>
```

**Example:**
```tsx
<CurrentCart.Clear>
  {({ onClear, hasItems, isLoading }) => (
    <button
      onClick={onClear}
      disabled={!hasItems || isLoading}
      className="w-full px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
    >
      {isLoading ? 'Clearing...' : 'Clear Cart'}
    </button>
  )}
</CurrentCart.Clear>
```

### Checkout

A headless component for checkout functionality.

**Signature:**
```tsx
interface CheckoutProps {
  children: (props: CheckoutRenderProps) => React.ReactNode;
}

interface CheckoutRenderProps {
  onProceed: () => Promise<void>;
  canCheckout: boolean;
  isLoading: boolean;
  error: string | null;
}

export const Checkout: React.FC<CheckoutProps>
```

**Example:**
```tsx
<CurrentCart.Checkout>
  {({ onProceed, canCheckout, isLoading, error }) => (
    <div>
      <button
        onClick={onProceed}
        disabled={!canCheckout || isLoading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Proceed to Checkout'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )}
</CurrentCart.Checkout>
```

### Notes

A headless component for buyer notes management.

**Signature:**
```tsx
interface NotesProps {
  children: (props: NotesRenderProps) => React.ReactNode;
}

interface NotesRenderProps {
  notes: string;
  onNotesChange: (notes: string) => Promise<void>;
}

export const Notes: React.FC<NotesProps>
```

**Example:**
```tsx
<CurrentCart.Notes>
  {({ notes, onNotesChange }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Order Notes</label>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add special instructions..."
        className="w-full p-2 border rounded"
        rows={3}
      />
    </div>
  )}
</CurrentCart.Notes>
```

### Coupon

A headless component for coupon code management.

**Signature:**
```tsx
interface CouponProps {
  children: (props: CouponRenderProps) => React.ReactNode;
}

interface CouponRenderProps {
  appliedCoupon: string | null;
  onApply: (code: string) => Promise<void>;
  onRemove: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const Coupon: React.FC<CouponProps>
```

**Example:**
```tsx
<CurrentCart.Coupon>
  {({ appliedCoupon, onApply, onRemove, isLoading, error }) => (
    <div className="space-y-2">
      {appliedCoupon ? (
        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
          <span className="text-green-700">Coupon: {appliedCoupon}</span>
          <button
            onClick={onRemove}
            className="text-red-500 text-sm"
            disabled={isLoading}
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            className="flex-1 p-2 border rounded"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onApply(e.currentTarget.value);
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder="Enter coupon code"]') as HTMLInputElement;
              if (input) onApply(input.value);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={isLoading}
          >
            Apply
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )}
</CurrentCart.Coupon>
```

## Usage Examples

The CurrentCart components are used extensively throughout the application:

### In MiniCart Component
```tsx
// src/components/ecom/MiniCart.tsx
export const MiniCartIcon = () => (
  <CurrentCart.Trigger>
    {({ itemCount, hasItems, onOpen }) => (
      <button onClick={onOpen} className="relative">
        <ShoppingCartIcon />
        {hasItems && <Badge count={itemCount} />}
      </button>
    )}
  </CurrentCart.Trigger>
);
```

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
<ServicesManagerProvider servicesManager={servicesManager}>
  <MiniCartIcon />
  {children}
  <MiniCartContent />
</ServicesManagerProvider>
```

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
<StoreLayout
  currentCartServiceConfig={currentCartServiceConfig}
  servicesManager={servicesManager}
  showSuccessMessage={showSuccessMessage}
  onSuccessMessageChange={setShowSuccessMessage}
>
  <ProductDetails setShowSuccessMessage={setShowSuccessMessage} />
</StoreLayout>
```

### In React Router App
```tsx
// src/react-pages/react-router/[...path].tsx
<WixServicesProvider showCartIcon={true}>
  <GlobalCartLoader>
    <Routes>
      <Route path="/cart" element={<Cart />} />
      <Route path="/products/:slug" element={<ProductDetailsRoute />} />
    </Routes>
  </GlobalCartLoader>
</WixServicesProvider>
``` 