# Product Service

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
