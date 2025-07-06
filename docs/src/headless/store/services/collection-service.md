# Collection Service

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