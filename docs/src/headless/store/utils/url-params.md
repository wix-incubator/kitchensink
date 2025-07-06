# URL Params Utility

The `URLParamsUtils` utility provides helper functions for managing URL search parameters in store applications. It handles parsing, updating, and retrieving URL parameters with support for multiple values per parameter.

## Overview

The URLParamsUtils class provides static methods for:
- Parsing URL search parameters into structured objects
- Updating the browser URL without page reload
- Retrieving current URL parameters
- Handling multiple values for the same parameter

## Exports

### URLParamsUtils

A utility class with static methods for URL parameter management.

**Signature:**
```tsx
export class URLParamsUtils {
  static parseSearchParams(searchParams: URLSearchParams): Record<string, string | string[]>;
  static updateURL(params: Record<string, string | string[]>): void;
  static getURLParams(): Record<string, string | string[]>;
}
```

## Methods

### parseSearchParams

Parses URLSearchParams into a structured object with support for multiple values.

**Signature:**
```tsx
static parseSearchParams(searchParams: URLSearchParams): Record<string, string | string[]>
```

**Parameters:**
- `searchParams` - URLSearchParams object to parse

**Returns:**
- Object with parameter names as keys and string or string array as values

**Example:**
```tsx
import { URLParamsUtils } from "../../headless/store/utils/url-params";

// URL: ?category=electronics&color=red&color=blue&sort=price-asc
const searchParams = new URLSearchParams(window.location.search);
const params = URLParamsUtils.parseSearchParams(searchParams);

console.log(params);
// Output:
// {
//   category: "electronics",
//   color: ["red", "blue"],
//   sort: "price-asc"
// }
```

### updateURL

Updates the browser URL with new parameters without causing a page reload.

**Signature:**
```tsx
static updateURL(params: Record<string, string | string[]>): void
```

**Parameters:**
- `params` - Object with parameter names and values to update

**Example:**
```tsx
import { URLParamsUtils } from "../../headless/store/utils/url-params";

// Update URL with new filters
URLParamsUtils.updateURL({
  category: "electronics",
  color: ["red", "blue"],
  minPrice: "100",
  maxPrice: "500",
  sort: "price-asc"
});

// URL becomes: /store?category=electronics&color=red&color=blue&minPrice=100&maxPrice=500&sort=price-asc
```

### getURLParams

Retrieves current URL parameters as a structured object.

**Signature:**
```tsx
static getURLParams(): Record<string, string | string[]>
```

**Returns:**
- Object with current URL parameter names and values

**Example:**
```tsx
import { URLParamsUtils } from "../../headless/store/utils/url-params";

// Get current URL parameters
const currentParams = URLParamsUtils.getURLParams();

console.log(currentParams);
// Output based on current URL
// {
//   category: "electronics",
//   sort: "name-asc"
// }
```

## Features

### Multiple Values Support

The utility automatically handles multiple values for the same parameter:

```tsx
// URL: ?color=red&color=blue&color=green
const params = URLParamsUtils.getURLParams();
console.log(params.color); // ["red", "blue", "green"]

// Update with multiple values
URLParamsUtils.updateURL({
  sizes: ["small", "medium", "large"]
});
// URL becomes: ?sizes=small&sizes=medium&sizes=large
```

### Server-Side Safety

The utility safely handles server-side rendering where `window` is not available:

```tsx
// Returns empty object on server-side
const params = URLParamsUtils.getURLParams(); // {} on server, actual params on client
```

### Clean URL Generation

The utility generates clean URLs and removes empty parameters:

```tsx
URLParamsUtils.updateURL({
  category: "electronics",
  color: "", // Empty value will be omitted
  size: []   // Empty array will be omitted
});
// URL becomes: ?category=electronics
```

## Usage Examples

The URLParamsUtils is used throughout the store application:

