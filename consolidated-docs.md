# Headless Components Documentation

# actions

### index


## Overview

This file serves as the main entry point for server-side actions in the application. It aggregates and exports various action modules that can be used with Astro's server actions or other server-side functionality. The file currently focuses on photo upload actions but is designed to be extended with additional action modules as needed.

The actions are organized in a structured manner to provide a clean API for server-side operations while maintaining separation of concerns between different functional areas.

## Exports

### `server`
**Type**: `{ photoUploadAstroActions: any }`

A configuration object that contains all available server actions. Currently includes photo upload functionality but can be extended with additional action modules.

## Usage Examples

### Basic Server Actions Setup
```typescript
import { server } from './actions';

// Use in Astro pages or API routes
export const actions = server;
```

### Accessing Photo Upload Actions
```typescript
import { server } from './actions';

// Access photo upload actions
const photoActions = server.photoUploadAstroActions;
```

### Extending with Additional Actions
```typescript
// To extend this file with new actions:
import { photoUploadAstroActions } from "../headless/members/actions/photo-upload-service-actions";
import { newActionModule } from "./path/to/new-actions";

export const server = {
  photoUploadAstroActions,
  newActionModule,
};
```

---

# components

### DocsMode


## Overview

The DocsMode component system provides a comprehensive documentation overlay and interaction system for React applications. It enables developers to create interactive documentation experiences where users can click on components to view their documentation in a side drawer. The system includes context management, component discovery, highlighting, and a floating menu interface.

This system is particularly useful for design systems, component libraries, and educational applications where users need to understand how components work. It provides a seamless way to transition between regular application usage and documentation exploration without leaving the current page context.

## Exports

### `DocsContextType`
**Type**: `interface`

TypeScript interface defining the shape of the docs context, including state management for docs mode, component discovery, page registration, and drawer configuration.

### `useDocsMode`
**Type**: `() => DocsContextType`

Custom React hook that provides access to the docs context. Must be used within a DocsProvider and throws an error if used outside the provider context.

### `DocsProvider`
**Type**: `React.FC<{ children: React.ReactNode }>`

Provider component that manages the global state for docs mode functionality including mode toggling, component selection, discovery tracking, and page documentation registration.

### `withDocsWrapper`
**Type**: `<T extends Record<string, any>>(renderPropFn: (props: T) => React.ReactNode, componentName: string, componentPath: string) => (props: T) => React.ReactNode`

Higher-order function that wraps render prop children with docs highlighting and click handling. Automatically registers components for discovery and provides interactive overlays in docs mode.

### `DocsDrawer`
**Type**: `React.FC`

Side drawer component that displays documentation content in an iframe with loading states, close functionality, and responsive design. Supports both normal and wide drawer modes.

### `DocsToggleButton`
**Type**: `React.FC`

Floating action button that toggles docs mode on/off and displays the count of discovered components. Positioned as a fixed overlay with visual state indicators.

### `DocsFloatingMenu`
**Type**: `React.FC`

Floating menu component that provides access to page docs, general docs, and discovered components. Features expandable sections with smooth animations and categorized documentation access.

### `PageDocsRegistration`
**Type**: `React.FC<PageDocsRegistrationProps>`

Utility component for pages to register their documentation metadata. Automatically registers and cleans up page documentation when the component mounts/unmounts.

## Usage Examples

### Basic Setup with DocsProvider
```tsx
import { DocsProvider, DocsToggleButton, DocsDrawer, DocsFloatingMenu } from './components/DocsMode';

function App() {
  return (
    <DocsProvider>
      <YourAppContent />
      <DocsToggleButton />
      <DocsDrawer />
      <DocsFloatingMenu />
    </DocsProvider>
  );
}
```

### Using the DocsMode Hook
```tsx
import { useDocsMode } from './components/DocsMode';

function MyComponent() {
  const { isDocsMode, openDocs, registerComponent } = useDocsMode();
  
  useEffect(() => {
    return registerComponent('MyComponent', '/docs/components/my-component');
  }, []);
  
  return (
    <div onClick={() => isDocsMode && openDocs('/docs/components/my-component')}>
      My Component Content
    </div>
  );
}
```

### Wrapping Components with Documentation
```tsx
import { withDocsWrapper } from './components/DocsMode';

const DocumentedButton = withDocsWrapper(
  ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
  'Button Component',
  '/docs/components/button'
);

function Usage() {
  return (
    <DocumentedButton onClick={() => console.log('clicked')}>
      Click me
    </DocumentedButton>
  );
}
```

### Registering Page Documentation
```tsx
import { PageDocsRegistration } from './components/DocsMode';

function ProductPage() {
  return (
    <>
      <PageDocsRegistration
        title="Product Catalog"
        description="Browse and filter products with advanced search capabilities"
        docsUrl="/docs/pages/product-catalog"
      />
      <div>
        Product page content here...
      </div>
    </>
  );
}
```

### Complete Documentation-Enabled Application
```tsx
import { 
  DocsProvider, 
  DocsToggleButton, 
  DocsDrawer, 
  DocsFloatingMenu,
  withDocsWrapper,
  PageDocsRegistration 
} from './components/DocsMode';

// Wrap your components with documentation
const DocumentedHeader = withDocsWrapper(
  ({ title }) => <header><h1>{title}</h1></header>,
  'Header Component',
  '/docs/components/header'
);

const DocumentedButton = withDocsWrapper(
  ({ children, ...props }) => <button {...props}>{children}</button>,
  'Button Component', 
  '/docs/components/button'
);

function App() {
  return (
    <DocsProvider>
      <PageDocsRegistration
        title="Home Page"
        description="Main application landing page with overview and navigation"
        docsUrl="/docs/pages/home"
      />
      
      <DocumentedHeader title="My App" />
      
      <main>
        <DocumentedButton onClick={() => alert('Hello!')}>
          Get Started
        </DocumentedButton>
      </main>
      
      {/* Docs UI */}
      <DocsToggleButton />
      <DocsDrawer />
      <DocsFloatingMenu />
    </DocsProvider>
  );
}
```

---

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

### Custom Navigation Component
```tsx
import { NavigationProvider } from './components/NavigationContext';

const CustomNavigation = ({ route, children, className, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault();
    // Custom navigation logic
    window.history.pushState({}, '', route);
  };
  
  return (
    <button 
      onClick={handleClick}
      className={`nav-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

function App() {
  return (
    <NavigationProvider navigationComponent={CustomNavigation}>
      <Navigation route="/store" className="primary-nav">
        Go to Store
      </Navigation>
    </NavigationProvider>
  );
}
```

### Using Navigation in Components
```tsx
import { useNavigation } from './components/NavigationContext';

function ProductCard({ product }) {
  const Navigation = useNavigation();
  
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <Navigation 
        route={`/products/${product.slug}`}
        className="product-link"
      >
        View Details
      </Navigation>
    </div>
  );
}

function Breadcrumb({ items }) {
  const Navigation = useNavigation();
  
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {index < items.length - 1 ? (
            <Navigation route={item.route}>
              {item.label}
            </Navigation>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && <span> / </span>}
        </span>
      ))}
    </nav>
  );
}
```

### Conditional Navigation with Authentication
```tsx
import { useNavigation } from './components/NavigationContext';
import { useAuth } from './hooks/useAuth';

function AuthenticatedNavigation({ route, children, requireAuth = false, ...props }) {
  const Navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigation route="/login" {...props}>
        {children}
      </Navigation>
    );
  }
  
  return (
    <Navigation route={route} {...props}>
      {children}
    </Navigation>
  );
}

function UserMenu() {
  return (
    <div className="user-menu">
      <AuthenticatedNavigation route="/profile" requireAuth>
        My Profile
      </AuthenticatedNavigation>
      <AuthenticatedNavigation route="/orders" requireAuth>
        Order History
      </AuthenticatedNavigation>
    </div>
  );
}
```

### Navigation with State Preservation
```tsx
const StatefulNavigation = ({ route, children, preserveState = false, ...props }) => {
  const handleNavigation = () => {
    if (preserveState) {
      sessionStorage.setItem('previousState', JSON.stringify(getCurrentState()));
    }
    // Navigate to route
  };
  
  return (
    <a href={route} onClick={handleNavigation} {...props}>
      {children}
    </a>
  );
};

