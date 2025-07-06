# Headless Components Documentation

# headless

## ecom

### components

##### CurrentCart


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
---

##### index


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
---

### services

##### current cart service


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
---

## store

### components

##### Category


The `Category` components provide category selection and display functionality for product collections, enabling users to filter products by category and navigate through category hierarchies.

## Overview

The Category module exports components that work together to provide category management:

- **Provider** - Context provider for category service
- **useCategory** - Hook for accessing category context
- **List** - Component for displaying and managing categories

## Exports

### Provider

A React context provider that makes the category service available to child components.

**Signature:**
```tsx
interface CategoryProviderProps {
  children: ReactNode;
}

export const Provider: React.FC<CategoryProviderProps>
```

**Example:**
```tsx
import { Category } from "../../headless/store/components";

<Category.Provider>
  <CategoryNavigation />
  <FilteredProductGrid />
</Category.Provider>
```

### useCategory

A React hook that provides access to the category service context.

**Signature:**
```tsx
function useCategory(): CategoryServiceAPI
```

**Example:**
```tsx
import { Category } from "../../headless/store/components";

function CustomCategoryComponent() {
  const categoryService = Category.useCategory();
  
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();
  
  return (
    <div>
      <p>Total categories: {categories.length}</p>
      <p>Selected: {selectedCategory || 'None'}</p>
    </div>
  );
}
```

### List

A component for displaying categories with selection management.

**Signature:**
```tsx
interface CategoryListProps {
  children: (data: {
    categories: categories.Category[];
    selectedCategory: string | null;
    setSelectedCategory: (categoryId: string | null) => void;
  }) => ReactNode;
}

export const List: React.FC<CategoryListProps>
```

**Example:**
```tsx
import { Category } from "../../headless/store/components";

<Category.Provider>
  <Category.List>
    {({ categories, selectedCategory, setSelectedCategory }) => (
      <div className="category-navigation">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        
        <div className="space-y-2">
          {/* All Categories Option */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            All Categories
          </button>
          
          {/* Individual Categories */}
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    )}
  </Category.List>
</Category.Provider>
```

## Advanced Examples

### Category Dropdown

```tsx
import { Category } from "../../headless/store/components";

function CategoryDropdown() {
  return (
    <Category.Provider>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => (
          <div className="relative">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </Category.List>
    </Category.Provider>
  );
}
```

### Category Sidebar with Counts

```tsx
import { Category } from "../../headless/store/components";

function CategorySidebar() {
  return (
    <Category.Provider>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => (
          <div className="w-64 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Shop by Category</h3>
            
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="flex items-center justify-between">
                  All Products
                  {selectedCategory === null && (
                    <span className="text-xs">✓</span>
                  )}
                </span>
              </button>
              
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {category.name}
                    {selectedCategory === category.id && (
                      <span className="text-xs">✓</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Category.List>
    </Category.Provider>
  );
}
```

### Category Breadcrumbs

```tsx
import { Category } from "../../headless/store/components";

function CategoryBreadcrumbs() {
  return (
    <Category.Provider>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => {
          const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
          
          return (
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => setSelectedCategory(null)}
                className="hover:text-blue-600 transition-colors"
              >
                Home
              </button>
              
              {selectedCategoryObj && (
                <>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">
                    {selectedCategoryObj.name}
                  </span>
                </>
              )}
            </nav>
          );
        }}
      </Category.List>
    </Category.Provider>
  );
}
```

### Category Filter with Clear Option

```tsx
import { Category } from "../../headless/store/components";

function CategoryFilter() {
  return (
    <Category.Provider>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 py-2">
              Filter by category:
            </span>
            
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
            
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </Category.List>
    </Category.Provider>
  );
}
```

## Complete Example

Here's a complete example showing how Category components integrate with other store components:

```tsx
import { Category } from "../../headless/store/components";
import { Collection } from "../../headless/store/components";

export function CategoryStoreLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Category.Provider>
        <Collection.Provider>
          <div className="flex gap-8">
            {/* Category Sidebar */}
            <div className="w-64 flex-shrink-0">
              <Category.List>
                {({ categories, selectedCategory, setSelectedCategory }) => (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Categories</h2>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          selectedCategory === null
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="font-medium">All Products</span>
                      </button>
                      
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span className="font-medium">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Category.List>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Category Breadcrumbs */}
              <Category.List>
                {({ categories, selectedCategory }) => {
                  const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
                  
                  return (
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                      <span>Home</span>
                      {selectedCategoryObj && (
                        <>
                          <span>/</span>
                          <span className="text-gray-900 font-medium">
                            {selectedCategoryObj.name}
                          </span>
                        </>
                      )}
                    </nav>
                  );
                }}
              </Category.List>
              
              {/* Products Grid */}
              <Collection.Grid>
                {({ products, isLoading, error, totalProducts }) => (
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h1 className="text-2xl font-bold">
                        <Category.List>
                          {({ categories, selectedCategory }) => {
                            const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
                            return selectedCategoryObj ? selectedCategoryObj.name : 'All Products';
                          }}
                        </Category.List>
                      </h1>
                      
                      <span className="text-gray-600">
                        {totalProducts} products
                      </span>
                    </div>
                    
                    {/* Products */}
                    {isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                            <div className="bg-gray-200 h-4 rounded mb-2"></div>
                            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <p className="text-red-600">Error loading products: {error}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                          <Collection.Item key={product._id} product={product}>
                            {({ title, image, price, available, slug }) => (
                              <a
                                href={`/products/${slug}`}
                                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              >
                                {image && (
                                  <img
                                    src={image}
                                    alt={title}
                                    className="w-full h-64 object-cover rounded-t-lg"
                                  />
                                )}
                                <div className="p-4">
                                  <h3 className="font-semibold text-gray-900 mb-2">
                                    {title}
                                  </h3>
                                  <p className="text-lg font-bold text-blue-600">
                                    {price}
                                  </p>
                                  <p className={`text-sm ${
                                    available ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {available ? 'In Stock' : 'Out of Stock'}
                                  </p>
                                </div>
                              </a>
                            )}
                          </Collection.Item>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Collection.Grid>
            </div>
          </div>
        </Collection.Provider>
      </Category.Provider>
    </div>
  );
}
```

## Usage Examples

The Category components are used throughout the application:

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
import { Category } from "../headless/store/components";

export const StoreLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Category.Provider>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Category.List>
            {({ categories, selectedCategory, setSelectedCategory }) => (
              <nav className="flex space-x-8">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? 'text-blue-600 font-semibold' : 'text-gray-700'}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? 'text-blue-600 font-semibold' : 'text-gray-700'}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            )}
          </Category.List>
        </div>
      </header>
      <main>{children}</main>
    </Category.Provider>
  </div>
);
```

### In Product List Components
```tsx
// src/components/store/ProductFilters.tsx
import { Category } from "../../headless/store/components";

export const ProductFilters = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold mb-4">Filters</h3>
    
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => (
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => setSelectedCategory(category.id)}
                  className="mr-2"
                />
                {category.name}
              </label>
            ))}
          </div>
        )}
      </Category.List>
    </div>
  </div>
);
```

## Integration with Services

The Category components integrate with the CategoryService:

### Category Service Integration
- Provides category data and selection state
- Manages category filtering and persistence
- Handles category-based product filtering
- Coordinates with Collection service for filtered results

### URL Integration
- Category selections are reflected in URL parameters
- Browser navigation preserves category state
- Direct links to category pages work correctly

### State Management
- Category selection state is reactive and persistent
- Multiple components can share the same category state
- Changes propagate automatically to all subscribers 
---

##### Collection


The `Collection` components provide headless functionality for displaying product collections. These components handle product grids, individual product items, collection headers, and pagination/loading actions.

## Overview

The Collection module exports several headless components that work together to create product collection interfaces:

- **Grid** - Main product grid with loading states
- **Item** - Individual product item display
- **Header** - Collection header with statistics
- **LoadMore** - Load more products functionality
- **Actions** - Collection actions (refresh, load more)

## Exports

### Grid

A headless component for displaying product grid collections.

**Signature:**
```tsx
interface GridProps {
  children: (props: GridRenderProps) => React.ReactNode;
}

interface GridRenderProps {
  products: productsV3.V3Product[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  totalProducts: number;
  hasProducts: boolean;
}

export const Grid: React.FC<GridProps>
```

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.Grid>
  {({ products, isLoading, error, isEmpty, totalProducts, hasProducts }) => (
    <div>
      {isLoading && <div>Loading products...</div>}
      {error && <div className="error">Error: {error}</div>}
      {isEmpty && <div>No products found</div>}
      {hasProducts && (
        <div>
          <p>Showing {products.length} of {totalProducts} products</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map(product => (
              <Collection.Item key={product._id} product={product}>
                {({ title, image, price, href }) => (
                  <a href={href}>
                    <img src={image} alt={title} />
                    <h3>{title}</h3>
                    <p>{price}</p>
                  </a>
                )}
              </Collection.Item>
            ))}
          </div>
        </div>
      )}
    </div>
  )}
</Collection.Grid>
```

### Item

A headless component for individual product items within a collection.

**Signature:**
```tsx
interface ItemProps {
  product: productsV3.V3Product;
  children: (props: ItemRenderProps) => React.ReactNode;
}

interface ItemRenderProps {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  price: string;
  compareAtPrice: string | null;
  description: string;
  available: boolean;
  href: string;
}

export const Item: React.FC<ItemProps>
```

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.Item product={product}>
  {({ 
    id, 
    title, 
    slug, 
    image, 
    price, 
    compareAtPrice, 
    description, 
    available, 
    href 
  }) => (
    <div className="product-card">
      <a href={href}>
        {image && (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          <div className="mt-2">
            <span className={`text-lg font-bold ${available ? 'text-green-600' : 'text-red-600'}`}>
              {price}
            </span>
            {compareAtPrice && (
              <span className="text-gray-500 line-through ml-2">
                {compareAtPrice}
              </span>
            )}
          </div>
          <p className="text-sm mt-1">
            {available ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </a>
    </div>
  )}
</Collection.Item>
```

### Header

A headless component for collection header with product count and statistics.

**Signature:**
```tsx
interface HeaderProps {
  children: (props: HeaderRenderProps) => React.ReactNode;
}

interface HeaderRenderProps {
  totalProducts: number;
  isLoading: boolean;
  hasProducts: boolean;
}

export const Header: React.FC<HeaderProps>
```

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.Header>
  {({ totalProducts, isLoading, hasProducts }) => (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        Products
        {!isLoading && hasProducts && (
          <span className="text-gray-500 ml-2">
            ({totalProducts} items)
          </span>
        )}
      </h1>
      {isLoading && (
        <div className="text-gray-500">Loading...</div>
      )}
    </div>
  )}
</Collection.Header>
```

### LoadMore

A headless component for load more products functionality.

**Signature:**
```tsx
interface LoadMoreProps {
  children: (props: LoadMoreRenderProps) => React.ReactNode;
}

interface LoadMoreRenderProps {
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  isLoading: boolean;
  hasProducts: boolean;
  totalProducts: number;
  hasMoreProducts: boolean;
}

export const LoadMore: React.FC<LoadMoreProps>
```

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.LoadMore>
  {({ 
    loadMore, 
    refresh, 
    isLoading, 
    hasProducts, 
    totalProducts, 
    hasMoreProducts 
  }) => (
    <div className="text-center mt-8">
      {hasProducts && (
        <p className="text-gray-600 mb-4">
          Showing {totalProducts} products
        </p>
      )}
      <div className="space-x-4">
        <button
          onClick={refresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
        {hasMoreProducts && (
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  )}
</Collection.LoadMore>
```

### Actions

A headless component for collection actions (refresh, load more).

**Signature:**
```tsx
interface ActionsProps {
  children: (props: ActionsRenderProps) => React.ReactNode;
}

interface ActionsRenderProps {
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const Actions: React.FC<ActionsProps>
```

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.Actions>
  {({ refresh, loadMore, isLoading, error }) => (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded">
          Error: {error}
        </div>
      )}
      <div className="flex space-x-4">
        <button
          onClick={refresh}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Collection'}
        </button>
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Load More Products'}
        </button>
      </div>
    </div>
  )}
</Collection.Actions>
```

## Usage Examples

The Collection components are used extensively throughout the application:

### In FilteredCollection Component
```tsx
// src/headless/store/components/FilteredCollection.tsx
import { Collection } from "./Collection";

export const Grid: React.FC<GridProps> = ({ children }) => {
  return (
    <Collection.Grid>
      {(collectionProps) => (
        <div>
          {children(collectionProps)}
        </div>
      )}
    </Collection.Grid>
  );
};
```

### In ProductList Component
```tsx
// src/components/store/ProductList.tsx
import { Collection } from "../../headless/store/components";

export const ProductGridContent = () => (
  <Collection.Grid>
    {({ products, isLoading, error, isEmpty, totalProducts }) => (
      <div>
        <Collection.Header>
          {({ totalProducts, isLoading: headerLoading }) => (
            <h2>Products ({totalProducts})</h2>
          )}
        </Collection.Header>
        
        {products.map(product => (
          <Collection.Item key={product._id} product={product}>
            {({ title, image, price, href, available }) => (
              <ProductCard 
                title={title}
                image={image}
                price={price}
                href={href}
                available={available}
              />
            )}
          </Collection.Item>
        ))}
        
        <Collection.LoadMore>
          {({ loadMore, hasMoreProducts, isLoading }) => (
            hasMoreProducts && (
              <button onClick={loadMore} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            )
          )}
        </Collection.LoadMore>
      </div>
    )}
  </Collection.Grid>
);
```

### In Store Example Pages
```tsx
// src/react-pages/store/example-1/index.tsx
import { Collection } from "../../../headless/store/components";

export default function StoreExample1Page() {
  return (
    <StoreLayout>
      <Collection.Grid>
        {({ products, isLoading, totalProducts, hasProducts }) => (
          <div>
            <Collection.Header>
              {({ totalProducts }) => (
                <h1>Store Collection ({totalProducts})</h1>
              )}
            </Collection.Header>
            
            {hasProducts && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map(product => (
                  <Collection.Item key={product._id} product={product}>
                    {({ title, image, price, href }) => (
                      <a href={href} className="block">
                        <img src={image} alt={title} />
                        <h3>{title}</h3>
                        <p>{price}</p>
                      </a>
                    )}
                  </Collection.Item>
                ))}
              </div>
            )}
            
            <Collection.Actions>
              {({ refresh, loadMore, isLoading, error }) => (
                <div className="text-center mt-8">
                  {error && <p className="text-red-500">{error}</p>}
                  <button 
                    onClick={refresh} 
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    Refresh Products
                  </button>
                </div>
              )}
            </Collection.Actions>
          </div>
        )}
      </Collection.Grid>
    </StoreLayout>
  );
}
```

### In React Router Store
```tsx
// src/react-pages/react-router/Routes.tsx
import { Collection } from "../../headless/store/components";

function StoreRoute() {
  return (
    <div>
      <Collection.Grid>
        {({ products, isLoading, error, totalProducts }) => (
          <div>
            <Collection.Header>
              {({ totalProducts, isLoading, hasProducts }) => (
                <div className="mb-6">
                  <h1>React Router Store</h1>
                  {hasProducts && <p>Total Products: {totalProducts}</p>}
                </div>
              )}
            </Collection.Header>
            
            {error && <div className="error">{error}</div>}
            
            <div className="product-grid">
              {products.map(product => (
                <Collection.Item key={product._id} product={product}>
                  {({ title, image, price, href }) => (
                    <Link to={href}>
                      <img src={image} alt={title} />
                      <h3>{title}</h3>
                      <p>{price}</p>
                    </Link>
                  )}
                </Collection.Item>
              ))}
            </div>
          </div>
        )}
      </Collection.Grid>
    </div>
  );
}
``` 
---

##### FilteredCollection


The `FilteredCollection` components provide advanced product collection functionality with integrated filtering capabilities. These components combine the Collection and Filter services to create sophisticated product browsing experiences.

## Overview

The FilteredCollection module exports components that work together to provide filtered product collections:

- **Provider** - Context provider that integrates Collection and Filter services
- **useFilteredCollection** - Hook for accessing the filtered collection context
- **FiltersLoading** - Loading state management for filters
- **Grid** - Product grid with filtering capabilities
- **Item** - Individual product item with safe data handling
- **LoadMore** - Pagination and load more functionality
- **Filters** - Filter management and controls

## Exports

### Provider

A React context provider that integrates Collection and Filter services.

**Signature:**
```tsx
interface FilteredCollectionProviderProps {
  children: ReactNode;
}

export const Provider: React.FC<FilteredCollectionProviderProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Provider>
  <YourFilteredProductInterface />
</FilteredCollection.Provider>
```

### useFilteredCollection

A React hook that provides access to the filtered collection context.

**Signature:**
```tsx
function useFilteredCollection(): {
  filter: FilterServiceAPI | null;
  collection: CollectionServiceAPI | null;
}
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

function CustomFilterComponent() {
  const { filter, collection } = FilteredCollection.useFilteredCollection();
  
  const products = collection?.products.get() || [];
  const currentFilters = filter?.currentFilters.get();
  
  return (
    <div>
      <p>Products: {products.length}</p>
      <p>Active filters: {Object.keys(currentFilters?.selectedOptions || {}).length}</p>
    </div>
  );
}
```

### FiltersLoading

A component that manages loading state for filters with pulse animation support.

**Signature:**
```tsx
interface FiltersLoadingProps {
  children: (data: { isFullyLoaded: boolean }) => ReactNode;
}

export const FiltersLoading: React.FC<FiltersLoadingProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Provider>
  <FilteredCollection.FiltersLoading>
    {({ isFullyLoaded }) => (
      <div className="relative">
        <FilterControls />
        {!isFullyLoaded && (
          <div className="absolute inset-0 bg-white/50 animate-pulse">
            <div className="text-center py-4">Loading filters...</div>
          </div>
        )}
      </div>
    )}
  </FilteredCollection.FiltersLoading>
</FilteredCollection.Provider>
```

### Grid

A component for displaying filtered product collections with comprehensive state management.

**Signature:**
```tsx
interface FilteredGridProps {
  children: (data: {
    products: productsV3.V3Product[];
    totalProducts: number;
    isLoading: boolean;
    error: string | null;
    isEmpty: boolean;
    hasMoreProducts: boolean;
  }) => ReactNode;
}

export const Grid: React.FC<FilteredGridProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Provider>
  <FilteredCollection.Grid>
    {({ products, totalProducts, isLoading, error, isEmpty, hasMoreProducts }) => (
      <div>
        {isLoading && <div>Loading products...</div>}
        {error && <div className="error">Error: {error}</div>}
        {isEmpty && <div>No products found matching your filters</div>}
        
        {!isEmpty && (
          <div>
            <p>Showing {products.length} of {totalProducts} products</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map(product => (
                <FilteredCollection.Item key={product._id} product={product}>
                  {({ title, image, price, available }) => (
                    <div className="product-card">
                      <img src={image || '/placeholder.jpg'} alt={title} />
                      <h3>{title}</h3>
                      <p className={available ? 'text-green-600' : 'text-red-600'}>
                        {price}
                      </p>
                    </div>
                  )}
                </FilteredCollection.Item>
              ))}
            </div>
            
            {hasMoreProducts && (
              <FilteredCollection.LoadMore>
                {({ loadMore, isLoading: loadingMore }) => (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                )}
              </FilteredCollection.LoadMore>
            )}
          </div>
        )}
      </div>
    )}
  </FilteredCollection.Grid>
</FilteredCollection.Provider>
```

### Item

A component for individual product items with safe data handling and type conversion.

**Signature:**
```tsx
interface FilteredItemProps {
  product: productsV3.V3Product;
  children: (data: {
    title: string;
    image: string | null;
    price: string;
    compareAtPrice: string | null;
    available: boolean;
    slug: string;
    description?: string;
  }) => ReactNode;
}

export const Item: React.FC<FilteredItemProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Item product={product}>
  {({ 
    title, 
    image, 
    price, 
    compareAtPrice, 
    available, 
    slug, 
    description 
  }) => (
    <div className="product-card border rounded-lg p-4">
      <a href={`/products/${slug}`}>
        {image && (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover rounded"
          />
        )}
        <div className="mt-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          {description && (
            <p className="text-gray-600 text-sm mt-1">{description}</p>
          )}
          <div className="mt-2">
            <span className={`text-lg font-bold ${
              available ? 'text-green-600' : 'text-red-600'
            }`}>
              {price}
            </span>
            {compareAtPrice && (
              <span className="text-gray-500 line-through ml-2">
                {compareAtPrice}
              </span>
            )}
          </div>
          <p className="text-sm mt-1">
            {available ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </a>
    </div>
  )}
</FilteredCollection.Item>
```

### LoadMore

A component for pagination and loading more products.

**Signature:**
```tsx
interface FilteredLoadMoreProps {
  children: (data: {
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    isLoading: boolean;
    hasProducts: boolean;
    totalProducts: number;
    hasMoreProducts: boolean;
  }) => ReactNode;
}

