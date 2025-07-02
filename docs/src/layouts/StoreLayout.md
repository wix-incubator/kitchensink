# Store Layout

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
