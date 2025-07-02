# Headless Components Documentation

# components

### NavigationContext


## Overview

The NavigationContext provides a flexible navigation system that allows applications to use different navigation implementations (like React Router, Next.js Router, or simple anchor tags) throughout the application. It uses React Context to provide a consistent navigation interface while allowing the underlying navigation mechanism to be swapped out easily.

This system is particularly useful for component libraries or applications that need to support multiple routing systems, or when building components that should work in different navigation environments without tight coupling to specific router implementations.

## Exports

### `NavigationProps`
**Type**: `interface`

Props interface for navigation components including route destination, children content, and additional props that will be passed through to the underlying navigation implementation.

### `NavigationComponent`
**Type**: `React.ComponentType<NavigationProps>`

Type definition for navigation components that can be used with the navigation context. Must accept NavigationProps and render appropriate navigation elements.

### `NavigationProvider`
**Type**: `React.FC<NavigationProviderProps>`

Provider component that sets up the navigation context with a specific navigation implementation. Defaults to anchor tag navigation if no custom component is provided.

### `useNavigation`
**Type**: `() => NavigationComponent`

Hook that returns the current navigation component from context. Returns default anchor tag navigation if used outside of provider context.

### `DefaultNavigationComponent`
**Type**: `NavigationComponent`

Default navigation implementation that renders standard anchor tags. Used as fallback when no custom navigation component is provided.

## Usage Examples

### Basic Setup with Default Navigation
```tsx
import { NavigationProvider, useNavigation } from './components/NavigationContext';

function App() {
  return (
    <NavigationProvider>
      <Header />
      <MainContent />
    </NavigationProvider>
  );
}

function Header() {
  const Navigation = useNavigation();
  
  return (
    <nav>
      <Navigation route="/">Home</Navigation>
      <Navigation route="/about">About</Navigation>
      <Navigation route="/contact">Contact</Navigation>
    </nav>
  );
}
```

### With React Router Integration
```tsx
import { NavigationProvider } from './components/NavigationContext';
import { Link } from 'react-router-dom';

const ReactRouterNavigation = ({ route, children, ...props }) => (
  <Link to={route} {...props}>
    {children}
  </Link>
);

function App() {
  return (
    <NavigationProvider navigationComponent={ReactRouterNavigation}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
        </Routes>
      </BrowserRouter>
    </NavigationProvider>
  );
}
```

### With Next.js Integration
```tsx
import { NavigationProvider } from './components/NavigationContext';
import Link from 'next/link';

const NextJsNavigation = ({ route, children, ...props }) => (
  <Link href={route}>
    <a {...props}>{children}</a>
  </Link>
);

function MyApp({ Component, pageProps }) {
  return (
    <NavigationProvider navigationComponent={NextJsNavigation}>
      <Component {...pageProps} />
    </NavigationProvider>
  );
}
```

---

## ecom

#### Cart


## Overview

The Cart component provides a comprehensive shopping cart interface for e-commerce applications. It displays cart items, handles quantity management, shows order summaries, and integrates with Wix's cart services for full e-commerce functionality. The component includes loading states, empty cart messaging, item management controls, order notes, coupon application, and checkout initiation.

This component is designed as a full-page cart experience with responsive design, supporting product images, variant displays, pricing information, and a complete checkout flow. It integrates seamlessly with Wix's headless commerce components and provides a polished shopping cart user experience.

## Exports

### `CartContent` (default export)
**Type**: `React.FC`

The main cart component that renders the complete shopping cart interface including item list, quantity controls, order summary, and checkout functionality. Uses Wix's CurrentCart headless components for state management.

## Usage Examples

### Embedded in Checkout Flow
```tsx
import CartContent from './components/ecom/Cart';
import { useState } from 'react';

function CheckoutFlow() {
  const [step, setStep] = useState(1);
  
  return (
    <div className="checkout-flow">
      <div className="steps-indicator">
        <span className={step === 1 ? 'active' : ''}>1. Cart</span>
        <span className={step === 2 ? 'active' : ''}>2. Shipping</span>
        <span className={step === 3 ? 'active' : ''}>3. Payment</span>
      </div>
      
      {step === 1 && (
        <div>
          <CartContent />
          <button onClick={() => setStep(2)}>
            Continue to Shipping
          </button>
        </div>
      )}
      
      {step === 2 && <ShippingForm />}
      {step === 3 && <PaymentForm />}
    </div>
  );
}
```

---

#### MiniCart


## Overview

The MiniCart components provide a compact shopping cart interface that displays as a slide-out panel from the right side of the screen. This includes a cart icon with item count badge and a detailed cart sidebar showing items, quantities, pricing, and checkout functionality. The components are designed for optimal user experience in e-commerce applications where users need quick access to their cart without leaving the current page.

The MiniCart system consists of multiple components that work together: a floating cart icon, a modal cart content area, and an internal coupon form. All components integrate with Wix's headless cart services and provide responsive design suitable for both desktop and mobile experiences.

## Exports

### `CouponFormMini`
**Type**: `React.FC<{ onApply: (code: string) => void; isLoading: boolean }>`

Internal component that provides a collapsible coupon code input form within the mini cart. Initially shows as a "Have a promo code?" link that expands to show input field and apply/cancel actions.

### `MiniCartIcon`
**Type**: `React.FC`

Fixed positioned cart icon component that displays in the top-right corner of the screen. Shows cart item count as a badge and triggers the mini cart modal when clicked.

### `MiniCartContent`
**Type**: `React.FC`

Main mini cart modal component that slides in from the right side. Displays cart items, quantities, pricing, coupon form, and checkout/continue shopping buttons in a responsive sidebar format.

## Usage Examples

### Full E-commerce Implementation
```tsx
import { MiniCartIcon, MiniCartContent } from './components/ecom/MiniCart';
import { ProductList } from './components/store/ProductList';
import { WixServicesProvider } from './providers/WixServicesProvider';

function EcommerceStore() {
  return (
    <WixServicesProvider showCartIcon={false}>
      <div className="store-layout">
        <header className="store-header">
          <h1>My Store</h1>
          <nav>
            <a href="/store">Products</a>
            <a href="/categories">Categories</a>
          </nav>
        </header>
        
        <main className="store-main">
          <ProductList />
        </main>
        
        <footer className="store-footer">
          <p>&copy; 2023 My Store</p>
        </footer>
        
        {/* MiniCart overlay */}
        <MiniCartIcon />
        <MiniCartContent />
      </div>
    </WixServicesProvider>
  );
}
```

