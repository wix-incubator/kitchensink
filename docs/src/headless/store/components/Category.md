# Category Components

The `Category` components provide category selection and display functionality for product collections, enabling users to filter products by category and navigate through category hierarchies.

## Overview

The Category module exports components that work together to provide category management:

- **Provider** - Context provider for category service
- **useCategory** - Hook for accessing category context
- **List** - Component for displaying and managing categories

## Exports

### Provider

A React context provider that makes the category service available to child components.

**Signature:**
```tsx
interface CategoryProviderProps {
  children: ReactNode;
}

export const Provider: React.FC<CategoryProviderProps>
```

**Example:**
```tsx
import { Category } from "../../headless/store/components";

<Category.Provider>
  <CategoryNavigation />
  <FilteredProductGrid />
</Category.Provider>
```

### useCategory

A React hook that provides access to the category service context.

**Signature:**
```tsx
function useCategory(): CategoryServiceAPI
```

**Example:**
```tsx
import { Category } from "../../headless/store/components";

function CustomCategoryComponent() {
  const categoryService = Category.useCategory();
  
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();
  
  return (
    <div>
      <p>Total categories: {categories.length}</p>
      <p>Selected: {selectedCategory || 'None'}</p>
    </div>
  );
}
```

### List

A component for displaying categories with selection management.

**Signature:**
```tsx
interface CategoryListProps {
  children: (data: {
    categories: categories.Category[];
    selectedCategory: string | null;
    setSelectedCategory: (categoryId: string | null) => void;
  }) => ReactNode;
}

export const List: React.FC<CategoryListProps>
```

**Example:**
```tsx
import { Category } from "../../headless/store/components";

<Category.Provider>
  <Category.List>
    {({ categories, selectedCategory, setSelectedCategory }) => (
      <div className="category-navigation">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        
        <div className="space-y-2">
          {/* All Categories Option */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            All Categories
          </button>
          
          {/* Individual Categories */}
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    )}
  </Category.List>
</Category.Provider>
```

## Advanced Examples

### Category Dropdown

```tsx
import { Category } from "../../headless/store/components";

function CategoryDropdown() {
  return (
    <Category.Provider>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => (
          <div className="relative">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </Category.List>
    </Category.Provider>
  );
}
```

### Category Sidebar with Counts

```tsx
import { Category } from "../../headless/store/components";

function CategorySidebar() {
  return (
    <Category.Provider>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => (
          <div className="w-64 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Shop by Category</h3>
            
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="flex items-center justify-between">
                  All Products
                  {selectedCategory === null && (
                    <span className="text-xs">✓</span>
                  )}
                </span>
              </button>
              
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {category.name}
                    {selectedCategory === category.id && (
                      <span className="text-xs">✓</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Category.List>
    </Category.Provider>
  );
}
```

### Category Breadcrumbs

```tsx
import { Category } from "../../headless/store/components";

function CategoryBreadcrumbs() {
  return (
    <Category.Provider>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => {
          const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
          
          return (
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => setSelectedCategory(null)}
                className="hover:text-blue-600 transition-colors"
              >
                Home
              </button>
              
              {selectedCategoryObj && (
                <>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">
                    {selectedCategoryObj.name}
                  </span>
                </>
              )}
            </nav>
          );
        }}
      </Category.List>
    </Category.Provider>
  );
}
```

### Category Filter with Clear Option

```tsx
import { Category } from "../../headless/store/components";

function CategoryFilter() {
  return (
    <Category.Provider>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 py-2">
              Filter by category:
            </span>
            
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
            
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </Category.List>
    </Category.Provider>
  );
}
```

## Complete Example

Here's a complete example showing how Category components integrate with other store components:

```tsx
import { Category } from "../../headless/store/components";
import { Collection } from "../../headless/store/components";

export function CategoryStoreLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Category.Provider>
        <Collection.Provider>
          <div className="flex gap-8">
            {/* Category Sidebar */}
            <div className="w-64 flex-shrink-0">
              <Category.List>
                {({ categories, selectedCategory, setSelectedCategory }) => (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Categories</h2>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          selectedCategory === null
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="font-medium">All Products</span>
                      </button>
                      
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span className="font-medium">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Category.List>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Category Breadcrumbs */}
              <Category.List>
                {({ categories, selectedCategory }) => {
                  const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
                  
                  return (
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                      <span>Home</span>
                      {selectedCategoryObj && (
                        <>
                          <span>/</span>
                          <span className="text-gray-900 font-medium">
                            {selectedCategoryObj.name}
                          </span>
                        </>
                      )}
                    </nav>
                  );
                }}
              </Category.List>
              
              {/* Products Grid */}
              <Collection.Grid>
                {({ products, isLoading, error, totalProducts }) => (
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h1 className="text-2xl font-bold">
                        <Category.List>
                          {({ categories, selectedCategory }) => {
                            const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
                            return selectedCategoryObj ? selectedCategoryObj.name : 'All Products';
                          }}
                        </Category.List>
                      </h1>
                      
                      <span className="text-gray-600">
                        {totalProducts} products
                      </span>
                    </div>
                    
                    {/* Products */}
                    {isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                            <div className="bg-gray-200 h-4 rounded mb-2"></div>
                            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <p className="text-red-600">Error loading products: {error}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                          <Collection.Item key={product._id} product={product}>
                            {({ title, image, price, available, slug }) => (
                              <a
                                href={`/products/${slug}`}
                                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              >
                                {image && (
                                  <img
                                    src={image}
                                    alt={title}
                                    className="w-full h-64 object-cover rounded-t-lg"
                                  />
                                )}
                                <div className="p-4">
                                  <h3 className="font-semibold text-gray-900 mb-2">
                                    {title}
                                  </h3>
                                  <p className="text-lg font-bold text-blue-600">
                                    {price}
                                  </p>
                                  <p className={`text-sm ${
                                    available ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {available ? 'In Stock' : 'Out of Stock'}
                                  </p>
                                </div>
                              </a>
                            )}
                          </Collection.Item>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Collection.Grid>
            </div>
          </div>
        </Collection.Provider>
      </Category.Provider>
    </div>
  );
}
```

## Usage Examples

The Category components are used throughout the application:

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
import { Category } from "../headless/store/components";

export const StoreLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Category.Provider>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Category.List>
            {({ categories, selectedCategory, setSelectedCategory }) => (
              <nav className="flex space-x-8">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? 'text-blue-600 font-semibold' : 'text-gray-700'}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? 'text-blue-600 font-semibold' : 'text-gray-700'}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            )}
          </Category.List>
        </div>
      </header>
      <main>{children}</main>
    </Category.Provider>
  </div>
);
```

### In Product List Components
```tsx
// src/components/store/ProductFilters.tsx
import { Category } from "../../headless/store/components";

export const ProductFilters = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold mb-4">Filters</h3>
    
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => (
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => setSelectedCategory(category.id)}
                  className="mr-2"
                />
                {category.name}
              </label>
            ))}
          </div>
        )}
      </Category.List>
    </div>
  </div>
);
```

## Integration with Services

The Category components integrate with the CategoryService:

### Category Service Integration
- Provides category data and selection state
- Manages category filtering and persistence
- Handles category-based product filtering
- Coordinates with Collection service for filtered results

### URL Integration
- Category selections are reflected in URL parameters
- Browser navigation preserves category state
- Direct links to category pages work correctly

### State Management
- Category selection state is reactive and persistent
- Multiple components can share the same category state
- Changes propagate automatically to all subscribers 