function App() {
  return (
    <NavigationProvider navigationComponent={StatefulNavigation}>
      <Navigation route="/cart" preserveState>
        View Cart
      </Navigation>
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

### Basic Cart Page
```tsx
import CartContent from './components/ecom/Cart';

function CartPage() {
  return (
    <div className="app">
      <CartContent />
    </div>
  );
}
```

### With Navigation Integration
```tsx
import CartContent from './components/ecom/Cart';
import { NavigationProvider } from './components/NavigationContext';

function App() {
  return (
    <NavigationProvider>
      <CartContent />
    </NavigationProvider>
  );
}
```

### In Store Layout
```tsx
import CartContent from './components/ecom/Cart';
import { StoreLayout } from './layouts/StoreLayout';

function CartPage() {
  return (
    <StoreLayout currentCartServiceConfig={null}>
      <CartContent />
    </StoreLayout>
  );
}
```

### As Route Component
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CartContent from './components/ecom/Cart';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cart" element={<CartContent />} />
        <Route path="/store" element={<StorePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### With Custom Styling
```tsx
import CartContent from './components/ecom/Cart';

function CustomizedCartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <h1>My Store - Shopping Cart</h1>
      </header>
      
      <main className="container mx-auto">
        <CartContent />
      </main>
      
      <footer className="bg-gray-800 text-white p-4">
        <p>&copy; 2023 My Store</p>
      </footer>
    </div>
  );
}
```

### Integration with Authentication
```tsx
import CartContent from './components/ecom/Cart';
import { useAuth } from './hooks/useAuth';

function AuthenticatedCart() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return (
      <div className="text-center p-8">
        <h2>Please sign in to view your cart</h2>
        <button>Sign In</button>
      </div>
    );
  }
  
  return <CartContent />;
}
```

### Mobile-Optimized Usage
```tsx
import CartContent from './components/ecom/Cart';
import { useMediaQuery } from './hooks/useMediaQuery';

function ResponsiveCart() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={isMobile ? 'mobile-cart' : 'desktop-cart'}>
      <CartContent />
    </div>
  );
}
```

### With Analytics Tracking
```tsx
import CartContent from './components/ecom/Cart';
import { useEffect } from 'react';
import { analytics } from './utils/analytics';

function TrackedCart() {
  useEffect(() => {
    // Track cart page view
    analytics.track('Cart Page Viewed');
  }, []);
  
  return <CartContent />;
}
```

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

### Basic MiniCart Setup
```tsx
import { MiniCartIcon, MiniCartContent } from './components/ecom/MiniCart';

function App() {
  return (
    <div className="app">
      <main>
        {/* Your main app content */}
        <ProductCatalog />
      </main>
      
      {/* MiniCart components */}
      <MiniCartIcon />
      <MiniCartContent />
    </div>
  );
}
```

### With StoreLayout Integration
```tsx
import { MiniCartIcon, MiniCartContent } from './components/ecom/MiniCart';
import { StoreLayout } from './layouts/StoreLayout';

function EcommerceApp() {
  return (
    <StoreLayout currentCartServiceConfig={null}>
      <ProductList />
      {/* MiniCart is automatically included in StoreLayout */}
    </StoreLayout>
  );
}
```

### Custom Styled MiniCart
```tsx
import { MiniCartIcon, MiniCartContent } from './components/ecom/MiniCart';

function CustomApp() {
  return (
    <div className="app">
      <header className="site-header">
        <nav>Your Navigation</nav>
        {/* Custom positioning */}
        <div className="relative">
          <MiniCartIcon />
        </div>
      </header>
      
      <main>
        <ProductGrid />
      </main>
      
      {/* Custom modal wrapper */}
      <div className="cart-overlay">
        <MiniCartContent />
      </div>
    </div>
  );
}
```

### Mobile-Optimized Implementation
```tsx
import { MiniCartIcon, MiniCartContent } from './components/ecom/MiniCart';
import { useMediaQuery } from './hooks/useMediaQuery';

function ResponsiveCart() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <>
      {/* Icon with mobile-specific positioning */}
      <div className={isMobile ? 'fixed top-4 right-4' : 'fixed top-6 right-6'}>
        <MiniCartIcon />
      </div>
      
      {/* Content with mobile-specific styling */}
      <div className={isMobile ? 'mobile-cart' : 'desktop-cart'}>
        <MiniCartContent />
      </div>
    </>
  );
}
```

### Integration with Product Actions
```tsx
import { MiniCartIcon, MiniCartContent } from './components/ecom/MiniCart';
import { useService } from '@wix/services-manager-react';
import { CurrentCartServiceDefinition } from './headless/ecom/services/current-cart-service';

function ProductWithMiniCart() {
  const cartService = useService(CurrentCartServiceDefinition);
  
  const handleAddToCart = async (productId: string) => {
    await cartService.addToCart([{
      catalogReference: {
        appId: 'stores',
        catalogItemId: productId
      },
      quantity: 1
    }]);
    
    // Mini cart will automatically update and show new item
  };
  
  return (
    <div>
      <div className="product-grid">
        <button onClick={() => handleAddToCart('product-123')}>
          Add to Cart
        </button>
      </div>
      
      <MiniCartIcon />
      <MiniCartContent />
    </div>
  );
}
```

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

### With Analytics Tracking
```tsx
import { MiniCartIcon, MiniCartContent } from './components/ecom/MiniCart';
import { useEffect } from 'react';
import { analytics } from './utils/analytics';

function TrackedMiniCart() {
  const cartService = useService(CurrentCartServiceDefinition);
  const isOpen = cartService.isOpen.use();
  
  useEffect(() => {
    if (isOpen) {
      analytics.track('Mini Cart Opened');
    }
  }, [isOpen]);
  
  return (
    <>
      <MiniCartIcon />
      <MiniCartContent />
    </>
  );
}
```

---

## icons

#### CheckIcon


## Overview

The CheckIcon component is a simple SVG icon component that renders a checkmark icon. It follows the standard icon component pattern with customizable className prop for styling and accessibility features. The icon uses stroke-based design with a thicker stroke weight for better visibility and inherits color from the current text color.

This component is commonly used for indicating success states, completed actions, form validation, or selection states throughout the application.

## Exports

### `CheckIcon`
**Type**: `React.FC<{ className?: string }>`

SVG icon component that renders a checkmark icon with optional CSS class customization. Uses stroke-based design with strokeWidth="3" for prominence.

## Usage Examples

### Success Messages
```tsx
import { CheckIcon } from './components/icons/CheckIcon';

function SuccessAlert() {
  return (
    <div className="success-alert">
      <CheckIcon className="w-5 h-5 text-green-600" />
      <span>Operation completed successfully!</span>
    </div>
  );
}
```

### Form Validation
```tsx
import { CheckIcon } from './components/icons/CheckIcon';

function ValidatedInput({ isValid }) {
  return (
    <div className="input-group">
      <input type="text" />
      {isValid && (
        <CheckIcon className="w-4 h-4 text-green-500" />
      )}
    </div>
  );
}
```

### Checkbox Alternative
```tsx
import { CheckIcon } from './components/icons/CheckIcon';

function CustomCheckbox({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`checkbox ${checked ? 'checked' : ''}`}
    >
      {checked && <CheckIcon className="w-3 h-3 text-white" />}
    </button>
  );
}
```

### Status Indicators
```tsx
import { CheckIcon } from './components/icons/CheckIcon';

function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id} className="task-item">
          <span className="task-status">
            {task.completed && (
              <CheckIcon className="w-4 h-4 text-green-600" />
            )}
          </span>
          {task.title}
        </li>
      ))}
    </ul>
  );
}
```

---

#### CloseIcon


## Overview

The CloseIcon component is a simple SVG icon component that renders an X (close) icon. It follows the standard icon component pattern with customizable className prop for styling and accessibility features. The icon uses stroke-based design and inherits color from the current text color.

This component is commonly used for close buttons, dismiss actions, remove operations, or cancel functionality in modals, alerts, forms, and other UI components.

## Exports

### `CloseIcon`
**Type**: `React.FC<{ className?: string }>`

SVG icon component that renders an X/close icon with optional CSS class customization. Uses stroke-based design with standard stroke weight.

## Usage Examples

### Modal Close Button
```tsx
import { CloseIcon } from './components/icons/CloseIcon';

function Modal({ onClose, children }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">
          <CloseIcon className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
}
```

### Alert Dismiss
```tsx
import { CloseIcon } from './components/icons/CloseIcon';

function Alert({ message, onDismiss }) {
  return (
    <div className="alert">
      <span>{message}</span>
      <button onClick={onDismiss} className="alert-dismiss">
        <CloseIcon className="w-4 h-4 text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
}
```

### Tag/Chip Remove
```tsx
import { CloseIcon } from './components/icons/CloseIcon';

function Tag({ label, onRemove }) {
  return (
    <span className="tag">
      {label}
      <button onClick={onRemove} className="tag-remove">
        <CloseIcon className="w-3 h-3 ml-1" />
      </button>
    </span>
  );
}
```

### Search Clear Button
```tsx
import { CloseIcon } from './components/icons/CloseIcon';

function SearchInput({ value, onChange, onClear }) {
  return (
    <div className="search-input">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search..."
      />
      {value && (
        <button onClick={onClear} className="search-clear">
          <CloseIcon className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
```

---

#### UserIcon


## Overview

The UserIcon component is a simple SVG icon component that renders a user/person icon. It follows the standard icon component pattern with customizable className prop for styling and accessibility features. The icon uses stroke-based design and inherits color from the current text color.

This component is part of the icon library and provides a consistent user interface element for representing users, profiles, or account-related functionality throughout the application.

## Exports

### `UserIcon`
**Type**: `React.FC<{ className?: string }>`

SVG icon component that renders a user/person icon with optional CSS class customization. Uses stroke-based design and inherits current text color.

## Usage Examples

### Basic Icon Usage
```tsx
import { UserIcon } from './components/icons/UserIcon';

function UserProfile() {
  return (
    <div className="user-profile">
      <UserIcon className="w-6 h-6" />
      <span>John Doe</span>
    </div>
  );
}
```

### With Custom Styling
```tsx
import { UserIcon } from './components/icons/UserIcon';

function ProfileButton() {
  return (
    <button className="profile-btn">
      <UserIcon className="w-5 h-5 text-blue-600" />
      Profile
    </button>
  );
}
```

### In Navigation Menu
```tsx
import { UserIcon } from './components/icons/UserIcon';

function Navigation() {
  return (
    <nav>
      <a href="/profile" className="nav-link">
        <UserIcon className="w-4 h-4 mr-2" />
        My Account
      </a>
    </nav>
  );
}
```

### Different Sizes
```tsx
import { UserIcon } from './components/icons/UserIcon';

function IconSizes() {
  return (
    <div>
      <UserIcon className="w-4 h-4" /> {/* Small */}
      <UserIcon className="w-6 h-6" /> {/* Medium */}
      <UserIcon className="w-8 h-8" /> {/* Large */}
    </div>
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

### Basic Category Picker with Context

```typescript
import CategoryPicker from './components/store/CategoryPicker';

function StorePage() {
  return (
    <div>
      <CategoryPicker />
      <div className="products">
        {/* Product grid filtered by selected category */}
      </div>
    </div>
  );
}
```

### With Custom Styling

```typescript
import CategoryPicker from './components/store/CategoryPicker';

function StyledStorePage() {
  return (
    <div>
      <CategoryPicker className="mb-8 border-b pb-4" />
      <div className="product-container">
        {/* Products */}
      </div>
    </div>
  );
}
```

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
      className="custom-category-picker"
    />
  );
}
```

### In Store Header

```typescript
import CategoryPicker from './components/store/CategoryPicker';

function StoreHeader() {
  return (
    <div className="store-header">
      <div className="flex justify-between items-center">
        <CategoryPicker className="flex-1" />
        <SortDropdown />
      </div>
    </div>
  );
}
```

### Mobile-Responsive Layout

```typescript
import CategoryPicker from './components/store/CategoryPicker';

function ResponsiveStore() {
  return (
    <div className="container mx-auto px-4">
      <CategoryPicker className="md:hidden mb-4" />
      <div className="flex gap-6">
        <aside className="hidden md:block w-64">
          <CategoryPicker className="sticky top-4" />
        </aside>
        <main className="flex-1">
          {/* Product grid */}
        </main>
      </div>
    </div>
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

### Basic Product Actions

```typescript
import { ProductActionButtons } from './components/store/ProductActionButtons';

function ProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Add product to cart logic
      await cartService.addToCart(productId, quantity);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ProductActionButtons
        onAddToCart={handleAddToCart}
        canAddToCart={true}
        isLoading={isLoading}
        isPreOrderEnabled={false}
        inStock={true}
        onShowSuccessMessage={setShowSuccess}
      />
      {showSuccess && <div>Added to cart successfully!</div>}
    </div>
  );
}
```

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

### Out of Stock Product

```typescript
import { ProductActionButtons } from './components/store/ProductActionButtons';

function OutOfStockProduct() {
  return (
    <ProductActionButtons
      onAddToCart={async () => {}}
      canAddToCart={false}
      isLoading={false}
      isPreOrderEnabled={false}
      inStock={false}
      onShowSuccessMessage={() => {}}
    />
  );
}
```

### With Custom Styling

```typescript
import { ProductActionButtons } from './components/store/ProductActionButtons';

function StyledProductActions() {
  return (
    <div className="product-actions-container">
      <ProductActionButtons
        onAddToCart={handleAddToCart}
        canAddToCart={true}
        isLoading={false}
        isPreOrderEnabled={false}
        inStock={true}
        onShowSuccessMessage={setShowMessage}
      />
    </div>
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

### Basic Product Detail Page
```tsx
import ProductDetails from './components/store/ProductDetails';

function ProductDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails />
    </div>
  );
}
```

### With Success Message Integration
```tsx
import ProductDetails from './components/store/ProductDetails';
import { useState } from 'react';

function ProductPageWithNotifications() {
  const [showSuccess, setShowSuccess] = useState(false);
  
  return (
    <div className="product-page">
      {showSuccess && (
        <div className="success-notification">
          Product added to cart successfully!
        </div>
      )}
      
      <ProductDetails
        setShowSuccessMessage={setShowSuccess}
        cartUrl="/shopping-cart"
      />
    </div>
  );
}
```

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

### With Breadcrumb Navigation
```tsx
import ProductDetails from './components/store/ProductDetails';
import { useProduct } from './hooks/useProduct';

function ProductPageWithBreadcrumbs({ productSlug }) {
  const { product, category } = useProduct(productSlug);
  
  return (
    <div className="product-page">
      <nav className="breadcrumb mb-8">
        <a href="/">Home</a>
        <span> / </span>
        <a href="/products">Products</a>
        {category && (
          <>
            <span> / </span>
            <a href={`/categories/${category.slug}`}>{category.name}</a>
          </>
        )}
        <span> / </span>
        <span>{product?.name}</span>
      </nav>
      
      <ProductDetails />
    </div>
  );
}
```

### Mobile-Optimized Layout
```tsx
import ProductDetails from './components/store/ProductDetails';
import { useMediaQuery } from './hooks/useMediaQuery';

function ResponsiveProductPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={`product-page ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
      {!isMobile && (
        <div className="desktop-controls">
          <button className="back-button">← Back to Products</button>
        </div>
      )}
      
      <ProductDetails />
      
      {isMobile && (
        <div className="mobile-footer">
          <button className="mobile-cart-button">
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
```

### With Related Products
```tsx
import ProductDetails from './components/store/ProductDetails';
import { RelatedProducts } from './components/store/RelatedProducts';

function CompleteProductPage() {
  return (
    <div className="complete-product-page">
      <div className="main-product">
        <ProductDetails />
      </div>
      
      <div className="related-section mt-16">
        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
        <RelatedProducts />
      </div>
    </div>
  );
}
```

### With Reviews Integration
```tsx
import ProductDetails from './components/store/ProductDetails';
import { ProductReviews } from './components/store/ProductReviews';

function ProductPageWithReviews() {
  return (
    <div className="product-with-reviews">
      <div className="product-main">
        <ProductDetails />
      </div>
      
      <div className="reviews-section mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <ProductReviews />
      </div>
    </div>
  );
}
```

### With Analytics Tracking
```tsx
import ProductDetails from './components/store/ProductDetails';
import { useEffect } from 'react';
import { analytics } from './utils/analytics';

function TrackedProductPage({ productId, productName }) {
  useEffect(() => {
    analytics.track('Product Viewed', {
      product_id: productId,
      product_name: productName
    });
  }, [productId, productName]);
  
  const handleAddToCart = () => {
    analytics.track('Product Added to Cart', {
      product_id: productId,
      product_name: productName
    });
  };
  
  return (
    <div className="tracked-product-page">
      <ProductDetails 
        setShowSuccessMessage={(show) => {
          if (show) handleAddToCart();
        }}
      />
    </div>
  );
}
```

### With Wishlist Integration
```tsx
import ProductDetails from './components/store/ProductDetails';
import { WishlistButton } from './components/WishlistButton';

function ProductPageWithWishlist() {
  return (
    <div className="product-page-wishlist">
      <div className="product-header mb-4">
        <WishlistButton />
      </div>
      
      <ProductDetails />
    </div>
  );
}
```

### Custom Styled Layout
```tsx
import ProductDetails from './components/store/ProductDetails';

function CustomProductPage() {
  return (
    <div className="custom-product-page">
      <div className="product-container max-w-7xl mx-auto">
        <div className="product-wrapper bg-white rounded-lg shadow-lg p-8">
          <ProductDetails />
        </div>
      </div>
      
      <div className="product-footer mt-8 text-center">
        <p className="text-gray-600">Free shipping on orders over $50</p>
      </div>
    </div>
  );
}
```

### With Size Guide Modal
```tsx
import ProductDetails from './components/store/ProductDetails';
import { useState } from 'react';
import { SizeGuideModal } from './components/SizeGuideModal';

function ProductPageWithSizeGuide() {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  return (
    <div className="product-with-size-guide">
      <div className="size-guide-trigger mb-4">
        <button 
          onClick={() => setShowSizeGuide(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          View Size Guide
        </button>
      </div>
      
      <ProductDetails />
      
      <SizeGuideModal 
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </div>
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

### Basic Product Filters

```typescript
import ProductFilters from './components/store/ProductFilters';

function ProductListingPage() {
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    selectedOptions: {}
  });

  const availableOptions = {
    productOptions: [
      {
        id: 'color',
        name: 'Color',
        choices: [
          { id: 'red', name: 'Red', colorCode: '#FF0000' },
          { id: 'blue', name: 'Blue', colorCode: '#0000FF' }
        ],
        optionRenderType: 'SWATCH_CHOICES'
      },
      {
        id: 'size',
        name: 'Size',
        choices: [
          { id: 'small', name: 'Small' },
          { id: 'medium', name: 'Medium' },
          { id: 'large', name: 'Large' }
        ]
      }
    ],
    priceRange: { min: 0, max: 1000 }
  };

  return (
    <div className="flex gap-6">
      <aside className="w-80">
        <ProductFilters
          onFiltersChange={setFilters}
          availableOptions={availableOptions}
          currentFilters={filters}
          clearFilters={() => setFilters({
            priceRange: { min: 0, max: 1000 },
            selectedOptions: {}
          })}
          isFiltered={Object.keys(filters.selectedOptions).length > 0}
        />
      </aside>
      <main className="flex-1">
        <ProductList filters={filters} />
      </main>
    </div>
  );
}
```

### With Wix Store Integration

```typescript
import ProductFilters from './components/store/ProductFilters';
import { FilteredCollection } from '../headless/store/components';

function WixStorePage() {
  return (
    <FilteredCollection.Provider>
      <FilteredCollection.Options>
        {({ availableOptions, currentFilters, setFilters, clearFilters, isFiltered }) => (
          <div className="store-layout">
            <ProductFilters
              onFiltersChange={setFilters}
              availableOptions={availableOptions}
              currentFilters={currentFilters}
              clearFilters={clearFilters}
              isFiltered={isFiltered}
            />
          </div>
        )}
      </FilteredCollection.Options>
    </FilteredCollection.Provider>
  );
}
```

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

### Color Swatch Filtering

```typescript
import ProductFilters from './components/store/ProductFilters';

function ColorFilterExample() {
  const colorOptions = {
    productOptions: [
      {
        id: 'color',
        name: 'Available Colors',
        optionRenderType: 'SWATCH_CHOICES',
        choices: [
          { id: 'red', name: 'Crimson Red', colorCode: '#DC143C' },
          { id: 'blue', name: 'Ocean Blue', colorCode: '#006994' },
          { id: 'green', name: 'Forest Green', colorCode: '#228B22' },
          { id: 'black', name: 'Midnight Black', colorCode: '#000000' }
        ]
      }
    ],
    priceRange: { min: 0, max: 500 }
  };

  return (
    <ProductFilters
      onFiltersChange={handleColorFilter}
      availableOptions={colorOptions}
      currentFilters={currentFilters}
      clearFilters={clearFilters}
      isFiltered={isFiltered}
    />
  );
}
```

### Price Range Only

```typescript
import ProductFilters from './components/store/ProductFilters';

function PriceRangeExample() {
  const priceOptions = {
    productOptions: [], // No other options
    priceRange: { min: 10, max: 2000 }
  };

  return (
    <ProductFilters
      onFiltersChange={({ priceRange }) => {
        console.log('Price range:', priceRange);
      }}
      availableOptions={priceOptions}
      currentFilters={{
        priceRange: { min: 50, max: 500 },
        selectedOptions: {}
      }}
      clearFilters={() => {}}
      isFiltered={false}
      className="price-filter-only"
    />
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

### Basic Product Listing
```tsx
import ProductList from './components/store/ProductList';

function ProductCatalogPage() {
  return (
    <div className="container mx-auto">
      <ProductList productPageRoute="/products" />
    </div>
  );
}
```

### Category-Specific Product List
```tsx
import ProductList from './components/store/ProductList';

function CategoryPage({ categorySlug }) {
  return (
    <div className="category-page">
      <header className="category-header">
        <h1>Category: {categorySlug}</h1>
      </header>
      <ProductList productPageRoute={`/products/category/${categorySlug}`} />
    </div>
  );
}
```

### With Custom Container and Layout
```tsx
import ProductList from './components/store/ProductList';

function CustomProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Our Products</h1>
          <p className="text-gray-600">Discover our amazing collection</p>
        </div>
        
        <ProductList productPageRoute="/store/products" />
      </div>
    </div>
  );
}
```

### Integration with Store Layout
```tsx
import ProductList from './components/store/ProductList';
import { StoreLayout } from './layouts/StoreLayout';

function StorePage() {
  return (
    <StoreLayout currentCartServiceConfig={null}>
      <div className="store-page">
        <ProductList productPageRoute="/store" />
      </div>
    </StoreLayout>
  );
}
```

### With Search Integration
```tsx
import ProductList from './components/store/ProductList';
import { useState } from 'react';

function SearchableProductPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="search-page">
      <div className="search-header mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
      </div>
      
      <ProductList productPageRoute="/products/search" />
    </div>
  );
}
```

### Mobile-Optimized Layout
```tsx
import ProductList from './components/store/ProductList';
import { useMediaQuery } from './hooks/useMediaQuery';

function ResponsiveProductPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={`product-page ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
      {!isMobile && (
        <div className="page-header">
          <h1>Product Catalog</h1>
          <p>Browse our complete selection</p>
        </div>
      )}
      
      <ProductList productPageRoute="/products" />
    </div>
  );
}
```

### With Analytics Tracking
```tsx
import ProductList from './components/store/ProductList';
import { useEffect } from 'react';
import { analytics } from './utils/analytics';

function TrackedProductPage() {
  useEffect(() => {
    analytics.track('Product Catalog Viewed');
  }, []);
  
  return (
    <div className="tracked-catalog">
      <ProductList productPageRoute="/catalog" />
    </div>
  );
}
```

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

### Sale/Promotional Products
```tsx
import ProductList from './components/store/ProductList';

function SalePage() {
  return (
    <div className="sale-page">
      <div className="sale-banner bg-red-600 text-white p-6 mb-8">
        <h1 className="text-3xl font-bold">Flash Sale!</h1>
        <p className="text-lg">Limited time offers on selected products</p>
      </div>
      
      <ProductList productPageRoute="/sale" />
    </div>
  );
}
```

### With Breadcrumb Navigation
```tsx
import ProductList from './components/store/ProductList';

function ProductPageWithBreadcrumbs({ category, subcategory }) {
  return (
    <div className="product-page-with-nav">
      <nav className="breadcrumb mb-6">
        <a href="/">Home</a>
        <span> / </span>
        <a href="/products">Products</a>
        {category && (
          <>
            <span> / </span>
            <a href={`/products/${category}`}>{category}</a>
          </>
        )}
        {subcategory && (
          <>
            <span> / </span>
            <span>{subcategory}</span>
          </>
        )}
      </nav>
      
      <ProductList productPageRoute={`/products/${category}/${subcategory || ''}`} />
    </div>
  );
}
```

### Integration with Wishlist
```tsx
import ProductList from './components/store/ProductList';
import { WishlistProvider } from './providers/WishlistProvider';

function ProductPageWithWishlist() {
  return (
    <WishlistProvider>
      <div className="wishlist-enabled-catalog">
        <div className="page-header mb-8">
          <h1>All Products</h1>
          <a href="/wishlist" className="wishlist-link">
            View Wishlist
          </a>
        </div>
        
        <ProductList productPageRoute="/products" />
      </div>
    </WishlistProvider>
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

### Basic Sort Dropdown

```typescript
import SortDropdown from './components/store/SortDropdown';

function ProductListPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Products</h1>
        <SortDropdown />
      </div>
      <div className="product-grid">
        {/* Products will be sorted based on selection */}
      </div>
    </div>
  );
}
```

### In Store Header

```typescript
import SortDropdown from './components/store/SortDropdown';
import CategoryPicker from './components/store/CategoryPicker';

function StoreHeader() {
  return (
    <div className="store-header">
      <div className="flex justify-between items-center">
        <CategoryPicker />
        <SortDropdown className="ml-4" />
      </div>
    </div>
  );
}
```

### With Custom Styling

```typescript
import SortDropdown from './components/store/SortDropdown';

function CustomProductPage() {
  return (
    <div>
      <div className="filters-container">
        <SortDropdown className="shadow-md rounded-xl" />
      </div>
      <div className="products">
        {/* Sorted products */}
      </div>
    </div>
  );
}
```

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

### Direct Sort Control Usage

```typescript
import { SortDropdownContent } from './components/store/SortDropdown';
import { SortBy } from '../headless/store/services/sort-service';

function CustomSortInterface() {
  const [currentSort, setCurrentSort] = useState<SortBy>('');

  return (
    <div className="sort-container">
      <SortDropdownContent
        sortBy={currentSort}
        setSortBy={setCurrentSort}
        className="custom-sort-dropdown"
      />
      <div>Currently sorting by: {currentSort || 'Latest Arrivals'}</div>
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

### Basic Store Header

```typescript
import StoreHeader from './components/store/StoreHeader';

function StorePage() {
  return (
    <div>
      <StoreHeader />
      <div className="product-grid">
        {/* Product content */}
      </div>
    </div>
  );
}
```

### With Custom Styling

```typescript
import StoreHeader from './components/store/StoreHeader';

function CustomStorePage() {
  return (
    <div>
      <StoreHeader className="shadow-lg mb-8" />
      <div className="products">
        {/* Product content */}
      </div>
    </div>
  );
}
```

### In Store Layout

```typescript
import StoreHeader from './components/store/StoreHeader';

function StoreLayout({ children }) {
  return (
    <div className="store-container">
      <StoreHeader className="sticky top-0 z-10" />
      <main>{children}</main>
    </div>
  );
}
```

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

---

## media

### components

##### FileUpload


## Overview

The FileUpload headless components provide a comprehensive file upload system using the render props pattern. These components handle file selection via drag-and-drop or file input, upload progress tracking, file validation, and preview functionality. The system is designed to be completely headless, providing the logic and state management while allowing full control over the UI presentation.

The components integrate with Wix's FileUploadService to provide reliable file handling including validation, progress tracking, and upload management. They support various file types with preview capabilities for images and provide detailed feedback throughout the upload process.

## Exports

### `FileSelector`
**Type**: `React.FC<FileSelectorProps>`

Headless component that handles file selection through drag-and-drop or file input. Provides drag state management, file preview generation, and file selection callbacks.

### `UploadProgress`
**Type**: `React.FC<UploadProgressProps>`

Headless component that tracks and reports upload progress and status including loading, success, and error states with detailed status information.

### `UploadTrigger`
**Type**: `React.FC<UploadTriggerProps>`

Headless component that provides upload initiation functionality. Manages upload availability based on file selection and current upload state.

### `FilePreview`
**Type**: `React.FC<FilePreviewProps>`

Headless component that provides file preview information including preview URLs, file metadata, formatted file sizes, and preview availability status.

### `ValidationStatus`
**Type**: `React.FC<ValidationStatusProps>`

Headless component that handles file validation against configurable rules including file size limits, allowed types, and file extensions.

## Usage Examples

### Basic File Upload Component
```tsx
import { FileSelector, UploadProgress, UploadTrigger, FilePreview } from './headless/media/components/FileUpload';

function FileUploadForm() {
  return (
    <div className="upload-container">
      <FileSelector>
        {({ dragOver, handleDragOver, handleDragLeave, handleDrop, handleFileSelect, selectedFile }) => (
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="upload-label">
              {selectedFile ? selectedFile.name : 'Drop files here or click to browse'}
            </label>
          </div>
        )}
      </FileSelector>

      <FilePreview>
        {({ hasPreview, previewUrl, fileName, formattedFileSize, fileType }) => (
          hasPreview && (
            <div className="file-preview">
              {previewUrl && <img src={previewUrl} alt="Preview" />}
              <div className="file-info">
                <p>Name: {fileName}</p>
                <p>Size: {formattedFileSize}</p>
                <p>Type: {fileType}</p>
              </div>
            </div>
          )
        )}
      </FilePreview>

      <UploadTrigger>
        {({ uploadFile, canUpload, isUploading }) => (
          <button
            onClick={uploadFile}
            disabled={!canUpload}
            className="upload-button"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        )}
      </UploadTrigger>

      <UploadProgress>
        {({ uploadState, isLoading, isSuccess, isError, hasMessage }) => (
          <div className="upload-status">
            {isLoading && <p>Uploading...</p>}
            {isSuccess && <p>Upload successful!</p>}
            {isError && <p>Upload failed: {uploadState.message}</p>}
          </div>
        )}
      </UploadProgress>
    </div>
  );
}
```

### Advanced File Upload with Validation
```tsx
import { 
  FileSelector, 
  UploadProgress, 
  UploadTrigger, 
  FilePreview, 
  ValidationStatus 
} from './headless/media/components/FileUpload';

function AdvancedFileUpload() {
  return (
    <div className="advanced-upload">
      <FileSelector>
        {({ 
          dragOver, 
          handleDragOver, 
          handleDragLeave, 
          handleDrop, 
          handleFileSelect, 
          selectedFile,
          clearFile 
        }) => (
          <div className="upload-area">
            <div
              className={`drop-zone ${dragOver ? 'drag-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                id="file-input"
              />
              
              {!selectedFile ? (
                <label htmlFor="file-input" className="upload-prompt">
                  <div className="upload-icon">📁</div>
                  <p>Drag & drop files here</p>
                  <p>or <span className="browse-link">browse</span></p>
                </label>
              ) : (
                <div className="file-selected">
                  <p>✅ File selected: {selectedFile.name}</p>
                  <button onClick={clearFile} className="clear-button">
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </FileSelector>

      <ValidationStatus>
        {({ isValid, error, validationRules }) => (
          <div className="validation-info">
            {!isValid && error && (
              <div className="error-message">❌ {error}</div>
            )}
            <div className="validation-rules">
              <p>Upload requirements:</p>
              <ul>
                {validationRules.maxFileSize && (
                  <li>Max size: {validationRules.maxFileSize / 1024 / 1024}MB</li>
                )}
                {validationRules.allowedTypes && (
                  <li>Allowed types: {validationRules.allowedTypes.join(', ')}</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </ValidationStatus>

      <FilePreview>
        {({ hasPreview, previewUrl, fileName, formattedFileSize, canPreview }) => (
          hasPreview && (
            <div className="preview-section">
              <h3>File Preview</h3>
              {canPreview && previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="File preview" 
                  className="preview-image"
                />
              )}
              <div className="file-details">
                <p><strong>File:</strong> {fileName}</p>
                <p><strong>Size:</strong> {formattedFileSize}</p>
              </div>
            </div>
          )
        )}
      </FilePreview>

      <div className="upload-actions">
        <UploadTrigger>
          {({ uploadFile, canUpload, isUploading }) => (
            <button
              onClick={uploadFile}
              disabled={!canUpload}
              className={`upload-btn ${canUpload ? 'enabled' : 'disabled'}`}
            >
              {isUploading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                'Start Upload'
              )}
            </button>
          )}
        </UploadTrigger>
      </div>

      <UploadProgress>
        {({ uploadState, isLoading, isSuccess, isError }) => (
          <div className="progress-section">
            {isLoading && (
              <div className="progress-bar">
                <div className="progress-fill"></div>
                <p>Uploading file...</p>
              </div>
            )}
            
            {isSuccess && (
              <div className="success-message">
                ✅ Upload completed successfully!
              </div>
            )}
            
            {isError && (
              <div className="error-message">
                ❌ Upload failed: {uploadState.message}
              </div>
            )}
          </div>
        )}
      </UploadProgress>
    </div>
  );
}
```

### Multiple File Upload Interface
```tsx
function MultiFileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  return (
    <div className="multi-upload">
      <FileSelector>
        {({ selectedFile, handleFileSelect, clearFile }) => (
          <div className="file-selector">
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="file-input"
            />
            
            {selectedFile && (
              <FilePreview>
                {({ fileName, formattedFileSize }) => (
                  <div className="selected-file">
                    <span>{fileName} ({formattedFileSize})</span>
                    <button onClick={clearFile}>Remove</button>
                  </div>
                )}
              </FilePreview>
            )}
          </div>
        )}
      </FileSelector>

      <UploadTrigger>
        {({ uploadFile, canUpload }) => (
          <button
            onClick={async () => {
              await uploadFile();
              // Add to uploaded files list
            }}
            disabled={!canUpload}
          >
            Add File
          </button>
        )}
      </UploadTrigger>

      <div className="uploaded-files">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="uploaded-file-item">
            {file.name} - ✅ Uploaded
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Image Upload with Crop Preview
```tsx
function ImageUploadWithPreview() {
  return (
    <div className="image-upload">
      <FileSelector>
        {({ dragOver, handleDrop, handleFileSelect, selectedFile }) => (
          <div 
            className={`image-drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-input"
            />
            
            <FilePreview>
              {({ hasPreview, previewUrl, canPreview }) => (
                <>
                  {hasPreview && canPreview ? (
                    <div className="image-preview">
                      <img src={previewUrl} alt="Preview" />
                      <div className="preview-actions">
                        <label htmlFor="image-input">Change Image</label>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="image-input" className="upload-prompt">
                      <div className="upload-icon">🖼️</div>
                      <p>Drop image here or click to browse</p>
                    </label>
                  )}
                </>
              )}
            </FilePreview>
          </div>
        )}
      </FileSelector>

      <ValidationStatus>
        {({ isValid, error }) => (
          !isValid && error && (
            <div className="validation-error">{error}</div>
          )
        )}
      </ValidationStatus>

      <UploadTrigger>
        {({ uploadFile, canUpload, isUploading }) => (
          <div className="upload-controls">
            <button
              onClick={uploadFile}
              disabled={!canUpload}
              className="primary-button"
            >
              {isUploading ? 'Uploading Image...' : 'Upload Image'}
            </button>
          </div>
        )}
      </UploadTrigger>
    </div>
  );
}
```

---

### services

##### media gallery service


## Overview

The MediaGalleryService is a headless service that manages media gallery functionality including image navigation, selection, and display state management. It provides reactive state management for media collections with support for cycling through images, selecting specific items, and managing the current display state.

This service is designed to work with image galleries, carousels, lightboxes, and similar media display components. It uses Wix's signals system for reactive updates and provides a clean API for managing media collections and user interactions.

## Exports

### `MediaItem`
**Type**: `interface`

Interface defining the structure of media items in the gallery.
- `image?`: string | null - URL or path to the image
- `altText?`: string | null - Alternative text for accessibility

### `MediaGalleryServiceAPI`
**Type**: `interface`

Complete API interface for the media gallery service including signals for state management and methods for navigation and media management.

### `MediaGalleryServiceDefinition`
**Type**: `ServiceDefinition<MediaGalleryServiceAPI>`

Service definition that identifies and types the media gallery service within Wix's service manager system.

### `MediaGalleryService`
**Type**: `ServiceImplementation<MediaGalleryServiceAPI>`

Main service implementation providing all media gallery functionality including navigation, selection, and media management.

## Usage Examples

### Basic Media Gallery Setup
```tsx
import { useService } from '@wix/services-manager-react';
import { MediaGalleryServiceDefinition } from './headless/media/services/media-gallery-service';

function MediaGallery({ images }) {
  const galleryService = useService(MediaGalleryServiceDefinition);
  
  const selectedIndex = galleryService.selectedMediaIndex.use();
  const mediaToDisplay = galleryService.mediaToDisplay.use();
  const totalMedia = galleryService.totalMedia.use();
  
  useEffect(() => {
    galleryService.setMediaToDisplay(images);
  }, [images]);
  
  const currentImage = mediaToDisplay[selectedIndex];
  
  return (
    <div className="media-gallery">
      <div className="main-image">
        {currentImage && (
          <img
            src={currentImage.image}
            alt={currentImage.altText || 'Gallery image'}
            className="w-full h-96 object-cover"
          />
        )}
      </div>
      
      <div className="gallery-controls">
        <button
          onClick={() => galleryService.previousMedia()}
          disabled={totalMedia <= 1}
        >
          Previous
        </button>
        
        <span>{selectedIndex + 1} of {totalMedia}</span>
        
        <button
          onClick={() => galleryService.nextMedia()}
          disabled={totalMedia <= 1}
        >
          Next
        </button>
      </div>
      
      <div className="thumbnail-strip">
        {mediaToDisplay.map((item, index) => (
          <button
            key={index}
            onClick={() => galleryService.setSelectedMediaIndex(index)}
            className={`thumbnail ${index === selectedIndex ? 'active' : ''}`}
          >
            <img
              src={item.image}
              alt={item.altText || `Thumbnail ${index + 1}`}
              className="w-16 h-16 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Product Image Gallery
```tsx
function ProductImageGallery({ product }) {
  const galleryService = useService(MediaGalleryServiceDefinition);
  
  const selectedIndex = galleryService.selectedMediaIndex.use();
  const mediaToDisplay = galleryService.mediaToDisplay.use();
  
  useEffect(() => {
    const mediaItems = product.media?.items?.map(item => ({
      image: item.image?.url,
      altText: item.image?.altText || product.name
    })) || [];
    
    galleryService.setMediaToDisplay(mediaItems);
  }, [product]);
  
  const currentImage = mediaToDisplay[selectedIndex];
  
  return (
    <div className="product-gallery">
      <div className="main-viewer">
        {currentImage ? (
          <img
            src={currentImage.image}
            alt={currentImage.altText}
            className="w-full h-[500px] object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
            <span>No image available</span>
          </div>
        )}
        
        {/* Navigation arrows */}
        <button
          onClick={() => galleryService.previousMedia()}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2"
        >
          ←
        </button>
        <button
          onClick={() => galleryService.nextMedia()}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2"
        >
          →
        </button>
      </div>
      
      <div className="thumbnails mt-4 flex gap-2 overflow-x-auto">
        {mediaToDisplay.map((item, index) => (
          <button
            key={index}
            onClick={() => galleryService.setSelectedMediaIndex(index)}
            className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
              index === selectedIndex ? 'border-blue-500' : 'border-gray-300'
            }`}
          >
            <img
              src={item.image}
              alt={item.altText}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Lightbox Gallery
```tsx
function LightboxGallery({ images, isOpen, onClose }) {
  const galleryService = useService(MediaGalleryServiceDefinition);
  
  const selectedIndex = galleryService.selectedMediaIndex.use();
  const mediaToDisplay = galleryService.mediaToDisplay.use();
  const totalMedia = galleryService.totalMedia.use();
  
  useEffect(() => {
    if (isOpen && images) {
      galleryService.setMediaToDisplay(images);
    }
  }, [isOpen, images]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          galleryService.previousMedia();
          break;
        case 'ArrowRight':
          galleryService.nextMedia();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const currentImage = mediaToDisplay[selectedIndex];
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        ×
      </button>
      
      <div className="max-w-5xl max-h-[90vh] relative">
        {currentImage && (
          <img
            src={currentImage.image}
            alt={currentImage.altText}
            className="max-w-full max-h-full object-contain"
          />
        )}
        
        {totalMedia > 1 && (
          <>
            <button
              onClick={() => galleryService.previousMedia()}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70"
            >
              ← Previous
            </button>
            <button
              onClick={() => galleryService.nextMedia()}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70"
            >
              Next →
            </button>
          </>
        )}
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
          {selectedIndex + 1} / {totalMedia}
        </div>
      </div>
    </div>
  );
}
```

### Carousel Implementation
```tsx
function MediaCarousel({ autoPlay = false, interval = 3000 }) {
  const galleryService = useService(MediaGalleryServiceDefinition);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  const selectedIndex = galleryService.selectedMediaIndex.use();
  const mediaToDisplay = galleryService.mediaToDisplay.use();
  const totalMedia = galleryService.totalMedia.use();
  
  useEffect(() => {
    if (!isPlaying || totalMedia <= 1) return;
    
    const timer = setInterval(() => {
      galleryService.nextMedia();
    }, interval);
    
    return () => clearInterval(timer);
  }, [isPlaying, totalMedia, interval]);
  
  const currentImage = mediaToDisplay[selectedIndex];
  
  return (
    <div className="carousel relative">
      <div className="carousel-viewport h-64 overflow-hidden rounded-lg">
        {currentImage && (
          <img
            src={currentImage.image}
            alt={currentImage.altText}
            className="w-full h-full object-cover transition-all duration-500"
          />
        )}
      </div>
      
      <div className="carousel-controls absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-white/80 rounded-full p-2"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="flex gap-2">
          {mediaToDisplay.map((_, index) => (
            <button
              key={index}
              onClick={() => galleryService.setSelectedMediaIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === selectedIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Grid Gallery with Modal
```tsx
function GridGallery({ images }) {
  const galleryService = useService(MediaGalleryServiceDefinition);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleImageClick = (index) => {
    galleryService.setSelectedMediaIndex(index);
    setIsModalOpen(true);
  };
  
  useEffect(() => {
    galleryService.setMediaToDisplay(images);
  }, [images]);
  
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className="aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
          >
            <img
              src={image.image}
              alt={image.altText}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      
      <LightboxGallery
        images={images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
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

### Basic Product Grid

```typescript
import { Collection } from './headless/store/components';

function ProductGrid() {
  return (
    <Collection.Grid>
      {({ products, isLoading, error, isEmpty }) => {
        if (isLoading) return <div>Loading products...</div>;
        if (error) return <div>Error: {error}</div>;
        if (isEmpty) return <div>No products found</div>;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Collection.Item key={product._id} product={product}>
                {({ title, image, price, compareAtPrice, href, available }) => (
                  <div className="product-card">
                    <a href={href}>
                      {image && <img src={image} alt={title} />}
                      <h3>{title}</h3>
                      <div className="price">
                        <span className="current-price">{price}</span>
                        {compareAtPrice && (
                          <span className="original-price">{compareAtPrice}</span>
                        )}
                      </div>
                      {!available && <span className="out-of-stock">Out of Stock</span>}
                    </a>
                  </div>
                )}
              </Collection.Item>
            ))}
          </div>
        );
      }}
    </Collection.Grid>
  );
}
```

### Collection with Header and Load More

```typescript
import { Collection } from './headless/store/components';

function ProductCollection() {
  return (
    <div className="product-collection">
      <Collection.Header>
        {({ totalProducts, isLoading, hasProducts }) => (
          <div className="collection-header">
            <h2>Our Products</h2>
            {hasProducts && !isLoading && (
              <p>{totalProducts} products available</p>
            )}
          </div>
        )}
      </Collection.Header>

      <Collection.Grid>
        {({ products, isLoading, error, isEmpty }) => (
          <div className="products-container">
            {isLoading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {isEmpty && <div className="empty">No products found</div>}
            
            <div className="product-grid">
              {products.map(product => (
                <Collection.Item key={product._id} product={product}>
                  {(itemProps) => <ProductCard {...itemProps} />}
                </Collection.Item>
              ))}
            </div>
          </div>
        )}
      </Collection.Grid>

      <Collection.LoadMore>
        {({ loadMore, hasMoreProducts, isLoading }) => (
          hasMoreProducts && (
            <div className="load-more-container">
              <button 
                onClick={loadMore}
                disabled={isLoading}
                className="load-more-btn"
              >
                {isLoading ? 'Loading...' : 'Load More Products'}
              </button>
            </div>
          )
        )}
      </Collection.LoadMore>
    </div>
  );
}
```

### Product Card Component

```typescript
import { Collection } from './headless/store/components';

function ProductCard({ product }: { product: productsV3.V3Product }) {
  return (
    <Collection.Item product={product}>
      {({ 
        title, 
        image, 
        price, 
        compareAtPrice, 
        description, 
        available, 
        href 
      }) => (
        <div className={`product-card ${!available ? 'unavailable' : ''}`}>
          <a href={href} className="product-link">
            <div className="product-image">
              {image ? (
                <img src={image} alt={title} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
              {!available && (
                <div className="availability-overlay">Out of Stock</div>
              )}
            </div>
            
            <div className="product-info">
              <h3 className="product-title">{title}</h3>
              <p className="product-description">
                {description.substring(0, 100)}...
              </p>
              
              <div className="product-pricing">
                <span className="current-price">{price}</span>
                {compareAtPrice && (
                  <span className="compare-price">{compareAtPrice}</span>
                )}
              </div>
            </div>
          </a>
        </div>
      )}
    </Collection.Item>
  );
}
```

### Collection with Actions

```typescript
import { Collection } from './headless/store/components';

function CollectionWithActions() {
  return (
    <div className="collection-container">
      <Collection.Actions>
        {({ refresh, error, isLoading }) => (
          <div className="collection-actions">
            <button 
              onClick={refresh}
              disabled={isLoading}
              className="refresh-btn"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Products'}
            </button>
            {error && (
              <div className="error-message">
                Error: {error}
                <button onClick={refresh}>Try Again</button>
              </div>
            )}
          </div>
        )}
      </Collection.Actions>

      <Collection.Grid>
        {({ products, isLoading, isEmpty }) => (
          <div className="product-grid">
            {/* Product grid content */}
          </div>
        )}
      </Collection.Grid>
    </div>
  );
}
```

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

### Basic Product Name Display

```typescript
import { Product } from './headless/store/components';

function ProductNameDisplay() {
  return (
    <Product.Name>
      {({ name }) => (
        <h1 className="product-title">{name}</h1>
      )}
    </Product.Name>
  );
}
```

### Product Description with Rich Content

```typescript
import { Product } from './headless/store/components';

function ProductDescriptionDisplay() {
  return (
    <Product.Description>
      {({ description, plainDescription }) => (
        <div className="product-description">
          {/* Rich content description */}
          <div 
            className="rich-description"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          
          {/* Fallback to plain description if needed */}
          {!description && (
            <p className="plain-description">{plainDescription}</p>
          )}
        </div>
      )}
    </Product.Description>
  );
}
```

### Complete Product Header

```typescript
import { Product } from './headless/store/components';

function ProductHeader() {
  return (
    <div className="product-header">
      <Product.Name>
        {({ name }) => (
          <h1 className="text-3xl font-bold mb-4">{name}</h1>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ description, plainDescription }) => (
          <div className="text-gray-600 mb-6">
            {description ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p>{plainDescription}</p>
            )}
          </div>
        )}
      </Product.Description>
    </div>
  );
}
```

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

### Conditional Product Display

```typescript
import { Product } from './headless/store/components';

function ConditionalProductInfo() {
  return (
    <div className="product-info">
      <Product.Name>
        {({ name }) => (
          <h2 className={name.length > 50 ? 'text-lg' : 'text-xl'}>
            {name}
          </h2>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ description, plainDescription }) => {
          const hasRichContent = description && description.length > 0;
          const hasPlainContent = plainDescription && plainDescription.length > 0;
          
          if (!hasRichContent && !hasPlainContent) {
            return <p className="text-gray-500">No description available</p>;
          }
          
          return (
            <div className="description">
              {hasRichContent ? (
                <div dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                <p>{plainDescription}</p>
              )}
            </div>
          );
        }}
      </Product.Description>
    </div>
  );
}
```

### Product Card Component

```typescript
import { Product } from './headless/store/components';

function ProductCard() {
  return (
    <div className="product-card">
      <Product.Name>
        {({ name }) => (
          <h3 className="product-card-title">{name}</h3>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ plainDescription }) => (
          <p className="product-card-description">
            {plainDescription.length > 100 
              ? `${plainDescription.substring(0, 100)}...`
              : plainDescription
            }
          </p>
        )}
      </Product.Description>
    </div>
  );
}
```

### Breadcrumb with Product Name

```typescript
import { Product } from './headless/store/components';

function ProductBreadcrumb() {
  return (
    <nav className="breadcrumb">
      <a href="/store">Store</a>
      <span> / </span>
      <Product.Name>
        {({ name }) => (
          <span className="current-product">{name}</span>
        )}
      </Product.Name>
    </nav>
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

### Basic Category Service Setup

```typescript
import { CategoryService, CategoryServiceDefinition } from './headless/store/services/category-service';

// Configure and register the service
const categoryServiceConfig = {
  categories: [],
  initialCategoryId: null,
  onCategoryChange: (categoryId, category) => {
    console.log('Category changed:', category?.name);
  }
};

// Use in component
function CategoryComponent() {
  const categoryService = useService(CategoryServiceDefinition);
  
  useEffect(() => {
    categoryService.loadCategories();
  }, []);

  return (
    <div>
      <p>Selected: {categoryService.selectedCategory.get()}</p>
      <button onClick={() => categoryService.setSelectedCategory('category-1')}>
        Select Category 1
      </button>
    </div>
  );
}
```

### With Navigation Integration

```typescript
import { CategoryService } from './headless/store/services/category-service';
import { useRouter } from 'next/router';

function StoreWithCategoryNavigation() {
  const router = useRouter();
  
  const categoryServiceConfig = {
    categories: [],
    initialCategoryId: router.query.category as string,
    onCategoryChange: (categoryId, category) => {
      // Update URL when category changes
      if (categoryId) {
        router.push(`/store/category/${category?.slug}`);
      } else {
        router.push('/store');
      }
    }
  };

  return (
    <ServiceProvider services={[
      [CategoryServiceDefinition, categoryServiceConfig]
    ]}>
      <StoreLayout />
    </ServiceProvider>
  );
}
```

### Category List Component

```typescript
import { CategoryServiceDefinition } from './headless/store/services/category-service';
import { useService } from '@wix/services-manager-react';

function CategoryList() {
  const categoryService = useService(CategoryServiceDefinition);
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();

  return (
    <div>
      <h3>Categories</h3>
      <ul>
        <li>
          <button
            onClick={() => categoryService.setSelectedCategory(null)}
            className={selectedCategory === null ? 'active' : ''}
          >
            All Products
          </button>
        </li>
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

### Auto-Loading Categories

```typescript
import { CategoryServiceDefinition, loadCategoriesConfig } from './headless/store/services/category-service';

async function setupCategoryService() {
  // Load categories from API
  const { categories } = await loadCategoriesConfig();
  
  const config = {
    categories,
    initialCategoryId: categories[0]?._id || null,
    onCategoryChange: (categoryId, category) => {
      // Track category selection
      analytics.track('Category Selected', {
        categoryId,
        categoryName: category?.name
      });
    }
  };

  return config;
}
```

### Reactive Category Display

```typescript
import { CategoryServiceDefinition } from './headless/store/services/category-service';
import { useSignal } from '@wix/services-manager-react';

function CategoryBreadcrumb() {
  const categoryService = useService(CategoryServiceDefinition);
  const selectedCategory = useSignal(categoryService.selectedCategory);
  const categories = useSignal(categoryService.categories);
  
  const currentCategory = selectedCategory 
    ? categories.find(cat => cat._id === selectedCategory)
    : null;

  return (
    <nav className="breadcrumb">
      <a href="/store">Store</a>
      {currentCategory && (
        <>
          <span> / </span>
          <span>{currentCategory.name}</span>
        </>
      )}
    </nav>
  );
}
```

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

### Basic Filter Service Integration
```tsx
import { useService } from '@wix/services-manager-react';
import { FilterServiceDefinition } from './headless/store/services/filter-service';

function FilterComponent() {
  const filterService = useService(FilterServiceDefinition);
  
  const currentFilters = filterService.currentFilters.use();
  const availableOptions = filterService.availableOptions.use();
  const isFullyLoaded = filterService.isFullyLoaded.use();
  
  if (!isFullyLoaded) {
    return <div>Loading filters...</div>;
  }
  
  return (
    <div className="filters">
      <PriceRangeFilter 
        priceRange={availableOptions.priceRange}
        selectedRange={currentFilters.priceRange}
        onChange={(range) => filterService.applyFilters({
          ...currentFilters,
          priceRange: range
        })}
      />
      
      {availableOptions.productOptions.map(option => (
        <OptionFilter
          key={option.id}
          option={option}
          selectedChoices={currentFilters.selectedOptions[option.id] || []}
          onChange={(choices) => filterService.applyFilters({
            ...currentFilters,
            selectedOptions: {
              ...currentFilters.selectedOptions,
              [option.id]: choices
            }
          })}
        />
      ))}
      
      <button onClick={() => filterService.clearFilters()}>
        Clear All Filters
      </button>
    </div>
  );
}
```

### Price Range Filter Component
```tsx
import { useState } from 'react';

function PriceRangeFilter({ priceRange, selectedRange, onChange }) {
  const [localMin, setLocalMin] = useState(selectedRange.min);
  const [localMax, setLocalMax] = useState(selectedRange.max);
  
  const handleApply = () => {
    onChange({ min: localMin, max: localMax });
  };
  
  return (
    <div className="price-filter">
      <h3>Price Range</h3>
      <div className="price-inputs">
        <label>
          Min: $
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(Number(e.target.value))}
            min={priceRange.min}
            max={priceRange.max}
          />
        </label>
        <label>
          Max: $
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(Number(e.target.value))}
            min={priceRange.min}
            max={priceRange.max}
          />
        </label>
      </div>
      <button onClick={handleApply}>Apply</button>
    </div>
  );
}
```

### Product Option Filter Component
```tsx
function OptionFilter({ option, selectedChoices, onChange }) {
  const handleChoiceToggle = (choiceId) => {
    const newChoices = selectedChoices.includes(choiceId)
      ? selectedChoices.filter(id => id !== choiceId)
      : [...selectedChoices, choiceId];
    onChange(newChoices);
  };
  
  if (option.optionRenderType === 'color') {
    return (
      <div className="color-filter">
        <h4>{option.name}</h4>
        <div className="color-choices">
          {option.choices.map(choice => (
            <button
              key={choice.id}
              onClick={() => handleChoiceToggle(choice.id)}
              className={`color-choice ${selectedChoices.includes(choice.id) ? 'selected' : ''}`}
              style={{ backgroundColor: choice.colorCode }}
              title={choice.name}
            />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="option-filter">
      <h4>{option.name}</h4>
      <div className="option-choices">
        {option.choices.map(choice => (
          <label key={choice.id} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedChoices.includes(choice.id)}
              onChange={() => handleChoiceToggle(choice.id)}
            />
            {choice.name}
          </label>
        ))}
      </div>
    </div>
  );
}
```

### Advanced Filter Panel
```tsx
function AdvancedFilterPanel() {
  const filterService = useService(FilterServiceDefinition);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentFilters = filterService.currentFilters.use();
  const availableOptions = filterService.availableOptions.use();
  
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    // Count price filter if not at defaults
    if (currentFilters.priceRange.min > availableOptions.priceRange.min ||
        currentFilters.priceRange.max < availableOptions.priceRange.max) {
      count++;
    }
    
    // Count option filters
    Object.values(currentFilters.selectedOptions).forEach(choices => {
      if (choices.length > 0) count++;
    });
    
    return count;
  }, [currentFilters, availableOptions]);
  
  return (
    <div className="filter-panel">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="filter-toggle"
      >
        Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>
      
      {isExpanded && (
        <div className="filter-content">
          <div className="filter-header">
            <h3>Filter Products</h3>
            {activeFilterCount > 0 && (
              <button 
                onClick={() => filterService.clearFilters()}
                className="clear-all"
              >
                Clear All
              </button>
            )}
          </div>
          
          <FilterComponent />
        </div>
      )}
    </div>
  );
}
```

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

### Filter Summary Component
```tsx
function FilterSummary() {
  const filterService = useService(FilterServiceDefinition);
  const currentFilters = filterService.currentFilters.use();
  const availableOptions = filterService.availableOptions.use();
  
  const appliedFilters = useMemo(() => {
    const filters = [];
    
    // Add price filter
    const { min, max } = currentFilters.priceRange;
    const { min: availableMin, max: availableMax } = availableOptions.priceRange;
    
    if (min > availableMin || max < availableMax) {
      filters.push({
        type: 'price',
        label: `$${min} - $${max}`,
        clear: () => filterService.applyFilters({
          ...currentFilters,
          priceRange: { min: availableMin, max: availableMax }
        })
      });
    }
    
    // Add option filters
    Object.entries(currentFilters.selectedOptions).forEach(([optionId, choiceIds]) => {
      if (choiceIds.length > 0) {
        const option = availableOptions.productOptions.find(opt => opt.id === optionId);
        if (option) {
          const selectedChoices = option.choices.filter(choice => 
            choiceIds.includes(choice.id)
          );
          
          filters.push({
            type: 'option',
            label: `${option.name}: ${selectedChoices.map(c => c.name).join(', ')}`,
            clear: () => filterService.applyFilters({
              ...currentFilters,
              selectedOptions: {
                ...currentFilters.selectedOptions,
                [optionId]: []
              }
            })
          });
        }
      }
    });
    
    return filters;
  }, [currentFilters, availableOptions]);
  
  if (appliedFilters.length === 0) return null;
  
  return (
    <div className="filter-summary">
      <span>Filters:</span>
      {appliedFilters.map((filter, index) => (
        <div key={index} className="filter-tag">
          {filter.label}
          <button onClick={filter.clear} className="remove-filter">×</button>
        </div>
      ))}
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

### Service Registration
```typescript
import { ProductService, ProductServiceDefinition, loadProductServiceConfig } from './headless/store/services/product-service';

// Load configuration and register service
const configResult = await loadProductServiceConfig('my-product-slug');

if (configResult.type === 'success') {
  const servicesMap = createServicesMap()
    .addService(ProductServiceDefinition, ProductService, configResult.config);
}
```

### Using Product Service in React Components
```tsx
import { useService } from '@wix/services-manager-react';
import { ProductServiceDefinition } from './headless/store/services/product-service';

function ProductDetailPage() {
  const productService = useService(ProductServiceDefinition);
  
  const product = productService.product.use();
  const isLoading = productService.isLoading.use();
  const error = productService.error.use();
  
  if (isLoading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <div>Price: {product.priceData?.formatted?.price}</div>
      {product.media?.mainMedia && (
        <img 
          src={product.media.mainMedia.image?.url} 
          alt={product.name}
        />
      )}
    </div>
  );
}
```

### Dynamic Product Loading
```tsx
function ProductLoader({ productSlug }: { productSlug: string }) {
  const productService = useService(ProductServiceDefinition);
  const [loading, setLoading] = useState(false);
  
  const handleLoadProduct = async () => {
    setLoading(true);
    try {
      await productService.loadProduct(productSlug);
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    handleLoadProduct();
  }, [productSlug]);
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      <ProductDetailPage />
    </div>
  );
}
```

### Product Information Display
```tsx
function ProductInfo() {
  const productService = useService(ProductServiceDefinition);
  const product = productService.product.use();
  
  return (
    <div className="product-info">
      <div className="product-header">
        <h1>{product.name}</h1>
        {product.ribbon && <span className="ribbon">{product.ribbon}</span>}
      </div>
      
      <div className="product-media">
        {product.media?.items?.map((media, index) => (
          <img
            key={index}
            src={media.image?.url}
            alt={`${product.name} image ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="product-details">
        <div className="price">
          {product.priceData?.formatted?.discountedPrice ? (
            <>
              <span className="original-price">
                {product.priceData.formatted.price}
              </span>
              <span className="discounted-price">
                {product.priceData.formatted.discountedPrice}
              </span>
            </>
          ) : (
            <span className="price">
              {product.priceData?.formatted?.price}
            </span>
          )}
        </div>
        
        <div className="description">
          {product.description && (
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          )}
        </div>
        
        <div className="categories">
          {product.productType?.name && (
            <span>Category: {product.productType.name}</span>
          )}
        </div>
        
        {product.additionalInfoSections?.map((section, index) => (
          <div key={index} className="info-section">
            <h3>{section.title}</h3>
            <p>{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

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

### Basic Related Products Display

```typescript
import { RelatedProductsServiceDefinition } from './headless/store/services/related-products-service';

function RelatedProductsSection() {
  const relatedService = useService(RelatedProductsServiceDefinition);
  const relatedProducts = useSignal(relatedService.relatedProducts);
  const isLoading = useSignal(relatedService.isLoading);
  const hasRelatedProducts = useSignal(relatedService.hasRelatedProducts);

  if (isLoading) {
    return <div>Loading related products...</div>;
  }

  if (!hasRelatedProducts) {
    return null; // Don't show section if no related products
  }

  return (
    <section className="related-products">
      <h2>You might also like</h2>
      <div className="products-grid">
        {relatedProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

### Product Detail Page Integration

```typescript
import { RelatedProductsServiceDefinition, loadRelatedProductsServiceConfig } from './headless/store/services/related-products-service';

function ProductDetailPage({ productId }: { productId: string }) {
  // Configure service with current product
  useEffect(() => {
    const configureService = async () => {
      const config = await loadRelatedProductsServiceConfig(productId, 6);
      // Service configuration would be applied here
    };
    configureService();
  }, [productId]);

  return (
    <div className="product-detail">
      <ProductInfo productId={productId} />
      <RelatedProductsSection />
    </div>
  );
}

function RelatedProductsSection() {
  const relatedService = useService(RelatedProductsServiceDefinition);
  const relatedProducts = useSignal(relatedService.relatedProducts);
  const error = useSignal(relatedService.error);

  return (
    <div className="related-section">
      <h3>Related Products</h3>
      {error && (
        <div className="error-message">
          Failed to load related products
          <button onClick={() => relatedService.refreshRelatedProducts()}>
            Try Again
          </button>
        </div>
      )}
      
      <div className="related-grid">
        {relatedProducts.map(product => (
          <RelatedProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

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

### Custom Related Products Logic

```typescript
import { RelatedProductsServiceDefinition } from './headless/store/services/related-products-service';

function CustomRelatedProducts({ currentProduct }: { currentProduct: Product }) {
  const relatedService = useService(RelatedProductsServiceDefinition);

  const loadCustomRelated = async () => {
    // Custom logic to load related products based on categories, tags, etc.
    await relatedService.loadRelatedProducts(currentProduct._id, 8);
  };

  useEffect(() => {
    loadCustomRelated();
  }, [currentProduct._id]);

  return <RelatedProductsDisplay />;
}
```

### Related Products with Analytics

```typescript
import { RelatedProductsServiceDefinition } from './headless/store/services/related-products-service';

function TrackedRelatedProducts() {
  const relatedService = useService(RelatedProductsServiceDefinition);
  const relatedProducts = useSignal(relatedService.relatedProducts);

  // Track when related products are viewed
  useEffect(() => {
    if (relatedProducts.length > 0) {
      analytics.track('Related Products Viewed', {
        productCount: relatedProducts.length,
        productIds: relatedProducts.map(p => p._id)
      });
    }
  }, [relatedProducts]);

  const handleProductClick = (product: Product) => {
    analytics.track('Related Product Clicked', {
      productId: product._id,
      productName: product.name,
      position: relatedProducts.findIndex(p => p._id === product._id)
    });
  };

  return (
    <div className="related-products">
      {relatedProducts.map((product, index) => (
        <div 
          key={product._id}
          onClick={() => handleProductClick(product)}
          className="related-product-item"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
```

### Error Handling and Retry

```typescript
import { RelatedProductsServiceDefinition } from './headless/store/services/related-products-service';

function RobustRelatedProducts() {
  const relatedService = useService(RelatedProductsServiceDefinition);
  const error = useSignal(relatedService.error);
  const isLoading = useSignal(relatedService.isLoading);
  const hasRelatedProducts = useSignal(relatedService.hasRelatedProducts);

  const handleRetry = async () => {
    try {
      await relatedService.refreshRelatedProducts();
    } catch (err) {
      console.error('Failed to refresh related products:', err);
    }
  };

  if (error) {
    return (
      <div className="related-products-error">
        <h3>Unable to load related products</h3>
        <p>{error}</p>
        <button 
          onClick={handleRetry}
          disabled={isLoading}
          className="retry-button"
        >
          {isLoading ? 'Retrying...' : 'Try Again'}
        </button>
      </div>
    );
  }

  if (!hasRelatedProducts && !isLoading) {
    return (
      <div className="no-related-products">
        <p>No related products found</p>
      </div>
    );
  }

  return <RelatedProductsList />;
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

### Basic Product Variant Selection

```typescript
import { SelectedVariantServiceDefinition } from './headless/store/services/selected-variant-service';

function ProductDetails() {
  const variantService = useService(SelectedVariantServiceDefinition);
  const selectedChoices = useSignal(variantService.selectedChoices);
  const currentPrice = useSignal(variantService.currentPrice);
  const isInStock = useSignal(variantService.isInStock);

  return (
    <div>
      <h1>Product Details</h1>
      <p>Price: {currentPrice}</p>
      <p>Stock: {isInStock ? 'In Stock' : 'Out of Stock'}</p>
      
      <div>
        <h3>Selected Options:</h3>
        {Object.entries(selectedChoices).map(([option, choice]) => (
          <p key={option}>{option}: {choice}</p>
        ))}
      </div>
    </div>
  );
}
```

### Product Option Selector

```typescript
import { SelectedVariantServiceDefinition } from './headless/store/services/selected-variant-service';

function ProductOptionSelector() {
  const variantService = useService(SelectedVariantServiceDefinition);
  const productOptions = useSignal(variantService.productOptions);
  const selectedChoices = useSignal(variantService.selectedChoices);

  return (
    <div className="product-options">
      {productOptions.map(option => (
        <div key={option.name} className="option-group">
          <h4>{option.name}</h4>
          <div className="choices">
            {option.choices?.map(choice => (
              <button
                key={choice.value}
                onClick={() => variantService.setOption(option.name!, choice.value!)}
                className={selectedChoices[option.name!] === choice.value ? 'selected' : ''}
                disabled={!variantService.isChoiceAvailable(option.name!, choice.value!)}
              >
                {choice.description}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Quantity Selector with Stock Validation

```typescript
import { SelectedVariantServiceDefinition } from './headless/store/services/selected-variant-service';

function QuantitySelector() {
  const variantService = useService(SelectedVariantServiceDefinition);
  const selectedQuantity = useSignal(variantService.selectedQuantity);
  const quantityAvailable = useSignal(variantService.quantityAvailable);
  const trackQuantity = useSignal(variantService.trackQuantity);

  const maxQuantity = trackQuantity && quantityAvailable ? quantityAvailable : 10;

  return (
    <div className="quantity-selector">
      <button 
        onClick={() => variantService.decrementQuantity()}
        disabled={selectedQuantity <= 1}
      >
        -
      </button>
      
      <input
        type="number"
        value={selectedQuantity}
        onChange={(e) => variantService.setSelectedQuantity(parseInt(e.target.value))}
        min="1"
        max={maxQuantity}
      />
      
      <button 
        onClick={() => variantService.incrementQuantity()}
        disabled={selectedQuantity >= maxQuantity}
      >
        +
      </button>
      
      {trackQuantity && quantityAvailable && (
        <p>
          {quantityAvailable} available
          {variantService.isLowStock(5) && ' (Low Stock!)'}
        </p>
      )}
    </div>
  );
}
```

### Add to Cart Integration

```typescript
import { SelectedVariantServiceDefinition } from './headless/store/services/selected-variant-service';

function AddToCartButton() {
  const variantService = useService(SelectedVariantServiceDefinition);
  const isLoading = useSignal(variantService.isLoading);
  const isInStock = useSignal(variantService.isInStock);
  const selectedQuantity = useSignal(variantService.selectedQuantity);
  const hasSelections = variantService.hasAnySelections();

  const handleAddToCart = async () => {
    try {
      await variantService.addToCart(selectedQuantity);
      // Show success message
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!isInStock || isLoading || !hasSelections}
      className="add-to-cart-btn"
    >
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Price Display with Discounts

```typescript
import { SelectedVariantServiceDefinition } from './headless/store/services/selected-variant-service';

function PriceDisplay() {
  const variantService = useService(SelectedVariantServiceDefinition);
  const currentPrice = useSignal(variantService.currentPrice);
  const currentCompareAtPrice = useSignal(variantService.currentCompareAtPrice);
  const isOnSale = useSignal(variantService.isOnSale);
  const currency = useSignal(variantService.currency);

  return (
    <div className="price-display">
      <span className="current-price">
        {currency} {currentPrice}
      </span>
      
      {isOnSale && currentCompareAtPrice && (
        <span className="original-price">
          {currency} {currentCompareAtPrice}
        </span>
      )}
      
      {isOnSale && (
        <span className="sale-badge">Sale!</span>
      )}
    </div>
  );
}
```

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

### Basic Sort Service Setup

```typescript
import { SortService, SortServiceDefinition } from './headless/store/services/sort-service';

// Configure and register the service
const sortServiceConfig = {
  initialSort: "price-asc" as SortBy
};

// Use in component
function SortControls() {
  const sortService = useService(SortServiceDefinition);
  const currentSort = useSignal(sortService.currentSort);

  return (
    <select 
      value={currentSort} 
      onChange={(e) => sortService.setSortBy(e.target.value as SortBy)}
    >
      <option value="">Newest First</option>
      <option value="name-asc">Name A-Z</option>
      <option value="name-desc">Name Z-A</option>
      <option value="price-asc">Price Low to High</option>
      <option value="price-desc">Price High to Low</option>
    </select>
  );
}
```

### Sort Dropdown Component

```typescript
import { SortServiceDefinition, SortBy } from './headless/store/services/sort-service';
import { useService } from '@wix/services-manager-react';

function SortDropdown() {
  const sortService = useService(SortServiceDefinition);
  const currentSort = useSignal(sortService.currentSort);

  const sortOptions = [
    { value: "", label: "Latest Arrivals" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" }
  ];

  return (
    <div className="sort-dropdown">
      <label>Sort by:</label>
      <select
        value={currentSort}
        onChange={(e) => sortService.setSortBy(e.target.value as SortBy)}
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

### URL Synchronization

```typescript
import { SortServiceDefinition } from './headless/store/services/sort-service';
import { useRouter } from 'next/router';

function SortWithURL() {
  const router = useRouter();
  const sortService = useService(SortServiceDefinition);

  // Initialize sort from URL parameter
  useEffect(() => {
    const urlSort = router.query.sort as string;
    const sortMap: Record<string, SortBy> = {
      'name_asc': 'name-asc',
      'name_desc': 'name-desc',
      'price_asc': 'price-asc',
      'price_desc': 'price-desc',
      'newest': ''
    };

    const sortBy = sortMap[urlSort] || '';
    sortService.setSortBy(sortBy);
  }, [router.query.sort]);

  return <SortDropdown />;
}
```

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

### Sort Button Group

```typescript
import { SortServiceDefinition, SortBy } from './headless/store/services/sort-service';

function SortButtons() {
  const sortService = useService(SortServiceDefinition);
  const currentSort = useSignal(sortService.currentSort);

  const sortButtons = [
    { key: "", label: "Newest", icon: "🆕" },
    { key: "price-asc", label: "Price ↑", icon: "💰" },
    { key: "price-desc", label: "Price ↓", icon: "💎" },
    { key: "name-asc", label: "A-Z", icon: "🔤" }
  ];

  return (
    <div className="sort-buttons">
      {sortButtons.map(button => (
        <button
          key={button.key}
          onClick={() => sortService.setSortBy(button.key as SortBy)}
          className={currentSort === button.key ? 'active' : ''}
        >
          {button.icon} {button.label}
        </button>
      ))}
    </div>
  );
}
```

### Advanced Sort with Analytics

```typescript
import { SortServiceDefinition } from './headless/store/services/sort-service';

function AnalyticsSortService() {
  const sortService = useService(SortServiceDefinition);

  const handleSortChange = async (sortBy: SortBy) => {
    // Track sort usage
    analytics.track('Product Sort Changed', {
      sortBy,
      previousSort: sortService.currentSort.get()
    });

    await sortService.setSortBy(sortBy);
  };

  // Monitor sort changes
  useEffect(() => {
    const unsubscribe = sortService.currentSort.subscribe(sortBy => {
      console.log('Sort changed to:', sortBy);
    });

    return unsubscribe;
  }, []);

  return { handleSortChange };
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

### BaseLayout


## Overview

The `BaseLayout` is an Astro layout component that provides the fundamental HTML structure for the application. It sets up the basic HTML document structure with meta tags, viewport configuration, client-side routing capabilities, and slot-based content injection. This layout serves as the foundation for all other layouts and pages in the application.

## Exports

### BaseLayout (Default Export)

```astro
---
import { ClientRouter } from "astro:transitions";
import "../styles/global.css";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <ClientRouter />
    <slot />
  </head>
  <body>
    <slot name="body" />
  </body>
</html>
```

An Astro layout component that provides the basic HTML document structure with responsive viewport settings and client-side routing support.

**Slots:**
- Default slot: Content injected into the `<head>` section
- `body` slot: Content injected into the `<body>` section

## Usage Examples

### Basic Page Layout

```astro
---
// src/pages/example.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <title>Example Page</title>
  <meta name="description" content="An example page" />
  
  <div slot="body">
    <h1>Welcome to Example Page</h1>
    <p>This content goes in the body.</p>
  </div>
</BaseLayout>
```

### Page with Custom Head Content

```astro
---
// src/pages/product.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <title>Product Details | My Store</title>
  <meta name="description" content="Product description for SEO" />
  <meta property="og:title" content="Product Details" />
  <meta property="og:description" content="Product description" />
  <link rel="canonical" href="https://mystore.com/product" />
  
  <main slot="body">
    <div class="container">
      <h1>Product Name</h1>
      <div class="product-details">
        <!-- Product content -->
      </div>
    </div>
  </main>
</BaseLayout>
```

### Layout with Custom Scripts

```astro
---
// src/pages/interactive.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <title>Interactive Page</title>
  <script>
    // Custom JavaScript for this page
    console.log('Page loaded');
  </script>
  <style>
    /* Page-specific styles */
    .interactive-content {
      background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
    }
  </style>
  
  <div slot="body" class="interactive-content">
    <h1>Interactive Content</h1>
    <button id="interactive-btn">Click Me</button>
  </div>
</BaseLayout>
```

### Multi-Language Support

```astro
---
// src/pages/es/inicio.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout>
  <title>Página de Inicio</title>
  <meta name="description" content="Página de inicio en español" />
  <html lang="es">
  
  <div slot="body">
    <header>
      <h1>Bienvenido</h1>
    </header>
    <main>
      <p>Contenido en español.</p>
    </main>
  </div>
</BaseLayout>
```

### Extended Layout Pattern

```astro
---
// src/layouts/StorePageLayout.astro
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<BaseLayout>
  <title>{title} | My Store</title>
  {description && <meta name="description" content={description} />}
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <div slot="body">
    <header class="store-header">
      <nav>
        <a href="/store">Store</a>
        <a href="/cart">Cart</a>
      </nav>
    </header>
    
    <main class="store-main">
      <slot />
    </main>
    
    <footer class="store-footer">
      <p>&copy; 2023 My Store</p>
    </footer>
  </div>
</BaseLayout>
```

### SEO-Optimized Usage

```astro
---
// src/pages/blog/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  // Generate paths for blog posts
}

const { slug } = Astro.params;
const post = await getPost(slug);
---

<BaseLayout>
  <title>{post.title} | My Blog</title>
  <meta name="description" content={post.excerpt} />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.excerpt} />
  <meta property="og:image" content={post.featuredImage} />
  <meta property="og:url" content={`https://myblog.com/blog/${slug}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href={`https://myblog.com/blog/${slug}`} />
  
  <article slot="body">
    <header>
      <h1>{post.title}</h1>
      <time>{post.publishedAt}</time>
    </header>
    <div set:html={post.content} />
  </article>
</BaseLayout>
```

### Development vs Production

```astro
---
// src/pages/development-example.astro
import BaseLayout from '../layouts/BaseLayout.astro';

const isDev = import.meta.env.DEV;
---

<BaseLayout>
  <title>Development Example</title>
  
  {isDev && (
    <script>
      // Development-only scripts
      console.log('Development mode active');
    </script>
  )}
  
  <div slot="body">
    <h1>Content</h1>
    {isDev && <div class="dev-tools">Development Tools</div>}
  </div>
</BaseLayout>
```

## Key Features

- **Responsive Viewport**: Properly configured viewport meta tag for mobile responsiveness
- **Client-Side Routing**: Integrated Astro ClientRouter for smooth page transitions
- **Global Styles**: Automatic inclusion of global CSS styles
- **Flexible Slots**: Separate slots for head and body content injection
- **HTML5 Structure**: Semantic HTML5 document structure
- **UTF-8 Encoding**: Proper character encoding setup
- **Language Support**: Lang attribute set to English by default
- **SEO Ready**: Basic meta tags structure for search engine optimization

## Dependencies

- **astro:transitions**: Astro's client-side routing capabilities
- **global.css**: Application-wide CSS styles

The BaseLayout provides a solid foundation for building consistent, accessible, and SEO-friendly web pages with Astro's component architecture.

---

### DocsLayout


## Overview

The `DocsLayout` is an Astro layout component specifically designed for documentation pages. It extends the BaseLayout and provides specialized styling, typography, and components for displaying technical documentation. The layout includes a table of contents component, comprehensive CSS styling for documentation content, and responsive design optimized for reading technical content.

## Exports

### DocsLayout (Default Export)

```astro
---
import BaseLayout from "./BaseLayout.astro";
import { TableOfContents } from "../components/TableOfContents";
---

<BaseLayout>
  <title>Documentation</title>
  <meta name="description" content="Component documentation" />
  <link rel="stylesheet" href="/src/styles/docs.css" />
  
  <!-- Comprehensive documentation styling -->
  <style is:global>
    /* Documentation-specific styles */
  </style>
  
  <div slot="body">
    <div class="docs-content">
      <TableOfContents client:load />
      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</BaseLayout>
```

An Astro layout component that provides a comprehensive documentation environment with table of contents, optimized typography, and styled content areas.

**Features:**
- Extends BaseLayout for core HTML structure
- Includes TableOfContents component for navigation
- Comprehensive CSS styling for documentation content
- Responsive design optimized for technical reading
- Typography optimized for code and prose

## Usage Examples

### Basic Documentation Page

```astro
---
// src/pages/docs/getting-started.astro
import DocsLayout from '../../layouts/DocsLayout.astro';
---

<DocsLayout>
  <h1>Getting Started</h1>
  
  <p>Welcome to our documentation. This guide will help you get started with our components.</p>
  
  <h2>Installation</h2>
  <pre><code>npm install @our/components</code></pre>
  
  <h2>Basic Usage</h2>
  <p>Here's how to use our components:</p>
  
  <code>
    import { Button } from '@our/components';
    
    function App() {
      return <Button>Click me</Button>;
    }
  </code>
</DocsLayout>
```

### API Documentation Page

```astro
---
// src/pages/docs/api/button.astro
import DocsLayout from '../../../layouts/DocsLayout.astro';
---

<DocsLayout>
  <h1>Button Component</h1>
  
  <div class="api-section">
    <h2>Props</h2>
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>variant</code></td>
          <td><code>string</code></td>
          <td><code>"primary"</code></td>
          <td>Button style variant</td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <div class="example-section">
    <h2>Examples</h2>
    <div class="example">
      <h3>Basic Button</h3>
      <pre><code>&lt;Button&gt;Click me&lt;/Button&gt;</code></pre>
    </div>
  </div>
</DocsLayout>
```

### Multi-Section Documentation

```astro
---
// src/pages/docs/components/overview.astro
import DocsLayout from '../../../layouts/DocsLayout.astro';
---

<DocsLayout>
  <h1>Component Overview</h1>
  
  <div class="overview-intro">
    <p>Our component library provides a comprehensive set of reusable UI components.</p>
  </div>
  
  <h2>Form Components</h2>
  <div class="component-grid">
    <div class="component-card">
      <h3><a href="/docs/components/button">Button</a></h3>
      <p>Interactive button component with multiple variants.</p>
    </div>
    <div class="component-card">
      <h3><a href="/docs/components/input">Input</a></h3>
      <p>Text input component with validation support.</p>
    </div>
  </div>
  
  <h2>Layout Components</h2>
  <div class="component-grid">
    <div class="component-card">
      <h3><a href="/docs/components/container">Container</a></h3>
      <p>Responsive container for content layout.</p>
    </div>
  </div>
  
  <h2>Navigation</h2>
  <ul>
    <li><a href="/docs/getting-started">Getting Started</a></li>
    <li><a href="/docs/theming">Theming</a></li>
    <li><a href="/docs/examples">Examples</a></li>
  </ul>
</DocsLayout>
```

### Code-Heavy Documentation

```astro
---
// src/pages/docs/examples/advanced.astro
import DocsLayout from '../../../layouts/DocsLayout.astro';
---

<DocsLayout>
  <h1>Advanced Examples</h1>
  
  <h2>Custom Hook Usage</h2>
  <p>Here's how to use our custom hooks in your components:</p>
  
  <pre><code class="language-tsx">
import { useLocalStorage, useDebounce } from '@our/hooks';

function SearchComponent() {
  const [query, setQuery] = useLocalStorage('searchQuery', '');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return (
    &lt;input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    /&gt;
  );
}
  </code></pre>
  
  <h2>Integration Patterns</h2>
  <p>Common patterns for integrating with external libraries:</p>
  
  <div class="code-example">
    <pre><code class="language-jsx">
// Using with React Query
function DataComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });
  
  if (isLoading) return &lt;LoadingSpinner /&gt;;
  if (error) return &lt;ErrorMessage error={error} /&gt;;
  
  return (
    &lt;div&gt;
      {data.map(post => (
        &lt;PostCard key={post.id} post={post} /&gt;
      ))}
    &lt;/div&gt;
  );
}
    </code></pre>
  </div>
</DocsLayout>
```

### MDX Integration

```astro
---
// src/pages/docs/guides/[...slug].astro
import DocsLayout from '../../../layouts/DocsLayout.astro';

export async function getStaticPaths() {
  const posts = await Astro.glob('../../../content/docs/guides/*.mdx');
  return posts.map(post => ({
    params: { slug: post.file.split('/').pop().replace('.mdx', '') },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content, frontmatter } = post;
---

<DocsLayout>
  <article class="prose">
    <header class="doc-header">
      <h1>{frontmatter.title}</h1>
      {frontmatter.description && (
        <p class="lead">{frontmatter.description}</p>
      )}
      {frontmatter.lastUpdated && (
        <p class="last-updated">
          Last updated: {new Date(frontmatter.lastUpdated).toLocaleDateString()}
        </p>
      )}
    </header>
    
    <Content />
  </article>
</DocsLayout>
```

### Documentation with Search

```astro
---
// src/pages/docs/search.astro
import DocsLayout from '../../layouts/DocsLayout.astro';
---

<DocsLayout>
  <h1>Documentation Search</h1>
  
  <div class="search-container">
    <input 
      type="search" 
      placeholder="Search documentation..." 
      class="search-input"
      id="doc-search"
    />
    <div id="search-results" class="search-results"></div>
  </div>
  
  <script>
    // Client-side search functionality
    const searchInput = document.getElementById('doc-search');
    const resultsContainer = document.getElementById('search-results');
    
    searchInput.addEventListener('input', async (e) => {
      const query = e.target.value;
      if (query.length > 2) {
        const results = await searchDocs(query);
        displayResults(results);
      } else {
        resultsContainer.innerHTML = '';
      }
    });
    
    function displayResults(results) {
      resultsContainer.innerHTML = results.map(result => `
        <div class="search-result">
          <h3><a href="${result.url}">${result.title}</a></h3>
          <p>${result.excerpt}</p>
        </div>
      `).join('');
    }
  </script>
</DocsLayout>
```

## Key Features

- **Table of Contents**: Automatic navigation generation with TableOfContents component
- **Typography Optimization**: Professional typography for technical content
- **Code Syntax Highlighting**: Styled code blocks and inline code
- **Responsive Design**: Optimized for both desktop and mobile reading
- **Documentation-Specific Styles**: Custom CSS for tables, code examples, and API documentation
- **Content Structure**: Organized layout with proper spacing and hierarchy
- **Professional Appearance**: Gradient background and modern design
- **Accessibility**: Proper contrast ratios and semantic HTML structure

## Styling Features

- **Inter Font Family**: Modern, readable font for technical content
- **Optimized Line Height**: 1.6 for comfortable reading
- **Color Scheme**: Professional gray color palette
- **Gradient Background**: Subtle gradient from light gray tones
- **Content Container**: Max-width container for optimal reading line length
- **Spacing System**: Consistent margins and padding throughout

## Dependencies

- **BaseLayout**: Extends the base HTML structure
- **TableOfContents**: Component for document navigation
- **docs.css**: Additional documentation-specific styles
- **Global Styles**: Comprehensive CSS reset and documentation styling

The DocsLayout provides a complete documentation environment optimized for technical content, code examples, and API documentation with professional styling and navigation.

---

### KitchensinkLayout


## Overview

The KitchensinkLayout is a comprehensive layout component designed for demo and showcase applications. It provides a visually striking gradient background, floating navigation menu, and complete integration with the documentation system. The layout includes an animated hamburger menu with navigation links to different sections, docs mode integration, and decorative visual elements.

This layout is specifically designed for "kitchen sink" style applications that showcase multiple features and components. It combines beautiful visual design with functional navigation and documentation capabilities, making it ideal for demos, portfolios, or multi-feature applications.

## Exports

### `KitchensinkLayoutProps`
**Type**: `interface`

Props interface for the KitchensinkLayout component.
- `children`: React.ReactNode - Child components to be rendered within the layout

### `KitchensinkLayout`
**Type**: `React.FC<KitchensinkLayoutProps>`

Main layout component that provides gradient background, floating navigation menu, docs mode integration, and decorative visual elements. Includes responsive design and smooth animations.

## Usage Examples

### Basic Layout Usage
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';

function App() {
  return (
    <KitchensinkLayout>
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white text-center">
          Welcome to Our App
        </h1>
        <p className="text-white/80 text-center mt-4">
          Explore our features and components
        </p>
      </main>
    </KitchensinkLayout>
  );
}
```

### Home Page Implementation
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';

function HomePage() {
  return (
    <KitchensinkLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-8">
            Demo Application
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Discover our comprehensive suite of components and features
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <FeatureCard
              title="E-commerce"
              description="Complete shopping experience"
              link="/store"
            />
            <FeatureCard
              title="Members"
              description="User management system"
              link="/members"
            />
            <FeatureCard
              title="Bookings"
              description="Appointment scheduling"
              link="/bookings"
            />
          </div>
        </div>
      </div>
    </KitchensinkLayout>
  );
}

function FeatureCard({ title, description, link }) {
  return (
    <a
      href={link}
      className="block p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
    >
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </a>
  );
}
```

### Feature Showcase Page
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';
import { PageDocsRegistration } from '../components/DocsMode';

function ComponentShowcase() {
  return (
    <KitchensinkLayout>
      <PageDocsRegistration
        title="Component Showcase"
        description="Interactive demonstration of all available components"
        docsUrl="/docs/components/showcase"
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Component Library
          </h1>
          <p className="text-white/80 text-xl">
            Click the docs button to explore components interactively
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ComponentSection title="Forms">
            <FormComponents />
          </ComponentSection>
          
          <ComponentSection title="Navigation">
            <NavigationComponents />
          </ComponentSection>
          
          <ComponentSection title="E-commerce">
            <EcommerceComponents />
          </ComponentSection>
          
          <ComponentSection title="Media">
            <MediaComponents />
          </ComponentSection>
        </div>
      </div>
    </KitchensinkLayout>
  );
}

function ComponentSection({ title, children }) {
  return (
    <section className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}
```

### Multi-Section Landing Page
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';

function LandingPage() {
  return (
    <KitchensinkLayout>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Beautiful Applications
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Built with modern tools and best practices
          </p>
          <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-xl backdrop-blur-lg border border-white/30 transition-all duration-300">
            Get Started
          </button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🛍️"
              title="E-commerce Ready"
              description="Complete shopping cart and checkout system"
            />
            <FeatureCard
              icon="👥"
              title="Member Management"
              description="User profiles and authentication"
            />
            <FeatureCard
              icon="📅"
              title="Booking System"
              description="Appointment and reservation management"
            />
          </div>
        </div>
      </section>
      
      {/* Documentation Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Interactive Documentation
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Use the docs toggle to explore components in real-time
          </p>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8 max-w-2xl mx-auto">
            <p className="text-white/90">
              Click the documentation button in the top-left corner to enter docs mode 
              and interact with any component on the page.
            </p>
          </div>
        </div>
      </section>
    </KitchensinkLayout>
  );
}
```

### Portfolio Style Layout
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';

function Portfolio() {
  return (
    <KitchensinkLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            My Portfolio
          </h1>
          <p className="text-white/80 text-xl">
            Showcase of projects and capabilities
          </p>
        </header>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
        
        {/* Skills Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Technologies
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-lg border border-white/30"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </KitchensinkLayout>
  );
}
```

### Dashboard Style Implementation
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';

function Dashboard() {
  return (
    <KitchensinkLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h3 className="text-white font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <StatCard label="Total Users" value="1,234" />
                <StatCard label="Revenue" value="$12,345" />
                <StatCard label="Orders" value="567" />
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Analytics Dashboard
              </h2>
              <DashboardCharts />
            </div>
          </main>
        </div>
      </div>
    </KitchensinkLayout>
  );
}
```

---

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

### Basic Store Layout
```tsx
import { StoreLayout } from './layouts/StoreLayout';

function ProductPage() {
  return (
    <StoreLayout currentCartServiceConfig={null}>
      <div>
        <h1>Product Catalog</h1>
        <ProductList />
      </div>
    </StoreLayout>
  );
}
```

### With External Services Manager
```tsx
import { StoreLayout } from './layouts/StoreLayout';
import { createServicesManager, createServicesMap } from '@wix/services-manager';
import { CurrentCartServiceDefinition, CurrentCartService } from '../headless/ecom/services/current-cart-service';

function App() {
  const servicesManager = createServicesManager(
    createServicesMap()
      .addService(CurrentCartServiceDefinition, CurrentCartService)
      // Add other services...
  );
  
  return (
    <StoreLayout 
      currentCartServiceConfig={cartConfig}
      servicesManager={servicesManager}
    >
      <ProductCatalog />
      <ProductDetails />
    </StoreLayout>
  );
}
```

### With Success Message Control
```tsx
import { useState } from 'react';
import { StoreLayout } from './layouts/StoreLayout';

function ShoppingApp() {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleAddToCart = async () => {
    // Add product to cart logic
    await addProductToCart();
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  return (
    <StoreLayout 
      currentCartServiceConfig={null}
      showSuccessMessage={showSuccess}
      onSuccessMessageChange={setShowSuccess}
    >
      <div>
        <button onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </StoreLayout>
  );
}
```

### Nested in Application Layout
```tsx
import { StoreLayout } from './layouts/StoreLayout';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function EcommerceApp() {
  return (
    <div className="app">
      <Header />
      
      <main>
        <StoreLayout currentCartServiceConfig={null}>
          <ProductCatalog />
          <FeaturedProducts />
        </StoreLayout>
      </main>
      
      <Footer />
    </div>
  );
}
```

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

### Multiple Store Sections
```tsx
import { StoreLayout } from './layouts/StoreLayout';

function MultiSectionStore() {
  return (
    <StoreLayout currentCartServiceConfig={null}>
      <section className="hero">
        <h1>Featured Products</h1>
        <FeaturedProducts />
      </section>
      
      <section className="catalog">
        <h2>Browse Catalog</h2>
        <ProductFilters />
        <ProductGrid />
      </section>
      
      <section className="recommendations">
        <h2>Recommended for You</h2>
        <RecommendedProducts />
      </section>
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

### Basic Usage
```tsx
import WixServicesProvider from './providers/WixServicesProvider';

function App() {
  return (
    <WixServicesProvider>
      <YourAppComponents />
    </WixServicesProvider>
  );
}
```

### With Cart Icon in Store Layout
```tsx
import WixServicesProvider from './providers/WixServicesProvider';

function StoreApp() {
  return (
    <WixServicesProvider showCartIcon={true}>
      <ProductCatalog />
      <ProductDetails />
    </WixServicesProvider>
  );
}
```

### Accessing Services in Child Components
```tsx
import { useService } from '@wix/services-manager-react';
import { ProductServiceDefinition } from '../headless/store/services/product-service';

function ProductComponent() {
  const productService = useService(ProductServiceDefinition);
  
  // Use the service methods
  const loadProducts = () => {
    productService.loadProducts();
  };
  
  return <div>Product Component</div>;
}
```

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

