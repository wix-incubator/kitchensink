# Filter Service

The `filter-service` provides comprehensive product filtering functionality, managing price ranges, product options, and filter state with automatic URL synchronization and integration with catalog services.

## Overview

The Filter Service handles:

- **Filter State Management** - Current filter selections and available options
- **Price Range Filtering** - Dynamic price range selection and validation
- **Product Option Filtering** - Multi-select filtering by product attributes
- **URL Synchronization** - Automatic URL parameter updates for deep linking
- **Catalog Integration** - Integration with catalog-wide option and price data

## API Interface

```tsx
interface FilterServiceAPI {
  // Core Filter State
  currentFilters: Signal<Filter>;
  availableOptions: Signal<{
    productOptions: ProductOption[];
    priceRange: { min: number; max: number };
  }>;
  isFullyLoaded: Signal<boolean>;
  
  // Filter Operations
  applyFilters: (filters: Filter) => Promise<void>;
  clearFilters: () => Promise<void>;
  
  // Catalog Data Loading
  loadCatalogPriceRange: (categoryId?: string) => Promise<void>;
  loadCatalogOptions: (categoryId?: string) => Promise<void>;
}

interface Filter {
  priceRange: { min: number; max: number };
  selectedOptions: { [optionId: string]: string[] };
}

interface ProductOption {
  id: string;
  name: string;
  choices: { id: string; name: string; colorCode?: string }[];
  optionRenderType?: string;
}

interface AvailableOptions {
  productOptions: ProductOption[];
  priceRange: PriceRange;
}
```

## Core Functionality

### Filter State Management

The service maintains current filter selections and available filtering options:

```tsx
// Example usage in a component
const filterService = useService(FilterServiceDefinition);

// Get current filter state
const currentFilters = filterService.currentFilters.get();
const availableOptions = filterService.availableOptions.get();
const isFullyLoaded = filterService.isFullyLoaded.get();

// Check if filters are applied
const hasActiveFilters = 
  currentFilters.priceRange.min > availableOptions.priceRange.min ||
  currentFilters.priceRange.max < availableOptions.priceRange.max ||
  Object.keys(currentFilters.selectedOptions).length > 0;
```

### Applying Filters

Apply filter selections with automatic URL synchronization:

```tsx
// Apply price range filter
await filterService.applyFilters({
  priceRange: { min: 50, max: 200 },
  selectedOptions: {}
});

// Apply option filters
await filterService.applyFilters({
  priceRange: { min: 0, max: 1000 },
  selectedOptions: {
    "color": ["red", "blue"],
    "size": ["large"]
  }
});

// Apply combined filters
await filterService.applyFilters({
  priceRange: { min: 25, max: 150 },
  selectedOptions: {
    "brand": ["nike", "adidas"],
    "category": ["shoes"]
  }
});
```

### Clearing Filters

Reset all filters to default state:

```tsx
// Clear all filters and reset to defaults
await filterService.clearFilters();

// This will reset:
// - Price range to catalog min/max
// - All selected options to empty
// - URL parameters (except sort)
```

### Loading Catalog Data

Load available options and price ranges from the catalog:

```tsx
// Load data for all products
await filterService.loadCatalogPriceRange();
await filterService.loadCatalogOptions();

// Load data for specific category
await filterService.loadCatalogPriceRange("category-id");
await filterService.loadCatalogOptions("category-id");
```

## Usage Examples

### Basic Filter Interface