### In Collection Service
```tsx
// src/headless/store/services/collection-service.ts
import { URLParamsUtils } from "../utils/url-params";

export async function loadCollectionServiceConfig(
  categoryId?: string,
  searchParams?: URLSearchParams
) {
  const urlParams = searchParams 
    ? URLParamsUtils.parseSearchParams(searchParams)
    : URLParamsUtils.getURLParams();
  
  // Parse filters from URL
  const filters = parseFilters(urlParams);
  const sort = urlParams.sort as SortBy || "";
  
  return {
    initialFilters: filters,
    initialSort: sort
  };
}
```

### In Filter Components
```tsx
// Example filter component
import { URLParamsUtils } from "../../headless/store/utils/url-params";

function PriceRangeFilter({ onFilterChange }) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const applyPriceFilter = () => {
    const currentParams = URLParamsUtils.getURLParams();
    
    URLParamsUtils.updateURL({
      ...currentParams,
      minPrice: minPrice || "",
      maxPrice: maxPrice || ""
    });
    
    onFilterChange({
      priceRange: {
        min: parseFloat(minPrice) || 0,
        max: parseFloat(maxPrice) || 999999
      }
    });
  };
  
  return (
    <div>
      <input 
        type="number" 
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Min Price"
      />
      <input 
        type="number" 
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Max Price"
      />
      <button onClick={applyPriceFilter}>Apply</button>
    </div>
  );
}
```

### In Sort Components
```tsx
// Example sort component
import { URLParamsUtils } from "../../headless/store/utils/url-params";

function SortDropdown({ currentSort, onSortChange }) {
  const handleSortChange = (newSort: string) => {
    const currentParams = URLParamsUtils.getURLParams();
    
    URLParamsUtils.updateURL({
      ...currentParams,
      sort: newSort
    });
    
    onSortChange(newSort);
  };
  
  return (
    <select value={currentSort} onChange={(e) => handleSortChange(e.target.value)}>
      <option value="">Default</option>
      <option value="name-asc">Name (A-Z)</option>
      <option value="price-asc">Price (Low to High)</option>
    </select>
  );
}
```

### In Category Components
```tsx
// Example category filter
import { URLParamsUtils } from "../../headless/store/utils/url-params";

function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  const handleCategoryChange = (categoryId: string) => {
    const currentParams = URLParamsUtils.getURLParams();
    
    URLParamsUtils.updateURL({
      ...currentParams,
      category: categoryId
    });
    
    onCategoryChange(categoryId);
  };
  
  return (
    <div>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className={selectedCategory === category.id ? "active" : ""}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
```

### In Astro Pages
```astro
---
// src/pages/store/category/[categorySlug].astro
import { URLParamsUtils } from "../../../headless/store/utils/url-params";

const searchParams = new URLSearchParams(Astro.url.search);
const urlParams = URLParamsUtils.parseSearchParams(searchParams);

// Use URL parameters for initial state
const initialSort = urlParams.sort as string || "";
const initialMinPrice = urlParams.minPrice as string || "";
const initialMaxPrice = urlParams.maxPrice as string || "";
---

<CategoryPage 
  initialSort={initialSort}
  initialMinPrice={initialMinPrice}
  initialMaxPrice={initialMaxPrice}
  client:load
/>
```

## Parameter Conventions

The utility follows these conventions for common store parameters:

### Filter Parameters
- `category` - Selected category ID
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `{optionName}` - Product option filters (e.g., `color`, `size`)

### Sort Parameters
- `sort` - Sort order (`name-asc`, `price-desc`, etc.)

### Search Parameters
- `q` - Search query
- `page` - Page number (if using traditional pagination)

### Example URL
```
/store?category=electronics&color=red&color=blue&minPrice=100&maxPrice=500&sort=price-asc&q=smartphone
```

This would be parsed as:
```tsx
{
  category: "electronics",
  color: ["red", "blue"],
  minPrice: "100",
  maxPrice: "500",
  sort: "price-asc",
  q: "smartphone"
}
``` 