---

## store

#### CategoryPicker


## Overview

The `CategoryPicker` component provides category filtering functionality for store pages. It displays a horizontal scrollable list of category buttons and integrates with Wix's category service to manage category selection. The component includes both a presentational component and a context-aware wrapper that connects to the store's category state.

## Exports

### CategoryPicker

```typescript
interface CategoryPickerProps {
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategory: string | null;
  categories: categories.Category[];
  className?: string;
}

function CategoryPicker({
  onCategorySelect,
  selectedCategory,
  categories,
  className = "",
}: CategoryPickerProps): JSX.Element | null
```

Presentational component that renders category buttons based on provided data.

**Props:**
- `onCategorySelect`: Function to handle category selection
- `selectedCategory`: Currently selected category ID
- `categories`: Array of category objects from Wix
- `className`: Optional CSS classes for styling

### CategoryPickerWithContext (Default Export)

```typescript
interface CategoryPickerWithContextProps {
  className?: string;
}

function CategoryPickerWithContext({ className }: CategoryPickerWithContextProps): JSX.Element
```

Context-aware wrapper that provides category data and state management through Wix's Category components.

**Props:**
- `className`: Optional CSS classes for styling

## Usage Examples

### Direct CategoryPicker Usage

```typescript
import { CategoryPicker } from './components/store/CategoryPicker';

function CustomCategoryInterface() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load categories from API
    loadCategories().then(setCategories);
  }, []);

  return (
    <CategoryPicker
      categories={categories}
      selectedCategory={selectedCategory}
      onCategorySelect={setSelectedCategory}
    />
  );
}
```

## Key Features

- **Horizontal Scrolling**: Categories scroll horizontally on mobile devices
- **Auto-Selection**: Automatically selects first category if none is selected
- **Active State**: Visual feedback for selected category with scaling and color changes
- **Context Integration**: Seamlessly integrates with Wix's Category context
- **Responsive Design**: Adapts to different screen sizes with flex-wrap
- **Empty State Handling**: Returns null when no categories are available
- **Smooth Transitions**: CSS transitions for hover and selection states
- **Accessibility**: Proper button semantics and keyboard navigation
- **Scrollbar Hiding**: Clean appearance with hidden scrollbars on mobile

## Dependencies

- **@wix/categories**: Wix SDK for category types and data
- **Category components**: Headless category components for state management

The component provides both controlled (CategoryPicker) and uncontrolled (CategoryPickerWithContext) variants for different use cases.

---

#### ProductActionButtons


## Overview

The `ProductActionButtons` component provides action buttons for product interactions, specifically "Add to Cart" and "Buy Now" functionality. It handles different product states including stock availability, pre-order scenarios, and loading states. The component integrates with Wix's cart service to manage cart operations and checkout flow.

## Exports

### ProductActionButtons (Default Export)

```typescript
interface ProductActionButtonsProps {
  onAddToCart: () => Promise<void>;
  canAddToCart: boolean;
  isLoading: boolean;
  isPreOrderEnabled: boolean;
  inStock: boolean;
  onShowSuccessMessage: (show: boolean) => void;
}

const ProductActionButtons: React.FC<ProductActionButtonsProps>
```

Main component that renders product action buttons with appropriate states and behaviors.

**Props:**
- `onAddToCart`: Function to handle adding product to cart
- `canAddToCart`: Whether the product can be added to cart
- `isLoading`: Loading state for button interactions
- `isPreOrderEnabled`: Whether pre-order is enabled for the product
- `inStock`: Whether the product is in stock
- `onShowSuccessMessage`: Callback to show/hide success messages

### AddToCartButton

```typescript
interface AddToCartButtonProps extends BaseButtonProps {
  isPreOrderEnabled: boolean;
  inStock: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps>
```

Button component for adding products to cart or pre-ordering. Displays different text based on stock status and pre-order availability.

### BuyNowButton

```typescript
interface BuyNowButtonProps {
  disabled: boolean;
  isLoading: boolean;
  onAddToCart: () => Promise<void>;
  className?: string;
}

const BuyNowButton: React.FC<BuyNowButtonProps>
```

Button component for immediate purchase that clears the cart, adds the product, and proceeds to checkout.

## Usage Examples

### Pre-Order Product

```typescript
import { ProductActionButtons } from './components/store/ProductActionButtons';

function PreOrderProduct() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePreOrder = async () => {
    setIsLoading(true);
    try {
      await preOrderService.addPreOrder(productId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductActionButtons
      onAddToCart={handlePreOrder}
      canAddToCart={true}
      isLoading={isLoading}
      isPreOrderEnabled={true}
      inStock={false}
      onShowSuccessMessage={() => {}}
    />
  );
}
```

## Key Features

- **Dual Action Support**: Provides both "Add to Cart" and "Buy Now" functionality
- **State Management**: Handles loading, disabled, and success states
- **Pre-Order Support**: Adapts button text and behavior for pre-order products
- **Stock Awareness**: Only shows "Buy Now" for in-stock items
- **Visual Feedback**: Includes loading spinners and hover effects
- **Cart Integration**: Integrates with Wix cart service for immediate purchase flow
- **Success Messaging**: Provides callback for showing success notifications
- **Responsive Design**: Buttons adapt to different screen sizes with proper styling

---

#### ProductDetails


## Overview

The ProductDetails component provides a comprehensive product detail page interface for e-commerce applications. It displays product information including images in a gallery format, pricing, descriptions, variant selection, product modifiers, and purchase options. The component integrates with Wix's headless commerce services to provide real-time product data, variant management, and cart functionality.

This component serves as the main product detail page and includes features like image galleries with thumbnails, variant selection for options like size and color, product modifiers for customization, pricing display with compare-at pricing, and integration with cart services for adding products to cart.

## Exports

### `FreeTextInput`
**Type**: `React.FC<{ modifier: any; name: string }>`

Reusable component for handling free text input modifiers. Provides a textarea with character counting and validation for custom product personalization options.

