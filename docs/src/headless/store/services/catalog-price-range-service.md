# Catalog Price Range Service

The `catalog-price-range-service` provides price range discovery and filtering capabilities, enabling users to understand the price distribution across products and filter by price ranges effectively.

## Overview

The Catalog Price Range Service handles:

- **Price Range Discovery** - Finds minimum and maximum prices across the catalog
- **Dynamic Price Filtering** - Provides price range data for filtering
- **Category-Specific Ranges** - Calculates price ranges for specific categories
- **Aggregation Queries** - Uses efficient aggregation to find price bounds
- **Error Handling** - Graceful handling of empty catalogs or invalid data

## API Interface

```tsx
interface CatalogPriceRangeServiceAPI {
  catalogPriceRange: Signal<CatalogPriceRange | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadCatalogPriceRange: (categoryId?: string) => Promise<void>;
}

interface CatalogPriceRange {
  minPrice: number;
  maxPrice: number;
}
```

## Core Functionality

### Getting Price Range

Access catalog price range data:

```tsx
import { useService } from "@wix/services-manager-react";
import { CatalogPriceRangeServiceDefinition } from "../services/catalog-price-range-service";

function PriceRangeComponent() {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const catalogPriceRange = priceRangeService.catalogPriceRange.get();
  const isLoading = priceRangeService.isLoading.get();
  const error = priceRangeService.error.get();
  
  if (isLoading) return <div>Loading price range...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!catalogPriceRange) return <div>No price data available</div>;
  
  return (
    <div>
      <h3>Price Range:</h3>
      <p>
        ${catalogPriceRange.minPrice} - ${catalogPriceRange.maxPrice}
      </p>
    </div>
  );
}
```

### Loading Price Range

```tsx
// Load price range for all products
await priceRangeService.loadCatalogPriceRange();

// Load price range for specific category
await priceRangeService.loadCatalogPriceRange("category-id");
```

## Usage Examples

### Price Range Slider

```tsx
import { useState, useEffect } from "react";

function PriceRangeSlider() {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const catalogPriceRange = priceRangeService.catalogPriceRange.get();
  const isLoading = priceRangeService.isLoading.get();
  
  const [selectedRange, setSelectedRange] = useState([0, 1000]);
  
  useEffect(() => {
    if (catalogPriceRange) {
      setSelectedRange([catalogPriceRange.minPrice, catalogPriceRange.maxPrice]);
    }
  }, [catalogPriceRange]);
  
  if (isLoading) {
    return (
      <div className="price-range-loading">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  
  if (!catalogPriceRange) {
    return null;
  }
  
  const handleRangeChange = (values: number[]) => {
    setSelectedRange(values);
    // Apply price filter logic here
  };
  
  return (
    <div className="price-range-slider">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Price Range
      </h4>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>${selectedRange[0]}</span>
          <span>${selectedRange[1]}</span>
        </div>
        
        {/* Custom range slider or use a library like react-slider */}
        <div className="relative">
          <input
            type="range"
            min={catalogPriceRange.minPrice}
            max={catalogPriceRange.maxPrice}
            value={selectedRange[0]}
            onChange={(e) => handleRangeChange([parseInt(e.target.value), selectedRange[1]])}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min={catalogPriceRange.minPrice}
            max={catalogPriceRange.maxPrice}
            value={selectedRange[1]}
            onChange={(e) => handleRangeChange([selectedRange[0], parseInt(e.target.value)])}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>${catalogPriceRange.minPrice}</span>
        <span>${catalogPriceRange.maxPrice}</span>
      </div>
    </div>
  );
}
```

### Price Range Input Fields

```tsx
function PriceRangeInputs() {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const catalogPriceRange = priceRangeService.catalogPriceRange.get();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  useEffect(() => {
    if (catalogPriceRange) {
      setMinPrice(catalogPriceRange.minPrice.toString());
      setMaxPrice(catalogPriceRange.maxPrice.toString());
    }
  }, [catalogPriceRange]);
  
  if (!catalogPriceRange) {
    return null;
  }
  
  const handleApplyFilter = () => {
    const min = Math.max(parseFloat(minPrice) || 0, catalogPriceRange.minPrice);
    const max = Math.min(parseFloat(maxPrice) || catalogPriceRange.maxPrice, catalogPriceRange.maxPrice);
    
    // Apply price filter logic
    console.log('Applying price filter:', { min, max });
  };
  
  return (
    <div className="price-range-inputs">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Price Range
      </h4>
      
      <div className="flex items-center space-x-2 mb-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Min</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min={catalogPriceRange.minPrice}
              max={catalogPriceRange.maxPrice}
              className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="flex-shrink-0 pt-6">
          <span className="text-gray-400">-</span>
        </div>
        
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Max</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min={catalogPriceRange.minPrice}
              max={catalogPriceRange.maxPrice}
              className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="1000"
            />
          </div>
        </div>
      </div>
      
      <button
        onClick={handleApplyFilter}
        className="w-full py-2 px-3 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
      >
        Apply Filter
      </button>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        Range: ${catalogPriceRange.minPrice} - ${catalogPriceRange.maxPrice}
      </div>
    </div>
  );
}
```

### Price Range Buckets

