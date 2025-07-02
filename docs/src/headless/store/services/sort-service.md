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