export const LoadMore: React.FC<FilteredLoadMoreProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.LoadMore>
  {({ 
    loadMore, 
    refresh, 
    isLoading, 
    hasProducts, 
    totalProducts, 
    hasMoreProducts 
  }) => (
    <div className="text-center mt-8">
      {hasProducts && (
        <p className="text-gray-600 mb-4">
          Showing {totalProducts} products
        </p>
      )}
      
      <div className="space-x-4">
        <button
          onClick={refresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
        
        {hasMoreProducts && (
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  )}
</FilteredCollection.LoadMore>
```

### Filters

A component for managing and applying product filters.

**Signature:**
```tsx
interface FilteredFiltersProps {
  children: (data: {
    applyFilters: (filters: Filter) => void;
    clearFilters: () => void;
    currentFilters: Filter;
    allProducts: productsV3.V3Product[];
    availableOptions: AvailableOptions;
    isFiltered: boolean;
  }) => ReactNode;
}

export const Filters: React.FC<FilteredFiltersProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Provider>
  <FilteredCollection.Filters>
    {({ 
      applyFilters, 
      clearFilters, 
      currentFilters, 
      availableOptions, 
      isFiltered 
    }) => (
      <div className="filters-panel">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Filters</h3>
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="text-blue-500 text-sm hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
        
        {/* Price Range Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Price Range</h4>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={currentFilters.priceRange.min}
              onChange={(e) => {
                const newFilters = {
                  ...currentFilters,
                  priceRange: {
                    ...currentFilters.priceRange,
                    min: parseFloat(e.target.value) || 0
                  }
                };
                applyFilters(newFilters);
              }}
              className="border rounded px-2 py-1 w-20"
            />
            <input
              type="number"
              placeholder="Max"
              value={currentFilters.priceRange.max}
              onChange={(e) => {
                const newFilters = {
                  ...currentFilters,
                  priceRange: {
                    ...currentFilters.priceRange,
                    max: parseFloat(e.target.value) || 999999
                  }
                };
                applyFilters(newFilters);
              }}
              className="border rounded px-2 py-1 w-20"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Range: ${availableOptions.priceRange.min} - ${availableOptions.priceRange.max}
          </p>
        </div>
        
        {/* Product Options Filters */}
        {Object.entries(availableOptions.options).map(([optionId, option]) => (
          <div key={optionId} className="mb-6">
            <h4 className="font-medium mb-2">{option.name}</h4>
            <div className="space-y-2">
              {option.choices.map(choice => (
                <label key={choice.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentFilters.selectedOptions[optionId]?.includes(choice.id) || false}
                    onChange={(e) => {
                      const currentChoices = currentFilters.selectedOptions[optionId] || [];
                      const newChoices = e.target.checked
                        ? [...currentChoices, choice.id]
                        : currentChoices.filter(id => id !== choice.id);
                      
                      const newFilters = {
                        ...currentFilters,
                        selectedOptions: {
                          ...currentFilters.selectedOptions,
                          [optionId]: newChoices
                        }
                      };
                      applyFilters(newFilters);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{choice.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </FilteredCollection.Filters>
</FilteredCollection.Provider>
```

## Complete Example

Here's a complete example showing how all FilteredCollection components work together:

```tsx
import { FilteredCollection } from "../../headless/store/components";

export function AdvancedProductGrid() {
  return (
    <FilteredCollection.Provider>
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-80 flex-shrink-0">
          <FilteredCollection.FiltersLoading>
            {({ isFullyLoaded }) => (
              <div className="sticky top-6">
                <FilteredCollection.Filters>
                  {({ 
                    applyFilters, 
                    clearFilters, 
                    currentFilters, 
                    availableOptions, 
                    isFiltered 
                  }) => (
                    <FiltersPanel
                      applyFilters={applyFilters}
                      clearFilters={clearFilters}
                      currentFilters={currentFilters}
                      availableOptions={availableOptions}
                      isFiltered={isFiltered}
                    />
                  )}
                </FilteredCollection.Filters>
                
                {/* Loading Overlay */}
                {!isFullyLoaded && (
                  <div className="absolute inset-0 bg-white/50 animate-pulse rounded">
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-500">Loading filters...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </FilteredCollection.FiltersLoading>
        </div>
        
        {/* Products Grid */}
        <div className="flex-1">
          <FilteredCollection.Grid>
            {({ products, isLoading, error, isEmpty, totalProducts, hasMoreProducts }) => (
              <div>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Products</h2>
                  {!isLoading && !isEmpty && (
                    <p className="text-gray-600">
                      Showing {products.length} of {totalProducts} products
                    </p>
                  )}
                </div>
                
                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                  </div>
                )}
                
                {/* Error State */}
                {error && (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">⚠️ Error loading products</div>
                    <p className="text-gray-600">{error}</p>
                  </div>
                )}
                
                {/* Empty State */}
                {isEmpty && !isLoading && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">📦 No products found</div>
                    <p className="text-gray-600">
                      Try adjusting your filters to see more results
                    </p>
                  </div>
                )}
                
                {/* Products Grid */}
                {!isEmpty && !isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <FilteredCollection.Item key={product._id} product={product}>
                        {({ title, image, price, compareAtPrice, available, slug }) => (
                          <ProductCard
                            title={title}
                            image={image}
                            price={price}
                            compareAtPrice={compareAtPrice}
                            available={available}
                            href={`/products/${slug}`}
                          />
                        )}
                      </FilteredCollection.Item>
                    ))}
                  </div>
                )}
                
                {/* Load More */}
                {hasMoreProducts && (
                  <FilteredCollection.LoadMore>
                    {({ loadMore, isLoading: loadingMore }) => (
                      <div className="text-center mt-8">
                        <button
                          onClick={loadMore}
                          disabled={loadingMore}
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingMore ? 'Loading More...' : 'Load More Products'}
                        </button>
                      </div>
                    )}
                  </FilteredCollection.LoadMore>
                )}
              </div>
            )}
          </FilteredCollection.Grid>
        </div>
      </div>
    </FilteredCollection.Provider>
  );
}
```

## Usage Examples

The FilteredCollection components are extensively used throughout the application:

### In Product List Pages
```tsx
// src/components/store/ProductList.tsx
import { FilteredCollection } from "../../headless/store/components";

export const ProductGridContent = () => (
  <FilteredCollection.Provider>
    <FilteredCollection.Grid>
      {({ products, isLoading, totalProducts }) => (
        <FilteredCollection.Filters>
          {({ currentFilters, applyFilters, clearFilters, availableOptions, isFiltered }) => (
            <div className="flex gap-8">
              <ProductFilters 
                currentFilters={currentFilters}
                onFiltersChange={applyFilters}
                clearFilters={clearFilters}
                availableOptions={availableOptions}
                isFiltered={isFiltered}
              />
              <ProductGrid products={products} />
            </div>
          )}
        </FilteredCollection.Filters>
      )}
    </FilteredCollection.Grid>
  </FilteredCollection.Provider>
);
```

### In Store Example Pages
```tsx
// src/react-pages/store/example-2/index.tsx
import { FilteredCollection } from "../../../headless/store/components";

const ProductGridContent = () => {
  return (
    <FilteredCollection.Provider>
      <FilteredCollection.Grid>
        {({ products, isLoading, error, isEmpty, totalProducts }) => (
          <FilteredCollection.Filters>
            {({ currentFilters, applyFilters, clearFilters, availableOptions, isFiltered }) => {
              return (
                <div className="min-h-screen">
                  <StoreHeader className="mb-6" />
                  <div className="flex gap-8">
                    <FiltersSidebar 
                      filters={{ currentFilters, applyFilters, clearFilters, availableOptions, isFiltered }}
                    />
                    <ProductsGrid products={products} />
                  </div>
                </div>
              );
            }}
          </FilteredCollection.Filters>
        )}
      </FilteredCollection.Grid>
    </FilteredCollection.Provider>
  );
};
```

## Integration with Services

The FilteredCollection components integrate with multiple services:

### Collection Service Integration
- Provides product data and pagination
- Manages loading states and errors
- Handles product search and retrieval

### Filter Service Integration
- Manages filter state and available options
- Applies filters to product collections
- Handles filter persistence and URL integration

### Combined Functionality
- Automatic filter application triggers collection refresh
- Coordinated loading states between filters and products
- Unified error handling across both services 
---

##### Product


The `Product` components provide basic product information display functionality, focusing on core product data like name and description.

## Overview

The Product module exports simple components for displaying product information:

- **Name** - Component for product name display
- **Description** - Component for product description display

## Exports

### Name

A headless component that provides access to the product name.

**Signature:**
```tsx
interface ProductNameProps {
  children: (props: ProductNameRenderProps) => React.ReactNode;
}

interface ProductNameRenderProps {
  name: string;
}

export const Name: React.FC<ProductNameProps>
```

**Example:**
```tsx
import { Product } from "../../headless/store/components";

<Product.Name>
  {({ name }) => (
    <h1 className="text-3xl font-bold text-gray-900 mb-4">
      {name}
    </h1>
  )}
</Product.Name>
```

### Description

A headless component that provides access to the product description in both rich text and plain text formats.

**Signature:**
```tsx
interface ProductDescriptionProps {
  children: (props: ProductDescriptionRenderProps) => React.ReactNode;
}

interface ProductDescriptionRenderProps {
  description: NonNullable<productsV3.V3Product["description"]>;
  plainDescription: NonNullable<productsV3.V3Product["plainDescription"]>;
}

export const Description: React.FC<ProductDescriptionProps>
```

**Example:**
```tsx
import { Product } from "../../headless/store/components";

<Product.Description>
  {({ description, plainDescription }) => (
    <div className="product-description">
      {/* Rich text description */}
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      
      {/* Fallback to plain text if rich text is not available */}
      {!description && plainDescription && (
        <p className="text-gray-700 whitespace-pre-wrap">
          {plainDescription}
        </p>
      )}
    </div>
  )}
</Product.Description>
```

## Complete Examples

### Basic Product Header

```tsx
import { Product } from "../../headless/store/components";

export function ProductHeader() {
  return (
    <div className="product-header">
      <Product.Name>
        {({ name }) => (
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {name}
          </h1>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ description, plainDescription }) => (
          <div className="text-gray-600 mb-6">
            {description ? (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : plainDescription ? (
              <p className="whitespace-pre-wrap">{plainDescription}</p>
            ) : (
              <p className="italic">No description available</p>
            )}
          </div>
        )}
      </Product.Description>
    </div>
  );
}
```

### Product Card Display

```tsx
import { Product } from "../../headless/store/components";

export function ProductCard({ className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <Product.Name>
        {({ name }) => (
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {name}
          </h2>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ plainDescription }) => (
          <p className="text-gray-600 text-sm line-clamp-3">
            {plainDescription || "No description available"}
          </p>
        )}
      </Product.Description>
    </div>
  );
}
```

### SEO-Optimized Product Display

```tsx
import { Product } from "../../headless/store/components";

export function SEOProductDisplay() {
  return (
    <article className="product-article">
      <Product.Name>
        {({ name }) => (
          <header>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {name}
            </h1>
            {/* SEO structured data */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": name
              })}
            </script>
          </header>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ description, plainDescription }) => (
          <section className="product-description">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Product Description
            </h2>
            
            {description ? (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : plainDescription ? (
              <div className="text-gray-700 whitespace-pre-wrap">
                {plainDescription}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No description available for this product.
              </p>
            )}
          </section>
        )}
      </Product.Description>
    </article>
  );
}
```

### Product Summary with Truncation

```tsx
import { Product } from "../../headless/store/components";
import { useState } from "react";

export function ProductSummary() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="product-summary">
      <Product.Name>
        {({ name }) => (
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {name}
          </h3>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ plainDescription }) => {
          const shouldTruncate = plainDescription && plainDescription.length > 150;
          const displayText = shouldTruncate && !isExpanded 
            ? plainDescription.substring(0, 150) + "..."
            : plainDescription;
          
          return (
            <div className="text-gray-600 text-sm">
              {displayText && (
                <p className="whitespace-pre-wrap">{displayText}</p>
              )}
              
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
              
              {!plainDescription && (
                <p className="italic text-gray-400">
                  No description available
                </p>
              )}
            </div>
          );
        }}
      </Product.Description>
    </div>
  );
}
```

## Usage Examples

The Product components are used throughout the application:

### In Product Detail Pages

```tsx
// src/react-pages/store/example-1/products/[slug].tsx
import { Product } from "../../../../headless/store/components";

export const ProductDetailContent = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="product-images">
          {/* Product images would go here */}
        </div>
        
        <div className="product-info">
          <Product.Name>
            {({ name }) => (
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {name}
              </h1>
            )}
          </Product.Name>
          
          <Product.Description>
            {({ description, plainDescription }) => (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                {description ? (
                  <div 
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : plainDescription ? (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {plainDescription}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    No description available
                  </p>
                )}
              </div>
            )}
          </Product.Description>
          
          {/* Other product components like variants, pricing, etc. */}
        </div>
      </div>
    </div>
  );
};
```

### In Product Lists

```tsx
// src/components/store/ProductList.tsx
import { Product } from "../../headless/store/components";

export const ProductListItem = ({ product }) => {
  return (
    <div className="product-list-item bg-white rounded-lg shadow-sm p-4">
      <Product.Name>
        {({ name }) => (
          <h3 className="font-semibold text-gray-900 mb-2">
            {name}
          </h3>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ plainDescription }) => (
          <p className="text-gray-600 text-sm line-clamp-2">
            {plainDescription || "No description available"}
          </p>
        )}
      </Product.Description>
    </div>
  );
};
```

### In Search Results

```tsx
// src/components/store/SearchResults.tsx
import { Product } from "../../headless/store/components";

export const SearchResultItem = ({ product }) => {
  return (
    <div className="search-result-item flex p-4 border-b border-gray-200">
      <div className="flex-1">
        <Product.Name>
          {({ name }) => (
            <h4 className="font-medium text-gray-900 mb-1">
              <a href={`/products/${product.slug}`} className="hover:text-blue-600">
                {name}
              </a>
            </h4>
          )}
        </Product.Name>
        
        <Product.Description>
          {({ plainDescription }) => (
            <p className="text-gray-600 text-sm line-clamp-2">
              {plainDescription || "No description available"}
            </p>
          )}
        </Product.Description>
      </div>
    </div>
  );
};
```

## Integration with Services

The Product components integrate with the ProductService:

### Product Service Integration
- Provides core product data (name, description)
- Handles both rich text and plain text descriptions
- Manages product information state and updates

### Content Formatting
- Supports HTML content in descriptions
- Provides fallback to plain text when rich content isn't available
- Handles content sanitization and display

### SEO Considerations
- Product names are suitable for H1 tags and page titles
- Descriptions can be used for meta descriptions
- Rich text content preserves formatting for better user experience

## Best Practices

### Content Display
- Always provide fallback content when descriptions are empty
- Use proper HTML sanitization when displaying rich text content
- Consider truncation for long descriptions in list views

### Accessibility
- Use semantic HTML elements (h1, h2, etc.) for product names
- Ensure proper heading hierarchy in product layouts
- Provide alternative text for users when content is unavailable

### Performance
- Product components are lightweight and don't perform heavy operations
- Rich text content should be sanitized on the server side when possible
- Consider lazy loading for product descriptions in long lists 
---

##### ProductVariantSelector


The `ProductVariantSelector` components provide comprehensive product variant selection functionality, enabling customers to choose product options like size, color, and style, view pricing, check stock availability, and add items to their cart.

## Overview

The ProductVariantSelector module exports components that work together to provide complete product variant selection:

- **Options** - Container for all product options
- **Option** - Individual product option (e.g., Size, Color)
- **Choice** - Individual choice within an option (e.g., Small, Red)
- **Trigger** - Add to cart functionality with validation
- **Stock** - Stock status and availability information

## Exports

### Options

A headless component that provides access to all product options and current selections.

**Signature:**
```tsx
interface OptionsProps {
  children: (props: OptionsRenderProps) => React.ReactNode;
}

interface OptionsRenderProps {
  options: productsV3.ConnectedOption[];
  hasOptions: boolean;
  selectedChoices: Record<string, string>;
}

export const Options: React.FC<OptionsProps>
```

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Options>
  {({ options, hasOptions, selectedChoices }) => (
    <div>
      {!hasOptions && <p>This product has no options</p>}
      
      {hasOptions && (
        <div className="product-options">
          <h3>Select Options</h3>
          <div className="space-y-4">
            {options.map(option => (
              <ProductVariantSelector.Option key={option.name} option={option}>
                {({ name, choices, selectedValue }) => (
                  <div className="option-group">
                    <label className="block text-sm font-medium mb-2">
                      {name}: {selectedValue || 'Please select'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {choices.map(choice => (
                        <ProductVariantSelector.Choice
                          key={choice.name}
                          option={option}
                          choice={choice}
                        >
                          {({ value, isSelected, isVisible, isInStock, onSelect }) => (
                            <button
                              onClick={onSelect}
                              disabled={!isVisible || !isInStock}
                              className={`px-3 py-1 border rounded ${
                                isSelected 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                              } ${
                                !isVisible || !isInStock 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : ''
                              }`}
                            >
                              {value}
                            </button>
                          )}
                        </ProductVariantSelector.Choice>
                      ))}
                    </div>
                  </div>
                )}
              </ProductVariantSelector.Option>
            ))}
          </div>
        </div>
      )}
    </div>
  )}
</ProductVariantSelector.Options>
```

### Option

A headless component for individual product options (e.g., Size, Color).

**Signature:**
```tsx
interface OptionProps {
  option: productsV3.ConnectedOption;
  children: (props: OptionRenderProps) => React.ReactNode;
}

interface OptionRenderProps {
  name: string;
  type: any;
  choices: productsV3.ConnectedOptionChoice[];
  selectedValue: string | null;
  hasChoices: boolean;
}

export const Option: React.FC<OptionProps>
```

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Option option={sizeOption}>
  {({ name, choices, selectedValue, hasChoices }) => (
    <div className="option-section">
      <h4 className="text-lg font-semibold mb-3">
        {name}
        {selectedValue && <span className="ml-2 text-blue-600">({selectedValue})</span>}
      </h4>
      
      {!hasChoices && <p className="text-gray-500">No choices available</p>}
      
      {hasChoices && (
        <div className="grid grid-cols-4 gap-2">
          {choices.map(choice => (
            <ProductVariantSelector.Choice
              key={choice.name}
              option={sizeOption}
              choice={choice}
            >
              {({ value, isSelected, isVisible, isInStock, onSelect }) => (
                <button
                  onClick={onSelect}
                  disabled={!isVisible}
                  className={`
                    p-2 border rounded text-center transition-colors
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'}
                    ${!isInStock 
                      ? 'bg-gray-100 text-gray-400 line-through' 
                      : ''}
                    ${!isVisible 
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'cursor-pointer'}
                  `}
                >
                  {value}
                  {!isInStock && (
                    <span className="block text-xs text-red-500">Out of Stock</span>
                  )}
                </button>
              )}
            </ProductVariantSelector.Choice>
          ))}
        </div>
      )}
    </div>
  )}
</ProductVariantSelector.Option>
```

### Choice

A headless component for individual choices within an option.

**Signature:**
```tsx
interface ChoiceProps {
  option: productsV3.ConnectedOption;
  choice: productsV3.ConnectedOptionChoice;
  children: (props: ChoiceRenderProps) => React.ReactNode;
}

interface ChoiceRenderProps {
  value: string;
  description: string | undefined;
  isSelected: boolean;
  isVisible: boolean;
  isInStock: boolean;
  isPreOrderEnabled: boolean;
  onSelect: () => void;
  optionName: string;
  choiceValue: string;
}

export const Choice: React.FC<ChoiceProps>
```

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Choice option={colorOption} choice={redChoice}>
  {({ 
    value, 
    isSelected, 
    isVisible, 
    isInStock, 
    isPreOrderEnabled, 
    onSelect,
    optionName,
    choiceValue
  }) => (
    <div className="choice-item">
      <button
        onClick={onSelect}
        disabled={!isVisible}
        className={`
          relative w-full p-3 border rounded-lg transition-all
          ${isSelected 
            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
            : 'border-gray-300 hover:border-gray-400'}
          ${!isVisible 
            ? 'opacity-30 cursor-not-allowed' 
            : 'cursor-pointer'}
        `}
        aria-label={`Select ${optionName}: ${choiceValue}`}
      >
        <span className="block font-medium">{value}</span>
        
        {/* Stock Status */}
        <span className={`block text-xs mt-1 ${
          isInStock ? 'text-green-600' : 
          isPreOrderEnabled ? 'text-orange-600' : 
          'text-red-600'
        }`}>
          {isInStock ? 'In Stock' : 
           isPreOrderEnabled ? 'Pre-Order' : 
           'Out of Stock'}
        </span>
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
              <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z"/>
            </svg>
          </div>
        )}
      </button>
    </div>
  )}
</ProductVariantSelector.Choice>
```

### Trigger

A headless component for add to cart functionality with comprehensive validation.

**Signature:**
```tsx
interface TriggerProps {
  quantity?: number;
  children: (props: TriggerRenderProps) => React.ReactNode;
}

interface TriggerRenderProps {
  onAddToCart: () => Promise<void>;
  canAddToCart: boolean;
  isLoading: boolean;
  price: string;
  inStock: boolean;
  isPreOrderEnabled: boolean;
  error: string | null;
  availableQuantity: number | null;
}

export const Trigger: React.FC<TriggerProps>
```

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Trigger quantity={2}>
  {({ 
    onAddToCart, 
    canAddToCart, 
    isLoading, 
    price, 
    inStock, 
    isPreOrderEnabled, 
    error, 
    availableQuantity 
  }) => (
    <div className="add-to-cart-section">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">{price}</span>
        {availableQuantity !== null && (
          <span className="text-sm text-gray-600">
            {availableQuantity} available
          </span>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <button
        onClick={onAddToCart}
        disabled={!canAddToCart || isLoading}
        className={`
          w-full py-3 px-6 rounded-lg font-medium transition-colors
          ${canAddToCart && !isLoading
            ? inStock 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding to Cart...
          </span>
        ) : inStock ? (
          'Add to Cart'
        ) : isPreOrderEnabled ? (
          'Pre-Order Now'
        ) : (
          'Out of Stock'
        )}
      </button>
      
      <div className="mt-2 text-xs text-gray-600">
        {inStock ? (
          '✓ In stock and ready to ship'
        ) : isPreOrderEnabled ? (
          '⏳ Available for pre-order'
        ) : (
          '❌ Currently out of stock'
        )}
      </div>
    </div>
  )}
</ProductVariantSelector.Trigger>
```

### Stock

A headless component for displaying stock status and availability information.

**Signature:**
```tsx
interface StockProps {
  children: (props: StockRenderProps) => React.ReactNode;
}

interface StockRenderProps {
  inStock: boolean;
  isPreOrderEnabled: boolean;
  status: string;
  trackInventory: boolean;
  currentVariantId: string | null;
  availableQuantity: number | null;
}

export const Stock: React.FC<StockProps>
```

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Stock>
  {({ 
    inStock, 
    isPreOrderEnabled, 
    status, 
    trackInventory, 
    currentVariantId, 
    availableQuantity 
  }) => (
    <div className="stock-info">
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        inStock 
          ? 'bg-green-100 text-green-800' 
          : isPreOrderEnabled 
            ? 'bg-orange-100 text-orange-800' 
            : 'bg-red-100 text-red-800'
      }`}>
        <span className={`w-2 h-2 rounded-full mr-2 ${
          inStock ? 'bg-green-500' : 
          isPreOrderEnabled ? 'bg-orange-500' : 
          'bg-red-500'
        }`}></span>
        {status}
      </div>
      
      {availableQuantity !== null && (
        <div className="mt-2 text-sm text-gray-600">
          {availableQuantity > 0 ? (
            <span>
              {availableQuantity} {availableQuantity === 1 ? 'item' : 'items'} available
            </span>
          ) : (
            <span>No items available</span>
          )}
        </div>
      )}
      
      {currentVariantId && (
        <div className="mt-1 text-xs text-gray-400">
          Variant: {currentVariantId}
        </div>
      )}
    </div>
  )}
</ProductVariantSelector.Stock>
```

## Complete Example

Here's a complete example showing how all ProductVariantSelector components work together:

```tsx
import { ProductVariantSelector } from "../../headless/store/components";

export function ProductVariantSelection() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Select Product Options</h2>
      
      {/* Product Options */}
      <ProductVariantSelector.Options>
        {({ options, hasOptions, selectedChoices }) => (
          <div className="space-y-6">
            {!hasOptions && (
              <p className="text-gray-500 text-center">
                This product has no customizable options
              </p>
            )}
            
            {hasOptions && (
              <div className="space-y-4">
                {options.map(option => (
                  <ProductVariantSelector.Option key={option.name} option={option}>
                    {({ name, choices, selectedValue, hasChoices }) => (
                      <div className="option-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {name}
                          {selectedValue && (
                            <span className="ml-2 text-blue-600 font-normal">
                              ({selectedValue})
                            </span>
                          )}
                        </label>
                        
                        {hasChoices && (
                          <div className="grid grid-cols-3 gap-2">
                            {choices.map(choice => (
                              <ProductVariantSelector.Choice
                                key={choice.name}
                                option={option}
                                choice={choice}
                              >
                                {({ 
                                  value, 
                                  isSelected, 
                                  isVisible, 
                                  isInStock, 
                                  isPreOrderEnabled, 
                                  onSelect 
                                }) => (
                                  <button
                                    onClick={onSelect}
                                    disabled={!isVisible}
                                    className={`
                                      p-2 border rounded text-center transition-all
                                      ${isSelected 
                                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' 
                                        : 'border-gray-300 hover:border-gray-400'}
                                      ${!isInStock && isVisible
                                        ? 'bg-gray-100 text-gray-400' 
                                        : ''}
                                      ${!isVisible 
                                        ? 'opacity-30 cursor-not-allowed' 
                                        : 'cursor-pointer'}
                                    `}
                                  >
                                    <span className="block font-medium">
                                      {value}
                                    </span>
                                    <span className={`block text-xs mt-1 ${
                                      isInStock ? 'text-green-600' : 
                                      isPreOrderEnabled ? 'text-orange-600' : 
                                      'text-red-600'
                                    }`}>
                                      {isInStock ? 'In Stock' : 
                                       isPreOrderEnabled ? 'Pre-Order' : 
                                       'Out of Stock'}
                                    </span>
                                  </button>
                                )}
                              </ProductVariantSelector.Choice>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </ProductVariantSelector.Option>
                ))}
              </div>
            )}
          </div>
        )}
      </ProductVariantSelector.Options>
      
      {/* Stock Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <ProductVariantSelector.Stock>
          {({ inStock, isPreOrderEnabled, status, availableQuantity }) => (
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                inStock 
                  ? 'bg-green-100 text-green-800' 
                  : isPreOrderEnabled 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  inStock ? 'bg-green-500' : 
                  isPreOrderEnabled ? 'bg-orange-500' : 
                  'bg-red-500'
                }`}></span>
                {status}
              </div>
              
              {availableQuantity !== null && (
                <span className="text-sm text-gray-600">
                  {availableQuantity} available
                </span>
              )}
            </div>
          )}
        </ProductVariantSelector.Stock>
      </div>
      
      {/* Add to Cart */}
      <div className="mt-6">
        <ProductVariantSelector.Trigger quantity={1}>
          {({ 
            onAddToCart, 
            canAddToCart, 
            isLoading, 
            price, 
            inStock, 
            isPreOrderEnabled, 
            error 
          }) => (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {price}
                </span>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={onAddToCart}
                disabled={!canAddToCart || isLoading}
                className={`
                  w-full py-3 px-6 rounded-lg font-medium transition-colors
                  ${canAddToCart && !isLoading
                    ? inStock 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                `}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding to Cart...
                  </span>
                ) : inStock ? (
                  'Add to Cart'
                ) : isPreOrderEnabled ? (
                  'Pre-Order Now'
                ) : (
                  'Out of Stock'
                )}
              </button>
            </div>
          )}
        </ProductVariantSelector.Trigger>
      </div>
    </div>
  );
}
```

## Usage Examples

The ProductVariantSelector components are used extensively throughout the application:

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
import { ProductVariantSelector } from "../../../../headless/store/components";

export const ProductVariantSelectorContent = ({ product }) => {
  return (
    <div className="space-y-6">
      <ProductVariantSelector.Options>
        {({ options, hasOptions }) => (
          <div className="space-y-4">
            {hasOptions && options.map(option => (
              <ProductVariantSelector.Option key={option.name} option={option}>
                {({ name, choices, selectedValue }) => (
                  <VariantOptionGroup
                    name={name}
                    choices={choices}
                    selectedValue={selectedValue}
                    option={option}
                  />
                )}
              </ProductVariantSelector.Option>
            ))}
          </div>
        )}
      </ProductVariantSelector.Options>
      
      <ProductVariantSelector.Stock>
        {({ inStock, isPreOrderEnabled, status, availableQuantity }) => (
          <StockIndicator
            inStock={inStock}
            isPreOrderEnabled={isPreOrderEnabled}
            status={status}
            availableQuantity={availableQuantity}
          />
        )}
      </ProductVariantSelector.Stock>
      
      <ProductVariantSelector.Trigger>
        {({ onAddToCart, canAddToCart, isLoading, price, error }) => (
          <AddToCartButton
            onAddToCart={onAddToCart}
            canAddToCart={canAddToCart}
            isLoading={isLoading}
            price={price}
            error={error}
          />
        )}
      </ProductVariantSelector.Trigger>
    </div>
  );
};
```

### In Product Action Buttons
```tsx
// src/components/store/ProductActionButtons.tsx
import { ProductVariantSelector } from "../../headless/store/components";

export const ProductActionButtons = ({ product }) => {
  return (
    <div className="flex space-x-4">
      <ProductVariantSelector.Trigger>
        {({ onAddToCart, canAddToCart, isLoading, price }) => (
          <button
            onClick={onAddToCart}
            disabled={!canAddToCart || isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : `Add to Cart - ${price}`}
          </button>
        )}
      </ProductVariantSelector.Trigger>
      
      <ProductVariantSelector.Stock>
        {({ inStock, isPreOrderEnabled, status }) => (
          <span className={`px-3 py-2 rounded text-sm ${
            inStock ? 'bg-green-100 text-green-800' : 
            isPreOrderEnabled ? 'bg-orange-100 text-orange-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
        )}
      </ProductVariantSelector.Stock>
    </div>
  );
};
```

## Integration with Services

The ProductVariantSelector components integrate with multiple services:

### Selected Variant Service Integration
- Manages product option selections and variant calculation
- Provides pricing, stock status, and availability information
- Handles add to cart operations with variant data

### Product Modifiers Service Integration
- Manages optional product modifiers (when available)
- Validates required modifier selections
- Includes modifier data in cart operations

### Service Coordination
- Automatic validation of required selections before add to cart
- Coordinated loading states across options and actions
- Unified error handling for variant selection and cart operations 
---

##### RelatedProducts


The `RelatedProducts` components provide functionality for displaying and managing related products, typically used to show similar or complementary items on product detail pages.

## Overview

The RelatedProducts module exports components for displaying related products:

- **List** - Container component for related products with loading states
- **Item** - Individual related product item with quick actions

## Exports

### List

A headless component that provides access to related products with state management.

**Signature:**
```tsx
interface ListProps {
  children: (props: ListRenderProps) => React.ReactNode;
}