```tsx
function PriceRangeBuckets() {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const catalogPriceRange = priceRangeService.catalogPriceRange.get();
  const [selectedBucket, setSelectedBucket] = useState(null);
  
  if (!catalogPriceRange) {
    return null;
  }
  
  const createPriceBuckets = (min: number, max: number) => {
    const range = max - min;
    const bucketSize = Math.ceil(range / 5); // Create 5 buckets
    
    const buckets = [];
    for (let i = 0; i < 5; i++) {
      const bucketMin = min + (i * bucketSize);
      const bucketMax = i === 4 ? max : min + ((i + 1) * bucketSize) - 1;
      
      buckets.push({
        id: i,
        label: `$${bucketMin} - $${bucketMax}`,
        min: bucketMin,
        max: bucketMax
      });
    }
    
    return buckets;
  };
  
  const priceBuckets = createPriceBuckets(catalogPriceRange.minPrice, catalogPriceRange.maxPrice);
  
  return (
    <div className="price-range-buckets">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Price Range
      </h4>
      
      <div className="space-y-2">
        <button
          onClick={() => setSelectedBucket(null)}
          className={`
            w-full text-left px-3 py-2 rounded-md text-sm transition-colors
            ${selectedBucket === null
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'hover:bg-gray-50 border border-gray-200'
            }
          `}
        >
          All Prices
        </button>
        
        {priceBuckets.map(bucket => (
          <button
            key={bucket.id}
            onClick={() => setSelectedBucket(bucket.id)}
            className={`
              w-full text-left px-3 py-2 rounded-md text-sm transition-colors
              ${selectedBucket === bucket.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'hover:bg-gray-50 border border-gray-200'
              }
            `}
          >
            {bucket.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Category-Specific Price Range

```tsx
function CategoryPriceRange({ categoryId }: { categoryId?: string }) {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const catalogPriceRange = priceRangeService.catalogPriceRange.get();
  const isLoading = priceRangeService.isLoading.get();
  
  useEffect(() => {
    priceRangeService.loadCatalogPriceRange(categoryId);
  }, [categoryId]);
  
  if (isLoading) {
    return <div>Loading price range for category...</div>;
  }
  
  if (!catalogPriceRange) {
    return (
      <div className="category-price-range-empty">
        <p className="text-gray-500 text-sm">
          No price data available for this category
        </p>
      </div>
    );
  }
  
  return (
    <div className="category-price-range">
      <h4 className="text-sm font-medium text-gray-900 mb-2">
        Price Range for Category
      </h4>
      
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-xs text-gray-600">Lowest</p>
            <p className="text-lg font-semibold text-green-600">
              ${catalogPriceRange.minPrice}
            </p>
          </div>
          
          <div className="flex-1 mx-4">
            <div className="h-2 bg-gradient-to-r from-green-400 to-red-400 rounded-full"></div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-600">Highest</p>
            <p className="text-lg font-semibold text-red-600">
              ${catalogPriceRange.maxPrice}
            </p>
          </div>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-600">
            Average: ${Math.round((catalogPriceRange.minPrice + catalogPriceRange.maxPrice) / 2)}
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Error Handling

```tsx
function PriceRangeWithErrorHandling() {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const catalogPriceRange = priceRangeService.catalogPriceRange.get();
  const isLoading = priceRangeService.isLoading.get();
  const error = priceRangeService.error.get();
  
  if (isLoading) {
    return <div>Loading price range...</div>;
  }
  
  if (error) {
    return (
      <div className="price-range-error">
        <div className="text-center py-4 border rounded-lg">
          <p className="text-red-500 text-sm mb-2">Failed to load price range</p>
          <p className="text-gray-500 text-xs mb-3">{error}</p>
          <button
            onClick={() => priceRangeService.loadCatalogPriceRange()}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!catalogPriceRange) {
    return (
      <div className="price-range-empty">
        <p className="text-gray-500 text-sm text-center py-4">
          No products with pricing information found
        </p>
      </div>
    );
  }
  
  return <PriceRangeSlider />;
}
```

## Server-Side Configuration

```tsx
// Server-side configuration
import { loadCatalogPriceRangeServiceConfig } from "../services/catalog-price-range-service";

export async function createPriceRangeConfig() {
  return await loadCatalogPriceRangeServiceConfig();
}
```

## Usage in Components

The Catalog Price Range Service is used throughout the application:

### In Filter Components
```tsx
// src/components/store/ProductFilters.tsx
const priceRangeService = useService(CatalogPriceRangeServiceDefinition);

// Used for price range filtering UI
const catalogPriceRange = priceRangeService.catalogPriceRange.get();
const isLoading = priceRangeService.isLoading.get();
```

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
const priceRangeService = useService(CatalogPriceRangeServiceDefinition);

// Used for sidebar price filters
const catalogPriceRange = priceRangeService.catalogPriceRange.get();
```

## Integration with Other Services

### Filter Service Integration
- Provides price range boundaries for price filtering
- Coordinates with other filter options
- Maintains filter state consistency

### Collection Service Integration
- Price ranges are applied to product queries
- Dynamic updates based on filtered results
- Coordinated loading and error states

### Category Service Integration
- Loads category-specific price ranges
- Updates when category selection changes
- Maintains category context for price filtering

## Best Practices

### Data Loading
- Load price ranges based on current category context
- Cache price range data to reduce API calls
- Handle empty catalogs gracefully
- Provide meaningful error messages

### User Experience
- Show price ranges in intuitive formats
- Use visual indicators for price distribution
- Provide multiple input methods (sliders, inputs, buckets)
- Clear feedback on price filter applications

### Performance
- Use efficient aggregation queries
- Minimize API calls during price range loading
- Cache frequently accessed price ranges
- Implement proper loading states

### Accessibility
- Provide proper labels for price inputs
- Use semantic HTML for price controls
- Support keyboard navigation
- Ensure price ranges are clearly communicated 