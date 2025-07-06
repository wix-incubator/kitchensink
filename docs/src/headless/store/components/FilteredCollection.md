# FilteredCollection Components

The `FilteredCollection` components provide advanced product collection functionality with integrated filtering capabilities. These components combine the Collection and Filter services to create sophisticated product browsing experiences.

## Overview

The FilteredCollection module exports components that work together to provide filtered product collections:

- **Provider** - Context provider that integrates Collection and Filter services
- **useFilteredCollection** - Hook for accessing the filtered collection context
- **FiltersLoading** - Loading state management for filters
- **Grid** - Product grid with filtering capabilities
- **Item** - Individual product item with safe data handling
- **LoadMore** - Pagination and load more functionality
- **Filters** - Filter management and controls

## Exports

### Provider

A React context provider that integrates Collection and Filter services.

**Signature:**
```tsx
interface FilteredCollectionProviderProps {
  children: ReactNode;
}

export const Provider: React.FC<FilteredCollectionProviderProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Provider>
  <YourFilteredProductInterface />
</FilteredCollection.Provider>
```

### useFilteredCollection

A React hook that provides access to the filtered collection context.

**Signature:**
```tsx
function useFilteredCollection(): {
  filter: FilterServiceAPI | null;
  collection: CollectionServiceAPI | null;
}
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

function CustomFilterComponent() {
  const { filter, collection } = FilteredCollection.useFilteredCollection();
  
  const products = collection?.products.get() || [];
  const currentFilters = filter?.currentFilters.get();
  
  return (
    <div>
      <p>Products: {products.length}</p>
      <p>Active filters: {Object.keys(currentFilters?.selectedOptions || {}).length}</p>
    </div>
  );
}
```

### FiltersLoading

A component that manages loading state for filters with pulse animation support.

**Signature:**
```tsx
interface FiltersLoadingProps {
  children: (data: { isFullyLoaded: boolean }) => ReactNode;
}

export const FiltersLoading: React.FC<FiltersLoadingProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Provider>
  <FilteredCollection.FiltersLoading>
    {({ isFullyLoaded }) => (
      <div className="relative">
        <FilterControls />
        {!isFullyLoaded && (
          <div className="absolute inset-0 bg-white/50 animate-pulse">
            <div className="text-center py-4">Loading filters...</div>
          </div>
        )}
      </div>
    )}
  </FilteredCollection.FiltersLoading>
</FilteredCollection.Provider>
```

### Grid

A component for displaying filtered product collections with comprehensive state management.

**Signature:**
```tsx
interface FilteredGridProps {
  children: (data: {
    products: productsV3.V3Product[];
    totalProducts: number;
    isLoading: boolean;
    error: string | null;
    isEmpty: boolean;
    hasMoreProducts: boolean;
  }) => ReactNode;
}

export const Grid: React.FC<FilteredGridProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Provider>
  <FilteredCollection.Grid>
    {({ products, totalProducts, isLoading, error, isEmpty, hasMoreProducts }) => (
      <div>
        {isLoading && <div>Loading products...</div>}
        {error && <div className="error">Error: {error}</div>}
        {isEmpty && <div>No products found matching your filters</div>}
        
        {!isEmpty && (
          <div>
            <p>Showing {products.length} of {totalProducts} products</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map(product => (
                <FilteredCollection.Item key={product._id} product={product}>
                  {({ title, image, price, available }) => (
                    <div className="product-card">
                      <img src={image || '/placeholder.jpg'} alt={title} />
                      <h3>{title}</h3>
                      <p className={available ? 'text-green-600' : 'text-red-600'}>
                        {price}
                      </p>
                    </div>
                  )}
                </FilteredCollection.Item>
              ))}
            </div>
            
            {hasMoreProducts && (
              <FilteredCollection.LoadMore>
                {({ loadMore, isLoading: loadingMore }) => (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                )}
              </FilteredCollection.LoadMore>
            )}
          </div>
        )}
      </div>
    )}
  </FilteredCollection.Grid>
</FilteredCollection.Provider>
```

### Item

A component for individual product items with safe data handling and type conversion.

