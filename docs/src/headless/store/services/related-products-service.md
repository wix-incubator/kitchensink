# Related Products Service

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