interface ListRenderProps {
  products: productsV3.V3Product[];
  isLoading: boolean;
  error: string | null;
  hasProducts: boolean;
  refresh: () => Promise<void>;
}

export const List: React.FC<ListProps>
```

**Example:**
```tsx
import { RelatedProducts } from "../../headless/store/components";

<RelatedProducts.List>
  {({ products, isLoading, error, hasProducts, refresh }) => (
    <div className="related-products">
      <h3 className="text-xl font-semibold mb-4">Related Products</h3>
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading related products...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading related products: {error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}
      
      {!isLoading && !error && !hasProducts && (
        <div className="text-center py-8">
          <p className="text-gray-600">No related products found</p>
        </div>
      )}
      
      {hasProducts && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <RelatedProducts.Item key={product._id} product={product}>
              {({ title, image, price, available, href, onQuickAdd }) => (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <a href={href}>
                    {image && (
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-48 object-cover rounded mb-3"
                      />
                    )}
                    <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
                    <p className="text-lg font-bold text-blue-600">{price}</p>
                    <p className={`text-sm ${available ? 'text-green-600' : 'text-red-600'}`}>
                      {available ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </a>
                  <button
                    onClick={onQuickAdd}
                    disabled={!available}
                    className="w-full mt-3 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                  >
                    Quick Add
                  </button>
                </div>
              )}
            </RelatedProducts.Item>
          ))}
        </div>
      )}
    </div>
  )}
</RelatedProducts.List>
```

### Item

A headless component for individual related product items with quick actions.

**Signature:**
```tsx
interface ItemProps {
  product: productsV3.V3Product;
  children: (props: ItemRenderProps) => React.ReactNode;
}

interface ItemRenderProps {
  title: string;
  image: string | null;
  price: string;
  available: boolean;
  href: string;
  description: string;
  onQuickAdd: () => void;
}

export const Item: React.FC<ItemProps>
```

**Example:**
```tsx
import { RelatedProducts } from "../../headless/store/components";

<RelatedProducts.Item product={product}>
  {({ 
    title, 
    image, 
    price, 
    available, 
    href, 
    description, 
    onQuickAdd 
  }) => (
    <div className="related-product-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <a href={href} className="block">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h4>
          {description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">
              {price}
            </span>
            <span className={`text-sm ${
              available ? 'text-green-600' : 'text-red-600'
            }`}>
              {available ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </a>
      
      <div className="p-4 pt-0">
        <button
          onClick={onQuickAdd}
          disabled={!available}
          className={`w-full py-2 px-4 rounded font-medium transition-colors ${
            available
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {available ? 'Quick Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )}
</RelatedProducts.Item>
```

## Complete Examples

### Simple Related Products Section

```tsx
import { RelatedProducts } from "../../headless/store/components";

export function SimpleRelatedProducts() {
  return (
    <section className="py-8">
      <RelatedProducts.List>
        {({ products, isLoading, error, hasProducts, refresh }) => {
          if (isLoading) {
            return (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading related products...</p>
              </div>
            );
          }

          if (error) {
            return (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load related products</p>
                <button
                  onClick={refresh}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            );
          }

          if (!hasProducts) {
            return (
              <div className="text-center py-12">
                <p className="text-gray-600">No related products available</p>
              </div>
            );
          }

          return (
            <div>
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <RelatedProducts.Item key={product._id} product={product}>
                    {({ title, image, price, available, href, onQuickAdd }) => (
                      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <a href={href} className="block">
                          {image && (
                            <img
                              src={image}
                              alt={title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-2">
                              {title}
                            </h3>
                            <p className="text-xl font-bold text-blue-600">
                              {price}
                            </p>
                          </div>
                        </a>
                        <div className="p-4 pt-0">
                          <button
                            onClick={onQuickAdd}
                            disabled={!available}
                            className={`w-full py-2 px-4 rounded font-medium ${
                              available
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {available ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    )}
                  </RelatedProducts.Item>
                ))}
              </div>
            </div>
          );
        }}
      </RelatedProducts.List>
    </section>
  );
}
```

### Related Products Carousel

```tsx
import { RelatedProducts } from "../../headless/store/components";
import { useState } from "react";