### `ProductDetails` (default export)
**Type**: `React.FC<{ setShowSuccessMessage?: (show: boolean) => void; cartUrl?: string }>`

Main product details component that renders the complete product information interface including media gallery, product information, variant selection, modifiers, and purchase options.

## Usage Examples

### In Store Layout
```tsx
import ProductDetails from './components/store/ProductDetails';
import { StoreLayout } from './layouts/StoreLayout';

function ProductPage() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  return (
    <StoreLayout 
      currentCartServiceConfig={null}
      showSuccessMessage={showSuccessMessage}
      onSuccessMessageChange={setShowSuccessMessage}
    >
      <div className="product-detail-page">
        <ProductDetails setShowSuccessMessage={setShowSuccessMessage} />
      </div>
    </StoreLayout>
  );
}
```

---

#### ProductFilters


## Overview

The `ProductFilters` component provides comprehensive filtering functionality for product listings. It includes price range filtering with dual sliders, product option filtering (including color swatches), and filter management controls. The component supports both mobile and desktop layouts with collapsible sections and integrates with Wix's filtering services.

## Exports

### ProductFilters (Default Export)

```typescript
interface ProductFiltersProps {
  onFiltersChange: (filters: {
    priceRange: { min: number; max: number };
    selectedOptions: { [optionId: string]: string[] };
  }) => void;
  className?: string;
  availableOptions: {
    productOptions: Array<{
      id: string;
      name: string;
      choices: Array<{ id: string; name: string; colorCode?: string }>;
      optionRenderType?: string;
    }>;
    priceRange: { min: number; max: number };
  };
  currentFilters: {
    priceRange: { min: number; max: number };
    selectedOptions: { [optionId: string]: string[] };
  };
  clearFilters: () => void;
  isFiltered: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps>
```

Main filtering component that renders price range slider and product option filters.

**Props:**
- `onFiltersChange`: Callback function when filters are updated
- `className`: Optional CSS classes for styling
- `availableOptions`: Available filtering options and price range
- `currentFilters`: Current filter selections
- `clearFilters`: Function to clear all filters
- `isFiltered`: Whether any filters are currently applied

## Usage Examples

### Mobile-Responsive Layout

```typescript
import ProductFilters from './components/store/ProductFilters';

function ResponsiveStorePage() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container mx-auto">
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary w-full"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar / Mobile overlay */}
        <div className={`
          lg:w-80 lg:block
          ${showFilters ? 'fixed inset-0 z-50 bg-white p-4' : 'hidden'}
        `}>
          <ProductFilters
            onFiltersChange={handleFiltersChange}
            availableOptions={options}
            currentFilters={filters}
            clearFilters={clearAllFilters}
            isFiltered={hasActiveFilters}
            className="h-full overflow-y-auto"
          />
        </div>

        <main className="flex-1">
          <ProductGrid />
        </main>
      </div>
    </div>
  );
}
```

## Key Features

- **Dual Range Slider**: Interactive price range selection with visual feedback
- **Color Swatches**: Visual color selection with hover tooltips
- **Checkbox Options**: Standard checkbox selection for text-based options
- **Mobile Responsive**: Collapsible interface for mobile devices
- **Real-time Updates**: Immediate filter application as user interacts
- **Clear Filters**: One-click option to reset all filters
- **Manual Price Input**: Number inputs for precise price range setting
- **Visual States**: Hover, focus, and selection states for all controls
- **Overflow Handling**: Scrollable areas for long option lists
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Filter Types Supported

### Price Range Filter
- Dual slider interface
- Manual number input
- Real-time visual feedback
- Validation to prevent invalid ranges

### Product Option Filters
- **SWATCH_CHOICES**: Color swatches with hover tooltips
- **Standard Options**: Checkbox lists with scrolling
- Multi-selection support
- Dynamic option availability

### Filter States
- Active/inactive visual states
- Loading states during filter application
- Empty state messaging
- Filter count indicators

## Dependencies

- **filter-service**: TypeScript types and interfaces for filtering
- **React hooks**: useState, useCallback, useEffect for state management
- **CSS custom properties**: Theme-aware styling system

The component provides a comprehensive filtering solution that adapts to different product types and user interface requirements.

---

#### ProductList


## Overview

The ProductList component provides a comprehensive product catalog interface for e-commerce applications. It displays products in a responsive grid layout with advanced filtering capabilities, search functionality, and infinite scroll loading. The component integrates with Wix's headless store services to provide real-time product data, filtering, and pagination.

This component serves as the main product browsing interface and includes features like product cards with images, pricing, options display, filter sidebar, loading states, empty states, and load more functionality. It's designed to work seamlessly with the broader store ecosystem and provides a complete product discovery experience.

## Exports

### `ProductGridContent`
**Type**: `React.FC<{ productPageRoute: string }>`

Core component that renders the product grid with filtering sidebar. Handles product display, filter integration, loading states, and navigation setup using the FilteredCollection headless components.

### `LoadMoreSection`
**Type**: `React.FC`

Component that handles infinite scroll functionality and load more actions. Provides buttons for loading additional products and refreshing the current product set.

### `ProductList` (default export)
**Type**: `React.FC<{ productPageRoute: string }>`

Main component that combines the product grid and load more functionality into a complete product listing interface.

## Usage Examples

### Collection-Based Product Display
```tsx
import ProductList from './components/store/ProductList';

function CollectionPage({ collectionId, collectionName }) {
  return (
    <div className="collection-page">
      <div className="collection-hero mb-8">
        <h1 className="text-4xl font-bold">{collectionName}</h1>
        <p className="text-lg text-gray-600 mt-2">
          Curated selection from our {collectionName.toLowerCase()} collection
        </p>
      </div>
      
      <ProductList productPageRoute={`/collections/${collectionId}`} />
    </div>
  );
}
```

---

#### SortDropdown


## Overview

The `SortDropdown` component provides sorting functionality for store product lists. It renders a styled dropdown select element that allows users to sort products by various criteria including name, price, and latest arrivals. The component integrates with Wix's Sort service to manage sorting state and updates.

## Exports

### SortDropdownContent

```typescript
interface SortDropdownContentProps {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  className?: string;
}

function SortDropdownContent({
  sortBy,
  setSortBy,
  className = "",
}: SortDropdownContentProps): JSX.Element
```

Presentational component that renders the actual dropdown with sort options.

