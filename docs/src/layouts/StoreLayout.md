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
