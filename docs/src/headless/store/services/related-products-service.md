# Related Products Service

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