**Props:**
- `sortBy`: Current sort option value
- `setSortBy`: Function to update the sort option
- `className`: Optional CSS classes for styling

### SortDropdown (Default Export)

```typescript
interface SortDropdownProps {
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps>
```

Context-aware wrapper that provides sort state management through Wix's Sort components.

**Props:**
- `className`: Optional CSS classes for styling

## Usage Examples

### Mobile-Responsive Layout

```typescript
import SortDropdown from './components/store/SortDropdown';

function ResponsiveProductPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Our Products</h1>
        <SortDropdown className="w-full md:w-auto" />
      </div>
      <div className="product-grid">
        {/* Products */}
      </div>
    </div>
  );
}
```

## Sort Options Available

The dropdown provides the following sorting options:

- **Latest Arrivals** (`""`) - Default option, shows newest products first
- **Name (A-Z)** (`"name-asc"`) - Alphabetical order by product name
- **Name (Z-A)** (`"name-desc"`) - Reverse alphabetical order
- **Price (Low to High)** (`"price-asc"`) - Ascending price order
- **Price (High to Low)** (`"price-desc"`) - Descending price order

## Key Features

- **Multiple Sort Options**: Supports sorting by name, price, and recency
- **Custom Styling**: Styled dropdown with custom arrow and focus states
- **Context Integration**: Seamlessly integrates with Wix's Sort context
- **Responsive Design**: Adapts to different screen sizes
- **Accessible**: Proper select semantics and keyboard navigation
- **Visual Feedback**: Focus ring and hover states for better UX
- **Theme Support**: Uses CSS custom properties for theming
- **Minimal Width**: Ensures consistent dropdown size across different content

## Dependencies

- **Sort components**: Headless sort components for state management
- **SortBy type**: TypeScript type definitions for sort options

The component provides a clean interface for product sorting that integrates with the broader store filtering system.

---

#### StoreHeader


## Overview

The `StoreHeader` component provides a header section for store pages that contains filtering and sorting controls. It combines the category picker and sort dropdown in a styled container with a backdrop blur effect and proper spacing.

## Exports

### StoreHeader (Default Export)

```typescript
interface StoreHeaderProps {
  className?: string;
}

function StoreHeader({ className }: StoreHeaderProps): JSX.Element
```

A header component that renders category filtering and sorting controls in a styled container.

**Props:**
- `className`: Optional additional CSS classes to apply to the header container

## Usage Examples

### Responsive Store Header

```typescript
import StoreHeader from './components/store/StoreHeader';

function ResponsiveStorePage() {
  return (
    <div className="container mx-auto">
      <StoreHeader className="lg:mx-0 mx-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Products */}
      </div>
    </div>
  );
}
```

## Key Features

- **Integrated Controls**: Combines category filtering and sorting in one header
- **Styled Container**: Provides consistent styling with backdrop blur and border
- **Flexible Positioning**: Accepts custom className for positioning and additional styling
- **Responsive Design**: Layout adapts to different screen sizes through flexbox
- **Clean Interface**: Minimal design that doesn't compete with product content
- **Reusable Component**: Can be used across different store pages and layouts

## Dependencies

- **CategoryFilter**: Component for category selection
- **SortDropdown**: Component for sorting options

The component acts as a composition of these child components, providing a consistent header interface for store functionality.

---

# headless

## ecom

### services

##### current cart service


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

---

## store

### components

##### Collection


## Overview

The Collection headless component provides render-prop based components for managing and displaying product collections. It includes components for product grids, individual items, load more functionality, collection headers, and actions. The component integrates with the CollectionService to provide reactive product data with comprehensive error handling and loading states.

## Exports

### Grid

```typescript
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

const Grid: React.FC<GridProps>
```

Headless component for product grid display with loading and error states.

**Render Props:**
- `products`: Array of product objects
- `isLoading`: Loading state indicator
- `error`: Error message if any
- `isEmpty`: Whether the collection is empty
- `totalProducts`: Total number of products
- `hasProducts`: Whether collection has any products

### Item

```typescript
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

const Item: React.FC<ItemProps>
```

Headless component for individual product item display.

**Props:**
- `product`: Product data object
- `children`: Render prop function

**Render Props:**
- `id`: Product ID
- `title`: Product name
- `slug`: URL-friendly product slug
- `image`: Main product image URL
- `price`: Formatted price string
- `compareAtPrice`: Original price for comparison
- `description`: Product description
- `available`: Availability status
- `href`: Product detail page URL

### LoadMore

```typescript
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

const LoadMore: React.FC<LoadMoreProps>
```

Headless component for load more functionality.

**Render Props:**
- `loadMore`: Function to load additional products
- `refresh`: Function to refresh the collection
- `isLoading`: Loading state
- `hasProducts`: Whether products exist
- `totalProducts`: Current number of loaded products
- `hasMoreProducts`: Whether more products are available

### Header

```typescript
interface HeaderProps {
  children: (props: HeaderRenderProps) => React.ReactNode;
}

interface HeaderRenderProps {
  totalProducts: number;
  isLoading: boolean;
  hasProducts: boolean;
}

const Header: React.FC<HeaderProps>
```

Headless component for collection header with product count.

**Render Props:**
- `totalProducts`: Total number of products
- `isLoading`: Loading state
- `hasProducts`: Whether products exist

### Actions

```typescript
interface ActionsProps {
  children: (props: ActionsRenderProps) => React.ReactNode;
}

interface ActionsRenderProps {
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const Actions: React.FC<ActionsProps>
```

Headless component for collection actions.

**Render Props:**
- `refresh`: Function to refresh collection
- `loadMore`: Function to load more products
- `isLoading`: Loading state
- `error`: Error message if any

## Usage Examples

### Responsive Product List

