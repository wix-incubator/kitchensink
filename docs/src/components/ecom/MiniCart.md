# MiniCart Components

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
