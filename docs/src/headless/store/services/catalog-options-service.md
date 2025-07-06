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

## Usage Examples

### Complete Filter Panel

```tsx
function FilterPanel() {
  const catalogService = useService(CatalogOptionsServiceDefinition);
  
  const catalogOptions = catalogService.catalogOptions.get();
  const isLoading = catalogService.isLoading.get();
  const error = catalogService.error.get();
  
  const [selectedFilters, setSelectedFilters] = useState({});
  
  const handleFilterChange = (optionId: string, choiceId: string, selected: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      [optionId]: {
        ...prev[optionId],
        [choiceId]: selected
      }
    }));
  };
  
  if (isLoading) {
    return (
      <div className="filter-panel-loading">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-300 rounded"></div>
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
        <div className="text-center py-8 border rounded-lg">
          <p className="text-red-500 mb-2">Failed to load filters</p>
          <button
            onClick={() => catalogService.loadCatalogOptions()}
            className="text-blue-500 hover:text-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!catalogOptions || catalogOptions.length === 0) {
    return (
      <div className="filter-panel-empty">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <p className="text-gray-500 text-center py-8">
          No filter options available
        </p>
      </div>
    );
  }
  
  return (
    <div className="filter-panel">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      <div className="space-y-6">
        {catalogOptions.map(option => (
          <div key={option.id} className="filter-group">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              {option.name}
            </h4>
            
            <div className="space-y-2">
              {option.choices.map(choice => (
                <label
                  key={choice.id}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters[option.id]?.[choice.id] || false}
                    onChange={(e) => handleFilterChange(option.id, choice.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex items-center space-x-2">
                    {choice.colorCode && (
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: choice.colorCode }}
                      />
                    )}
                    <span className="text-sm text-gray-700">{choice.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <button
          onClick={() => setSelectedFilters({})}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}
```

### Color Swatch Filter