```typescript
import { Collection } from './headless/store/components';

function ResponsiveProductList() {
  return (
    <div className="responsive-collection">
      <Collection.Header>
        {({ totalProducts, hasProducts }) => (
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            {hasProducts && (
              <span className="text-gray-600">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
              </span>
            )}
          </div>
        )}
      </Collection.Header>

      <Collection.Grid>
        {({ products, isLoading, error, isEmpty }) => {
          if (isLoading) {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded"></div>
                    <div className="mt-2 bg-gray-200 h-4 rounded"></div>
                    <div className="mt-1 bg-gray-200 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            );
          }

          if (error) {
            return (
              <div className="text-center py-8">
                <p className="text-red-600">Failed to load products</p>
                <Collection.Actions>
                  {({ refresh }) => (
                    <button 
                      onClick={refresh}
                      className="mt-4 btn-primary"
                    >
                      Try Again
                    </button>
                  )}
                </Collection.Actions>
              </div>
            );
          }

          if (isEmpty) {
            return (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found</p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Collection.Item key={product._id} product={product}>
                  {(itemProps) => <ProductCard {...itemProps} />}
                </Collection.Item>
              ))}
            </div>
          );
        }}
      </Collection.Grid>
    </div>
  );
}
```

## Key Features

- **Render Props Pattern**: Maximum flexibility for UI implementation
- **Error Handling**: Comprehensive error boundaries and fallback states
- **Loading States**: Built-in loading indicators and skeleton screens
- **Responsive Design**: Adapts to different screen sizes and layouts
- **Type Safety**: Full TypeScript support for all props and render props
- **Service Integration**: Seamless integration with CollectionService
- **Price Formatting**: Automatic price formatting with compare-at prices
- **Availability Checking**: Stock status and availability indicators
- **URL Generation**: Automatic product detail page URLs

## Dependencies

- **CollectionServiceDefinition**: Service for collection data management
- **@wix/stores**: Wix Stores SDK for product types
- **@wix/services-manager-react**: React integration for service management

The components provide a complete headless solution for product collection display with robust error handling and flexible rendering options.

---

##### Product


## Overview

The Product headless component provides render-prop based components for displaying product information. It includes components for product name and description display, integrating with the ProductService to provide reactive product data. These components follow the headless pattern, allowing complete control over rendering while providing the data and logic.

## Exports

### Name

```typescript
interface ProductNameProps {
  children: (props: ProductNameRenderProps) => React.ReactNode;
}

interface ProductNameRenderProps {
  name: string;
}

const Name: React.FC<ProductNameProps>
```

Headless component for product name display.

**Props:**
- `children`: Render prop function that receives product name data

**Render Props:**
- `name`: Product name string

### Description

```typescript
interface ProductDescriptionProps {
  children: (props: ProductDescriptionRenderProps) => React.ReactNode;
}

interface ProductDescriptionRenderProps {
  description: NonNullable<productsV3.V3Product["description"]>;
  plainDescription: NonNullable<productsV3.V3Product["plainDescription"]>;
}

const Description: React.FC<ProductDescriptionProps>
```

Headless component for product description display.

**Props:**
- `children`: Render prop function that receives product description data

**Render Props:**
- `description`: Rich text description (may contain HTML)
- `plainDescription`: Plain text version of description

## Usage Examples

### SEO-Optimized Product Info

```typescript
import { Product } from './headless/store/components';

function SEOProductInfo() {
  return (
    <>
      <Product.Name>
        {({ name }) => (
          <>
            <h1 className="sr-only">{name}</h1>
            <div className="product-name" itemProp="name">
              {name}
            </div>
          </>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ plainDescription }) => (
          <meta name="description" content={plainDescription} />
        )}
      </Product.Description>
    </>
  );
}
```

## Key Features

- **Render Props Pattern**: Provides maximum flexibility for UI implementation
- **Rich Content Support**: Handles both HTML and plain text descriptions
- **Service Integration**: Automatically connects to ProductService for data
- **Type Safety**: Full TypeScript support for all props and render props
- **Reactive Updates**: Automatically re-renders when product data changes
- **SEO Friendly**: Supports proper semantic HTML structure
- **Fallback Handling**: Graceful handling of missing or empty content

## Dependencies

- **ProductServiceDefinition**: Service for product data management
- **@wix/stores**: Wix Stores SDK for product types
- **@wix/services-manager-react**: React integration for service management

The components provide a clean, headless approach to product information display with full control over presentation and styling.

---

### services

##### category service


## Overview

The `CategoryService` provides category management functionality for store applications. It handles category selection, loading categories from Wix's categories API, and managing category state through reactive signals. The service supports initial category selection, category change callbacks, and automatic category loading with proper error handling.

## Exports

### CategoryServiceAPI

```typescript
interface CategoryServiceAPI {
  selectedCategory: Signal<string | null>;
  categories: Signal<categories.Category[]>;
  setSelectedCategory: (categoryId: string | null) => void;
  loadCategories: () => Promise<void>;
}
```

Interface defining the category service API with signals for reactive state management.

### CategoryServiceDefinition

```typescript
const CategoryServiceDefinition = defineService<CategoryServiceAPI>("category-service")
```

Service definition for dependency injection and service registration.

### CategoryServiceConfig

```typescript
interface CategoryServiceConfig {
  categories: categories.Category[];
  initialCategoryId?: string | null;
  onCategoryChange?: (categoryId: string | null, category: categories.Category | null) => void;
}
```

Configuration interface for initializing the category service.

**Properties:**
- `categories`: Initial categories array
- `initialCategoryId`: Optional initial selected category ID
- `onCategoryChange`: Optional callback for category change events

### CategoryService

```typescript
const CategoryService = implementService.withConfig<CategoryServiceConfig>()(
  CategoryServiceDefinition,
  ({ getService, config }) => CategoryServiceAPI
)
```

Service implementation with configuration support.

### loadCategoriesConfig

```typescript
async function loadCategoriesConfig(): Promise<{
  categories: categories.Category[];
}>
```

Utility function to load categories from Wix's categories API with automatic sorting.

## Usage Examples

### Category Filter Integration

```typescript
import { CategoryServiceDefinition } from './headless/store/services/category-service';
import { ProductServiceDefinition } from './product-service';

function CategoryFilteredProducts() {
  const categoryService = useService(CategoryServiceDefinition);
  const productService = useService(ProductServiceDefinition);
  
  // Update product filter when category changes
  useEffect(() => {
    const unsubscribe = categoryService.selectedCategory.subscribe(categoryId => {
      productService.setFilter({
        categoryId,
      });
    });
    
    return unsubscribe;
  }, []);

  return <ProductGrid />;
}
```

## Key Features

