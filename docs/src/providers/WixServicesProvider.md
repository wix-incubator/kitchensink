# WixServicesProvider

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
