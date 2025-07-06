# Sort Service

The `sort-service` provides product sorting functionality with automatic URL synchronization, enabling users to sort product collections by various criteria like name, price, and recommendations.

## Overview

The Sort Service handles:

- **Sort State Management** - Current sort selection and updates
- **URL Synchronization** - Automatic URL parameter updates for deep linking
- **Sort Options** - Multiple sorting criteria (name, price, recommended)
- **Default Handling** - Fallback to default sort when no selection is made

## API Interface

```tsx
interface SortServiceAPI {
  currentSort: Signal<SortBy>;
  setSortBy: (sortBy: SortBy) => Promise<void>;
}

type SortBy = "" | "name-asc" | "name-desc" | "price-asc" | "price-desc" | "recommended";
```

## Sort Options

The service supports the following sort options:

- `""` (empty) - Default sort (newest)
- `"name-asc"` - Name A to Z
- `"name-desc"` - Name Z to A  
- `"price-asc"` - Price low to high
- `"price-desc"` - Price high to low
- `"recommended"` - Recommended products

## Core Functionality

### Getting Current Sort

Access the current sort selection:

```tsx
import { useService } from "@wix/services-manager-react";
import { SortServiceDefinition } from "../services/sort-service";

function SortComponent() {
  const sortService = useService(SortServiceDefinition);
  
  const currentSort = sortService.currentSort.get();
  
  return (
    <div>
      <p>Current sort: {currentSort || 'Default (newest)'}</p>
    </div>
  );
}
```

### Setting Sort Option

Change the sort selection:

```tsx
// Set sort to price ascending
await sortService.setSortBy("price-asc");

// Set sort to name descending
await sortService.setSortBy("name-desc");

// Reset to default sort
await sortService.setSortBy("");
```

## Usage Examples

### Sort Dropdown

```tsx
import { useService } from "@wix/services-manager-react";
import { SortServiceDefinition } from "../services/sort-service";

function SortDropdown() {
  const sortService = useService(SortServiceDefinition);
  
  const currentSort = sortService.currentSort.get();
  
  const sortOptions = [
    { value: "", label: "Newest" },
    { value: "recommended", label: "Recommended" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];
  
  return (
    <div className="sort-dropdown">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sort by:
      </label>
      <select
        value={currentSort}
        onChange={(e) => sortService.setSortBy(e.target.value as any)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

### Sort Button Group

```tsx
function SortButtonGroup() {
  const sortService = useService(SortServiceDefinition);
  
  const currentSort = sortService.currentSort.get();
  
  const sortOptions = [
    { value: "", label: "Newest", icon: "🆕" },
    { value: "recommended", label: "Popular", icon: "⭐" },
    { value: "price-asc", label: "Price ↑", icon: "💰" },
    { value: "price-desc", label: "Price ↓", icon: "💸" },
    { value: "name-asc", label: "A-Z", icon: "🔤" },
    { value: "name-desc", label: "Z-A", icon: "🔠" },
  ];
  
  return (
    <div className="sort-buttons">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Sort by:</h3>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map(option => (
          <button
            key={option.value}
            onClick={() => sortService.setSortBy(option.value as any)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${currentSort === option.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Mobile Sort Modal

```tsx
import { useState } from "react";

function MobileSortModal() {
  const [isOpen, setIsOpen] = useState(false);
  const sortService = useService(SortServiceDefinition);
  
  const currentSort = sortService.currentSort.get();
  
  const sortOptions = [
    { value: "", label: "Newest" },
    { value: "recommended", label: "Recommended" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];
  
  const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || "Newest";
  
  return (
    <>
      {/* Sort Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span>{currentSortLabel}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg">
            <div className="border-b px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sort Products</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      sortService.setSortBy(option.value as any);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-colors
                      ${currentSort === option.value
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      {currentSort === option.value && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

### Sort with Results Count

```tsx
function SortWithResults() {
  const sortService = useService(SortServiceDefinition);
  const collectionService = useService(CollectionServiceDefinition);
  
  const currentSort = sortService.currentSort.get();
  const totalProducts = collectionService.totalProducts.get();
  
  const sortOptions = [
    { value: "", label: "Newest" },
    { value: "recommended", label: "Recommended" },
    { value: "price-asc", label: "Price ↑" },
    { value: "price-desc", label: "Price ↓" },
    { value: "name-asc", label: "A-Z" },
    { value: "name-desc", label: "Z-A" },
  ];
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="text-sm text-gray-600">
        {totalProducts} products
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Sort:</span>
        <select
          value={currentSort}
          onChange={(e) => sortService.setSortBy(e.target.value as any)}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
```

## URL Integration

The Sort Service automatically manages URL parameters:

### URL Parameter Mapping

```tsx
// Sort selections are mapped to URL parameters:
const sortMap = {
  "name-asc": "name_asc",
  "name-desc": "name_desc", 
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  "recommended": "recommended",
  "": "newest" // Default - not added to URL
};

// Examples:
// /products?sort=price_asc
// /products?sort=name_desc
// /products (no sort parameter for default)
```

### Deep Linking Support

URLs with sort parameters are automatically restored:

```tsx
// URL: /products?sort=price_desc
// → currentSort will be set to "price-desc"

// URL: /products
// → currentSort will be set to "" (default)
```

## Usage in Components

The Sort Service is used throughout the application:

### In Sort Components
```tsx
// src/headless/store/components/Sort.tsx
export const Controller = (props: SortControllerProps) => {
  const service = useService(SortServiceDefinition);
  
  const currentSort = service.currentSort.get();
  const setSortBy = service.setSortBy;
  
  return props.children({ currentSort, setSortBy });
};
```

### In Product List Pages
```tsx
// src/react-pages/store/example-1/index.tsx
const sortService = useService(SortServiceDefinition);

// Used for sort dropdown and maintaining sort state
```

### In Collection Components
```tsx
// Collection service reacts to sort changes
// and automatically re-fetches products with new sort order
```

## Integration with Other Services

### Collection Service Integration
- Sort changes trigger automatic collection refresh
- New sort order is applied to product queries
- Loading states are coordinated between services

### URL Parameters Service Integration
- Uses URLParamsUtils for URL synchronization
- Preserves other URL parameters (filters, pagination)
- Supports browser navigation (back/forward)

## Best Practices

### State Management
- Always use the service for sort state management
- Don't store sort state in component state
- Subscribe to sort changes for reactive updates

### URL Handling
- Let the service handle URL parameter updates
- Don't manually modify sort URL parameters
- Test deep linking and browser navigation

### User Experience
- Show current sort selection clearly
- Provide intuitive sort option labels
- Use loading states during sort changes
- Remember sort preferences when possible

### Performance
- Sort service is lightweight and optimized
- URL updates are automatic and efficient
- Service integrates seamlessly with collections 