```tsx
import { useService } from "@wix/services-manager-react";
import { FilterServiceDefinition } from "../services/filter-service";

function ProductFilters() {
  const filterService = useService(FilterServiceDefinition);
  
  const currentFilters = filterService.currentFilters.get();
  const availableOptions = filterService.availableOptions.get();
  const isFullyLoaded = filterService.isFullyLoaded.get();
  
  const handlePriceChange = async (min: number, max: number) => {
    await filterService.applyFilters({
      ...currentFilters,
      priceRange: { min, max }
    });
  };
  
  const handleOptionChange = async (optionId: string, choiceIds: string[]) => {
    await filterService.applyFilters({
      ...currentFilters,
      selectedOptions: {
        ...currentFilters.selectedOptions,
        [optionId]: choiceIds
      }
    });
  };
  
  if (!isFullyLoaded) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="filters-panel">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={currentFilters.priceRange.min}
              onChange={(e) => handlePriceChange(
                parseInt(e.target.value) || availableOptions.priceRange.min,
                currentFilters.priceRange.max
              )}
              className="flex-1 border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Max"
              value={currentFilters.priceRange.max}
              onChange={(e) => handlePriceChange(
                currentFilters.priceRange.min,
                parseInt(e.target.value) || availableOptions.priceRange.max
              )}
              className="flex-1 border rounded px-3 py-2"
            />
          </div>
          <div className="text-xs text-gray-500">
            Range: ${availableOptions.priceRange.min} - ${availableOptions.priceRange.max}
          </div>
        </div>
      </div>
      
      {/* Product Options Filters */}
      {availableOptions.productOptions.map(option => (
        <div key={option.id} className="mb-6">
          <h4 className="font-medium mb-3">{option.name}</h4>
          <div className="space-y-2">
            {option.choices.map(choice => {
              const selectedChoices = currentFilters.selectedOptions[option.id] || [];
              const isSelected = selectedChoices.includes(choice.id);
              
              return (
                <label key={choice.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newChoices = e.target.checked
                        ? [...selectedChoices, choice.id]
                        : selectedChoices.filter(id => id !== choice.id);
                      handleOptionChange(option.id, newChoices);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{choice.name}</span>
                  {choice.colorCode && (
                    <span
                      className="ml-2 w-4 h-4 rounded-full border"
                      style={{ backgroundColor: choice.colorCode }}
                    />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Clear Filters */}
      <button
        onClick={() => filterService.clearFilters()}
        className="w-full py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
      >
        Clear All Filters
      </button>
    </div>
  );
}
```

### Advanced Filter UI with Counts

```tsx
function AdvancedFilters() {
  const filterService = useService(FilterServiceDefinition);
  
  const currentFilters = filterService.currentFilters.get();
  const availableOptions = filterService.availableOptions.get();
  const isFullyLoaded = filterService.isFullyLoaded.get();
  
  // Calculate active filter count
  const activeFilterCount = Object.values(currentFilters.selectedOptions)
    .reduce((count, choices) => count + choices.length, 0) +
    (currentFilters.priceRange.min > availableOptions.priceRange.min ? 1 : 0) +
    (currentFilters.priceRange.max < availableOptions.priceRange.max ? 1 : 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              {activeFilterCount} active
            </span>
            <button
              onClick={() => filterService.clearFilters()}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      
      {!isFullyLoaded ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="space-y-2">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="h-3 bg-gray-200 rounded w-3/4"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Price Range with Slider */}
          <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            <div className="space-y-3">
              <input
                type="range"
                min={availableOptions.priceRange.min}
                max={availableOptions.priceRange.max}
                value={currentFilters.priceRange.max}
                onChange={(e) => filterService.applyFilters({
                  ...currentFilters,
                  priceRange: {
                    ...currentFilters.priceRange,
                    max: parseInt(e.target.value)
                  }
                })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${currentFilters.priceRange.min}</span>
                <span>${currentFilters.priceRange.max}</span>
              </div>
            </div>
          </div>
          
          {/* Product Options with Chips */}
          {availableOptions.productOptions.map(option => {
            const selectedChoices = currentFilters.selectedOptions[option.id] || [];
            
            return (
              <div key={option.id}>
                <h4 className="font-medium mb-3">
                  {option.name}
                  {selectedChoices.length > 0 && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {selectedChoices.length}
                    </span>
                  )}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {option.choices.map(choice => {
                    const isSelected = selectedChoices.includes(choice.id);
                    
                    return (
                      <button
                        key={choice.id}
                        onClick={() => {
                          const newChoices = isSelected
                            ? selectedChoices.filter(id => id !== choice.id)
                            : [...selectedChoices, choice.id];
                          
                          filterService.applyFilters({
                            ...currentFilters,
                            selectedOptions: {
                              ...currentFilters.selectedOptions,
                              [option.id]: newChoices
                            }
                          });
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {choice.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

### Mobile Filter Modal

```tsx
import { useState } from "react";

function MobileFilterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const filterService = useService(FilterServiceDefinition);
  
  const currentFilters = filterService.currentFilters.get();
  const availableOptions = filterService.availableOptions.get();
  
  const activeFilterCount = Object.values(currentFilters.selectedOptions)
    .reduce((count, choices) => count + choices.length, 0);
  
  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>
      
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Filter content */}
              <AdvancedFilters />
            </div>
            
            <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
              <button
                onClick={() => filterService.clearFilters()}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

### Filter Summary Display