- **Reactive State**: Uses signals for reactive category state management
- **Navigation Support**: Optional callback for handling category navigation
- **Auto-Loading**: Built-in category loading from Wix Categories API
- **Initial Selection**: Support for setting initial category on service creation
- **Error Handling**: Graceful error handling with fallback empty categories
- **Category Sorting**: Automatically sorts categories with "all-products" first
- **Visibility Filtering**: Only loads visible categories from the API
- **Side Effect Management**: Prevents navigation during initial service setup

## API Integration

The service integrates with Wix's Categories API:
- Queries categories with `@wix/stores` namespace
- Filters for visible categories only
- Handles API errors gracefully
- Provides structured category data

## Dependencies

- **@wix/services-definitions**: Service definition framework
- **@wix/categories**: Wix Categories SDK
- **SignalsServiceDefinition**: For reactive state management

The service provides a complete category management solution with reactive state, API integration, and navigation support.

---

##### filter service


## Overview

The FilterService is a comprehensive headless service that manages product filtering functionality in e-commerce applications. It handles price range filters, product option filters (like size, color, etc.), and integrates with catalog services to provide real-time filtering capabilities. The service manages filter state, URL synchronization, and coordinates with other services to provide a complete filtering experience.

This service uses Wix's signals system for reactive state management and automatically updates the URL to reflect current filter states. It subscribes to catalog price range and options services to provide accurate filtering options and maintains consistency between the UI and the underlying data.

## Exports

### `ProductOption`
**Type**: `interface`

Interface defining product option structure including option ID, name, available choices, and rendering preferences for UI components.

### `PriceRange`
**Type**: `interface`

Interface defining price range structure with minimum and maximum values for price filtering functionality.

### `AvailableOptions`
**Type**: `interface`

Interface defining the complete set of available filtering options including product options and price range information.

### `Filter`
**Type**: `interface`

Interface defining the current filter state including selected price range and chosen option values.

### `FilterServiceAPI`
**Type**: `interface`

Complete API interface for the filter service including signals for state management and methods for filter operations.

### `FilterServiceDefinition`
**Type**: `ServiceDefinition<FilterServiceAPI>`

Service definition that identifies and types the filter service within Wix's service manager system.

### `FilterService`
**Type**: `ServiceImplementation<FilterServiceAPI>`

Main service implementation providing all filtering functionality including state management, filter application, and URL synchronization.

### `defaultFilter`
**Type**: `Filter`

Default filter configuration with empty price range and no selected options.

## Usage Examples

### Filter Integration with Product List
```tsx
function ProductListWithFilters() {
  const filterService = useService(FilterServiceDefinition);
  const productService = useService(ProductListServiceDefinition);
  
  const currentFilters = filterService.currentFilters.use();
  const products = productService.products.use();
  
  useEffect(() => {
    // Load catalog options and price range when component mounts
    filterService.loadCatalogOptions();
    filterService.loadCatalogPriceRange();
  }, []);
  
  useEffect(() => {
    // Apply filters to product service when filters change
    productService.applyFilters(currentFilters);
  }, [currentFilters]);
  
  return (
    <div className="product-list-page">
      <aside className="filters-sidebar">
        <FilterComponent />
      </aside>
      
      <main className="products-main">
        <div className="products-header">
          <h2>Products ({products.length})</h2>
          <FilterSummary />
        </div>
        <ProductGrid products={products} />
      </main>
    </div>
  );
}
```

---

##### product service


## Overview

The ProductService is a headless service that manages individual product data and loading operations in a Wix e-commerce application. It provides reactive state management for product information, loading states, and error handling when fetching product details by slug. The service integrates with Wix's stores API to fetch comprehensive product data including descriptions, categories, media, and variant information.

This service follows the Wix services pattern and uses signals for reactive state updates. It's designed to be used in product detail pages where a single product needs to be loaded and displayed with full information.

## Exports

### `ProductServiceAPI`
**Type**: `interface`

TypeScript interface defining the API surface for product operations, including reactive signals for product state and methods for loading products.

### `ProductServiceDefinition`
**Type**: `ServiceDefinition<ProductServiceAPI>`

Service definition that identifies and types the product service within Wix's service manager system.

### `ProductService`
**Type**: `ServiceImplementation<ProductServiceAPI>`

Main service implementation that provides product loading functionality and reactive state management.

### `ProductServiceConfigResult`
**Type**: `{ type: "success"; config: ServiceFactoryConfig<typeof ProductService> } | { type: "notFound" }`

Type union representing the result of loading product configuration, either successful with config data or indicating the product was not found.

### `loadProductServiceConfig`
**Type**: `(productSlug: string) => Promise<ProductServiceConfigResult>`

Async function that loads product configuration by slug, handling not-found cases and returning appropriate result types.

## Usage Examples

### Server-Side Product Loading (Astro)
```typescript
// In an Astro page or API route
import { loadProductServiceConfig } from './headless/store/services/product-service';

export async function getStaticPaths() {
  // Generate paths for all products
  return [
    { params: { slug: 'product-1' } },
    { params: { slug: 'product-2' } },
  ];
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const configResult = await loadProductServiceConfig(slug);
  
  if (configResult.type === 'notFound') {
    return { notFound: true };
  }
  
  return {
    props: {
      productConfig: configResult.config,
    },
  };
}
```

---

##### related products service


## Overview

The `RelatedProductsService` provides functionality for loading and managing related product recommendations. It handles fetching products related to a current product, manages loading states, and provides reactive signals for UI updates. This service is commonly used on product detail pages to show similar or recommended products to customers.

## Exports

### RelatedProductsServiceAPI

```typescript
interface RelatedProductsServiceAPI {
  relatedProducts: Signal<productsV3.V3Product[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  hasRelatedProducts: Signal<boolean>;

  loadRelatedProducts: (productId: string, limit?: number) => Promise<void>;
  refreshRelatedProducts: () => Promise<void>;
}
```

Interface defining the related products service API with signals for reactive state management.

### RelatedProductsServiceDefinition

```typescript
const RelatedProductsServiceDefinition = defineService<RelatedProductsServiceAPI>("relatedProducts")
```

Service definition for dependency injection and service registration.

### RelatedProductsService

```typescript
const RelatedProductsService = implementService.withConfig<{
  productId: string;
  limit?: number;
}>()(RelatedProductsServiceDefinition, ({ getService, config }) => RelatedProductsServiceAPI)
```

