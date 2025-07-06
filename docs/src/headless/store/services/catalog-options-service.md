# Catalog Options Service

The `catalog-options-service` provides comprehensive product catalog options and filtering capabilities, enabling users to discover and filter products based on various product attributes, customizations, and inventory status.

## Overview

The Catalog Options Service handles:

- **Product Options Discovery** - Finds all available product options and choices
- **Dynamic Filtering** - Provides filtering options based on actual product catalog
- **Inventory Integration** - Includes inventory status filtering
- **Category-Specific Options** - Filters options by category when needed
- **Intelligent Sorting** - Smart sorting of choices (numerical, alphabetical)
- **Color Code Support** - Handles color swatches and visual choices

## API Interface

```tsx
interface CatalogOptionsServiceAPI {
  catalogOptions: Signal<ProductOption[] | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadCatalogOptions: (categoryId?: string) => Promise<void>;
}

interface ProductOption {
  id: string;
  name: string;
  choices: ProductChoice[];
  optionRenderType?: string;
}

interface ProductChoice {
  id: string;
  name: string;
  colorCode?: string;
}
```

## Option Types

The service supports various option types:

- **Color Swatches** - Visual color choices with color codes
- **Size Options** - Clothing sizes, dimensions, etc.
- **Material Options** - Fabric, metal, wood types
- **Style Variants** - Different styles or models
- **Inventory Status** - Available, out of stock, pre-order
- **Custom Attributes** - Any product customization options

## Core Functionality

### Getting Catalog Options

Access catalog options and filtering data:

```tsx
import { useService } from "@wix/services-manager-react";
import { CatalogOptionsServiceDefinition } from "../services/catalog-options-service";

function CatalogOptionsComponent() {
  const catalogService = useService(CatalogOptionsServiceDefinition);
  
  const catalogOptions = catalogService.catalogOptions.get();
  const isLoading = catalogService.isLoading.get();
  const error = catalogService.error.get();
  
  if (isLoading) return <div>Loading catalog options...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!catalogOptions) return <div>No options available</div>;
  
  return (
    <div>
      <h3>Filter by:</h3>
      {catalogOptions.map(option => (
        <div key={option.id}>
          <h4>{option.name}</h4>
          <div className="choices">
            {option.choices.map(choice => (
              <button
                key={choice.id}
                className="choice-button"
                style={choice.colorCode ? { backgroundColor: choice.colorCode } : {}}
              >
                {choice.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Loading Options by Category

Load options for specific categories:

```tsx
// Load options for all products
await catalogService.loadCatalogOptions();

// Load options for specific category
await catalogService.loadCatalogOptions("category-id");
```

## Usage Example

```tsx
function CatalogFilterPanel() {
  const catalogOptionsService = useService(CatalogOptionsServiceDefinition);
  
  const catalogOptions = catalogOptionsService.catalogOptions.get();
  const isLoading = catalogOptionsService.isLoading.get();
  const error = catalogOptionsService.error.get();
  
  if (isLoading) {
    return (
      <div className="filter-panel-loading">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-3 bg-gray-200 rounded w-16"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="filter-panel-error">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }
  
  const renderFilterOption = (option: any) => {
    if (option.optionType === "color") {
      return (
        <div key={option.key} className="filter-group">
          <h4 className="text-sm font-medium text-gray-900 mb-2">{option.name}</h4>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value: any) => (
              <button
                key={value.key}
                onClick={() => {
                  // Toggle filter selection logic would go here
                  console.log('Selected color:', value.value);
                }}
                className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: value.color || value.value }}
                title={value.value}
              >
                <span className="sr-only">{value.value}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    if (option.optionType === "size") {
      // Sort sizes intelligently
      const sortedValues = [...option.values].sort((a, b) => {
        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        const aIndex = sizeOrder.indexOf(a.value);
        const bIndex = sizeOrder.indexOf(b.value);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        // Fallback to alphabetical for non-standard sizes
        return a.value.localeCompare(b.value);
      });
      
      return (
        <div key={option.key} className="filter-group">
          <h4 className="text-sm font-medium text-gray-900 mb-2">{option.name}</h4>
          <div className="flex flex-wrap gap-2">
            {sortedValues.map((value: any) => (
              <button
                key={value.key}
                onClick={() => {
                  console.log('Selected size:', value.value);
                }}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                {value.value}
                {value.productCount > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({value.productCount})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    // Default rendering for other option types
    return (
      <div key={option.key} className="filter-group">
        <h4 className="text-sm font-medium text-gray-900 mb-2">{option.name}</h4>
        <div className="space-y-2">
          {option.values.map((value: any) => (
            <label key={value.key} className="flex items-center">
              <input
                type="checkbox"
                onChange={() => {
                  console.log('Selected option:', value.value);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {value.value}
                {value.productCount > 0 && (
                  <span className="text-gray-500 ml-1">
                    ({value.productCount})
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="catalog-filter-panel">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Filter Products
      </h3>
      
      <div className="space-y-6">
        {catalogOptions.map(renderFilterOption)}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={() => {
            // Clear all filters logic
            console.log('Clear all filters');
          }}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}
```

## Server-Side Configuration

Load catalog options server-side:

```tsx
// Server-side configuration
import { loadCatalogOptionsServiceConfig } from "../services/catalog-options-service";

export async function createCatalogOptionsConfig() {
  return await loadCatalogOptionsServiceConfig();
}
```

## Usage in Components

The Catalog Options Service is used throughout the application:

### In Filter Components
```tsx
// src/components/store/ProductFilters.tsx
const catalogService = useService(CatalogOptionsServiceDefinition);

// Used for building dynamic filter UI
const catalogOptions = catalogService.catalogOptions.get();
const isLoading = catalogService.isLoading.get();
```

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
const catalogService = useService(CatalogOptionsServiceDefinition);

// Used for sidebar filters and category-specific options
const catalogOptions = catalogService.catalogOptions.get();
```

## Integration with Other Services

### Filter Service Integration
- Provides filter options to the filter service
- Coordinates with active filters
- Maintains filter state consistency

### Collection Service Integration
- Filter options are applied to product queries
- Dynamic updates based on search results
- Coordinated loading and error states

### Category Service Integration
- Loads category-specific options
- Updates when category selection changes
- Maintains category context for filtering

## Best Practices

### Data Loading
- Load catalog options based on current context
- Cache options data to reduce API calls
- Provide loading states during data fetching
- Handle empty states gracefully

### User Experience
- Show visual representations for color options
- Use intelligent sorting for size and numerical options
- Provide clear filter counts and selections
- Enable easy filter clearing and resetting

### Performance
- Implement lazy loading for large option sets
- Use efficient data structures for filter state
- Minimize re-renders during filter updates
- Cache frequently accessed options

### Accessibility
- Provide proper labels for all filter options
- Use semantic HTML for filter controls
- Support keyboard navigation
- Ensure color options have text alternatives 