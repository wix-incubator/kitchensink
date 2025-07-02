# Filter Service

## Overview

The FilterService is a comprehensive headless service that manages product filtering functionality in e-commerce applications. It handles price range filters, product option filters (like size, color, etc.), and integrates with catalog services to provide real-time filtering capabilities. The service manages filter state, URL synchronization, and coordinates with other services to provide a complete filtering experience.

This service uses Wix's signals system for reactive state management and automatically updates the URL to reflect current filter states. It subscribes to catalog price range and options services to provide accurate filtering options and maintains consistency between the UI and the underlying data.

## Exports

### `ProductOption`
**Type**: `interface`

Interface defining product option structure including option ID, name, available choices, and rendering preferences for UI components.

### `PriceRange`
**Type**: `interface`

Interface defining price range structure with minimum and maximum values for price filtering functionality.

### `AvailableOptions`
**Type**: `interface`

Interface defining the complete set of available filtering options including product options and price range information.

### `Filter`
**Type**: `interface`

Interface defining the current filter state including selected price range and chosen option values.

### `FilterServiceAPI`
**Type**: `interface`

Complete API interface for the filter service including signals for state management and methods for filter operations.

### `FilterServiceDefinition`
**Type**: `ServiceDefinition<FilterServiceAPI>`

Service definition that identifies and types the filter service within Wix's service manager system.

### `FilterService`
**Type**: `ServiceImplementation<FilterServiceAPI>`

Main service implementation providing all filtering functionality including state management, filter application, and URL synchronization.

### `defaultFilter`
**Type**: `Filter`

Default filter configuration with empty price range and no selected options.

## Usage Examples

### Filter Integration with Product List
```tsx
function ProductListWithFilters() {
  const filterService = useService(FilterServiceDefinition);
  const productService = useService(ProductListServiceDefinition);
  
  const currentFilters = filterService.currentFilters.use();
  const products = productService.products.use();
  
  useEffect(() => {
    // Load catalog options and price range when component mounts
    filterService.loadCatalogOptions();
    filterService.loadCatalogPriceRange();
  }, []);
  
  useEffect(() => {
    // Apply filters to product service when filters change
    productService.applyFilters(currentFilters);
  }, [currentFilters]);
  
  return (
    <div className="product-list-page">
      <aside className="filters-sidebar">
        <FilterComponent />
      </aside>
      
      <main className="products-main">
        <div className="products-header">
          <h2>Products ({products.length})</h2>
          <FilterSummary />
        </div>
        <ProductGrid products={products} />
      </main>
    </div>
  );
}
```