Service implementation with configuration support for product ID and result limit.

**Config:**
- `productId`: ID of the current product to find related products for
- `limit`: Optional maximum number of related products to fetch (default: 4)

### loadRelatedProductsServiceConfig

```typescript
async function loadRelatedProductsServiceConfig(
  productId: string,
  limit: number = 4
): Promise<ServiceFactoryConfig<typeof RelatedProductsService>>
```

Utility function to create service configuration for related products loading.

## Usage Examples

### Related Products Carousel

```typescript
import { RelatedProductsServiceDefinition } from './headless/store/services/related-products-service';

function RelatedProductsCarousel() {
  const relatedService = useService(RelatedProductsServiceDefinition);
  const relatedProducts = useSignal(relatedService.relatedProducts);
  const isLoading = useSignal(relatedService.isLoading);
  const hasRelatedProducts = useSignal(relatedService.hasRelatedProducts);

  if (!hasRelatedProducts && !isLoading) {
    return null;
  }

  return (
    <div className="related-carousel">
      <h2>Related Products</h2>
      
      {isLoading ? (
        <div className="carousel-loading">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="product-skeleton" />
          ))}
        </div>
      ) : (
        <div className="carousel-container">
          <div className="carousel-track">
            {relatedProducts.map(product => (
              <div key={product._id} className="carousel-item">
                <img src={product.media?.main?.image} alt={product.name} />
                <h4>{product.name}</h4>
                <p className="price">
                  ${product.actualPriceRange?.minValue?.amount}
                </p>
                <button className="quick-add-btn">
                  Quick Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Key Features

- **Reactive State**: Uses signals for reactive related products state management
- **Configurable Limits**: Allows setting the number of related products to fetch
- **Error Handling**: Comprehensive error states with retry functionality
- **Loading States**: Built-in loading indicators for better UX
- **Automatic Exclusion**: Automatically excludes the current product from results
- **Refresh Capability**: Ability to refresh related products on demand
- **Empty State Handling**: Proper handling when no related products are found

## API Integration

The service integrates with Wix's Products V3 API:
- Queries products excluding the current product ID
- Supports limit configuration for result count
- Handles API errors gracefully with fallback states
- Provides structured product data for display

## Dependencies

- **@wix/services-definitions**: Service definition framework
- **@wix/stores**: Wix Stores SDK for product data
- **SignalsServiceDefinition**: For reactive state management

The service provides a complete solution for related product recommendations with reactive state management and robust error handling.

---

##### selected variant service


## Overview

The `SelectedVariantService` is a comprehensive service for managing product variant selection in e-commerce applications. It handles variant choices, inventory tracking, pricing calculations, and integrates with cart functionality. The service provides reactive state management for all variant-related data including options, quantities, stock status, and pricing information.

This service is essential for product detail pages where users need to select product variants (size, color, etc.) and see real-time updates to pricing, availability, and media display.

## Exports

### SelectedVariantServiceAPI

```typescript
interface SelectedVariantServiceAPI {
  // Core variant selection state
  selectedQuantity: Signal<number>;
  selectedChoices: Signal<Record<string, string>>;
  selectedVariantId: ReadOnlySignal<string | null>;
  currentVariant: ReadOnlySignal<productsV3.Variant | null>;
  
  // Pricing signals
  currentPrice: ReadOnlySignal<string>;
  currentCompareAtPrice: ReadOnlySignal<string | null>;
  basePrice: Signal<number>;
  discountPrice: Signal<number | null>;
  isOnSale: Signal<boolean | null>;
  
  // Inventory & availability
  isInStock: ReadOnlySignal<boolean>;
  isPreOrderEnabled: ReadOnlySignal<boolean>;
  quantityAvailable: Signal<number | null>;
  trackQuantity: Signal<boolean>;
  
  // Product data
  product: ReadOnlySignal<productsV3.V3Product | null>;
  productOptions: ReadOnlySignal<productsV3.ConnectedOption[]>;
  variants: Signal<productsV3.Variant[]>;
  options: Signal<Record<string, string[]>>;
  
  // UI state
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  ribbonLabel: Signal<string | null>;
  
  // Utility properties
  productId: Signal<string>;
  currency: ReadOnlySignal<string>;
  
  // Selection methods
  setSelectedChoices: (choices: Record<string, string>) => void;
  setOption: (group: string, value: string) => void;
  selectVariantById: (id: string) => void;
  resetSelections: () => void;
  
  // Quantity methods
  setSelectedQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  
  // Cart integration
  addToCart: (quantity?: number, modifiers?: Record<string, any>) => Promise<void>;
  
  // Computed methods
  selectedVariant: () => productsV3.Variant | null;
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;
  
  // Smart variant selection
  getAvailableChoicesForOption: (optionName: string) => string[];
  getChoiceInfo: (optionName: string, choiceValue: string) => 
    { isAvailable: boolean; isInStock: boolean };
  isChoiceAvailable: (optionName: string, choiceValue: string) => boolean;
  isChoiceInStock: (optionName: string, choiceValue: string) => boolean;
  hasAnySelections: () => boolean;
}
```

### SelectedVariantServiceDefinition

```typescript
const SelectedVariantServiceDefinition = defineService<SelectedVariantServiceAPI>("selectedVariant")
```

Service definition for dependency injection and service registration.

### SelectedVariantService

```typescript
const SelectedVariantService = implementService.withConfig<{}>()(
  SelectedVariantServiceDefinition,
  ({ getService }) => SelectedVariantServiceAPI
)
```

Service implementation that coordinates with product, cart, and media services.

## Usage Examples

### Smart Variant Selection

```typescript
import { SelectedVariantServiceDefinition } from './headless/store/services/selected-variant-service';