```tsx
function FilterSummary() {
  const filterService = useService(FilterServiceDefinition);
  
  const currentFilters = filterService.currentFilters.get();
  const availableOptions = filterService.availableOptions.get();
  
  const activePriceFilter = 
    currentFilters.priceRange.min > availableOptions.priceRange.min ||
    currentFilters.priceRange.max < availableOptions.priceRange.max;
  
  const activeOptionFilters = Object.entries(currentFilters.selectedOptions)
    .filter(([_, choices]) => choices.length > 0);
  
  const hasActiveFilters = activePriceFilter || activeOptionFilters.length > 0;
  
  if (!hasActiveFilters) {
    return null;
  }
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-blue-900">Active Filters</h4>
        <button
          onClick={() => filterService.clearFilters()}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Price Filter */}
        {activePriceFilter && (
          <span className="inline-flex items-center gap-1 bg-white border border-blue-300 rounded-full px-3 py-1 text-sm">
            Price: ${currentFilters.priceRange.min} - ${currentFilters.priceRange.max}
            <button
              onClick={() => filterService.applyFilters({
                ...currentFilters,
                priceRange: availableOptions.priceRange
              })}
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              ✕
            </button>
          </span>
        )}
        
        {/* Option Filters */}
        {activeOptionFilters.map(([optionId, choiceIds]) => {
          const option = availableOptions.productOptions.find(opt => opt.id === optionId);
          if (!option) return null;
          
          return choiceIds.map(choiceId => {
            const choice = option.choices.find(c => c.id === choiceId);
            if (!choice) return null;
            
            return (
              <span
                key={`${optionId}-${choiceId}`}
                className="inline-flex items-center gap-1 bg-white border border-blue-300 rounded-full px-3 py-1 text-sm"
              >
                {option.name}: {choice.name}
                <button
                  onClick={() => {
                    const newChoices = choiceIds.filter(id => id !== choiceId);
                    filterService.applyFilters({
                      ...currentFilters,
                      selectedOptions: {
                        ...currentFilters.selectedOptions,
                        [optionId]: newChoices
                      }
                    });
                  }}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  ✕
                </button>
              </span>
            );
          });
        })}
      </div>
    </div>
  );
}
```

## Integration with Other Services

### Collection Service Integration

The Filter Service works closely with the Collection Service:

```tsx
// Filter changes automatically trigger collection updates
// through URL parameter synchronization and reactive subscriptions
```

### URL Parameter Management

Automatic URL synchronization maintains deep linking:

```tsx
// URL structure: /products?minPrice=50&maxPrice=200&color=red&color=blue&size=large

// Parameters are automatically updated when filters change
// and restored when the page loads
```

### Catalog Services Integration

Integration with catalog-wide data sources:

```tsx
// Automatically loads available options and price ranges
// from CatalogOptionsService and CatalogPriceRangeService

// Reacts to changes in catalog data
// Updates filter UI when new options become available
```

## Usage in Components

The Filter Service is used extensively throughout the application:

### In FilteredCollection Components
```tsx
// src/headless/store/components/FilteredCollection.tsx
export const Filters: React.FC<FilteredFiltersProps> = ({ children }) => {
  const { filter } = useFilteredCollection();
  
  const currentFilters = filter!.currentFilters.get();
  const availableOptions = filter!.availableOptions.get();
  
  return children({
    applyFilters: filter!.applyFilters,
    clearFilters: filter!.clearFilters,
    currentFilters,
    availableOptions,
    // ... other filter data
  });
};
```

### In Product List Components
```tsx
// src/components/store/ProductFilters.tsx
const filterService = useService(FilterServiceDefinition);

// Used for filter UI, state management, and URL synchronization
```

### In Store Layout Pages
```tsx
// src/react-pages/store/example-2/index.tsx
// Filter service provides state management for comprehensive filtering UI
```

## Best Practices

### State Management
- Always check `isFullyLoaded` before showing filter UI
- Use reactive subscriptions for real-time updates
- Handle loading states gracefully

### URL Integration
- Filter state is automatically synchronized with URL parameters
- Preserve sort parameters when applying filters
- Support deep linking to filtered views

### Performance
- Filter service is optimized for reactive updates
- Catalog data is loaded once and cached
- URL updates are debounced to prevent excessive navigation

### User Experience
- Show active filter counts and summaries
- Provide clear filter removal options
- Handle empty states when no products match filters
- Use appropriate loading states during filter operations 