export function RelatedProductsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  return (
    <section className="py-8">
      <RelatedProducts.List>
        {({ products, isLoading, error, hasProducts }) => {
          if (isLoading) {
            return (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
                <div className="flex gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-1">
                      <div className="h-48 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (error || !hasProducts) {
            return null; // Hide section if no products
          }

          const itemsPerPage = 4;
          const totalPages = Math.ceil(products.length / itemsPerPage);
          const currentProducts = products.slice(
            currentIndex * itemsPerPage,
            (currentIndex + 1) * itemsPerPage
          );

          return (
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Related Products</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentIndex(Math.min(totalPages - 1, currentIndex + 1))}
                    disabled={currentIndex === totalPages - 1}
                    className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentProducts.map(product => (
                  <RelatedProducts.Item key={product._id} product={product}>
                    {({ title, image, price, available, href, onQuickAdd }) => (
                      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <a href={href} className="block">
                          {image && (
                            <img
                              src={image}
                              alt={title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                              {title}
                            </h3>
                            <p className="text-xl font-bold text-blue-600">
                              {price}
                            </p>
                            <p className={`text-sm ${
                              available ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {available ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>
                        </a>
                        <div className="p-4 pt-0">
                          <button
                            onClick={onQuickAdd}
                            disabled={!available}
                            className={`w-full py-2 px-4 rounded font-medium ${
                              available
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Quick Add
                          </button>
                        </div>
                      </div>
                    )}
                  </RelatedProducts.Item>
                ))}
              </div>

              <div className="flex justify-center mt-6 gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full ${
                      i === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        }}
      </RelatedProducts.List>
    </section>
  );
}
```

### Compact Related Products Sidebar

```tsx
import { RelatedProducts } from "../../headless/store/components";

export function RelatedProductsSidebar() {
  return (
    <aside className="w-64 bg-gray-50 p-4 rounded-lg">
      <RelatedProducts.List>
        {({ products, isLoading, error, hasProducts }) => {
          if (isLoading) {
            return (
              <div>
                <div className="h-5 bg-gray-200 rounded mb-4 w-32"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (error || !hasProducts) {
            return null;
          }

          return (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Related Products</h3>
              <div className="space-y-4">
                {products.slice(0, 3).map(product => (
                  <RelatedProducts.Item key={product._id} product={product}>
                    {({ title, image, price, available, href, onQuickAdd }) => (
                      <div className="flex gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <a href={href} className="flex-shrink-0">
                          {image && (
                            <img
                              src={image}
                              alt={title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                        </a>
                        <div className="flex-1 min-w-0">
                          <a href={href} className="block">
                            <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                              {title}
                            </h4>
                            <p className="text-sm font-bold text-blue-600 mb-1">
                              {price}
                            </p>
                          </a>
                          <button
                            onClick={onQuickAdd}
                            disabled={!available}
                            className={`text-xs px-2 py-1 rounded ${
                              available
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {available ? 'Add' : 'N/A'}
                          </button>
                        </div>
                      </div>
                    )}
                  </RelatedProducts.Item>
                ))}
              </div>
            </div>
          );
        }}
      </RelatedProducts.List>
    </aside>
  );
}
```

## Usage Examples

The RelatedProducts components are used in product detail pages and other locations:

### In Product Detail Pages

```tsx
// src/react-pages/store/example-1/products/[slug].tsx
import { RelatedProducts } from "../../../../headless/store/components";

export const ProductDetailPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Main product content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product images and details */}
      </div>
      
      {/* Related Products Section */}
      <RelatedProducts.List>
        {({ products, isLoading, error, hasProducts }) => {
          if (!hasProducts && !isLoading) {
            return null; // Don't show section if no products
          }
          
          return (
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Failed to load related products</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map(product => (
                    <RelatedProducts.Item key={product._id} product={product}>
                      {({ title, image, price, available, href }) => (
                        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <a href={href} className="block">
                            {image && (
                              <img
                                src={image}
                                alt={title}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                            )}
                            <div className="p-4">
                              <h3 className="font-medium text-gray-900 mb-2">
                                {title}
                              </h3>
                              <p className="text-xl font-bold text-blue-600">
                                {price}
                              </p>
                              <p className={`text-sm ${
                                available ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {available ? 'In Stock' : 'Out of Stock'}
                              </p>
                            </div>
                          </a>
                        </div>
                      )}
                    </RelatedProducts.Item>
                  ))}
                </div>
              )}
            </section>
          );
        }}
      </RelatedProducts.List>
    </div>
  );
};
```

### In Shopping Cart

```tsx
// src/react-pages/cart.tsx
import { RelatedProducts } from "../headless/store/components";

export const CartPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Cart items */}
      <div className="mb-12">
        {/* Cart content */}
      </div>
      
      {/* Related Products for Cross-selling */}
      <RelatedProducts.List>
        {({ products, hasProducts, isLoading }) => {
          if (!hasProducts || isLoading) {
            return null;
          }
          
          return (
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold mb-6">Complete Your Purchase</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 4).map(product => (
                  <RelatedProducts.Item key={product._id} product={product}>
                    {({ title, image, price, available, href, onQuickAdd }) => (
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <a href={href} className="block">
                          {image && (
                            <img
                              src={image}
                              alt={title}
                              className="w-full h-32 object-cover rounded mb-3"
                            />
                          )}
                          <h3 className="font-medium text-gray-900 mb-1 text-sm">
                            {title}
                          </h3>
                          <p className="text-lg font-bold text-blue-600">
                            {price}
                          </p>
                        </a>
                        <button
                          onClick={onQuickAdd}
                          disabled={!available}
                          className={`w-full mt-3 py-2 px-3 rounded text-sm font-medium ${
                            available
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {available ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    )}
                  </RelatedProducts.Item>
                ))}
              </div>
            </section>
          );
        }}
      </RelatedProducts.List>
    </div>
  );
};
```

## Integration with Services

The RelatedProducts components integrate with the RelatedProductsService:

### Service Integration
- Automatically loads related products for the current context
- Provides loading states and error handling
- Supports refresh functionality for updated recommendations

### Quick Add Functionality
- Integrates with cart services for quick add operations
- Handles inventory checks and availability
- Provides immediate feedback for user actions

### URL Generation
- Automatically generates product page URLs
- Supports different store layouts and routing patterns
- Maintains consistent navigation experience

## Best Practices

### Loading States
- Always show loading indicators while fetching related products
- Use skeleton screens for better perceived performance
- Handle empty states gracefully

### Error Handling
- Provide retry mechanisms for failed requests
- Hide sections when no products are available
- Log errors for debugging while maintaining user experience

### Performance
- Limit the number of related products shown
- Use responsive design for different screen sizes
- Implement lazy loading for below-fold content

### User Experience
- Show clear product information (title, price, availability)
- Provide quick actions (add to cart, view details)
- Maintain consistent styling with the rest of the application
``` 
---

##### SelectedVariant


The `SelectedVariant` components provide access to information about the currently selected product variant, including pricing, SKU, and physical properties.

## Overview

The SelectedVariant module exports components for displaying selected variant information:

- **Details** - Physical details like SKU and weight
- **Price** - Current pricing information with compare prices
- **SKU** - Product SKU display

## Exports

### Details

A headless component that provides access to the selected variant's physical details.

**Signature:**
```tsx
interface ProductDetailsProps {
  children: (props: ProductDetailsRenderProps) => React.ReactNode;
}

interface ProductDetailsRenderProps {
  sku: string | null;
  weight: string | null;
}

export const Details: React.FC<ProductDetailsProps>
```

**Example:**
```tsx
import { SelectedVariant } from "../../headless/store/components";

<SelectedVariant.Details>
  {({ sku, weight }) => (
    <div className="variant-details">
      <h3 className="text-lg font-semibold mb-3">Product Details</h3>
      <dl className="space-y-2">
        {sku && (
          <div className="flex">
            <dt className="font-medium text-gray-700 w-20">SKU:</dt>
            <dd className="text-gray-900">{sku}</dd>
          </div>
        )}
        {weight && (
          <div className="flex">
            <dt className="font-medium text-gray-700 w-20">Weight:</dt>
            <dd className="text-gray-900">{weight} lbs</dd>
          </div>
        )}
      </dl>
    </div>
  )}
</SelectedVariant.Details>
```

### Price

A headless component that provides comprehensive pricing information for the selected variant.

**Signature:**
```tsx
interface PriceProps {
  children: (props: PriceRenderProps) => React.ReactNode;
}

interface PriceRenderProps {
  price: string;
  compareAtPrice: string | null;
  currency: string;
}

export const Price: React.FC<PriceProps>
```

**Example:**
```tsx
import { SelectedVariant } from "../../headless/store/components";

<SelectedVariant.Price>
  {({ price, compareAtPrice, currency }) => (
    <div className="pricing">
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {price}
        </span>
        {compareAtPrice && (
          <span className="text-xl text-gray-500 line-through">
            {compareAtPrice}
          </span>
        )}
        {compareAtPrice && (
          <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
            Sale
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-1">
        Currency: {currency}
      </p>
    </div>
  )}
</SelectedVariant.Price>
```

### SKU

A headless component that provides access to the selected variant's SKU.

**Signature:**
```tsx
interface SKUProps {
  children: (props: SKURenderProps) => React.ReactNode;
}

interface SKURenderProps {
  sku: string | null;
}

export const SKU: React.FC<SKUProps>
```

**Example:**
```tsx
import { SelectedVariant } from "../../headless/store/components";

<SelectedVariant.SKU>
  {({ sku }) => (
    <div className="sku-display">
      {sku ? (
        <span className="text-sm text-gray-600">
          SKU: <span className="font-mono">{sku}</span>
        </span>
      ) : (
        <span className="text-sm text-gray-400">
          No SKU available
        </span>
      )}
    </div>
  )}
</SelectedVariant.SKU>
```

## Complete Examples

### Product Information Panel

```tsx
import { SelectedVariant } from "../../headless/store/components";

export function ProductInfoPanel() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Product Information</h2>
      
      {/* Current Pricing */}
      <div className="mb-6">
        <SelectedVariant.Price>
          {({ price, compareAtPrice, currency }) => (
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {price}
                </span>
                {compareAtPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {compareAtPrice}
                    </span>
                    <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                      On Sale
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">
                All prices in {currency}
              </p>
            </div>
          )}
        </SelectedVariant.Price>
      </div>
      
      {/* Product Details */}
      <div className="border-t pt-4">
        <SelectedVariant.Details>
          {({ sku, weight }) => (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Details</h3>
              <dl className="space-y-2">
                {sku && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-700">SKU</dt>
                    <dd className="text-sm text-gray-900 font-mono">{sku}</dd>
                  </div>
                )}
                {weight && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-700">Weight</dt>
                    <dd className="text-sm text-gray-900">{weight} lbs</dd>
                  </div>
                )}
                {!sku && !weight && (
                  <p className="text-sm text-gray-500 italic">
                    No additional details available
                  </p>
                )}
              </dl>
            </div>
          )}
        </SelectedVariant.Details>
      </div>
    </div>
  );
}
```

### Pricing Display with Savings

```tsx
import { SelectedVariant } from "../../headless/store/components";

export function PricingDisplay() {
  return (
    <SelectedVariant.Price>
      {({ price, compareAtPrice, currency }) => {
        // Calculate savings if compare price exists
        const currentPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
        const originalPrice = compareAtPrice ? parseFloat(compareAtPrice.replace(/[^0-9.]/g, '')) : null;
        const savings = originalPrice ? originalPrice - currentPrice : 0;
        const savingsPercent = originalPrice ? Math.round((savings / originalPrice) * 100) : 0;
        
        return (
          <div className="pricing-display">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl font-bold text-blue-600">
                {price}
              </span>
              {compareAtPrice && (
                <div className="text-right">
                  <div className="text-lg text-gray-500 line-through">
                    {compareAtPrice}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Save {savingsPercent}%
                  </div>
                </div>
              )}
            </div>
            
            {compareAtPrice && (
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  Limited Time Sale
                </span>
                <span className="text-sm text-gray-600">
                  You save ${savings.toFixed(2)}
                </span>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              * Price shown in {currency}
            </p>
          </div>
        );
      }}
    </SelectedVariant.Price>
  );
}
```

### Product Summary Card

```tsx
import { SelectedVariant } from "../../headless/store/components";

export function ProductSummaryCard() {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <SelectedVariant.Price>
            {({ price, compareAtPrice }) => (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {price}
                </span>
                {compareAtPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {compareAtPrice}
                  </span>
                )}
              </div>
            )}
          </SelectedVariant.Price>
        </div>
        
        <SelectedVariant.SKU>
          {({ sku }) => (
            <div className="text-right">
              {sku && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {sku}
                </span>
              )}
            </div>
          )}
        </SelectedVariant.SKU>
      </div>
      
      <SelectedVariant.Details>
        {({ weight }) => (
          <div className="text-sm text-gray-600">
            {weight && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                <span>Weight: {weight} lbs</span>
              </div>
            )}
          </div>
        )}
      </SelectedVariant.Details>
    </div>
  );
}
```

### Mobile-Optimized Price Display

```tsx
import { SelectedVariant } from "../../headless/store/components";

export function MobilePriceDisplay() {
  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
      <SelectedVariant.Price>
        {({ price, compareAtPrice }) => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {price}
              </span>
              {compareAtPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {compareAtPrice}
                </span>
              )}
            </div>
            
            <SelectedVariant.SKU>
              {({ sku }) => (
                <div className="text-right">
                  {sku && (
                    <span className="text-xs text-gray-500">
                      SKU: {sku}
                    </span>
                  )}
                </div>
              )}
            </SelectedVariant.SKU>
          </div>
        )}
      </SelectedVariant.Price>
    </div>
  );
}
```

### Product Specification List

```tsx
import { SelectedVariant } from "../../headless/store/components";

export function ProductSpecifications() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Specifications</h3>
      
      <SelectedVariant.Details>
        {({ sku, weight }) => (
          <dl className="grid grid-cols-1 gap-3">
            {sku && (
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                <dt className="font-medium text-gray-700">Product Code</dt>
                <dd className="font-mono text-gray-900 text-sm mt-1 sm:mt-0">
                  {sku}
                </dd>
              </div>
            )}
            
            {weight && (
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                <dt className="font-medium text-gray-700">Shipping Weight</dt>
                <dd className="text-gray-900 mt-1 sm:mt-0">
                  {weight} pounds
                </dd>
              </div>
            )}
            
            <SelectedVariant.Price>
              {({ currency }) => (
                <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                  <dt className="font-medium text-gray-700">Currency</dt>
                  <dd className="text-gray-900 mt-1 sm:mt-0">
                    {currency}
                  </dd>
                </div>
              )}
            </SelectedVariant.Price>
          </dl>
        )}
      </SelectedVariant.Details>
    </div>
  );
}
```

## Usage Examples

The SelectedVariant components are used throughout product detail pages:

### In Product Detail Pages

```tsx
// src/react-pages/store/example-1/products/[slug].tsx
import { SelectedVariant } from "../../../../headless/store/components";

export const ProductDetailContent = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="product-images">
          {/* Product images */}
        </div>
        
        <div className="product-info">
          {/* Product name and description */}
          
          {/* Pricing Section */}
          <div className="mb-6">
            <SelectedVariant.Price>
              {({ price, compareAtPrice, currency }) => (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {price}
                  </span>
                  {compareAtPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {compareAtPrice}
                      </span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                        Sale
                      </span>
                    </>
                  )}
                </div>
              )}
            </SelectedVariant.Price>
          </div>
          
          {/* Variant selectors */}
          
          {/* Product details */}
          <div className="mt-8 pt-8 border-t">
            <SelectedVariant.Details>
              {({ sku, weight }) => (
                <div>
                  <h3 className="text-lg font-medium mb-3">Product Details</h3>
                  <div className="space-y-2">
                    {sku && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">SKU</span>
                        <span className="font-mono text-gray-900">{sku}</span>
                      </div>
                    )}
                    {weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight</span>
                        <span className="text-gray-900">{weight} lbs</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </SelectedVariant.Details>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### In Product Action Buttons

```tsx
// src/components/store/ProductActionButtons.tsx
import { SelectedVariant } from "../../headless/store/components";

export const ProductActionButtons = () => {
  return (
    <div className="space-y-4">
      {/* Pricing display */}
      <SelectedVariant.Price>
        {({ price, compareAtPrice }) => (
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-900">
              {price}
            </span>
            {compareAtPrice && (
              <span className="ml-2 text-lg text-gray-500 line-through">
                {compareAtPrice}
              </span>
            )}
          </div>
        )}
      </SelectedVariant.Price>
      
      {/* Add to cart button */}
      <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600">
        Add to Cart
      </button>
      
      {/* SKU reference */}
      <SelectedVariant.SKU>
        {({ sku }) => (
          <div className="text-center text-sm text-gray-600">
            {sku && <span>Item: {sku}</span>}
          </div>
        )}
      </SelectedVariant.SKU>
    </div>
  );
};
```

## Integration with Services

The SelectedVariant components integrate with multiple services:

### Selected Variant Service Integration
- Automatically tracks the currently selected product variant
- Provides reactive updates when variant selections change
- Handles pricing calculations and currency formatting

### Product Service Integration
- Integrates with base product data
- Provides fallback information when variant data isn't available
- Maintains consistency with overall product information

## Best Practices

### Pricing Display
- Always show current price prominently
- Use visual cues (strikethrough, badges) for sale prices
- Provide currency context for international customers

### Product Information
- Show SKU for customer service and inventory tracking
- Display weight for shipping calculations
- Handle missing data gracefully with fallbacks

### Responsive Design
- Adapt pricing display for mobile screens
- Use appropriate typography scales for different screen sizes
- Ensure touch targets are appropriately sized

### Accessibility
- Use semantic markup for pricing information
- Provide clear labels for product specifications
- Ensure sufficient color contrast for sale indicators 
---

##### Sort


The `Sort` components provide headless functionality for sorting product collections. These components use React context to manage sort state and provide sorting controls.

## Overview

The Sort module exports components and hooks for managing product sorting:

- **Provider** - Context provider for sort state
- **Controller** - Render prop component for sort controls
- **useSortContext** - Hook for accessing sort context

## Exports

### Provider

A React context provider that manages sort state and integrates with the Sort Service.

**Signature:**
```tsx
interface ProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProviderProps): JSX.Element
```

**Example:**
```tsx
import { Sort } from "../../headless/store/components";

<Sort.Provider>
  <YourSortingInterface />
</Sort.Provider>
```

### Controller

A render prop component that provides access to sort state and actions.

**Signature:**
```tsx
interface ControllerProps {
  children: (props: SortContextValue) => React.ReactNode;
}

interface SortContextValue {
  currentSort: SortBy;
  setSortBy: (sortBy: SortBy) => void;
}

export function Controller({ children }: ControllerProps): JSX.Element
```

**Example:**
```tsx
import { Sort } from "../../headless/store/components";

<Sort.Provider>
  <Sort.Controller>
    {({ currentSort, setSortBy }) => (
      <div className="sort-controls">
        <label htmlFor="sort-select">Sort by:</label>
        <select 
          id="sort-select"
          value={currentSort} 
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="border rounded px-3 py-2"
        >
          <option value="">Default</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="recommended">Recommended</option>
        </select>
      </div>
    )}
  </Sort.Controller>
</Sort.Provider>
```

### useSortContext

A React hook that provides access to the sort context. Must be used within a Sort.Provider.

**Signature:**
```tsx
function useSortContext(): SortContextValue

interface SortContextValue {
  currentSort: SortBy;
  setSortBy: (sortBy: SortBy) => void;
}
```

**Example:**
```tsx
import { Sort } from "../../headless/store/components";

function CustomSortDropdown() {
  const { currentSort, setSortBy } = Sort.useSortContext();
  
  return (
    <div className="relative">
      <button 
        className="flex items-center px-4 py-2 border rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        Sort: {getSortLabel(currentSort)}
        <ChevronDownIcon className="ml-2 w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg">
          <button onClick={() => setSortBy("name-asc")}>Name (A-Z)</button>
          <button onClick={() => setSortBy("price-asc")}>Price (Low to High)</button>
          <button onClick={() => setSortBy("recommended")}>Recommended</button>
        </div>
      )}
    </div>
  );
}

// Use within Provider
<Sort.Provider>
  <CustomSortDropdown />
</Sort.Provider>
```

## Sort Options

The Sort components work with these sort values:

### SortBy Type
```tsx
type SortBy = "" | "name-asc" | "name-desc" | "price-asc" | "price-desc" | "recommended";
```

### Sort Options
- `""` (empty string) - Default/no sorting
- `"name-asc"` - Sort by name ascending (A-Z)
- `"name-desc"` - Sort by name descending (Z-A)
- `"price-asc"` - Sort by price ascending (low to high)
- `"price-desc"` - Sort by price descending (high to low)
- `"recommended"` - Sort by recommendation (category-based)

## Integration with Sort Service

The Sort components integrate automatically with the Sort Service:

- **State Synchronization**: The Provider syncs with the Sort Service state
- **Automatic Updates**: Changes in sort selection trigger collection refresh
- **URL Integration**: Sort state can be persisted in URL parameters

## Usage Examples

The Sort components are used throughout the application:

### In Product List Components
```tsx
// src/components/store/ProductList.tsx
import { Sort } from "../../headless/store/components";

export function ProductList() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Products</h2>
        
        <Sort.Provider>
          <Sort.Controller>
            {({ currentSort, setSortBy }) => (
              <select 
                value={currentSort} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">Default</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            )}
          </Sort.Controller>
        </Sort.Provider>
      </div>
      
      <ProductGrid />
    </div>
  );
}
```

### In FilteredCollection Pages
```tsx
// src/react-pages/store/example-2/index.tsx
import { Sort } from "../../../headless/store/components";

export default function StoreExample2Page() {
  return (
    <div>
      <Sort.Provider>
        <div className="flex justify-between items-center mb-8">
          <h1>Advanced Store</h1>
          
          <Sort.Controller>
            {({ currentSort, setSortBy }) => (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={currentSort}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="">Default</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="recommended">Recommended</option>
                </select>
              </div>
            )}
          </Sort.Controller>
        </div>
        
        <ProductGridContent />
      </Sort.Provider>
    </div>
  );
}
```

### Custom Sort Component with Icons
```tsx
import { Sort } from "../../headless/store/components";

function SortButtons() {
  return (
    <Sort.Provider>
      <Sort.Controller>
        {({ currentSort, setSortBy }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => setSortBy("name-asc")}
              className={`flex items-center px-3 py-2 rounded ${
                currentSort === "name-asc" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <AlphabeticalIcon className="w-4 h-4 mr-1" />
              A-Z
            </button>
            
            <button
              onClick={() => setSortBy("price-asc")}
              className={`flex items-center px-3 py-2 rounded ${
                currentSort === "price-asc" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <PriceUpIcon className="w-4 h-4 mr-1" />
              Price ↑
            </button>
            
            <button
              onClick={() => setSortBy("price-desc")}
              className={`flex items-center px-3 py-2 rounded ${
                currentSort === "price-desc" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <PriceDownIcon className="w-4 h-4 mr-1" />
              Price ↓
            </button>
            
            <button
              onClick={() => setSortBy("recommended")}
              className={`flex items-center px-3 py-2 rounded ${
                currentSort === "recommended" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <StarIcon className="w-4 h-4 mr-1" />
              Recommended
            </button>
          </div>
        )}
      </Sort.Controller>
    </Sort.Provider>
  );
}
```

### Advanced Sort Dropdown
```tsx
import { Sort } from "../../headless/store/components";

function AdvancedSortDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
    { value: "recommended", label: "Recommended" }
  ];
  
  return (
    <Sort.Provider>
      <Sort.Controller>
        {({ currentSort, setSortBy }) => {
          const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || "Default";
          
          return (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-48 px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="text-sm font-medium text-gray-700">
                  Sort: {currentLabel}
                </span>
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              </button>
              
              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        currentSort === option.value
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      </Sort.Controller>
    </Sort.Provider>
  );
}
```

## Error Handling

The Sort components provide error handling:

### Context Validation
The `useSortContext` hook throws an error if used outside of a `Sort.Provider`:

```tsx
function useSortContext() {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("useSortContext must be used within a Sort.Provider");
  }
  return context;
}
```

### Service Integration Error Handling
The Provider component handles errors from the Sort Service gracefully and provides fallback states. 
---

##### index


This module exports all the headless components for store/e-commerce catalog functionality.

## Overview

The store components provide headless functionality for product catalogs, collections, variants, and related store operations. These components are designed to be framework-agnostic and use render props patterns for maximum flexibility.

## Exports

### Sort

Components for handling product sorting functionality.

**Signature:**
```tsx
export * as Sort from "./Sort";
```

The Sort namespace includes:
- `Provider` - Sort context provider
- `Controller` - Sort controller with render props
- `useSortContext` - Hook for accessing sort context

**Example:**
```tsx
import { Sort } from "../../headless/store/components";

<Sort.Provider>
  <Sort.Controller>
    {({ currentSort, setSortBy }) => (
      <select value={currentSort} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Default</option>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
    )}
  </Sort.Controller>
</Sort.Provider>
```

### Category

Components for category selection and management.

**Signature:**
```tsx
export * as Category from "./Category";
```

The Category namespace includes:
- `Provider` - Category context provider
- `List` - Category list with render props
- `useCategory` - Hook for accessing category service

**Example:**
```tsx
import { Category } from "../../headless/store/components";

<Category.Provider>
  <Category.List>
    {({ categories, selectedCategory, setSelectedCategory }) => (
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            <button onClick={() => setSelectedCategory(category.id)}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    )}
  </Category.List>
</Category.Provider>
```

### FilteredCollection

Components for filtered product collections with advanced filtering capabilities.

**Signature:**
```tsx
export * as FilteredCollection from "./FilteredCollection";
```

The FilteredCollection namespace includes:
- `Provider` - Filtered collection context provider
- `Grid` - Product grid with filtering
- `Filters` - Filter controls
- `FiltersLoading` - Loading state for filters

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Provider>
  <FilteredCollection.Grid>
    {({ products, isLoading, totalProducts }) => (
      <div>
        <p>Total: {totalProducts}</p>
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    )}
  </FilteredCollection.Grid>
</FilteredCollection.Provider>
```

### ProductVariantSelector

Components for managing product variant selection.

**Signature:**
```tsx
export * as ProductVariantSelector from "./ProductVariantSelector";
```

The ProductVariantSelector namespace includes:
- `Options` - Product options display
- `Choice` - Individual choice selection
- `AddToCartButton` - Add to cart with variant handling

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Options>
  {({ options, selectedChoices, onChoiceSelect }) => (
    <div>
      {options.map(option => (
        <div key={option.name}>
          <h4>{option.name}</h4>
          {option.choices.map(choice => (
            <button
              key={choice.value}
              onClick={() => onChoiceSelect(option.name, choice.value)}
            >
              {choice.description}
            </button>
          ))}
        </div>
      ))}
    </div>
  )}
</ProductVariantSelector.Options>
```

### RelatedProducts

Components for displaying related products.

**Signature:**
```tsx
export * as RelatedProducts from "./RelatedProducts";
```

The RelatedProducts namespace includes:
- `List` - Related products list
- `Item` - Individual related product item

**Example:**
```tsx
import { RelatedProducts } from "../../headless/store/components";

<RelatedProducts.List>
  {({ products, isLoading, hasProducts }) => (
    <div>
      {hasProducts && (
        <div>
          <h3>Related Products</h3>
          {products.map(product => (
            <RelatedProducts.Item key={product._id} product={product}>
              {({ title, image, price, href }) => (
                <a href={href}>
                  <img src={image} alt={title} />
                  <h4>{title}</h4>
                  <p>{price}</p>
                </a>
              )}
            </RelatedProducts.Item>
          ))}
        </div>
      )}
    </div>
  )}
</RelatedProducts.List>
```

### SocialSharing

Components for social media sharing functionality.

**Signature:**
```tsx
export * as SocialSharing from "./SocialSharing";
```

The SocialSharing namespace includes:
- `Root` - Social sharing root component
- `Platforms` - Platform-specific sharing

**Example:**
```tsx
import { SocialSharing } from "../../headless/store/components";

<SocialSharing.Root>
  {({ platforms, shareFacebook, shareTwitter, copyLink }) => (
    <div>
      <button onClick={shareFacebook}>Share on Facebook</button>
      <button onClick={shareTwitter}>Share on Twitter</button>
      <button onClick={copyLink}>Copy Link</button>
    </div>
  )}
</SocialSharing.Root>
```

### Collection

Components for product collection display and management.

**Signature:**
```tsx
export * as Collection from "./Collection";
```

The Collection namespace includes:
- `Grid` - Product grid display
- `Item` - Individual product item
- `Header` - Collection header with stats

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.Grid>
  {({ products, isLoading, hasProducts }) => (
    <div>
      <Collection.Header>
        {({ totalProducts, isLoading: headerLoading }) => (
          <h2>Products ({totalProducts})</h2>
        )}
      </Collection.Header>
      
      {hasProducts && (
        <div className="grid">
          {products.map(product => (
            <Collection.Item key={product._id} product={product}>
              {({ title, image, price, href }) => (
                <a href={href}>
                  <img src={image} alt={title} />
                  <h3>{title}</h3>
                  <p>{price}</p>
                </a>
              )}
            </Collection.Item>
          ))}
        </div>
      )}
    </div>
  )}
</Collection.Grid>
```

### Product

Components for individual product display and management.

**Signature:**
```tsx
export * as Product from "./Product";
```

The Product namespace includes:
- `Name` - Product name display
- `Description` - Product description
- `Details` - Product details and specifications

**Example:**
```tsx
import { Product } from "../../headless/store/components";

<Product.Name>
  {({ name, isLoading }) => (
    <h1>{name}</h1>
  )}
</Product.Name>

<Product.Description>
  {({ description, isLoading }) => (
    <div dangerouslySetInnerHTML={{ __html: description }} />
  )}
</Product.Description>
```

### ProductModifiers

Components for product modifiers and customization options.

**Signature:**
```tsx
export * as ProductModifiers from "./ProductModifiers";
```

The ProductModifiers namespace includes:
- `Modifiers` - All product modifiers
- `FreeText` - Free text input modifier

**Example:**
```tsx
import { ProductModifiers } from "../../headless/store/components";

<ProductModifiers.Modifiers>
  {({ modifiers, hasModifiers, selectedModifiers }) => (
    <div>
      {hasModifiers && (
        <div>
          <h3>Customize Your Product</h3>
          {modifiers.map(modifier => (
            <div key={modifier.name}>
              <label>{modifier.name}</label>
              {/* Render modifier input based on type */}
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</ProductModifiers.Modifiers>
```

### SelectedVariant

Components for managing selected product variants.

**Signature:**
```tsx
export * as SelectedVariant from "./SelectedVariant";
```

The SelectedVariant namespace includes:
- `ProductDetails` - Selected variant details
- Variant-specific information and pricing

**Example:**
```tsx
import { SelectedVariant } from "../../headless/store/components";

<SelectedVariant.ProductDetails>
  {({ variant, price, availability, image }) => (
    <div>
      <img src={image} alt="Product" />
      <h2>{variant.name}</h2>
      <p>{price}</p>
      <p>Availability: {availability}</p>
    </div>
  )}
</SelectedVariant.ProductDetails>
```

## Usage Examples

The store components are used extensively throughout the application:

### In Product List Pages
```tsx
// src/components/store/ProductList.tsx
import { FilteredCollection } from "../../headless/store/components";

export const ProductGridContent = () => (
  <FilteredCollection.Provider>
    <FilteredCollection.Grid>
      {({ products, isLoading, totalProducts }) => (
        <FilteredCollection.Filters>
          {({ currentFilters, applyFilters, clearFilters }) => (
            <div>
              <ProductFilters 
                currentFilters={currentFilters}
                onFiltersChange={applyFilters}
                clearFilters={clearFilters}
              />
              <ProductGrid products={products} />
            </div>
          )}
        </FilteredCollection.Filters>
      )}
    </FilteredCollection.Grid>
  </FilteredCollection.Provider>
);
```

### In Product Detail Pages
```tsx
// src/components/store/ProductDetails.tsx
import { Product, ProductVariantSelector, SelectedVariant } from "../../headless/store/components";

export default function ProductDetails() {
  return (
    <div>
      <Product.Name>
        {({ name }) => <h1>{name}</h1>}
      </Product.Name>
      
      <SelectedVariant.ProductDetails>
        {({ variant, price, image }) => (
          <div>
            <img src={image} alt={variant.name} />
            <p>{price}</p>
          </div>
        )}
      </SelectedVariant.ProductDetails>
      
      <ProductVariantSelector.Options>
        {({ options, selectedChoices, onChoiceSelect }) => (
          <VariantSelector 
            options={options}
            selectedChoices={selectedChoices}
            onChoiceSelect={onChoiceSelect}
          />
        )}
      </ProductVariantSelector.Options>
    </div>
  );
}
```

### In Store Example Pages
```tsx
// src/react-pages/store/example-1/index.tsx
import { FilteredCollection } from "../../../headless/store/components";

export default function StoreExample1Page() {
  return (
    <StoreLayout>
      <FilteredCollection.Provider>
        <FilteredCollection.Grid>
          {({ products, isLoading, totalProducts }) => (
            <div>
              <h1>Store Collection ({totalProducts})</h1>
              <ProductGrid products={products} />
            </div>
          )}
        </FilteredCollection.Grid>
      </FilteredCollection.Provider>
    </StoreLayout>
  );
}
```

### In WixServicesProvider
```tsx
// src/providers/WixServicesProvider.tsx
import { 
  CollectionServiceDefinition, 
  ProductServiceDefinition,
  CategoryServiceDefinition 
} from "../headless/store/services";

export default function WixServicesProvider({ children }) {
  const servicesMap = createServicesMap()
    .addService(CollectionServiceDefinition, CollectionService)
    .addService(ProductServiceDefinition, ProductService)
    .addService(CategoryServiceDefinition, CategoryService);

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      {children}
    </ServicesManagerProvider>
  );
}
``` 
---

### services

##### catalog options service


The `catalog-options-service` provides comprehensive product catalog options and filtering capabilities, enabling users to discover and filter products based on various product attributes, customizations, and inventory status.

## Overview

The Catalog Options Service handles:

- **Product Options Discovery** - Finds all available product options and choices
- **Dynamic Filtering** - Provides filtering options based on actual product catalog
- **Inventory Integration** - Includes inventory status filtering
- **Category-Specific Options** - Filters options by category when needed
- **Intelligent Sorting** - Smart sorting of choices (numerical, alphabetical)
- **Color Code Support** - Handles color swatches and visual choices

## API Interface

```tsx
interface CatalogOptionsServiceAPI {
  catalogOptions: Signal<ProductOption[] | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadCatalogOptions: (categoryId?: string) => Promise<void>;
}

interface ProductOption {
  id: string;
  name: string;
  choices: ProductChoice[];
  optionRenderType?: string;
}

interface ProductChoice {
  id: string;
  name: string;
  colorCode?: string;
}
```

## Option Types

The service supports various option types:

- **Color Swatches** - Visual color choices with color codes
- **Size Options** - Clothing sizes, dimensions, etc.
- **Material Options** - Fabric, metal, wood types
- **Style Variants** - Different styles or models
- **Inventory Status** - Available, out of stock, pre-order
- **Custom Attributes** - Any product customization options

## Core Functionality

### Getting Catalog Options

Access catalog options and filtering data:

```tsx
import { useService } from "@wix/services-manager-react";
import { CatalogOptionsServiceDefinition } from "../services/catalog-options-service";

function CatalogOptionsComponent() {
  const catalogService = useService(CatalogOptionsServiceDefinition);
  
  const catalogOptions = catalogService.catalogOptions.get();
  const isLoading = catalogService.isLoading.get();
  const error = catalogService.error.get();
  
  if (isLoading) return <div>Loading catalog options...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!catalogOptions) return <div>No options available</div>;
  
  return (
    <div>
      <h3>Filter by:</h3>
      {catalogOptions.map(option => (
        <div key={option.id}>
          <h4>{option.name}</h4>
          <div className="choices">
            {option.choices.map(choice => (
              <button
                key={choice.id}
                className="choice-button"
                style={choice.colorCode ? { backgroundColor: choice.colorCode } : {}}
              >
                {choice.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Loading Options by Category

Load options for specific categories:

```tsx
// Load options for all products
await catalogService.loadCatalogOptions();

// Load options for specific category
await catalogService.loadCatalogOptions("category-id");
```

## Usage Example

```tsx
function CatalogFilterPanel() {
  const catalogOptionsService = useService(CatalogOptionsServiceDefinition);
  
  const catalogOptions = catalogOptionsService.catalogOptions.get();
  const isLoading = catalogOptionsService.isLoading.get();
  const error = catalogOptionsService.error.get();
  
  if (isLoading) {
    return (
      <div className="filter-panel-loading">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-3 bg-gray-200 rounded w-16"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="filter-panel-error">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }
  
  const renderFilterOption = (option: any) => {
    if (option.optionType === "color") {
      return (
        <div key={option.key} className="filter-group">
          <h4 className="text-sm font-medium text-gray-900 mb-2">{option.name}</h4>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value: any) => (
              <button
                key={value.key}
                onClick={() => {
                  // Toggle filter selection logic would go here
                  console.log('Selected color:', value.value);
                }}
                className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: value.color || value.value }}
                title={value.value}
              >
                <span className="sr-only">{value.value}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    if (option.optionType === "size") {
      // Sort sizes intelligently
      const sortedValues = [...option.values].sort((a, b) => {
        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        const aIndex = sizeOrder.indexOf(a.value);
        const bIndex = sizeOrder.indexOf(b.value);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        // Fallback to alphabetical for non-standard sizes
        return a.value.localeCompare(b.value);
      });
      
      return (
        <div key={option.key} className="filter-group">
          <h4 className="text-sm font-medium text-gray-900 mb-2">{option.name}</h4>
          <div className="flex flex-wrap gap-2">
            {sortedValues.map((value: any) => (
              <button
                key={value.key}
                onClick={() => {
                  console.log('Selected size:', value.value);
                }}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                {value.value}
                {value.productCount > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({value.productCount})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    // Default rendering for other option types
    return (
      <div key={option.key} className="filter-group">
        <h4 className="text-sm font-medium text-gray-900 mb-2">{option.name}</h4>
        <div className="space-y-2">
          {option.values.map((value: any) => (
            <label key={value.key} className="flex items-center">
              <input
                type="checkbox"
                onChange={() => {
                  console.log('Selected option:', value.value);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {value.value}
                {value.productCount > 0 && (
                  <span className="text-gray-500 ml-1">
                    ({value.productCount})
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="catalog-filter-panel">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Filter Products
      </h3>
      
      <div className="space-y-6">
        {catalogOptions.map(renderFilterOption)}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={() => {
            // Clear all filters logic
            console.log('Clear all filters');
          }}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}
```

## Server-Side Configuration

Load catalog options server-side:

```tsx
// Server-side configuration
import { loadCatalogOptionsServiceConfig } from "../services/catalog-options-service";

export async function createCatalogOptionsConfig() {
  return await loadCatalogOptionsServiceConfig();
}
```

## Usage in Components

The Catalog Options Service is used throughout the application:

### In Filter Components
```tsx
// src/components/store/ProductFilters.tsx
const catalogService = useService(CatalogOptionsServiceDefinition);

// Used for building dynamic filter UI
const catalogOptions = catalogService.catalogOptions.get();
const isLoading = catalogService.isLoading.get();
```

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
const catalogService = useService(CatalogOptionsServiceDefinition);

// Used for sidebar filters and category-specific options
const catalogOptions = catalogService.catalogOptions.get();
```

## Integration with Other Services

### Filter Service Integration
- Provides filter options to the filter service
- Coordinates with active filters
- Maintains filter state consistency

### Collection Service Integration
- Filter options are applied to product queries
- Dynamic updates based on search results
- Coordinated loading and error states

### Category Service Integration
- Loads category-specific options
- Updates when category selection changes
- Maintains category context for filtering

## Best Practices

### Data Loading
- Load catalog options based on current context
- Cache options data to reduce API calls
- Provide loading states during data fetching
- Handle empty states gracefully

### User Experience
- Show visual representations for color options
- Use intelligent sorting for size and numerical options
- Provide clear filter counts and selections
- Enable easy filter clearing and resetting

### Performance
- Implement lazy loading for large option sets
- Use efficient data structures for filter state
- Minimize re-renders during filter updates
- Cache frequently accessed options

### Accessibility
- Provide proper labels for all filter options
- Use semantic HTML for filter controls
- Support keyboard navigation
- Ensure color options have text alternatives 
---

##### catalog price range service


The `catalog-price-range-service` provides price range discovery and filtering capabilities, enabling users to understand the price distribution across products and filter by price ranges effectively.

## Overview

The Catalog Price Range Service handles:

- **Price Range Discovery** - Finds minimum and maximum prices across the catalog
- **Dynamic Price Filtering** - Provides price range data for filtering
- **Category-Specific Ranges** - Calculates price ranges for specific categories
- **Aggregation Queries** - Uses efficient aggregation to find price bounds
- **Error Handling** - Graceful handling of empty catalogs or invalid data

## API Interface

```tsx
interface CatalogPriceRangeServiceAPI {
  catalogPriceRange: Signal<CatalogPriceRange | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadCatalogPriceRange: (categoryId?: string) => Promise<void>;
}

interface CatalogPriceRange {
  minPrice: number;
  maxPrice: number;
}
```

## Core Functionality

### Getting Price Range

Access catalog price range data:

```tsx
import { useService } from "@wix/services-manager-react";
import { CatalogPriceRangeServiceDefinition } from "../services/catalog-price-range-service";

function PriceRangeComponent() {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const catalogPriceRange = priceRangeService.catalogPriceRange.get();
  const isLoading = priceRangeService.isLoading.get();
  const error = priceRangeService.error.get();
  
  if (isLoading) return <div>Loading price range...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!catalogPriceRange) return <div>No price data available</div>;
  
  return (
    <div>
      <h3>Price Range:</h3>
      <p>
        ${catalogPriceRange.minPrice} - ${catalogPriceRange.maxPrice}
      </p>
    </div>
  );
}
```

### Loading Price Range

```tsx
// Load price range for all products
await priceRangeService.loadCatalogPriceRange();

// Load price range for specific category
await priceRangeService.loadCatalogPriceRange("category-id");
```

## Usage Example

```tsx
function PriceRangeFilter() {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const priceRange = priceRangeService.priceRange.get();
  const isLoading = priceRangeService.isLoading.get();
  const error = priceRangeService.error.get();
  
  const [selectedMin, setSelectedMin] = useState(priceRange?.min || 0);
  const [selectedMax, setSelectedMax] = useState(priceRange?.max || 1000);
  
  useEffect(() => {
    if (priceRange) {
      setSelectedMin(priceRange.min);
      setSelectedMax(priceRange.max);
    }
  }, [priceRange]);
  
  if (isLoading) {
    return (
      <div className="price-range-loading">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="animate-pulse">
          <div className="h-2 bg-gray-300 rounded w-full mb-4"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-300 rounded flex-1"></div>
            <div className="h-8 bg-gray-300 rounded flex-1"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !priceRange) {
    return (
      <div className="price-range-error">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
        <p className="text-red-500 text-sm">{error || 'Unable to load price range'}</p>
      </div>
    );
  }
  
  const handleSliderChange = (values: number[]) => {
    setSelectedMin(values[0]);
    setSelectedMax(values[1]);
  };
  
  const handleApplyRange = () => {
    // Apply price range filter logic
    console.log('Apply price range:', { min: selectedMin, max: selectedMax });
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <div className="price-range-filter">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Price Range
      </h4>
      
      <div className="space-y-4">
        {/* Range Slider */}
        <div className="relative">
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={selectedMin}
            onChange={(e) => {
              const value = Math.min(Number(e.target.value), selectedMax - 1);
              setSelectedMin(value);
            }}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={selectedMax}
            onChange={(e) => {
              const value = Math.max(Number(e.target.value), selectedMin + 1);
              setSelectedMax(value);
            }}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{formatPrice(priceRange.min)}</span>
            <span>{formatPrice(priceRange.max)}</span>
          </div>
        </div>
        
        {/* Input Fields */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Min</label>
            <input
              type="number"
              value={selectedMin}
              onChange={(e) => {
                const value = Math.max(priceRange.min, Number(e.target.value));
                setSelectedMin(Math.min(value, selectedMax - 1));
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              min={priceRange.min}
              max={selectedMax - 1}
            />
          </div>
          
          <div className="flex items-center justify-center mt-4">
            <span className="text-gray-400">-</span>
          </div>
          
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Max</label>
            <input
              type="number"
              value={selectedMax}
              onChange={(e) => {
                const value = Math.min(priceRange.max, Number(e.target.value));
                setSelectedMax(Math.max(value, selectedMin + 1));
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              min={selectedMin + 1}
              max={priceRange.max}
            />
          </div>
        </div>
        
        {/* Selected Range Display */}
        <div className="text-center text-sm text-gray-600">
          {formatPrice(selectedMin)} - {formatPrice(selectedMax)}
        </div>
        
        {/* Apply Button */}
        <button
          onClick={handleApplyRange}
          className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Apply Price Filter
        </button>
      </div>
    </div>
  );
}
```

## Error Handling

```tsx
function PriceRangeWithErrorHandling() {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const catalogPriceRange = priceRangeService.catalogPriceRange.get();
  const isLoading = priceRangeService.isLoading.get();
  const error = priceRangeService.error.get();
  
  if (isLoading) {
    return <div>Loading price range...</div>;
  }
  
  if (error) {
    return (
      <div className="price-range-error">
        <div className="text-center py-4 border rounded-lg">
          <p className="text-red-500 text-sm mb-2">Failed to load price range</p>
          <p className="text-gray-500 text-xs mb-3">{error}</p>
          <button
            onClick={() => priceRangeService.loadCatalogPriceRange()}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!catalogPriceRange) {
    return (
      <div className="price-range-empty">
        <p className="text-gray-500 text-sm text-center py-4">
          No products with pricing information found
        </p>
      </div>
    );
  }
  
  return <PriceRangeSlider />;
}
```

## Server-Side Configuration

```tsx
// Server-side configuration
import { loadCatalogPriceRangeServiceConfig } from "../services/catalog-price-range-service";

export async function createPriceRangeConfig() {
  return await loadCatalogPriceRangeServiceConfig();
}
```

## Usage in Components

The Catalog Price Range Service is used throughout the application:

### In Filter Components
```tsx
// src/components/store/ProductFilters.tsx
const priceRangeService = useService(CatalogPriceRangeServiceDefinition);

// Used for price range filtering UI
const catalogPriceRange = priceRangeService.catalogPriceRange.get();
const isLoading = priceRangeService.isLoading.get();
```

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
const priceRangeService = useService(CatalogPriceRangeServiceDefinition);

// Used for sidebar price filters
const catalogPriceRange = priceRangeService.catalogPriceRange.get();
```

## Integration with Other Services

### Filter Service Integration
- Provides price range boundaries for price filtering
- Coordinates with other filter options
- Maintains filter state consistency

### Collection Service Integration
- Price ranges are applied to product queries
- Dynamic updates based on filtered results
- Coordinated loading and error states

### Category Service Integration
- Loads category-specific price ranges
- Updates when category selection changes
- Maintains category context for price filtering

## Best Practices

### Data Loading
- Load price ranges based on current category context
- Cache price range data to reduce API calls
- Handle empty catalogs gracefully
- Provide meaningful error messages

### User Experience
- Show price ranges in intuitive formats
- Use visual indicators for price distribution
- Provide multiple input methods (sliders, inputs, buckets)
- Clear feedback on price filter applications

### Performance
- Use efficient aggregation queries
- Minimize API calls during price range loading
- Cache frequently accessed price ranges
- Implement proper loading states

### Accessibility
- Provide proper labels for price inputs
- Use semantic HTML for price controls
- Support keyboard navigation
- Ensure price ranges are clearly communicated 
---

##### category service


The `category-service` provides category management and navigation functionality for e-commerce stores, handling category selection, loading, and navigation with automatic routing integration.

## Overview

The Category Service handles:

- **Category Management** - Loads and manages store categories
- **Category Selection** - Tracks selected category state
- **Navigation Integration** - Handles category-based navigation
- **Category Loading** - Fetches categories from Wix Categories API
- **State Management** - Maintains category selection and list state

## API Interface

```tsx
interface CategoryServiceAPI {
  selectedCategory: Signal<string | null>;
  categories: Signal<categories.Category[]>;
  setSelectedCategory: (categoryId: string | null) => void;
  loadCategories: () => Promise<void>;
}

interface CategoryServiceConfig {
  categories: categories.Category[];
  initialCategoryId?: string | null;
  onCategoryChange?: (categoryId: string | null, category: categories.Category | null) => void;
}
```

## Category Data Structure

Categories loaded from the service include:

- **_id** - Unique category identifier
- **name** - Category display name
- **slug** - URL-friendly category identifier
- **description** - Category description
- **visible** - Whether category is visible to users
- **media** - Category images and media
- **parent** - Parent category for hierarchical categories

## Core Functionality

### Getting Categories

Access category data and selection:

```tsx
import { useService } from "@wix/services-manager-react";
import { CategoryServiceDefinition } from "../services/category-service";

function CategoryComponent() {
  const categoryService = useService(CategoryServiceDefinition);
  
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();
  
  return (
    <div>
      <h3>Categories:</h3>
      <ul>
        {categories.map(category => (
          <li key={category._id}>
            <button 
              onClick={() => categoryService.setSelectedCategory(category._id)}
              className={selectedCategory === category._id ? 'active' : ''}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Setting Selected Category

Change the selected category:

```tsx
// Select specific category
categoryService.setSelectedCategory("category-id");

// Clear selection (show all products)
categoryService.setSelectedCategory(null);
```

### Loading Categories

Load categories from the API:

```tsx
// Load categories dynamically
await categoryService.loadCategories();

// Access loaded categories
const categories = categoryService.categories.get();
```

## Usage Example

```tsx
function CategoryNavigationMenu() {
  const categoryService = useService(CategoryServiceDefinition);
  
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();
  const isLoading = categoryService.isLoading.get();
  
  if (isLoading) {
    return (
      <div className="category-navigation-loading">
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-300 rounded w-24"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <nav className="category-navigation">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Shop by Category
      </h3>
      
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => categoryService.setSelectedCategory(null)}
            className={`
              w-full text-left px-3 py-2 rounded-lg transition-colors
              ${!selectedCategory
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            All Products
          </button>
        </li>
        
        {categories.map(category => (
          <li key={category._id}>
            <button
              onClick={() => categoryService.setSelectedCategory(category)}
              className={`
                w-full text-left px-3 py-2 rounded-lg transition-colors
                ${selectedCategory?._id === category._id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {category.name}
              {category.numberOfProducts > 0 && (
                <span className="text-sm text-gray-500 ml-1">
                  ({category.numberOfProducts})
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

## Navigation Integration

The service supports automatic navigation when categories change:

### Navigation Handler Configuration

```tsx
// Configure navigation handler
const categoryService = CategoryService.withConfig({
  categories: categories,
  initialCategoryId: null,
  onCategoryChange: (categoryId, category) => {
    if (categoryId) {
      // Navigate to category page
      window.location.href = `/store/category/${category.slug}`;
    } else {
      // Navigate to all products
      window.location.href = '/store';
    }
  }
});
```

### Custom Navigation Handler

```tsx
// Custom navigation with URL updates
const handleCategoryChange = (categoryId: string | null, category: categories.Category | null) => {
  if (categoryId && category) {
    // Update URL with category
    const url = new URL(window.location.href);
    url.searchParams.set('category', category.slug);
    window.history.pushState({}, '', url.toString());
  } else {
    // Clear category from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    window.history.pushState({}, '', url.toString());
  }
};
```

## Server-Side Configuration

Load categories server-side for better performance:

### Category Loading Function

```tsx
// Server-side category loading
export async function loadCategoriesConfig() {
  try {
    const categoriesResponse = await categories
      .queryCategories({
        treeReference: {
          appNamespace: "@wix/stores",
          treeKey: null,
        },
      })
      .eq("visible", true)
      .find();

    const fetchedCategories = categoriesResponse.items || [];

    // Sort categories to put "all-products" first
    const allProductsCategory = fetchedCategories.find(cat => cat.slug === "all-products");
    const otherCategories = fetchedCategories.filter(cat => cat.slug !== "all-products");
    
    const allCategories = allProductsCategory 
      ? [allProductsCategory, ...otherCategories]
      : fetchedCategories;

    return {
      categories: allCategories,
    };
  } catch (error) {
    console.warn("Failed to load categories:", error);
    return {
      categories: [],
    };
  }
}
```

### Astro Integration

```tsx
// In Astro page
---
import { loadCategoriesConfig } from "../services/category-service";

const { categories } = await loadCategoriesConfig();
---

<CategoryPage categories={categories} />
```

## Usage in Components

The Category Service is used throughout the application:

### In Category Components
```tsx
// src/headless/store/components/Category.tsx
export const List = (props: CategoryListProps) => {
  const service = useService(CategoryServiceDefinition);
  
  const categories = service.categories.get();
  const selectedCategory = service.selectedCategory.get();
  
  return props.children({ categories, selectedCategory });
};
```

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
const categoryService = useService(CategoryServiceDefinition);

// Used for category navigation and filtering
const categories = categoryService.categories.get();
const selectedCategory = categoryService.selectedCategory.get();
```

### In Product Collection Pages
```tsx
// src/react-pages/store/example-1/index.tsx
// Category service integrates with collection filtering
const categoryService = useService(CategoryServiceDefinition);
const collectionService = useService(CollectionServiceDefinition);

// When category changes, collection automatically updates
```

## Integration with Other Services

### Collection Service Integration
- Category selection automatically filters product collections
- Collection service reacts to category changes
- Coordinated loading states between services

### Filter Service Integration
- Category filters work alongside other product filters
- Category changes reset other filters when configured
- Maintains filter state consistency

### URL Parameters Integration
- Category selection can be synced with URL parameters
- Deep linking support for category pages
- Browser navigation compatibility

## Best Practices

### Category Management
- Load categories server-side when possible
- Handle loading states gracefully
- Provide fallback for missing categories
- Sort categories logically (e.g., "All Products" first)

### Navigation
- Use smooth transitions between category changes
- Provide clear visual indication of selected category
- Support keyboard navigation
- Handle navigation errors gracefully

### Performance
- Cache category data when possible
- Implement proper loading states
- Use optimistic updates for category selection
- Minimize API calls during category changes

### User Experience
- Show category names clearly
- Provide category descriptions when available
- Use category images for better visual appeal
- Implement search functionality for large category lists

### Error Handling
- Gracefully handle category loading failures
- Provide fallback categories when API fails
- Show user-friendly error messages
- Implement retry mechanisms for failed requests 
---

##### collection service


The Collection Service provides reactive state management for product collections in e-commerce applications. It handles product search, filtering, sorting, and pagination with the Wix Stores v3 API.

## Overview

The Collection Service is a headless service that manages:
- Product search and retrieval
- Category-based filtering
- Price range filtering
- Product options filtering
- Sorting functionality
- Pagination and loading more products
- Loading states and error handling

## API Interface

### CollectionServiceAPI

The main interface defining all available collection operations and state signals.

**Signature:**
```tsx
interface CollectionServiceAPI {
  products: Signal<productsV3.V3Product[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  totalProducts: Signal<number>;
  hasProducts: Signal<boolean>;
  hasMoreProducts: Signal<boolean>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}
```

## Exports

### CollectionServiceDefinition

The service definition for dependency injection.

**Signature:**
```tsx
export const CollectionServiceDefinition = defineService<CollectionServiceAPI>("collection");
```

**Example:**
```tsx
import { CollectionServiceDefinition } from "../headless/store/services/collection-service";

// Use in services manager
const servicesManager = createServicesManager(
  createServicesMap()
    .addService(CollectionServiceDefinition, CollectionService)
);
```

### CollectionService

The service implementation with reactive state management and search capabilities.

**Signature:**
```tsx
export const CollectionService = implementService.withConfig<{
  initialProducts?: productsV3.V3Product[];
  pageSize?: number;
  initialCursor?: string;
  initialHasMore?: boolean;
  categories?: any[];
}>()(CollectionServiceDefinition, ({ getService, config }) => {
  // Implementation details
});
```

**Example:**
```tsx
import { CollectionService, CollectionServiceDefinition } from "../headless/store/services/collection-service";

// Configure service with initial state
const collectionConfig = {
  initialProducts: [],
  pageSize: 20,
  initialCursor: undefined,
  initialHasMore: true,
  categories: []
};

const servicesManager = createServicesManager(
  createServicesMap()
    .addService(CollectionServiceDefinition, CollectionService, collectionConfig)
);
```

### loadCollectionServiceConfig

Utility function to load the collection service configuration with URL parameters and categories.

**Signature:**
```tsx
export async function loadCollectionServiceConfig(
  categoryId?: string,
  searchParams?: URLSearchParams,
  preloadedCategories?: any[]
): Promise<
  ServiceFactoryConfig<typeof CollectionService> & {
    initialCursor?: string;
    initialHasMore?: boolean;
    initialSort?: SortBy;
    initialFilters?: Filter;
  }
>
```

**Example:**
```tsx
import { loadCollectionServiceConfig } from "../headless/store/services/collection-service";

// Load configuration in Astro page
const searchParams = new URLSearchParams(Astro.url.search);
const collectionServiceConfig = await loadCollectionServiceConfig(
  "category-id",
  searchParams,
  preloadedCategories
);

// Use in component
export { collectionServiceConfig };
```

## State Signals

### products
Array of current products in the collection.

**Type:** `Signal<productsV3.V3Product[]>`

### isLoading
Loading state for collection operations.

**Type:** `Signal<boolean>`

### error
Error message from collection operations.

**Type:** `Signal<string | null>`

### totalProducts
Total number of products currently loaded.

**Type:** `Signal<number>`

### hasProducts
Whether the collection has any products.

**Type:** `Signal<boolean>`

### hasMoreProducts
Whether there are more products available to load.

**Type:** `Signal<boolean>`

## Collection Operations

### loadMore
Loads more products using cursor-based pagination.

**Signature:**
```tsx
loadMore: () => Promise<void>
```

**Example:**
```tsx
const service = useService(CollectionServiceDefinition);

await service.loadMore();
```

### refresh
Refreshes the entire collection with current filters and sorting.

**Signature:**
```tsx
refresh: () => Promise<void>
```

**Example:**
```tsx
const service = useService(CollectionServiceDefinition);

await service.refresh();
```

## Search and Filtering

The Collection Service integrates with other services for comprehensive search functionality:

### Category Integration
Automatically filters products based on selected categories from the Category Service.

### Filter Integration
Applies filters from the Filter Service including:
- Price range filtering
- Product options filtering
- Inventory status filtering

### Sort Integration
Applies sorting from the Sort Service including:
- Name (ascending/descending)
- Price (ascending/descending)
- Recommended (category-based)

## Search Options

The service builds complex search options including:

### Filter Conditions
- **Category Filter**: Filters products by category ID
- **Price Range Filter**: Filters by minimum and maximum price
- **Product Options Filter**: Filters by specific product option choices
- **Inventory Filter**: Filters by availability status

### Sort Options
- `name-asc` - Sort by name ascending
- `name-desc` - Sort by name descending
- `price-asc` - Sort by price ascending
- `price-desc` - Sort by price descending
- `recommended` - Sort by category recommendation

### Field Selection
Requests specific product fields for optimal performance:
- Description and plain description
- Category information
- Media items and thumbnails
- Variant options
- Weight and measurement units

## Usage Examples

The Collection Service is used throughout the application:

### In FilteredCollection Component
```tsx
// src/headless/store/components/FilteredCollection.tsx
import { CollectionServiceDefinition } from "../services/collection-service";

export const Grid: React.FC<GridProps> = ({ children }) => {
  const service = useService(CollectionServiceDefinition);
  
  const products = service.products.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();
  
  return children({ products, isLoading, error });
};
```

### In Store Example Pages
```tsx
// src/react-pages/store/example-1/index.tsx
import { 
  CollectionService, 
  CollectionServiceDefinition 
} from "../../../headless/store/services/collection-service";

export default function StoreExample1Page({ filteredCollectionServiceConfig }) {
  const servicesManager = createServicesManager(
    createServicesMap()
      .addService(CollectionServiceDefinition, CollectionService, filteredCollectionServiceConfig)
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <ProductList />
    </ServicesManagerProvider>
  );
}
```

### In Astro Pages
```astro
---
// src/pages/store/example-1/index.astro
import { loadCollectionServiceConfig } from "../../../headless/store/services/collection-service";

const searchParams = new URLSearchParams(Astro.url.search);
const filteredCollectionServiceConfig = await loadCollectionServiceConfig(
  undefined,
  searchParams,
  preloadedCategories
);
---

<StoreExample1Page 
  filteredCollectionServiceConfig={filteredCollectionServiceConfig}
  client:load
/>
```

### In WixServicesProvider
```tsx
// src/providers/WixServicesProvider.tsx
import { CollectionServiceDefinition, CollectionService } from "../headless/store/services/collection-service";

export default function WixServicesProvider({ children }) {
  const servicesMap = createServicesMap()
    .addService(CollectionServiceDefinition, CollectionService);

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
import { CollectionServiceDefinition } from "../../headless/store/services/collection-service";

function StoreRoute() {
  const collectionService = useService(CollectionServiceDefinition);
  const products = collectionService.products.get();
  
  return (
    <div>
      <h1>Store Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
```

## Configuration Parameters

### initialProducts
Array of products to initialize the collection with.

**Type:** `productsV3.V3Product[]`
**Default:** `[]`

### pageSize
Number of products to load per page.

**Type:** `number`
**Default:** `20`

### initialCursor
Cursor for pagination initialization.

**Type:** `string`
**Default:** `undefined`

### initialHasMore
Whether there are more products available initially.

**Type:** `boolean`
**Default:** `true`

### categories
Array of category data for filtering.

**Type:** `any[]`
**Default:** `[]`

## URL Parameters Integration

The service integrates with URL parameters for bookmarkable states:

### Supported Parameters
- `category` - Selected category ID
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sort` - Sort order
- Custom option filters (e.g., `color`, `size`)

### Example URL
```
/store?category=electronics&minPrice=100&maxPrice=500&sort=price-asc&color=red,blue
```

## Error Handling

The service provides comprehensive error handling:

### Error States
- Network errors during product search
- Invalid filter parameters
- Category loading failures
- Pagination errors

### Error Recovery
- Graceful fallbacks for missing data
- Retry mechanisms for transient failures
- User-friendly error messages 
---

##### filter service


The `filter-service` provides comprehensive product filtering functionality, managing price ranges, product options, and filter state with automatic URL synchronization and integration with catalog services.

## Overview

The Filter Service handles:

- **Filter State Management** - Current filter selections and available options
- **Price Range Filtering** - Dynamic price range selection and validation
- **Product Option Filtering** - Multi-select filtering by product attributes
- **URL Synchronization** - Automatic URL parameter updates for deep linking
- **Catalog Integration** - Integration with catalog-wide option and price data

## API Interface

```tsx
interface FilterServiceAPI {
  // Core Filter State
  currentFilters: Signal<Filter>;
  availableOptions: Signal<{
    productOptions: ProductOption[];
    priceRange: { min: number; max: number };
  }>;
  isFullyLoaded: Signal<boolean>;
  
  // Filter Operations
  applyFilters: (filters: Filter) => Promise<void>;
  clearFilters: () => Promise<void>;
  
  // Catalog Data Loading
  loadCatalogPriceRange: (categoryId?: string) => Promise<void>;
  loadCatalogOptions: (categoryId?: string) => Promise<void>;
}

interface Filter {
  priceRange: { min: number; max: number };
  selectedOptions: { [optionId: string]: string[] };
}

interface ProductOption {
  id: string;
  name: string;
  choices: { id: string; name: string; colorCode?: string }[];
  optionRenderType?: string;
}

interface AvailableOptions {
  productOptions: ProductOption[];
  priceRange: PriceRange;
}
```

## Core Functionality

### Filter State Management

The service maintains current filter selections and available filtering options:

```tsx
// Example usage in a component
const filterService = useService(FilterServiceDefinition);

// Get current filter state
const currentFilters = filterService.currentFilters.get();
const availableOptions = filterService.availableOptions.get();
const isFullyLoaded = filterService.isFullyLoaded.get();

// Check if filters are applied
const hasActiveFilters = 
  currentFilters.priceRange.min > availableOptions.priceRange.min ||
  currentFilters.priceRange.max < availableOptions.priceRange.max ||
  Object.keys(currentFilters.selectedOptions).length > 0;
```

### Applying Filters

Apply filter selections with automatic URL synchronization:

```tsx
// Apply price range filter
await filterService.applyFilters({
  priceRange: { min: 50, max: 200 },
  selectedOptions: {}
});

// Apply option filters
await filterService.applyFilters({
  priceRange: { min: 0, max: 1000 },
  selectedOptions: {
    "color": ["red", "blue"],
    "size": ["large"]
  }
});

// Apply combined filters
await filterService.applyFilters({
  priceRange: { min: 25, max: 150 },
  selectedOptions: {
    "brand": ["nike", "adidas"],
    "category": ["shoes"]
  }
});
```

### Clearing Filters

Reset all filters to default state:

```tsx
// Clear all filters and reset to defaults
await filterService.clearFilters();

// This will reset:
// - Price range to catalog min/max
// - All selected options to empty
// - URL parameters (except sort)
```

### Loading Catalog Data

Load available options and price ranges from the catalog:

```tsx
// Load data for all products
await filterService.loadCatalogPriceRange();
await filterService.loadCatalogOptions();

// Load data for specific category
await filterService.loadCatalogPriceRange("category-id");
await filterService.loadCatalogOptions("category-id");
```

## Usage Examples

### Basic Filter Interface

```tsx
import { useService } from "@wix/services-manager-react";
import { FilterServiceDefinition } from "../services/filter-service";

function ProductFilters() {
  const filterService = useService(FilterServiceDefinition);
  
  const currentFilters = filterService.currentFilters.get();
  const availableOptions = filterService.availableOptions.get();
  const isFullyLoaded = filterService.isFullyLoaded.get();
  
  const handlePriceChange = async (min: number, max: number) => {
    await filterService.applyFilters({
      ...currentFilters,
      priceRange: { min, max }
    });
  };
  
  const handleOptionChange = async (optionId: string, choiceIds: string[]) => {
    await filterService.applyFilters({
      ...currentFilters,
      selectedOptions: {
        ...currentFilters.selectedOptions,
        [optionId]: choiceIds
      }
    });
  };
  
  if (!isFullyLoaded) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="filters-panel">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={currentFilters.priceRange.min}
              onChange={(e) => handlePriceChange(
                parseInt(e.target.value) || availableOptions.priceRange.min,
                currentFilters.priceRange.max
              )}
              className="flex-1 border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Max"
              value={currentFilters.priceRange.max}
              onChange={(e) => handlePriceChange(
                currentFilters.priceRange.min,
                parseInt(e.target.value) || availableOptions.priceRange.max
              )}
              className="flex-1 border rounded px-3 py-2"
            />
          </div>
          <div className="text-xs text-gray-500">
            Range: ${availableOptions.priceRange.min} - ${availableOptions.priceRange.max}
          </div>
        </div>
      </div>
      
      {/* Product Options Filters */}
      {availableOptions.productOptions.map(option => (
        <div key={option.id} className="mb-6">
          <h4 className="font-medium mb-3">{option.name}</h4>
          <div className="space-y-2">
            {option.choices.map(choice => {
              const selectedChoices = currentFilters.selectedOptions[option.id] || [];
              const isSelected = selectedChoices.includes(choice.id);
              
              return (
                <label key={choice.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newChoices = e.target.checked
                        ? [...selectedChoices, choice.id]
                        : selectedChoices.filter(id => id !== choice.id);
                      handleOptionChange(option.id, newChoices);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{choice.name}</span>
                  {choice.colorCode && (
                    <span
                      className="ml-2 w-4 h-4 rounded-full border"
                      style={{ backgroundColor: choice.colorCode }}
                    />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Clear Filters */}
      <button
        onClick={() => filterService.clearFilters()}
        className="w-full py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
      >
        Clear All Filters
      </button>
    </div>
  );
}
```

### Advanced Filter UI with Counts

```tsx
function AdvancedFilters() {
  const filterService = useService(FilterServiceDefinition);
  
  const currentFilters = filterService.currentFilters.get();
  const availableOptions = filterService.availableOptions.get();
  const isFullyLoaded = filterService.isFullyLoaded.get();
  
  // Calculate active filter count
  const activeFilterCount = Object.values(currentFilters.selectedOptions)
    .reduce((count, choices) => count + choices.length, 0) +
    (currentFilters.priceRange.min > availableOptions.priceRange.min ? 1 : 0) +
    (currentFilters.priceRange.max < availableOptions.priceRange.max ? 1 : 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              {activeFilterCount} active
            </span>
            <button
              onClick={() => filterService.clearFilters()}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      
      {!isFullyLoaded ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="space-y-2">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="h-3 bg-gray-200 rounded w-3/4"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Price Range with Slider */}
          <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            <div className="space-y-3">
              <input
                type="range"
                min={availableOptions.priceRange.min}
                max={availableOptions.priceRange.max}
                value={currentFilters.priceRange.max}
                onChange={(e) => filterService.applyFilters({
                  ...currentFilters,
                  priceRange: {
                    ...currentFilters.priceRange,
                    max: parseInt(e.target.value)
                  }
                })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${currentFilters.priceRange.min}</span>
                <span>${currentFilters.priceRange.max}</span>
              </div>
            </div>
          </div>
          
          {/* Product Options with Chips */}
          {availableOptions.productOptions.map(option => {
            const selectedChoices = currentFilters.selectedOptions[option.id] || [];
            
            return (
              <div key={option.id}>
                <h4 className="font-medium mb-3">
                  {option.name}
                  {selectedChoices.length > 0 && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {selectedChoices.length}
                    </span>
                  )}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {option.choices.map(choice => {
                    const isSelected = selectedChoices.includes(choice.id);
                    
                    return (
                      <button
                        key={choice.id}
                        onClick={() => {
                          const newChoices = isSelected
                            ? selectedChoices.filter(id => id !== choice.id)
                            : [...selectedChoices, choice.id];
                          
                          filterService.applyFilters({
                            ...currentFilters,
                            selectedOptions: {
                              ...currentFilters.selectedOptions,
                              [option.id]: newChoices
                            }
                          });
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {choice.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

### Mobile Filter Modal

```tsx
import { useState } from "react";

function MobileFilterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const filterService = useService(FilterServiceDefinition);
  
  const currentFilters = filterService.currentFilters.get();
  const availableOptions = filterService.availableOptions.get();
  
  const activeFilterCount = Object.values(currentFilters.selectedOptions)
    .reduce((count, choices) => count + choices.length, 0);
  
  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>
      
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Filter content */}
              <AdvancedFilters />
            </div>
            
            <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
              <button
                onClick={() => filterService.clearFilters()}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

### Filter Summary Display

```tsx
function FilterSummary() {
  const filterService = useService(FilterServiceDefinition);
  
  const currentFilters = filterService.currentFilters.get();
  const availableOptions = filterService.availableOptions.get();
  
  const activePriceFilter = 
    currentFilters.priceRange.min > availableOptions.priceRange.min ||
    currentFilters.priceRange.max < availableOptions.priceRange.max;
  
  const activeOptionFilters = Object.entries(currentFilters.selectedOptions)
    .filter(([_, choices]) => choices.length > 0);
  
  const hasActiveFilters = activePriceFilter || activeOptionFilters.length > 0;
  
  if (!hasActiveFilters) {
    return null;
  }
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-blue-900">Active Filters</h4>
        <button
          onClick={() => filterService.clearFilters()}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Price Filter */}
        {activePriceFilter && (
          <span className="inline-flex items-center gap-1 bg-white border border-blue-300 rounded-full px-3 py-1 text-sm">
            Price: ${currentFilters.priceRange.min} - ${currentFilters.priceRange.max}
            <button
              onClick={() => filterService.applyFilters({
                ...currentFilters,
                priceRange: availableOptions.priceRange
              })}
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              ✕
            </button>
          </span>
        )}
        
        {/* Option Filters */}
        {activeOptionFilters.map(([optionId, choiceIds]) => {
          const option = availableOptions.productOptions.find(opt => opt.id === optionId);
          if (!option) return null;
          
          return choiceIds.map(choiceId => {
            const choice = option.choices.find(c => c.id === choiceId);
            if (!choice) return null;
            
            return (
              <span
                key={`${optionId}-${choiceId}`}
                className="inline-flex items-center gap-1 bg-white border border-blue-300 rounded-full px-3 py-1 text-sm"
              >
                {option.name}: {choice.name}
                <button
                  onClick={() => {
                    const newChoices = choiceIds.filter(id => id !== choiceId);
                    filterService.applyFilters({
                      ...currentFilters,
                      selectedOptions: {
                        ...currentFilters.selectedOptions,
                        [optionId]: newChoices
                      }
                    });
                  }}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  ✕
                </button>
              </span>
            );
          });
        })}
      </div>
    </div>
  );
}
```

## Integration with Other Services

### Collection Service Integration

The Filter Service works closely with the Collection Service:

```tsx
// Filter changes automatically trigger collection updates
// through URL parameter synchronization and reactive subscriptions
```

### URL Parameter Management

Automatic URL synchronization maintains deep linking:

```tsx
// URL structure: /products?minPrice=50&maxPrice=200&color=red&color=blue&size=large

// Parameters are automatically updated when filters change
// and restored when the page loads
```

### Catalog Services Integration

Integration with catalog-wide data sources:

```tsx
// Automatically loads available options and price ranges
// from CatalogOptionsService and CatalogPriceRangeService

// Reacts to changes in catalog data
// Updates filter UI when new options become available
```

## Usage in Components

The Filter Service is used extensively throughout the application:

### In FilteredCollection Components
```tsx
// src/headless/store/components/FilteredCollection.tsx
export const Filters: React.FC<FilteredFiltersProps> = ({ children }) => {
  const { filter } = useFilteredCollection();
  
  const currentFilters = filter!.currentFilters.get();
  const availableOptions = filter!.availableOptions.get();
  
  return children({
    applyFilters: filter!.applyFilters,
    clearFilters: filter!.clearFilters,
    currentFilters,
    availableOptions,
    // ... other filter data
  });
};
```

### In Product List Components
```tsx
// src/components/store/ProductFilters.tsx
const filterService = useService(FilterServiceDefinition);

// Used for filter UI, state management, and URL synchronization
```

### In Store Layout Pages
```tsx
// src/react-pages/store/example-2/index.tsx
// Filter service provides state management for comprehensive filtering UI
```

## Best Practices

### State Management
- Always check `isFullyLoaded` before showing filter UI
- Use reactive subscriptions for real-time updates
- Handle loading states gracefully

### URL Integration
- Filter state is automatically synchronized with URL parameters
- Preserve sort parameters when applying filters
- Support deep linking to filtered views

### Performance
- Filter service is optimized for reactive updates
- Catalog data is loaded once and cached
- URL updates are debounced to prevent excessive navigation

### User Experience
- Show active filter counts and summaries
- Provide clear filter removal options
- Handle empty states when no products match filters
- Use appropriate loading states during filter operations 
---

##### product modifiers service


The `product-modifiers-service` provides comprehensive product modifier management for products with customizable options like text inputs, swatch choices, and other modifiers that affect pricing and availability.

## Overview

The Product Modifiers Service handles:

- **Modifier Management** - Manages all product modifiers and their values
- **Choice Selection** - Handles swatch choices and text choices
- **Free Text Input** - Manages free text modifiers
- **Validation** - Validates required modifiers and input constraints
- **State Management** - Maintains modifier selections and validation states

## API Interface

```tsx
interface ProductModifiersServiceAPI {
  modifiers: ReadOnlySignal<productsV3.ConnectedModifier[]>;
  selectedModifiers: Signal<Record<string, ModifierValue>>;
  hasModifiers: ReadOnlySignal<boolean>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  setModifierChoice: (modifierName: string, choiceValue: string) => void;
  setModifierFreeText: (modifierName: string, freeTextValue: string) => void;
  clearModifier: (modifierName: string) => void;
  clearAllModifiers: () => void;
  getModifierValue: (modifierName: string) => ModifierValue | null;
  isModifierRequired: (modifierName: string) => boolean;
  hasRequiredModifiers: () => boolean;
  areAllRequiredModifiersFilled: () => boolean;
}

interface ModifierValue {
  modifierName: string;
  choiceValue?: string; // For SWATCH_CHOICES and TEXT_CHOICES
  freeTextValue?: string; // For FREE_TEXT
}
```

## Modifier Types

The service supports different types of modifiers:

- **SWATCH_CHOICES** - Color/pattern swatches with visual choices
- **TEXT_CHOICES** - Text-based dropdown/radio choices
- **FREE_TEXT** - Custom text input fields

## Core Functionality

### Getting Modifier Data

Access modifier information:

```tsx
import { useService } from "@wix/services-manager-react";
import { ProductModifiersServiceDefinition } from "../services/product-modifiers-service";

function ModifierComponent() {
  const modifierService = useService(ProductModifiersServiceDefinition);
  
  const modifiers = modifierService.modifiers.get();
  const selectedModifiers = modifierService.selectedModifiers.get();
  const hasModifiers = modifierService.hasModifiers.get();
  
  if (!hasModifiers) {
    return null;
  }
  
  return (
    <div>
      <h3>Product Customization:</h3>
      {modifiers.map(modifier => (
        <div key={modifier.name}>
          <label>{modifier.name}</label>
          {modifier.mandatory && <span className="required">*</span>}
          {/* Render modifier based on type */}
        </div>
      ))}
    </div>
  );
}
```

### Setting Modifier Values

Update modifier selections:

```tsx
// Set choice-based modifier
modifierService.setModifierChoice("Color", "Red");

// Set free text modifier
modifierService.setModifierFreeText("Custom Text", "My custom message");

// Clear specific modifier
modifierService.clearModifier("Color");

// Clear all modifiers
modifierService.clearAllModifiers();
```

### Validation

Check modifier validation:

```tsx
// Check if modifier is required
const isRequired = modifierService.isModifierRequired("Color");

// Check if product has required modifiers
const hasRequired = modifierService.hasRequiredModifiers();

// Check if all required modifiers are filled
const allFilled = modifierService.areAllRequiredModifiersFilled();

// Get specific modifier value
const colorValue = modifierService.getModifierValue("Color");
```

## Usage Example

```tsx
function ProductModifierForm() {
  const modifierService = useService(ProductModifiersServiceDefinition);
  
  const modifiers = modifierService.modifiers.get();
  const selectedModifiers = modifierService.selectedModifiers.get();
  const hasModifiers = modifierService.hasModifiers.get();
  const hasRequiredModifiers = modifierService.hasRequiredModifiers();
  const allRequiredFilled = modifierService.areAllRequiredModifiersFilled();
  
  if (!hasModifiers) {
    return null;
  }
  
  const renderModifier = (modifier: any) => {
    const isRequired = modifierService.isModifierRequired(modifier.name);
    const selectedValue = selectedModifiers[modifier.name];
    
    if (modifier.modifierRenderType === "SWATCH_CHOICES") {
      return (
        <div className="color-swatch-selector">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {modifier.name}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          <div className="flex flex-wrap gap-2">
            {modifier.choices?.map((choice: any) => (
              <button
                key={choice._id}
                onClick={() => modifierService.setModifierChoice(modifier.name, choice.value)}
                className={`
                  w-10 h-10 rounded-full border-2 transition-all
                  ${selectedValue?.choiceValue === choice.value
                    ? 'border-blue-500 scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                style={{ backgroundColor: choice.color || '#f3f4f6' }}
                title={choice.description}
              >
                {selectedValue?.choiceValue === choice.value && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (modifier.modifierRenderType === "TEXT_CHOICES") {
      return (
        <div className="text-choice-dropdown">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {modifier.name}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          <select
            value={selectedValue?.choiceValue || ''}
            onChange={(e) => {
              if (e.target.value) {
                modifierService.setModifierChoice(modifier.name, e.target.value);
              } else {
                modifierService.clearModifier(modifier.name);
              }
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select {modifier.name}</option>
            {modifier.choices?.map((choice: any) => (
              <option key={choice._id} value={choice.value}>
                {choice.description}
              </option>
            ))}
          </select>
        </div>
      );
    } else if (modifier.modifierRenderType === "FREE_TEXT") {
      return (
        <div className="free-text-input">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {modifier.name}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          <textarea
            value={selectedValue?.freeTextValue || ''}
            onChange={(e) => {
              if (e.target.value.trim()) {
                modifierService.setModifierFreeText(modifier.name, e.target.value);
              } else {
                modifierService.clearModifier(modifier.name);
              }
            }}
            placeholder={`Enter ${modifier.name.toLowerCase()}...`}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
          
          {modifier.maxLength && (
            <p className="text-sm text-gray-500 mt-1">
              {(selectedValue?.freeTextValue || '').length}/{modifier.maxLength} characters
            </p>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="product-modifier-form">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Customize Your Product
      </h3>
      
      <div className="space-y-4">
        {modifiers.map(modifier => (
          <div key={modifier.name} className="modifier-field">
            {renderModifier(modifier)}
          </div>
        ))}
      </div>
      
      {hasRequiredModifiers && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            * Required fields
          </p>
          {!allRequiredFilled && (
            <p className="text-sm text-red-600 mt-1">
              Please fill all required customization options
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

## Usage in Components

The Product Modifiers Service is used throughout the application:

### In Product Modifier Components
```tsx
// src/headless/store/components/ProductModifiers.tsx
export const Options = (props: ProductModifiersOptionsProps) => {
  const service = useService(ProductModifiersServiceDefinition);
  
  const modifiers = service.modifiers.get();
  const selectedModifiers = service.selectedModifiers.get();
  
  return props.children({ modifiers, selectedModifiers, service });
};
```

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
const modifierService = useService(ProductModifiersServiceDefinition);

// Used for product customization options
const hasModifiers = modifierService.hasModifiers.get();
const allRequiredFilled = modifierService.areAllRequiredModifiersFilled();
```

## Integration with Other Services

### Product Service Integration
- Modifier data is extracted from the product service
- Changes to product trigger modifier updates
- Coordinated loading states

### Cart Service Integration
- Modifier selections are included in cart operations
- Modifier values affect cart item identity
- Pricing calculations include modifier costs

### Selected Variant Service Integration
- Modifiers work alongside variant selections
- Both contribute to final product configuration
- Coordinated validation and state management

## Best Practices

### State Management
- Always validate required modifiers before cart operations
- Clear modifiers when switching products
- Provide immediate feedback for validation errors
- Use optimistic updates for better UX

### User Experience
- Show clear labels for required modifiers
- Provide visual feedback for selections
- Use appropriate input types for different modifiers
- Show modifier summaries before purchase

### Validation
- Implement client-side validation for better UX
- Validate on both selection and submission
- Show specific error messages for each modifier
- Handle edge cases like empty text inputs

### Performance
- Cache modifier data when possible
- Minimize re-renders during selection
- Use debouncing for free text inputs
- Implement proper loading states 
---

##### product service


The `product-service` provides comprehensive product data management for individual product pages, handling product loading, state management, and error handling with server-side configuration support.

## Overview

The Product Service handles:

- **Product Loading** - Fetches product data by slug from Wix Stores
- **State Management** - Manages product data, loading states, and error states
- **Server-Side Configuration** - Supports server-side product loading for performance
- **Error Handling** - Provides comprehensive error handling for missing products
- **Rich Product Data** - Includes comprehensive product fields for display

## API Interface

```tsx
interface ProductServiceAPI {
  product: Signal<productsV3.V3Product>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadProduct: (slug: string) => Promise<void>;
}

type ProductServiceConfigResult =
  | { type: "success"; config: ServiceFactoryConfig<typeof ProductService> }
  | { type: "notFound" };
```

## Product Fields

The service fetches comprehensive product data including:

- **Description** - Full product description
- **Direct Categories** - Category information
- **Breadcrumbs** - Navigation breadcrumbs
- **Info Section** - Additional product information
- **Media Items** - Product images and media
- **Plain Description** - Text-only description
- **Thumbnail** - Product thumbnail image
- **URL** - Product URL
- **Variant Options** - Product variant choice names
- **Weight Measurement** - Product weight information

## Core Functionality

### Getting Product Data

Access the current product data:

```tsx
import { useService } from "@wix/services-manager-react";
import { ProductServiceDefinition } from "../services/product-service";

function ProductComponent() {
  const productService = useService(ProductServiceDefinition);
  
  const product = productService.product.get();
  const isLoading = productService.isLoading.get();
  const error = productService.error.get();
  
  if (isLoading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <img src={product.media?.[0]?.url} alt={product.name} />
    </div>
  );
}
```

### Loading Products

Load a product by slug:

```tsx
// Load product by slug
await productService.loadProduct("my-product-slug");

// Check loading state
const isLoading = productService.isLoading.get();

// Check for errors
const error = productService.error.get();
```

## Usage Example

```tsx
import { useService } from "@wix/services-manager-react";
import { ProductServiceDefinition } from "../services/product-service";

function ProductDetailPage() {
  const productService = useService(ProductServiceDefinition);
  
  const product = productService.product.get();
  const isLoading = productService.isLoading.get();
  const error = productService.error.get();
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
        <div className="h-8 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">❌ Product Not Found</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {product.media && product.media.length > 0 && (
            <img
              src={product.media[0].url}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}
          
          {/* Additional Images */}
          <div className="grid grid-cols-4 gap-2">
            {product.media?.slice(1, 5).map((media, index) => (
              <img
                key={index}
                src={media.url}
                alt={`${product.name} ${index + 2}`}
                className="w-full h-20 object-cover rounded border cursor-pointer hover:border-blue-500"
              />
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {/* Price */}
          <div className="text-2xl font-bold text-gray-900">
            ${product.price?.price}
          </div>
          
          {/* Stock Status */}
          {product.stock && (
            <div className="text-sm text-gray-600">
              {product.stock.inventoryStatus === "IN_STOCK" 
                ? "✅ In Stock" 
                : "❌ Out of Stock"}
            </div>
          )}
          
          {/* Add to Cart Button */}
          <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Server-Side Configuration

The service supports server-side product loading for better performance:

### Server-Side Setup

```tsx
// In Astro page (.astro file)
---
import { loadProductServiceConfig } from "../services/product-service";

export async function getStaticPaths() {
  // Get all product slugs for static generation
  return [
    { params: { slug: "product-1" } },
    { params: { slug: "product-2" } },
    // ... more products
  ];
}

const { slug } = Astro.params;
const productConfig = await loadProductServiceConfig(slug);

if (productConfig.type === "notFound") {
  return Astro.redirect("/404");
}
---

<ProductPage config={productConfig.config} />
```

### Service Configuration

```tsx
// Client-side service configuration
import { ServiceFactory } from "@wix/services-manager-react";

function ProductPage({ config }) {
  return (
    <ServiceFactory services={[ProductService.withConfig(config)]}>
      <ProductDetailPage />
    </ServiceFactory>
  );
}
```

## Error Handling

The service provides comprehensive error handling:

### Error Types

```tsx
// Product not found
const error = productService.error.get();
// → "Product not found"

// Network errors
// → "Failed to load product"

// Invalid configuration
// → Service configuration error
```

### Error Recovery

```tsx
function ProductWithRetry() {
  const productService = useService(ProductServiceDefinition);
  
  const product = productService.product.get();
  const isLoading = productService.isLoading.get();
  const error = productService.error.get();
  
  const handleRetry = () => {
    const slug = window.location.pathname.split('/').pop();
    if (slug) {
      productService.loadProduct(slug);
    }
  };
  
  if (error) {
    return (
      <div className="error-state text-center py-12">
        <div className="text-red-500 text-lg mb-4">❌ Failed to Load Product</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="space-x-4">
          <button
            onClick={handleRetry}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return <ProductDetailPage />;
}
```

## Usage in Components

The Product Service is used throughout the application:

### In Product Components
```tsx
// src/headless/store/components/Product.tsx
export const Name = (props: ProductNameProps) => {
  const service = useService(ProductServiceDefinition);
  const product = service.product.get();
  
  return props.children({ name: product.name });
};

export const Description = (props: ProductDescriptionProps) => {
  const service = useService(ProductServiceDefinition);
  const product = service.product.get();
  
  return props.children({ description: product.description });
};
```

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
const productService = useService(ProductServiceDefinition);

// Used for displaying product information
const product = productService.product.get();
const isLoading = productService.isLoading.get();
const error = productService.error.get();
```

## Integration with Other Services

### Selected Variant Service Integration
- Product data is used to configure variant options
- Variant selections affect product pricing and availability
- Coordinated loading states and error handling

### Media Gallery Service Integration
- Product media data is used for image galleries
- Media service handles image optimization and display
- Shared loading states for media content

### Cart Service Integration
- Product data is used for cart item information
- Variant selections are coordinated with cart operations
- Stock information affects cart availability

## Best Practices

### Data Loading
- Always use server-side configuration for initial load
- Handle loading states gracefully
- Provide comprehensive error handling
- Cache product data when possible

### Error Handling
- Display user-friendly error messages
- Provide retry mechanisms
- Implement proper fallback states
- Handle network failures gracefully

### Performance
- Use server-side rendering for initial product data
- Implement proper loading states
- Optimize image loading
- Cache frequently accessed products

### User Experience
- Show loading skeletons during data fetching
- Provide clear error messages
- Enable easy navigation back to product lists
- Implement retry functionality for failures 
---

##### related products service


The `related-products-service` provides related product recommendations and management, enabling cross-selling and product discovery by showing relevant products based on the current product context.

## Overview

The Related Products Service handles:

- **Product Recommendations** - Loads related products based on current product
- **Loading Management** - Handles loading states and error handling
- **Customizable Limits** - Configurable number of related products
- **Refresh Capability** - Ability to refresh related products
- **State Management** - Maintains related product list and states

## API Interface

```tsx
interface RelatedProductsServiceAPI {
  relatedProducts: Signal<productsV3.V3Product[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  hasRelatedProducts: Signal<boolean>;

  loadRelatedProducts: (productId: string, limit?: number) => Promise<void>;
  refreshRelatedProducts: () => Promise<void>;
}
```

## Service Configuration

```tsx
interface RelatedProductsServiceConfig {
  productId: string;
  limit?: number; // Default: 4
}
```

## Core Functionality

### Getting Related Products

Access related product data:

```tsx
import { useService } from "@wix/services-manager-react";
import { RelatedProductsServiceDefinition } from "../services/related-products-service";

function RelatedProductsComponent() {
  const relatedService = useService(RelatedProductsServiceDefinition);
  
  const relatedProducts = relatedService.relatedProducts.get();
  const isLoading = relatedService.isLoading.get();
  const error = relatedService.error.get();
  const hasRelatedProducts = relatedService.hasRelatedProducts.get();
  
  if (isLoading) return <div>Loading related products...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!hasRelatedProducts) return null;
  
  return (
    <div>
      <h3>You might also like:</h3>
      <div className="grid grid-cols-4 gap-4">
        {relatedProducts.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.media?.[0]?.url} alt={product.name} />
            <h4>{product.name}</h4>
            <p>${product.price?.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Loading Related Products

Load related products for a specific product:

```tsx
// Load related products for a product
await relatedService.loadRelatedProducts("product-id", 6);

// Refresh current related products
await relatedService.refreshRelatedProducts();
```

## Usage Example

```tsx
function RelatedProductsGrid() {
  const relatedService = useService(RelatedProductsServiceDefinition);
  
  const relatedProducts = relatedService.relatedProducts.get();
  const isLoading = relatedService.isLoading.get();
  const error = relatedService.error.get();
  const hasRelatedProducts = relatedService.hasRelatedProducts.get();
  
  if (isLoading) {
    return (
      <div className="related-products-loading">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Related Products
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 aspect-square rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="related-products-error">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Related Products
        </h3>
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Failed to load related products</p>
          <button
            onClick={() => relatedService.refreshRelatedProducts()}
            className="text-blue-500 hover:text-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!hasRelatedProducts) {
    return null;
  }
  
  return (
    <div className="related-products-grid">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        You might also like
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map(product => (
          <div key={product._id} className="product-card group">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              {product.media?.[0] ? (
                <img
                  src={product.media[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </h4>
              <p className="text-sm text-gray-600">
                ${product.price?.price || 'N/A'}
              </p>
            </div>
            
            <button className="mt-2 w-full bg-blue-500 text-white py-1 px-2 rounded text-sm hover:bg-blue-600 transition-colors">
              View Product
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Server-Side Configuration

Configure the service with product context:

### Service Configuration

```tsx
// Server-side configuration
import { loadRelatedProductsServiceConfig } from "../services/related-products-service";

export async function loadRelatedProductsConfig(productId: string) {
  return await loadRelatedProductsServiceConfig(productId, 6);
}
```

### Astro Integration

```tsx
// In Astro page
---
import { loadRelatedProductsConfig } from "../services/related-products-service";

const productId = "current-product-id";
const relatedProductsConfig = await loadRelatedProductsConfig(productId);
---

<RelatedProductsSection config={relatedProductsConfig} />
```

## Error Handling

Handle related products loading errors:

```tsx
function RelatedProductsWithErrorHandling() {
  const relatedService = useService(RelatedProductsServiceDefinition);
  
  const relatedProducts = relatedService.relatedProducts.get();
  const isLoading = relatedService.isLoading.get();
  const error = relatedService.error.get();
  const hasRelatedProducts = relatedService.hasRelatedProducts.get();
  
  if (isLoading) {
    return <RelatedProductsLoading />;
  }
  
  if (error) {
    return (
      <div className="related-products-error">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Related Products
        </h3>
        <div className="text-center py-8 border rounded-lg">
          <p className="text-red-500 mb-2">Failed to load related products</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => relatedService.refreshRelatedProducts()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!hasRelatedProducts) {
    return (
      <div className="related-products-empty">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Related Products
        </h3>
        <p className="text-gray-500 text-center py-8">
          No related products found
        </p>
      </div>
    );
  }
  
  return <RelatedProductsGrid />;
}
```

## Usage in Components

The Related Products Service is used throughout the application:

### In Related Products Components
```tsx
// src/headless/store/components/RelatedProducts.tsx
export const List = (props: RelatedProductsListProps) => {
  const service = useService(RelatedProductsServiceDefinition);
  
  const relatedProducts = service.relatedProducts.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();
  
  return props.children({ relatedProducts, isLoading, error });
};

export const Item = (props: RelatedProductsItemProps) => {
  const { product } = props;
  
  return props.children({ product });
};
```

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
const relatedProductsService = useService(RelatedProductsServiceDefinition);

// Used for showing related products
const relatedProducts = relatedProductsService.relatedProducts.get();
const hasRelatedProducts = relatedProductsService.hasRelatedProducts.get();
```

## Integration with Other Services

### Product Service Integration
- Uses current product ID to load related products
- Excludes current product from related products list
- Coordinated loading states

### Cart Service Integration
- Related products can be added to cart
- Cart operations work with related product data
- Shared product information

### Navigation Integration
- Related products support navigation to product pages
- URL generation for related product links
- Navigation state management

## Best Practices

### Data Loading
- Load related products asynchronously
- Use appropriate limits to avoid overwhelming users
- Implement proper error handling and retry logic
- Cache related products when possible

### User Experience
- Show loading states while fetching related products
- Provide clear error messages and retry options
- Use responsive design for different screen sizes
- Implement smooth transitions and animations

### Performance
- Limit the number of related products loaded
- Use lazy loading for related product images
- Implement pagination for large related product lists
- Cache related products to reduce API calls

### Content Strategy
- Show genuinely related products when possible
- Fall back to popular products if no related products exist
- Consider category-based or tag-based relationships
- Implement A/B testing for related product algorithms 
---

##### selected variant service


The `selected-variant-service` is a comprehensive service that manages product variant selection, pricing, inventory, and cart operations. It provides reactive state management for product options, handles variant calculations, and integrates with the cart system.

## Overview

The Selected Variant Service handles:

- **Variant Selection** - Managing product option choices and variant calculation
- **Pricing** - Current pricing, discounts, and price formatting
- **Inventory** - Stock status, quantities, and pre-order availability
- **Cart Operations** - Adding selected variants to cart with modifiers
- **Choice Validation** - Determining available and valid option combinations

## API Interface

```tsx
interface SelectedVariantServiceAPI {
  // Core Selection State
  selectedQuantity: Signal<number>;
  selectedChoices: Signal<Record<string, string>>;
  selectedVariantId: ReadOnlySignal<string | null>;
  currentVariant: ReadOnlySignal<productsV3.Variant | null>;
  
  // Pricing Signals
  currentPrice: ReadOnlySignal<string>;
  currentCompareAtPrice: ReadOnlySignal<string | null>;
  basePrice: Signal<number>;
  discountPrice: Signal<number | null>;
  isOnSale: Signal<boolean | null>;
  
  // Inventory Signals
  isInStock: ReadOnlySignal<boolean>;
  isPreOrderEnabled: ReadOnlySignal<boolean>;
  quantityAvailable: Signal<number | null>;
  trackQuantity: Signal<boolean>;
  
  // Product Data
  product: ReadOnlySignal<productsV3.V3Product | null>;
  productOptions: ReadOnlySignal<productsV3.ConnectedOption[]>;
  variants: Signal<productsV3.Variant[]>;
  options: Signal<Record<string, string[]>>;
  
  // State Management
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  productId: Signal<string>;
  ribbonLabel: Signal<string | null>;
  currency: ReadOnlySignal<string>;
  
  // Methods
  selectedVariant: () => productsV3.Variant | null;
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;
  setSelectedChoices: (choices: Record<string, string>) => void;
  addToCart: (quantity?: number, modifiers?: Record<string, any>) => Promise<void>;
  setOption: (group: string, value: string) => void;
  setSelectedQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  selectVariantById: (id: string) => void;
  resetSelections: () => void;
  
  // Choice Validation
  getAvailableChoicesForOption: (optionName: string) => string[];
  getChoiceInfo: (optionName: string, choiceValue: string) => {
    isAvailable: boolean;
    isInStock: boolean;
    isPreOrderEnabled: boolean;
  };
  isChoiceAvailable: (optionName: string, choiceValue: string) => boolean;
  isChoiceInStock: (optionName: string, choiceValue: string) => boolean;
  isChoicePreOrderEnabled: (optionName: string, choiceValue: string) => boolean;
  hasAnySelections: () => boolean;
}
```

## Core Functionality

### Variant Selection Management

The service tracks selected product options and automatically calculates the matching variant:

```tsx
// Example usage in a component
const variantService = useService(SelectedVariantServiceDefinition);

// Get current selections
const selectedChoices = variantService.selectedChoices.get();
const currentVariant = variantService.currentVariant.get();

// Update selections
variantService.setSelectedChoices({
  "Size": "Large",
  "Color": "Red"
});

// Set individual option
variantService.setOption("Size", "Medium");
```

### Price Calculation

The service provides reactive pricing information:

```tsx
// Get current pricing
const currentPrice = variantService.currentPrice.get(); // "$29.99"
const compareAtPrice = variantService.currentCompareAtPrice.get(); // "$39.99" or null
const isOnSale = variantService.isOnSale.get(); // true/false

// Get numeric price for calculations
const numericPrice = variantService.finalPrice(); // 29.99
```

### Inventory Management

Stock status and quantity tracking:

```tsx
// Check stock status
const inStock = variantService.isInStock.get();
const isPreOrderEnabled = variantService.isPreOrderEnabled.get();
const availableQuantity = variantService.quantityAvailable.get();

// Check if stock is low
const isLowStock = variantService.isLowStock(5); // threshold of 5 items
```

### Choice Validation

Validate option combinations and availability:

```tsx
// Check if a choice is available
const isAvailable = variantService.isChoiceAvailable("Size", "Large");
const isInStock = variantService.isChoiceInStock("Color", "Red");

// Get all available choices for an option
const availableSizes = variantService.getAvailableChoicesForOption("Size");

// Get detailed choice information
const choiceInfo = variantService.getChoiceInfo("Size", "Large");
// Returns: { isAvailable: true, isInStock: true, isPreOrderEnabled: false }
```

### Cart Operations

Add selected variants to cart:

```tsx
// Add to cart with current selections
await variantService.addToCart(2); // quantity of 2

// Add to cart with modifiers
await variantService.addToCart(1, {
  "Custom Text": "Happy Birthday!",
  "Gift Wrap": true
});
```

## Usage Examples

### Basic Variant Selection

```tsx
import { useService } from "@wix/services-manager-react";
import { SelectedVariantServiceDefinition } from "../services/selected-variant-service";

function ProductVariantSelector() {
  const variantService = useService(SelectedVariantServiceDefinition);
  
  const selectedChoices = variantService.selectedChoices.get();
  const productOptions = variantService.productOptions.get();
  const currentPrice = variantService.currentPrice.get();
  const inStock = variantService.isInStock.get();
  
  return (
    <div className="variant-selector">
      <div className="price text-2xl font-bold mb-4">
        {currentPrice}
      </div>
      
      {productOptions.map(option => (
        <div key={option.name} className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {option.name}
          </label>
          <div className="flex gap-2">
            {option.choicesSettings?.choices?.map(choice => (
              <button
                key={choice.name}
                onClick={() => variantService.setOption(option.name!, choice.name!)}
                className={`px-3 py-1 border rounded ${
                  selectedChoices[option.name!] === choice.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                {choice.name}
              </button>
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-6">
        <span className={`px-2 py-1 rounded text-sm ${
          inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  );
}
```

### Smart Choice Validation

```tsx
function SmartVariantSelector() {
  const variantService = useService(SelectedVariantServiceDefinition);
  
  const selectedChoices = variantService.selectedChoices.get();
  const productOptions = variantService.productOptions.get();
  
  return (
    <div className="smart-variant-selector">
      {productOptions.map(option => (
        <div key={option.name} className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {option.name}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {option.choicesSettings?.choices?.map(choice => {
              const isSelected = selectedChoices[option.name!] === choice.name;
              const isAvailable = variantService.isChoiceAvailable(option.name!, choice.name!);
              const isInStock = variantService.isChoiceInStock(option.name!, choice.name!);
              const isPreOrderEnabled = variantService.isChoicePreOrderEnabled(option.name!, choice.name!);
              
              return (
                <button
                  key={choice.name}
                  onClick={() => variantService.setOption(option.name!, choice.name!)}
                  disabled={!isAvailable}
                  className={`
                    p-2 border rounded text-center transition-colors
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'}
                    ${!isInStock 
                      ? 'bg-gray-100 text-gray-400' 
                      : ''}
                    ${!isAvailable 
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'cursor-pointer'}
                  `}
                >
                  <span className="block font-medium">{choice.name}</span>
                  <span className={`block text-xs mt-1 ${
                    isInStock ? 'text-green-600' : 
                    isPreOrderEnabled ? 'text-orange-600' : 
                    'text-red-600'
                  }`}>
                    {isInStock ? 'In Stock' : 
                     isPreOrderEnabled ? 'Pre-Order' : 
                     'Out of Stock'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Add to Cart with Validation

```tsx
function AddToCartButton() {
  const variantService = useService(SelectedVariantServiceDefinition);
  
  const selectedQuantity = variantService.selectedQuantity.get();
  const currentPrice = variantService.currentPrice.get();
  const inStock = variantService.isInStock.get();
  const isPreOrderEnabled = variantService.isPreOrderEnabled.get();
  const isLoading = variantService.isLoading.get();
  const error = variantService.error.get();
  
  const canAddToCart = inStock || isPreOrderEnabled;
  
  const handleAddToCart = async () => {
    try {
      await variantService.addToCart(selectedQuantity);
      // Handle success (e.g., show notification)
    } catch (error) {
      // Handle error
      console.error('Failed to add to cart:', error);
    }
  };
  
  return (
    <div className="add-to-cart-section">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center border rounded">
          <button
            onClick={() => variantService.decrementQuantity()}
            className="px-3 py-1 hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-4 py-1 border-l border-r">
            {selectedQuantity}
          </span>
          <button
            onClick={() => variantService.incrementQuantity()}
            className="px-3 py-1 hover:bg-gray-100"
          >
            +
          </button>
        </div>
        <span className="text-lg font-bold">{currentPrice}</span>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <button
        onClick={handleAddToCart}
        disabled={!canAddToCart || isLoading}
        className={`
          w-full py-3 px-6 rounded-lg font-medium transition-colors
          ${canAddToCart && !isLoading
            ? inStock 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
        `}
      >
        {isLoading ? 'Adding...' : 
         inStock ? 'Add to Cart' : 
         isPreOrderEnabled ? 'Pre-Order' : 
         'Out of Stock'}
      </button>
    </div>
  );
}
```

### Quantity Management

```tsx
function QuantitySelector() {
  const variantService = useService(SelectedVariantServiceDefinition);
  
  const selectedQuantity = variantService.selectedQuantity.get();
  const availableQuantity = variantService.quantityAvailable.get();
  const trackQuantity = variantService.trackQuantity.get();
  
  const isLowStock = variantService.isLowStock(5);
  
  return (
    <div className="quantity-selector">
      <label className="block text-sm font-medium mb-2">
        Quantity
      </label>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => variantService.decrementQuantity()}
          disabled={selectedQuantity <= 1}
          className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          -
        </button>
        
        <input
          type="number"
          value={selectedQuantity}
          onChange={(e) => variantService.setSelectedQuantity(parseInt(e.target.value) || 1)}
          min="1"
          max={availableQuantity || undefined}
          className="w-16 px-2 py-1 border rounded text-center"
        />
        
        <button
          onClick={() => variantService.incrementQuantity()}
          disabled={trackQuantity && availableQuantity !== null && selectedQuantity >= availableQuantity}
          className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          +
        </button>
      </div>
      
      {trackQuantity && availableQuantity !== null && (
        <p className="text-sm text-gray-600 mt-1">
          {availableQuantity} available
          {isLowStock && <span className="text-orange-600 ml-1">(Low Stock!)</span>}
        </p>
      )}
    </div>
  );
}
```

## Integration with Other Services

### Product Service Integration

The Selected Variant Service automatically integrates with the Product Service:

```tsx
// The service automatically loads product data
const product = variantService.product.get();
const productOptions = variantService.productOptions.get();
```

### Cart Service Integration

Cart operations are handled automatically:

```tsx
// Adding to cart integrates with the current cart
await variantService.addToCart(2);

// The cart service will be updated with the new item
```

### Media Gallery Integration

The service automatically updates the media gallery based on selected options:

```tsx
// When choices are selected, the media gallery updates
variantService.setSelectedChoices({
  "Color": "Red" // If red variant has specific images, they'll be shown
});
```

## Error Handling

The service provides comprehensive error handling:

```tsx
const error = variantService.error.get();

if (error) {
  // Handle various error types
  console.error('Variant service error:', error);
}

// Common error scenarios:
// - Invalid option combinations
// - Out of stock items
// - Cart operation failures
// - Network connectivity issues
```

## Best Practices

### State Management
- Always check loading states before showing UI
- Subscribe to relevant signals for reactive updates
- Handle error states gracefully

### Validation
- Use choice validation methods to show only available options
- Provide clear feedback for out-of-stock items
- Validate selections before allowing cart operations

### Performance
- The service is optimized for reactive updates
- Avoid unnecessary re-renders by using specific signals
- Cache expensive operations when possible

### User Experience
- Show loading states during operations
- Provide clear feedback for successful actions
- Handle edge cases (no variants, out of stock, etc.)

## Usage in Components

The Selected Variant Service is used extensively throughout the application:

### In ProductVariantSelector Components
```tsx
// src/headless/store/components/ProductVariantSelector.tsx
export const Options = (props: OptionsProps) => {
  const variantService = useService(SelectedVariantServiceDefinition);
  const selectedChoices = variantService.selectedChoices.get();
  const options = variantService.productOptions.get();
  
  return props.children({
    options,
    hasOptions: options.length > 0,
    selectedChoices,
  });
};
```

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
const variantService = useService(SelectedVariantServiceDefinition);

// Used for variant selection, pricing, and cart operations
```

### In Product Action Buttons
```tsx
// src/components/store/ProductActionButtons.tsx
const variantService = useService(SelectedVariantServiceDefinition);

// Used for add to cart functionality with variant data
``` 
---

##### social sharing service


The `social-sharing-service` provides comprehensive social media sharing functionality for products, enabling users to share products across various platforms including Facebook, Twitter, LinkedIn, WhatsApp, email, and native device sharing.

## Overview

The Social Sharing Service handles:

- **Multi-Platform Sharing** - Support for major social media platforms
- **Native Sharing** - Web Share API integration for mobile devices
- **Email Sharing** - Direct email sharing capability
- **Clipboard Operations** - Copy product links to clipboard
- **Share Tracking** - Track sharing activity and platform usage
- **Custom Configuration** - Configurable sharing options per product

## API Interface

```tsx
interface SocialSharingServiceAPI {
  availablePlatforms: Signal<SharingPlatform[]>;
  shareCount: Signal<number>;
  lastSharedPlatform: Signal<string | null>;

  shareToFacebook: (url: string, title: string, description?: string) => void;
  shareToTwitter: (url: string, text: string, hashtags?: string[]) => void;
  shareToLinkedIn: (url: string, title: string, summary?: string) => void;
  shareToWhatsApp: (url: string, text: string) => void;
  shareToEmail: (url: string, subject: string, body: string) => void;
  copyToClipboard: (url: string) => Promise<boolean>;
  shareNative: (data: { title: string; text: string; url: string }) => Promise<boolean>;
  trackShare: (platform: string) => void;
}

interface SharingPlatform {
  name: string;
  icon: string;
  color: string;
  shareUrl: string;
}
```

## Service Configuration

```tsx
interface SocialSharingServiceConfig {
  productName: string;
  productUrl: string;
  productDescription?: string;
  productImage?: string;
}
```

## Supported Platforms

The service supports sharing to:

- **Facebook** - Product sharing with image and description
- **Twitter** - Tweet with hashtags and product link
- **LinkedIn** - Professional sharing with summary
- **WhatsApp** - Direct message sharing
- **Email** - Email sharing with custom subject and body
- **Native** - Device native sharing (mobile/desktop)
- **Clipboard** - Copy link functionality

## Core Functionality

### Basic Sharing Operations

```tsx
import { useService } from "@wix/services-manager-react";
import { SocialSharingServiceDefinition } from "../services/social-sharing-service";

function SocialSharingComponent() {
  const sharingService = useService(SocialSharingServiceDefinition);
  
  const availablePlatforms = sharingService.availablePlatforms.get();
  const shareCount = sharingService.shareCount.get();
  
  const handleFacebookShare = () => {
    sharingService.shareToFacebook(
      "https://example.com/product/123",
      "Amazing Product",
      "Check out this amazing product!"
    );
  };
  
  const handleTwitterShare = () => {
    sharingService.shareToTwitter(
      "https://example.com/product/123",
      "Check out this amazing product!",
      ["products", "shopping", "deals"]
    );
  };
  
  return (
    <div>
      <h3>Share this product:</h3>
      <div className="flex gap-2">
        <button onClick={handleFacebookShare}>Share on Facebook</button>
        <button onClick={handleTwitterShare}>Share on Twitter</button>
      </div>
      <p>Total shares: {shareCount}</p>
    </div>
  );
}
```

### Platform-Specific Sharing

```tsx
// Facebook sharing
sharingService.shareToFacebook(
  "https://example.com/product/123",
  "Product Name",
  "Product description"
);

// Twitter sharing with hashtags
sharingService.shareToTwitter(
  "https://example.com/product/123",
  "Check out this product!",
  ["shopping", "deals", "products"]
);

// LinkedIn sharing
sharingService.shareToLinkedIn(
  "https://example.com/product/123",
  "Product Name",
  "Professional summary about the product"
);

// WhatsApp sharing
sharingService.shareToWhatsApp(
  "https://example.com/product/123",
  "Look at this amazing product!"
);

// Email sharing
sharingService.shareToEmail(
  "https://example.com/product/123",
  "Check out this product",
  "I thought you might be interested in this product."
);
```

### Clipboard and Native Sharing

```tsx
// Copy to clipboard
const copySuccess = await sharingService.copyToClipboard("https://example.com/product/123");
if (copySuccess) {
  alert("Link copied to clipboard!");
}

// Native sharing (mobile/desktop)
const shareData = {
  title: "Product Name",
  text: "Check out this amazing product!",
  url: "https://example.com/product/123"
};

const nativeShareSuccess = await sharingService.shareNative(shareData);
if (!nativeShareSuccess) {
  // Fallback to custom sharing UI
  showCustomSharingModal();
}
```

## Usage Example

```tsx
function SocialSharingWidget() {
  const sharingService = useService(SocialSharingServiceDefinition);
  
  const availablePlatforms = sharingService.availablePlatforms.get();
  const shareCount = sharingService.shareCount.get();
  const lastSharedPlatform = sharingService.lastSharedPlatform.get();
  
  const productUrl = "https://example.com/product/123";
  const productTitle = "Amazing Product";
  const productDescription = "Check out this amazing product!";
  
  const handleShare = async (platform: string) => {
    switch (platform) {
      case "Facebook":
        sharingService.shareToFacebook(productUrl, productTitle, productDescription);
        break;
      case "Twitter":
        sharingService.shareToTwitter(productUrl, productDescription, ["shopping", "deals"]);
        break;
      case "LinkedIn":
        sharingService.shareToLinkedIn(productUrl, productTitle, productDescription);
        break;
      case "WhatsApp":
        sharingService.shareToWhatsApp(productUrl, productDescription);
        break;
      case "Email":
        sharingService.shareToEmail(productUrl, `Check out: ${productTitle}`, productDescription);
        break;
      case "Native":
        const success = await sharingService.shareNative({
          title: productTitle,
          text: productDescription,
          url: productUrl
        });
        if (!success) {
          alert("Native sharing not supported");
        }
        break;
      case "Clipboard":
        const copied = await sharingService.copyToClipboard(productUrl);
        if (copied) {
          alert("Link copied to clipboard!");
        }
        break;
    }
  };
  
  return (
    <div className="social-sharing-widget">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Share this product
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {availablePlatforms.map(platform => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform.name)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
            style={{ borderColor: platform.color }}
          >
            <span className="w-5 h-5" style={{ color: platform.color }}>
              {getPlatformIcon(platform.icon)}
            </span>
            <span className="text-sm">{platform.name}</span>
          </button>
        ))}
        
        {/* Native Share Button (mobile/desktop) */}
        <button
          onClick={() => handleShare("Native")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          <span className="w-5 h-5">📱</span>
          <span className="text-sm">Share</span>
        </button>
        
        {/* Copy Link Button */}
        <button
          onClick={() => handleShare("Clipboard")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          <span className="w-5 h-5">📋</span>
          <span className="text-sm">Copy Link</span>
        </button>
      </div>
      
      <div className="text-sm text-gray-600">
        {shareCount > 0 && (
          <p>This product has been shared {shareCount} times</p>
        )}
        {lastSharedPlatform && (
          <p>Last shared on: {lastSharedPlatform}</p>
        )}
      </div>
    </div>
  );
}

// Helper function for platform icons
function getPlatformIcon(iconName: string) {
  const icons = {
    facebook: "📘",
    twitter: "🐦",
    linkedin: "💼",
    whatsapp: "💬",
    mail: "📧"
  };
  return icons[iconName] || "📤";
}
```



## Server-Side Configuration

Configure sharing service with product data:

```tsx
// Server-side configuration
import { loadSocialSharingServiceConfig } from "../services/social-sharing-service";

export async function createSharingConfig(product: any) {
  return await loadSocialSharingServiceConfig(
    product.name,
    `https://example.com/product/${product.slug}`,
    product.description,
    product.media?.[0]?.url
  );
}
```

## Error Handling and Fallbacks

```tsx
function SharingWithErrorHandling() {
  const sharingService = useService(SocialSharingServiceDefinition);
  
  const handleShareWithFallback = async (platform: string) => {
    try {
      switch (platform) {
        case "native":
          const success = await sharingService.shareNative({
            title: "Product Name",
            text: "Check this out!",
            url: "https://example.com/product/123"
          });
          
          if (!success) {
            // Fallback to copy to clipboard
            const copied = await sharingService.copyToClipboard("https://example.com/product/123");
            if (copied) {
              alert("Link copied to clipboard!");
            } else {
              alert("Sharing not supported on this device");
            }
          }
          break;
          
        case "clipboard":
          const copied = await sharingService.copyToClipboard("https://example.com/product/123");
          if (copied) {
            alert("Link copied to clipboard!");
          } else {
            // Fallback to showing the URL
            prompt("Copy this link:", "https://example.com/product/123");
          }
          break;
          
        default:
          // Platform-specific sharing
          handlePlatformShare(platform);
      }
    } catch (error) {
      console.error(`Sharing failed for ${platform}:`, error);
      alert("Sharing failed. Please try again.");
    }
  };
  
  return (
    <div className="sharing-with-fallback">
      <button onClick={() => handleShareWithFallback("native")}>
        Share (Native)
      </button>
      <button onClick={() => handleShareWithFallback("clipboard")}>
        Copy Link
      </button>
    </div>
  );
}
```

## Usage in Components

The Social Sharing Service is used throughout the application:

### In Social Sharing Components
```tsx
// src/headless/store/components/SocialSharing.tsx
export const ShareButton = (props: ShareButtonProps) => {
  const service = useService(SocialSharingServiceDefinition);
  
  const availablePlatforms = service.availablePlatforms.get();
  const shareCount = service.shareCount.get();
  
  return props.children({ availablePlatforms, shareCount, service });
};
```

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
const sharingService = useService(SocialSharingServiceDefinition);

// Used for product sharing functionality
const availablePlatforms = sharingService.availablePlatforms.get();
const shareCount = sharingService.shareCount.get();
```

## Integration with Other Services

### Product Service Integration
- Uses product data for sharing content
- Automatically updates sharing URLs when product changes
- Coordinated product information

### Analytics Integration
- Tracks sharing events for analytics
- Provides share count and platform preferences
- Integrates with broader analytics systems

### SEO Integration
- Generates proper meta tags for social sharing
- Supports Open Graph and Twitter Card metadata
- Enhances social media appearance

## Best Practices

### User Experience
- Provide clear sharing options
- Use recognizable platform icons and colors
- Implement fallback mechanisms for unsupported platforms
- Show feedback when sharing succeeds or fails

### Content Strategy
- Customize sharing content for each platform
- Use appropriate hashtags and mentions
- Include compelling descriptions and calls-to-action
- Optimize sharing content for each platform's audience

### Performance
- Lazy load sharing functionality
- Cache sharing configurations
- Minimize external dependencies
- Use efficient popup window management

### Privacy and Security
- Respect user privacy preferences
- Use secure sharing URLs
- Implement proper error handling
- Follow platform-specific guidelines and policies 
---

##### sort service


The `sort-service` provides product sorting functionality with automatic URL synchronization, enabling users to sort product collections by various criteria like name, price, and recommendations.

## Overview

The Sort Service handles:

- **Sort State Management** - Current sort selection and updates
- **URL Synchronization** - Automatic URL parameter updates for deep linking
- **Sort Options** - Multiple sorting criteria (name, price, recommended)
- **Default Handling** - Fallback to default sort when no selection is made

## API Interface

```tsx
interface SortServiceAPI {
  currentSort: Signal<SortBy>;
  setSortBy: (sortBy: SortBy) => Promise<void>;
}

type SortBy = "" | "name-asc" | "name-desc" | "price-asc" | "price-desc" | "recommended";
```

## Sort Options

The service supports the following sort options:

- `""` (empty) - Default sort (newest)
- `"name-asc"` - Name A to Z
- `"name-desc"` - Name Z to A  
- `"price-asc"` - Price low to high
- `"price-desc"` - Price high to low
- `"recommended"` - Recommended products

## Core Functionality

### Getting Current Sort

Access the current sort selection:

```tsx
import { useService } from "@wix/services-manager-react";
import { SortServiceDefinition } from "../services/sort-service";

function SortComponent() {
  const sortService = useService(SortServiceDefinition);
  
  const currentSort = sortService.currentSort.get();
  
  return (
    <div>
      <p>Current sort: {currentSort || 'Default (newest)'}</p>
    </div>
  );
}
```

### Setting Sort Option

Change the sort selection:

```tsx
// Set sort to price ascending
await sortService.setSortBy("price-asc");

// Set sort to name descending
await sortService.setSortBy("name-desc");

// Reset to default sort
await sortService.setSortBy("");
```

## Usage Example

```tsx
import { useService } from "@wix/services-manager-react";
import { SortServiceDefinition } from "../services/sort-service";

function SortDropdown() {
  const sortService = useService(SortServiceDefinition);
  
  const currentSort = sortService.currentSort.get();
  
  const sortOptions = [
    { value: "", label: "Newest" },
    { value: "recommended", label: "Recommended" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];
  
  return (
    <div className="sort-dropdown">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sort by:
      </label>
      <select
        value={currentSort}
        onChange={(e) => sortService.setSortBy(e.target.value as any)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```



## URL Integration

The Sort Service automatically manages URL parameters:

### URL Parameter Mapping

```tsx
// Sort selections are mapped to URL parameters:
const sortMap = {
  "name-asc": "name_asc",
  "name-desc": "name_desc", 
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  "recommended": "recommended",
  "": "newest" // Default - not added to URL
};

// Examples:
// /products?sort=price_asc
// /products?sort=name_desc
// /products (no sort parameter for default)
```

### Deep Linking Support

URLs with sort parameters are automatically restored:

```tsx
// URL: /products?sort=price_desc
// → currentSort will be set to "price-desc"

// URL: /products
// → currentSort will be set to "" (default)
```

## Usage in Components

The Sort Service is used throughout the application:

### In Sort Components
```tsx
// src/headless/store/components/Sort.tsx
export const Controller = (props: SortControllerProps) => {
  const service = useService(SortServiceDefinition);
  
  const currentSort = service.currentSort.get();
  const setSortBy = service.setSortBy;
  
  return props.children({ currentSort, setSortBy });
};
```

### In Product List Pages
```tsx
// src/react-pages/store/example-1/index.tsx
const sortService = useService(SortServiceDefinition);

// Used for sort dropdown and maintaining sort state
```

### In Collection Components
```tsx
// Collection service reacts to sort changes
// and automatically re-fetches products with new sort order
```

## Integration with Other Services

### Collection Service Integration
- Sort changes trigger automatic collection refresh
- New sort order is applied to product queries
- Loading states are coordinated between services

### URL Parameters Service Integration
- Uses URLParamsUtils for URL synchronization
- Preserves other URL parameters (filters, pagination)
- Supports browser navigation (back/forward)

## Best Practices

### State Management
- Always use the service for sort state management
- Don't store sort state in component state
- Subscribe to sort changes for reactive updates

### URL Handling
- Let the service handle URL parameter updates
- Don't manually modify sort URL parameters
- Test deep linking and browser navigation

### User Experience
- Show current sort selection clearly
- Provide intuitive sort option labels
- Use loading states during sort changes
- Remember sort preferences when possible

### Performance
- Sort service is lightweight and optimized
- URL updates are automatic and efficient
- Service integrates seamlessly with collections 
---

### utils

##### url params


The `URLParamsUtils` utility provides helper functions for managing URL search parameters in store applications. It handles parsing, updating, and retrieving URL parameters with support for multiple values per parameter.

## Overview

The URLParamsUtils class provides static methods for:
- Parsing URL search parameters into structured objects
- Updating the browser URL without page reload
- Retrieving current URL parameters
- Handling multiple values for the same parameter

## Exports

### URLParamsUtils

A utility class with static methods for URL parameter management.

**Signature:**
```tsx
export class URLParamsUtils {
  static parseSearchParams(searchParams: URLSearchParams): Record<string, string | string[]>;
  static updateURL(params: Record<string, string | string[]>): void;
  static getURLParams(): Record<string, string | string[]>;
}
```

## Methods

### parseSearchParams

Parses URLSearchParams into a structured object with support for multiple values.

**Signature:**
```tsx
static parseSearchParams(searchParams: URLSearchParams): Record<string, string | string[]>
```

**Parameters:**
- `searchParams` - URLSearchParams object to parse

**Returns:**
- Object with parameter names as keys and string or string array as values

**Example:**
```tsx
import { URLParamsUtils } from "../../headless/store/utils/url-params";

// URL: ?category=electronics&color=red&color=blue&sort=price-asc
const searchParams = new URLSearchParams(window.location.search);
const params = URLParamsUtils.parseSearchParams(searchParams);

console.log(params);
// Output:
// {
//   category: "electronics",
//   color: ["red", "blue"],
//   sort: "price-asc"
// }
```

### updateURL

Updates the browser URL with new parameters without causing a page reload.

**Signature:**
```tsx
static updateURL(params: Record<string, string | string[]>): void
```

**Parameters:**
- `params` - Object with parameter names and values to update

**Example:**
```tsx
import { URLParamsUtils } from "../../headless/store/utils/url-params";

// Update URL with new filters
URLParamsUtils.updateURL({
  category: "electronics",
  color: ["red", "blue"],
  minPrice: "100",
  maxPrice: "500",
  sort: "price-asc"
});

// URL becomes: /store?category=electronics&color=red&color=blue&minPrice=100&maxPrice=500&sort=price-asc
```

### getURLParams

Retrieves current URL parameters as a structured object.

**Signature:**
```tsx
static getURLParams(): Record<string, string | string[]>
```

**Returns:**
- Object with current URL parameter names and values

**Example:**
```tsx
import { URLParamsUtils } from "../../headless/store/utils/url-params";

// Get current URL parameters
const currentParams = URLParamsUtils.getURLParams();

console.log(currentParams);
// Output based on current URL
// {
//   category: "electronics",
//   sort: "name-asc"
// }
```

## Features

### Multiple Values Support

The utility automatically handles multiple values for the same parameter:

```tsx
// URL: ?color=red&color=blue&color=green
const params = URLParamsUtils.getURLParams();
console.log(params.color); // ["red", "blue", "green"]

// Update with multiple values
URLParamsUtils.updateURL({
  sizes: ["small", "medium", "large"]
});
// URL becomes: ?sizes=small&sizes=medium&sizes=large
```

### Server-Side Safety

The utility safely handles server-side rendering where `window` is not available:

```tsx
// Returns empty object on server-side
const params = URLParamsUtils.getURLParams(); // {} on server, actual params on client
```

### Clean URL Generation

The utility generates clean URLs and removes empty parameters:

```tsx
URLParamsUtils.updateURL({
  category: "electronics",
  color: "", // Empty value will be omitted
  size: []   // Empty array will be omitted
});
// URL becomes: ?category=electronics
```

## Usage Examples

The URLParamsUtils is used throughout the store application:

### In Collection Service
```tsx
// src/headless/store/services/collection-service.ts
import { URLParamsUtils } from "../utils/url-params";

export async function loadCollectionServiceConfig(
  categoryId?: string,
  searchParams?: URLSearchParams
) {
  const urlParams = searchParams 
    ? URLParamsUtils.parseSearchParams(searchParams)
    : URLParamsUtils.getURLParams();
  
  // Parse filters from URL
  const filters = parseFilters(urlParams);
  const sort = urlParams.sort as SortBy || "";
  
  return {
    initialFilters: filters,
    initialSort: sort
  };
}
```

### In Filter Components
```tsx
// Example filter component
import { URLParamsUtils } from "../../headless/store/utils/url-params";

function PriceRangeFilter({ onFilterChange }) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const applyPriceFilter = () => {
    const currentParams = URLParamsUtils.getURLParams();
    
    URLParamsUtils.updateURL({
      ...currentParams,
      minPrice: minPrice || "",
      maxPrice: maxPrice || ""
    });
    
    onFilterChange({
      priceRange: {
        min: parseFloat(minPrice) || 0,
        max: parseFloat(maxPrice) || 999999
      }
    });
  };
  
  return (
    <div>
      <input 
        type="number" 
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Min Price"
      />
      <input 
        type="number" 
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Max Price"
      />
      <button onClick={applyPriceFilter}>Apply</button>
    </div>
  );
}
```

### In Sort Components
```tsx
// Example sort component
import { URLParamsUtils } from "../../headless/store/utils/url-params";

function SortDropdown({ currentSort, onSortChange }) {
  const handleSortChange = (newSort: string) => {
    const currentParams = URLParamsUtils.getURLParams();
    
    URLParamsUtils.updateURL({
      ...currentParams,
      sort: newSort
    });
    
    onSortChange(newSort);
  };
  
  return (
    <select value={currentSort} onChange={(e) => handleSortChange(e.target.value)}>
      <option value="">Default</option>
      <option value="name-asc">Name (A-Z)</option>
      <option value="price-asc">Price (Low to High)</option>
    </select>
  );
}
```

### In Category Components
```tsx
// Example category filter
import { URLParamsUtils } from "../../headless/store/utils/url-params";

function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  const handleCategoryChange = (categoryId: string) => {
    const currentParams = URLParamsUtils.getURLParams();
    
    URLParamsUtils.updateURL({
      ...currentParams,
      category: categoryId
    });
    
    onCategoryChange(categoryId);
  };
  
  return (
    <div>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className={selectedCategory === category.id ? "active" : ""}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
```

### In Astro Pages
```astro
---
// src/pages/store/category/[categorySlug].astro
import { URLParamsUtils } from "../../../headless/store/utils/url-params";

const searchParams = new URLSearchParams(Astro.url.search);
const urlParams = URLParamsUtils.parseSearchParams(searchParams);

// Use URL parameters for initial state
const initialSort = urlParams.sort as string || "";
const initialMinPrice = urlParams.minPrice as string || "";
const initialMaxPrice = urlParams.maxPrice as string || "";
---

<CategoryPage 
  initialSort={initialSort}
  initialMinPrice={initialMinPrice}
  initialMaxPrice={initialMaxPrice}
  client:load
/>
```

## Parameter Conventions

The utility follows these conventions for common store parameters:

### Filter Parameters
- `category` - Selected category ID
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `{optionName}` - Product option filters (e.g., `color`, `size`)

### Sort Parameters
- `sort` - Sort order (`name-asc`, `price-desc`, etc.)

### Search Parameters
- `q` - Search query
- `page` - Page number (if using traditional pagination)

### Example URL
```
/store?category=electronics&color=red&color=blue&minPrice=100&maxPrice=500&sort=price-asc&q=smartphone
```

This would be parsed as:
```tsx
{
  category: "electronics",
  color: ["red", "blue"],
  minPrice: "100",
  maxPrice: "500",
  sort: "price-asc",
  q: "smartphone"
}
``` 
---

# providers

### WixServicesProvider


## Overview

The WixServicesProvider is a comprehensive React provider component that sets up and manages the entire service layer for a Wix-powered application. It integrates multiple services including e-commerce, product management, filtering, categorization, and media handling through Wix's services manager pattern.

This provider acts as the central hub for dependency injection, making all necessary services available throughout the component tree. It supports both standalone usage and integration with store layouts, providing flexibility for different application architectures. The provider uses the services manager pattern to ensure proper service lifecycle management and dependency resolution.

## Exports

### `WixServicesProviderProps`
**Type**: `interface`

Props interface for the WixServicesProvider component.
- `children`: ReactNode - Child components to be wrapped by the provider
- `showCartIcon?`: boolean - Optional flag to show cart icon in header for mini cart functionality

### `WixServicesProvider` (default export)
**Type**: `React.FC<WixServicesProviderProps>`

The main provider component that initializes and provides access to all Wix services including product management, cart functionality, filtering, categorization, sorting, media gallery, and catalog services.

## Usage Examples

### Complete Application Setup
```tsx
import WixServicesProvider from './providers/WixServicesProvider';
import { ProductList } from './components/store/ProductList';
import { Cart } from './components/ecom/Cart';

function EcommerceApp() {
  return (
    <WixServicesProvider showCartIcon={true}>
      <main>
        <ProductList />
        <Cart />
      </main>
    </WixServicesProvider>
  );
}
```

---