function SmartVariantSelector() {
  const variantService = useService(SelectedVariantServiceDefinition);
  const options = useSignal(variantService.options);

  return (
    <div className="smart-selector">
      {Object.entries(options).map(([optionName, choices]) => (
        <div key={optionName} className="option-group">
          <h4>{optionName}</h4>
          <div className="choices">
            {choices.map(choice => {
              const choiceInfo = variantService.getChoiceInfo(optionName, choice);
              return (
                <button
                  key={choice}
                  onClick={() => variantService.setOption(optionName, choice)}
                  className={`choice-btn ${!choiceInfo.isAvailable ? 'unavailable' : ''} ${!choiceInfo.isInStock ? 'out-of-stock' : ''}`}
                  disabled={!choiceInfo.isAvailable}
                >
                  {choice}
                  {!choiceInfo.isInStock && <span className="stock-indicator">Out of Stock</span>}
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

## Key Features

- **Reactive State Management**: All variant data is managed through reactive signals
- **Inventory Integration**: Real-time inventory tracking and stock validation
- **Smart Selection**: Prevents invalid variant combinations
- **Price Calculations**: Automatic price updates based on selected variant
- **Media Integration**: Automatically updates product media based on selections
- **Cart Integration**: Seamless add-to-cart functionality
- **Quantity Management**: Built-in quantity controls with validation
- **Pre-order Support**: Handles pre-order scenarios and availability
- **Stock Alerts**: Low stock warnings and availability checking
- **Error Handling**: Comprehensive error states and loading indicators

## Dependencies

- **@wix/services-definitions**: Service definition framework
- **@wix/stores**: Wix Stores SDK for product and inventory data
- **CurrentCartServiceDefinition**: For cart operations
- **ProductServiceDefinition**: For product data
- **MediaGalleryServiceDefinition**: For media management
- **SignalsServiceDefinition**: For reactive state management

The service provides a complete solution for product variant management with sophisticated state handling and integration capabilities.

---

##### sort service


## Overview

The `SortService` provides sorting functionality for store product listings. It manages sort state through reactive signals, handles URL parameter synchronization, and provides a type-safe interface for different sorting options. The service supports sorting by name (ascending/descending), price (ascending/descending), and default newest-first ordering.

## Exports

### SortBy

```typescript
type SortBy = "" | "name-asc" | "name-desc" | "price-asc" | "price-desc"
```

Type definition for available sorting options:
- `""` (empty string): Latest arrivals/newest first (default)
- `"name-asc"`: Name A-Z
- `"name-desc"`: Name Z-A  
- `"price-asc"`: Price low to high
- `"price-desc"`: Price high to low

### SortServiceAPI

```typescript
interface SortServiceAPI {
  currentSort: Signal<SortBy>;
  setSortBy: (sortBy: SortBy) => Promise<void>;
}
```

Interface defining the sort service API with reactive state and sorting method.

### SortServiceDefinition

```typescript
const SortServiceDefinition = defineService<SortServiceAPI>("sort")
```

Service definition for dependency injection and service registration.

### defaultSort

```typescript
const defaultSort: SortBy = ""
```

Default sort option (newest first).

### SortService

```typescript
const SortService = implementService.withConfig<{
  initialSort?: SortBy;
}>()(SortServiceDefinition, ({ getService, config }) => SortServiceAPI)
```

Service implementation with optional initial sort configuration.

**Config:**
- `initialSort`: Optional initial sort option

## Usage Examples

### Product List Integration

```typescript
import { SortServiceDefinition } from './headless/store/services/sort-service';
import { ProductServiceDefinition } from './product-service';

function SortedProductList() {
  const sortService = useService(SortServiceDefinition);
  const productService = useService(ProductServiceDefinition);

  // Update product query when sort changes
  useEffect(() => {
    const unsubscribe = sortService.currentSort.subscribe(sortBy => {
      productService.setSortBy(sortBy);
    });

    return unsubscribe;
  }, []);

  return <ProductGrid />;
}
```

## URL Parameter Mapping

The service automatically maps sort values to URL-friendly parameters:

- `""` (newest) → `newest` (default, parameter omitted)
- `"name-asc"` → `name_asc`
- `"name-desc"` → `name_desc`
- `"price-asc"` → `price_asc`
- `"price-desc"` → `price_desc`

## Key Features

- **Type Safety**: Strongly typed sort options prevent invalid values
- **Reactive State**: Uses signals for reactive sort state management
- **URL Synchronization**: Automatically updates URL parameters when sort changes
- **Default Handling**: Provides sensible default (newest first)
- **Async API**: Sort changes return promises for chaining operations
- **Clean URLs**: Omits sort parameter for default option to keep URLs clean

## Dependencies

- **@wix/services-definitions**: Service definition framework
- **SignalsServiceDefinition**: For reactive state management
- **URLParamsUtils**: For URL parameter management

The service provides a complete sorting solution with URL persistence and reactive state management.

---

# layouts

### StoreLayout


## Overview

The StoreLayout component is a React layout wrapper that provides e-commerce functionality including cart management, success notifications, and services provider setup. It serves as a specialized layout for store pages that need shopping cart capabilities, automatically setting up the necessary services and UI components for cart operations.

This layout component integrates with Wix's services manager pattern and provides a complete cart experience including mini cart display, success messages, and proper service configuration. It can work with an external services manager or create its own isolated cart service setup.

## Exports

### `StoreLayoutProps`
**Type**: `interface`

Props interface for the StoreLayout component.
- `children`: ReactNode - Child components to be rendered within the layout
- `currentCartServiceConfig`: any - Configuration for the cart service
- `servicesManager?`: any - Optional external services manager instance
- `showSuccessMessage?`: boolean - Controls success message visibility
- `onSuccessMessageChange?`: (show: boolean) => void - Callback for success message state changes

### `StoreLayout`
**Type**: `React.FC<StoreLayoutProps>`

Main layout component that provides store functionality including cart services, mini cart UI, and success notifications. Can use external services manager or create isolated cart services.

## Usage Examples

### Complete Store Setup with Cart Configuration
```tsx
import { StoreLayout } from './layouts/StoreLayout';
import { loadCurrentCartServiceConfig } from '../headless/ecom/services/current-cart-service';
import { useEffect, useState } from 'react';

function StoreApp() {
  const [cartConfig, setCartConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await loadCurrentCartServiceConfig();
        setCartConfig(config);
      } catch (error) {
        console.error('Failed to load cart config:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfig();
  }, []);
  
  if (isLoading) {
    return <div>Loading store...</div>;
  }
  
  return (
    <StoreLayout currentCartServiceConfig={cartConfig}>
      <div className="store-content">
        <h1>Welcome to Our Store</h1>
        <ProductGrid />
        <Categories />
      </div>
    </StoreLayout>
  );
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