**Signature:**
```tsx
interface FilteredItemProps {
  product: productsV3.V3Product;
  children: (data: {
    title: string;
    image: string | null;
    price: string;
    compareAtPrice: string | null;
    available: boolean;
    slug: string;
    description?: string;
  }) => ReactNode;
}

export const Item: React.FC<FilteredItemProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Item product={product}>
  {({ 
    title, 
    image, 
    price, 
    compareAtPrice, 
    available, 
    slug, 
    description 
  }) => (
    <div className="product-card border rounded-lg p-4">
      <a href={`/products/${slug}`}>
        {image && (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover rounded"
          />
        )}
        <div className="mt-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          {description && (
            <p className="text-gray-600 text-sm mt-1">{description}</p>
          )}
          <div className="mt-2">
            <span className={`text-lg font-bold ${
              available ? 'text-green-600' : 'text-red-600'
            }`}>
              {price}
            </span>
            {compareAtPrice && (
              <span className="text-gray-500 line-through ml-2">
                {compareAtPrice}
              </span>
            )}
          </div>
          <p className="text-sm mt-1">
            {available ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </a>
    </div>
  )}
</FilteredCollection.Item>
```

### LoadMore

A component for pagination and loading more products.

**Signature:**
```tsx
interface FilteredLoadMoreProps {
  children: (data: {
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    isLoading: boolean;
    hasProducts: boolean;
    totalProducts: number;
    hasMoreProducts: boolean;
  }) => ReactNode;
}

export const LoadMore: React.FC<FilteredLoadMoreProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.LoadMore>
  {({ 
    loadMore, 
    refresh, 
    isLoading, 
    hasProducts, 
    totalProducts, 
    hasMoreProducts 
  }) => (
    <div className="text-center mt-8">
      {hasProducts && (
        <p className="text-gray-600 mb-4">
          Showing {totalProducts} products
        </p>
      )}
      
      <div className="space-x-4">
        <button
          onClick={refresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
        
        {hasMoreProducts && (
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  )}
</FilteredCollection.LoadMore>
```

### Filters

A component for managing and applying product filters.

