# Sort Service

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