```tsx
function ColorSwatchFilter() {
  const catalogService = useService(CatalogOptionsServiceDefinition);
  
  const catalogOptions = catalogService.catalogOptions.get();
  const [selectedColors, setSelectedColors] = useState(new Set());
  
  const colorOption = catalogOptions?.find(option => 
    option.name.toLowerCase().includes('color')
  );
  
  if (!colorOption) return null;
  
  const handleColorToggle = (colorId: string) => {
    const newSelected = new Set(selectedColors);
    if (newSelected.has(colorId)) {
      newSelected.delete(colorId);
    } else {
      newSelected.add(colorId);
    }
    setSelectedColors(newSelected);
  };
  
  return (
    <div className="color-swatch-filter">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        {colorOption.name}
      </h4>
      
      <div className="flex flex-wrap gap-2">
        {colorOption.choices.map(choice => (
          <button
            key={choice.id}
            onClick={() => handleColorToggle(choice.id)}
            className={`
              w-8 h-8 rounded-full border-2 transition-all
              ${selectedColors.has(choice.id)
                ? 'border-blue-500 scale-110'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            style={{ backgroundColor: choice.colorCode || '#f3f4f6' }}
            title={choice.name}
          >
            {selectedColors.has(choice.id) && (
              <span className="text-white text-xs">✓</span>
            )}
          </button>
        ))}
      </div>
      
      {selectedColors.size > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            {selectedColors.size} color{selectedColors.size > 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
}
```

### Size Filter with Smart Sorting

```tsx
function SizeFilter() {
  const catalogService = useService(CatalogOptionsServiceDefinition);
  
  const catalogOptions = catalogService.catalogOptions.get();
  const [selectedSizes, setSelectedSizes] = useState(new Set());
  
  const sizeOption = catalogOptions?.find(option => 
    option.name.toLowerCase().includes('size')
  );
  
  if (!sizeOption) return null;
  
  // The service already handles intelligent sorting
  const sortedSizes = sizeOption.choices;
  
  const handleSizeToggle = (sizeId: string) => {
    const newSelected = new Set(selectedSizes);
    if (newSelected.has(sizeId)) {
      newSelected.delete(sizeId);
    } else {
      newSelected.add(sizeId);
    }
    setSelectedSizes(newSelected);
  };
  
  return (
    <div className="size-filter">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        {sizeOption.name}
      </h4>
      
      <div className="grid grid-cols-4 gap-2">
        {sortedSizes.map(choice => (
          <button
            key={choice.id}
            onClick={() => handleSizeToggle(choice.id)}
            className={`
              px-3 py-2 text-sm border rounded-md transition-colors
              ${selectedSizes.has(choice.id)
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {choice.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Inventory Status Filter

```tsx
function InventoryStatusFilter() {
  const catalogService = useService(CatalogOptionsServiceDefinition);
  
  const catalogOptions = catalogService.catalogOptions.get();
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  
  const inventoryOption = catalogOptions?.find(option => 
    option.name.toLowerCase().includes('inventory') || 
    option.name.toLowerCase().includes('availability')
  );
  
  if (!inventoryOption) return null;
  
  const handleStatusToggle = (statusId: string) => {
    const newSelected = new Set(selectedStatuses);
    if (newSelected.has(statusId)) {
      newSelected.delete(statusId);
    } else {
      newSelected.add(statusId);
    }
    setSelectedStatuses(newSelected);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_stock':
        return '✅';
      case 'out_of_stock':
        return '❌';
      case 'pre_order':
        return '⏳';
      default:
        return '📦';
    }
  };
  
  return (
    <div className="inventory-status-filter">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Availability
      </h4>
      
      <div className="space-y-2">
        {inventoryOption.choices.map(choice => (
          <label
            key={choice.id}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedStatuses.has(choice.id)}
              onChange={(e) => handleStatusToggle(choice.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            
            <div className="flex items-center space-x-2">
              <span>{getStatusIcon(choice.name)}</span>
              <span className="text-sm text-gray-700">
                {choice.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
```

### Category-Specific Options

```tsx
function CategoryOptionsFilter({ categoryId }: { categoryId?: string }) {
  const catalogService = useService(CatalogOptionsServiceDefinition);
  
  const catalogOptions = catalogService.catalogOptions.get();
  const isLoading = catalogService.isLoading.get();
  
  // Load options for specific category
  useEffect(() => {
    catalogService.loadCatalogOptions(categoryId);
  }, [categoryId]);
  
  if (isLoading) {
    return <div>Loading category options...</div>;
  }
  
  if (!catalogOptions || catalogOptions.length === 0) {
    return (
      <div className="category-options-empty">
        <p className="text-gray-500 text-center py-8">
          No filter options available for this category
        </p>
      </div>
    );
  }
  
  return (
    <div className="category-options-filter">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Filter Products
      </h3>
      
      <div className="space-y-4">
        {catalogOptions.map(option => (
          <div key={option.id} className="filter-group">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              {option.name}
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {option.choices.map(choice => (
                <button
                  key={choice.id}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {choice.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Mobile Filter Modal

```tsx
import { useState } from "react";

function MobileFilterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const catalogService = useService(CatalogOptionsServiceDefinition);
  
  const catalogOptions = catalogService.catalogOptions.get();
  const [selectedFilters, setSelectedFilters] = useState({});
  
  const handleApplyFilters = () => {
    // Apply filters logic here
    console.log('Applying filters:', selectedFilters);
    setIsOpen(false);
  };
  
  const getFilterCount = () => {
    return Object.values(selectedFilters).reduce((count, filters) => {
      return count + Object.values(filters).filter(Boolean).length;
    }, 0);
  };
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
        <span>Filter</span>
        {getFilterCount() > 0 && (
          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
            {getFilterCount()}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-auto">
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
              {catalogOptions?.map(option => (
                <div key={option.id} className="filter-group">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    {option.name}
                  </h4>
                  
                  <div className="space-y-2">
                    {option.choices.map(choice => (
                      <label
                        key={choice.id}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[option.id]?.[choice.id] || false}
                          onChange={(e) => {
                            setSelectedFilters(prev => ({
                              ...prev,
                              [option.id]: {
                                ...prev[option.id],
                                [choice.id]: e.target.checked
                              }
                            }));
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        
                        <div className="flex items-center space-x-2">
                          {choice.colorCode && (
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: choice.colorCode }}
                            />
                          )}
                          <span className="text-sm text-gray-700">{choice.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-3">
              <button
                onClick={() => setSelectedFilters({})}
                className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Apply Filters ({getFilterCount()})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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