**Signature:**
```tsx
interface FilteredFiltersProps {
  children: (data: {
    applyFilters: (filters: Filter) => void;
    clearFilters: () => void;
    currentFilters: Filter;
    allProducts: productsV3.V3Product[];
    availableOptions: AvailableOptions;
    isFiltered: boolean;
  }) => ReactNode;
}

export const Filters: React.FC<FilteredFiltersProps>
```

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Provider>
  <FilteredCollection.Filters>
    {({ 
      applyFilters, 
      clearFilters, 
      currentFilters, 
      availableOptions, 
      isFiltered 
    }) => (
      <div className="filters-panel">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Filters</h3>
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="text-blue-500 text-sm hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
        
        {/* Price Range Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Price Range</h4>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={currentFilters.priceRange.min}
              onChange={(e) => {
                const newFilters = {
                  ...currentFilters,
                  priceRange: {
                    ...currentFilters.priceRange,
                    min: parseFloat(e.target.value) || 0
                  }
                };
                applyFilters(newFilters);
              }}
              className="border rounded px-2 py-1 w-20"
            />
            <input
              type="number"
              placeholder="Max"
              value={currentFilters.priceRange.max}
              onChange={(e) => {
                const newFilters = {
                  ...currentFilters,
                  priceRange: {
                    ...currentFilters.priceRange,
                    max: parseFloat(e.target.value) || 999999
                  }
                };
                applyFilters(newFilters);
              }}
              className="border rounded px-2 py-1 w-20"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Range: ${availableOptions.priceRange.min} - ${availableOptions.priceRange.max}
          </p>
        </div>
        
        {/* Product Options Filters */}
        {Object.entries(availableOptions.options).map(([optionId, option]) => (
          <div key={optionId} className="mb-6">
            <h4 className="font-medium mb-2">{option.name}</h4>
            <div className="space-y-2">
              {option.choices.map(choice => (
                <label key={choice.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentFilters.selectedOptions[optionId]?.includes(choice.id) || false}
                    onChange={(e) => {
                      const currentChoices = currentFilters.selectedOptions[optionId] || [];
                      const newChoices = e.target.checked
                        ? [...currentChoices, choice.id]
                        : currentChoices.filter(id => id !== choice.id);
                      
                      const newFilters = {
                        ...currentFilters,
                        selectedOptions: {
                          ...currentFilters.selectedOptions,
                          [optionId]: newChoices
                        }
                      };
                      applyFilters(newFilters);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{choice.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </FilteredCollection.Filters>
</FilteredCollection.Provider>
```

## Complete Example

Here's a complete example showing how all FilteredCollection components work together:

```tsx
import { FilteredCollection } from "../../headless/store/components";

export function AdvancedProductGrid() {
  return (
    <FilteredCollection.Provider>
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-80 flex-shrink-0">
          <FilteredCollection.FiltersLoading>
            {({ isFullyLoaded }) => (
              <div className="sticky top-6">
                <FilteredCollection.Filters>
                  {({ 
                    applyFilters, 
                    clearFilters, 
                    currentFilters, 
                    availableOptions, 
                    isFiltered 
                  }) => (
                    <FiltersPanel
                      applyFilters={applyFilters}
                      clearFilters={clearFilters}
                      currentFilters={currentFilters}
                      availableOptions={availableOptions}
                      isFiltered={isFiltered}
                    />
                  )}
                </FilteredCollection.Filters>
                
                {/* Loading Overlay */}
                {!isFullyLoaded && (
                  <div className="absolute inset-0 bg-white/50 animate-pulse rounded">
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-500">Loading filters...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </FilteredCollection.FiltersLoading>
        </div>
        
        {/* Products Grid */}
        <div className="flex-1">
          <FilteredCollection.Grid>
            {({ products, isLoading, error, isEmpty, totalProducts, hasMoreProducts }) => (
              <div>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Products</h2>
                  {!isLoading && !isEmpty && (
                    <p className="text-gray-600">
                      Showing {products.length} of {totalProducts} products
                    </p>
                  )}
                </div>
                
                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                  </div>
                )}
                
                {/* Error State */}
                {error && (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">⚠️ Error loading products</div>
                    <p className="text-gray-600">{error}</p>
                  </div>
                )}
                
                {/* Empty State */}
                {isEmpty && !isLoading && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">📦 No products found</div>
                    <p className="text-gray-600">
                      Try adjusting your filters to see more results
                    </p>
                  </div>
                )}
                
                {/* Products Grid */}
                {!isEmpty && !isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <FilteredCollection.Item key={product._id} product={product}>
                        {({ title, image, price, compareAtPrice, available, slug }) => (
                          <ProductCard
                            title={title}
                            image={image}
                            price={price}
                            compareAtPrice={compareAtPrice}
                            available={available}
                            href={`/products/${slug}`}
                          />
                        )}
                      </FilteredCollection.Item>
                    ))}
                  </div>
                )}
                
                {/* Load More */}
                {hasMoreProducts && (
                  <FilteredCollection.LoadMore>
                    {({ loadMore, isLoading: loadingMore }) => (
                      <div className="text-center mt-8">
                        <button
                          onClick={loadMore}
                          disabled={loadingMore}
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingMore ? 'Loading More...' : 'Load More Products'}
                        </button>
                      </div>
                    )}
                  </FilteredCollection.LoadMore>
                )}
              </div>
            )}
          </FilteredCollection.Grid>
        </div>
      </div>
    </FilteredCollection.Provider>
  );
}
```

## Usage Examples

The FilteredCollection components are extensively used throughout the application:

### In Product List Pages
```tsx
// src/components/store/ProductList.tsx
import { FilteredCollection } from "../../headless/store/components";

export const ProductGridContent = () => (
  <FilteredCollection.Provider>
    <FilteredCollection.Grid>
      {({ products, isLoading, totalProducts }) => (
        <FilteredCollection.Filters>
          {({ currentFilters, applyFilters, clearFilters, availableOptions, isFiltered }) => (
            <div className="flex gap-8">
              <ProductFilters 
                currentFilters={currentFilters}
                onFiltersChange={applyFilters}
                clearFilters={clearFilters}
                availableOptions={availableOptions}
                isFiltered={isFiltered}
              />
              <ProductGrid products={products} />
            </div>
          )}
        </FilteredCollection.Filters>
      )}
    </FilteredCollection.Grid>
  </FilteredCollection.Provider>
);
```

### In Store Example Pages
```tsx
// src/react-pages/store/example-2/index.tsx
import { FilteredCollection } from "../../../headless/store/components";

const ProductGridContent = () => {
  return (
    <FilteredCollection.Provider>
      <FilteredCollection.Grid>
        {({ products, isLoading, error, isEmpty, totalProducts }) => (
          <FilteredCollection.Filters>
            {({ currentFilters, applyFilters, clearFilters, availableOptions, isFiltered }) => {
              return (
                <div className="min-h-screen">
                  <StoreHeader className="mb-6" />
                  <div className="flex gap-8">
                    <FiltersSidebar 
                      filters={{ currentFilters, applyFilters, clearFilters, availableOptions, isFiltered }}
                    />
                    <ProductsGrid products={products} />
                  </div>
                </div>
              );
            }}
          </FilteredCollection.Filters>
        )}
      </FilteredCollection.Grid>
    </FilteredCollection.Provider>
  );
};
```

## Integration with Services

The FilteredCollection components integrate with multiple services:

### Collection Service Integration
- Provides product data and pagination
- Manages loading states and errors
- Handles product search and retrieval

### Filter Service Integration
- Manages filter state and available options
- Applies filters to product collections
- Handles filter persistence and URL integration

### Combined Functionality
- Automatic filter application triggers collection refresh
- Coordinated loading states between filters and products
- Unified error handling across both services 