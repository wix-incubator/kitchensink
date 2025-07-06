# Category Service

The `category-service` provides category management and navigation functionality for e-commerce stores, handling category selection, loading, and navigation with automatic routing integration.

## Overview

The Category Service handles:

- **Category Management** - Loads and manages store categories
- **Category Selection** - Tracks selected category state
- **Navigation Integration** - Handles category-based navigation
- **Category Loading** - Fetches categories from Wix Categories API
- **State Management** - Maintains category selection and list state

## API Interface

```tsx
interface CategoryServiceAPI {
  selectedCategory: Signal<string | null>;
  categories: Signal<categories.Category[]>;
  setSelectedCategory: (categoryId: string | null) => void;
  loadCategories: () => Promise<void>;
}

interface CategoryServiceConfig {
  categories: categories.Category[];
  initialCategoryId?: string | null;
  onCategoryChange?: (categoryId: string | null, category: categories.Category | null) => void;
}
```

## Category Data Structure

Categories loaded from the service include:

- **_id** - Unique category identifier
- **name** - Category display name
- **slug** - URL-friendly category identifier
- **description** - Category description
- **visible** - Whether category is visible to users
- **media** - Category images and media
- **parent** - Parent category for hierarchical categories

## Core Functionality

### Getting Categories

Access category data and selection:

```tsx
import { useService } from "@wix/services-manager-react";
import { CategoryServiceDefinition } from "../services/category-service";

function CategoryComponent() {
  const categoryService = useService(CategoryServiceDefinition);
  
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();
  
  return (
    <div>
      <h3>Categories:</h3>
      <ul>
        {categories.map(category => (
          <li key={category._id}>
            <button 
              onClick={() => categoryService.setSelectedCategory(category._id)}
              className={selectedCategory === category._id ? 'active' : ''}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Setting Selected Category

Change the selected category:

```tsx
// Select specific category
categoryService.setSelectedCategory("category-id");

// Clear selection (show all products)
categoryService.setSelectedCategory(null);
```

### Loading Categories

Load categories from the API:

```tsx
// Load categories dynamically
await categoryService.loadCategories();

// Access loaded categories
const categories = categoryService.categories.get();
```

## Usage Examples

### Category Navigation Menu

```tsx
import { useService } from "@wix/services-manager-react";
import { CategoryServiceDefinition } from "../services/category-service";

function CategoryNavigation() {
  const categoryService = useService(CategoryServiceDefinition);
  
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();
  
  return (
    <nav className="category-nav">
      <div className="flex flex-wrap gap-2">
        {/* All Products Button */}
        <button
          onClick={() => categoryService.setSelectedCategory(null)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectedCategory === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          All Products
        </button>
        
        {/* Category Buttons */}
        {categories.map(category => (
          <button
            key={category._id}
            onClick={() => categoryService.setSelectedCategory(category._id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${selectedCategory === category._id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
```

### Category Sidebar

```tsx
function CategorySidebar() {
  const categoryService = useService(CategoryServiceDefinition);
  
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();
  
  return (
    <aside className="category-sidebar w-64 bg-white border-r">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Categories
        </h3>
        
        <div className="space-y-1">
          {/* All Products */}
          <button
            onClick={() => categoryService.setSelectedCategory(null)}
            className={`
              w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
              ${selectedCategory === null
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            All Products
          </button>
          
          {/* Category List */}
          {categories.map(category => (
            <button
              key={category._id}
              onClick={() => categoryService.setSelectedCategory(category._id)}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                ${selectedCategory === category._id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
```

### Category Dropdown

```tsx
function CategoryDropdown() {
  const categoryService = useService(CategoryServiceDefinition);
  
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();
  
  const selectedCategoryName = selectedCategory 
    ? categories.find(cat => cat._id === selectedCategory)?.name || 'Unknown'
    : 'All Categories';
  
  return (
    <div className="category-dropdown">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Category:
      </label>
      <select
        value={selectedCategory || ''}
        onChange={(e) => categoryService.setSelectedCategory(e.target.value || null)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Category Grid with Images

```tsx
function CategoryGrid() {
  const categoryService = useService(CategoryServiceDefinition);
  
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();
  
  return (
    <div className="category-grid">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Shop by Category
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* All Products Card */}
        <button
          onClick={() => categoryService.setSelectedCategory(null)}
          className={`
            relative group overflow-hidden rounded-lg aspect-square
            ${selectedCategory === null
              ? 'ring-2 ring-blue-500'
              : 'hover:scale-105 transition-transform'
            }
          `}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              All Products
            </span>
          </div>
        </button>
        
        {/* Category Cards */}
        {categories.map(category => (
          <button
            key={category._id}
            onClick={() => categoryService.setSelectedCategory(category._id)}
            className={`
              relative group overflow-hidden rounded-lg aspect-square
              ${selectedCategory === category._id
                ? 'ring-2 ring-blue-500'
                : 'hover:scale-105 transition-transform'
              }
            `}
          >
            {category.media?.[0] ? (
              <img
                src={category.media[0].url}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-semibold text-lg">
                {category.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Category Breadcrumbs

```tsx
function CategoryBreadcrumbs() {
  const categoryService = useService(CategoryServiceDefinition);
  
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();
  
  const selectedCategoryData = selectedCategory 
    ? categories.find(cat => cat._id === selectedCategory)
    : null;
  
  return (
    <nav className="category-breadcrumbs mb-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" className="hover:text-blue-500">Home</a>
        <span>›</span>
        <button
          onClick={() => categoryService.setSelectedCategory(null)}
          className={`
            hover:text-blue-500 transition-colors
            ${selectedCategory === null ? 'text-blue-500 font-medium' : ''}
          `}
        >
          Store
        </button>
        
        {selectedCategoryData && (
          <>
            <span>›</span>
            <span className="text-gray-900 font-medium">
              {selectedCategoryData.name}
            </span>
          </>
        )}
      </div>
    </nav>
  );
}
```

## Navigation Integration

The service supports automatic navigation when categories change:

### Navigation Handler Configuration

```tsx
// Configure navigation handler
const categoryService = CategoryService.withConfig({
  categories: categories,
  initialCategoryId: null,
  onCategoryChange: (categoryId, category) => {
    if (categoryId) {
      // Navigate to category page
      window.location.href = `/store/category/${category.slug}`;
    } else {
      // Navigate to all products
      window.location.href = '/store';
    }
  }
});
```

### Custom Navigation Handler

```tsx
// Custom navigation with URL updates
const handleCategoryChange = (categoryId: string | null, category: categories.Category | null) => {
  if (categoryId && category) {
    // Update URL with category
    const url = new URL(window.location.href);
    url.searchParams.set('category', category.slug);
    window.history.pushState({}, '', url.toString());
  } else {
    // Clear category from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    window.history.pushState({}, '', url.toString());
  }
};
```

## Server-Side Configuration

Load categories server-side for better performance:

### Category Loading Function

```tsx
// Server-side category loading
export async function loadCategoriesConfig() {
  try {
    const categoriesResponse = await categories
      .queryCategories({
        treeReference: {
          appNamespace: "@wix/stores",
          treeKey: null,
        },
      })
      .eq("visible", true)
      .find();

    const fetchedCategories = categoriesResponse.items || [];

    // Sort categories to put "all-products" first
    const allProductsCategory = fetchedCategories.find(cat => cat.slug === "all-products");
    const otherCategories = fetchedCategories.filter(cat => cat.slug !== "all-products");
    
    const allCategories = allProductsCategory 
      ? [allProductsCategory, ...otherCategories]
      : fetchedCategories;

    return {
      categories: allCategories,
    };
  } catch (error) {
    console.warn("Failed to load categories:", error);
    return {
      categories: [],
    };
  }
}
```

### Astro Integration

```tsx
// In Astro page
---
import { loadCategoriesConfig } from "../services/category-service";

const { categories } = await loadCategoriesConfig();
---

<CategoryPage categories={categories} />
```

## Usage in Components

The Category Service is used throughout the application:

### In Category Components
```tsx
// src/headless/store/components/Category.tsx
export const List = (props: CategoryListProps) => {
  const service = useService(CategoryServiceDefinition);
  
  const categories = service.categories.get();
  const selectedCategory = service.selectedCategory.get();
  
  return props.children({ categories, selectedCategory });
};
```

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
const categoryService = useService(CategoryServiceDefinition);

// Used for category navigation and filtering
const categories = categoryService.categories.get();
const selectedCategory = categoryService.selectedCategory.get();
```

### In Product Collection Pages
```tsx
// src/react-pages/store/example-1/index.tsx
// Category service integrates with collection filtering
const categoryService = useService(CategoryServiceDefinition);
const collectionService = useService(CollectionServiceDefinition);

// When category changes, collection automatically updates
```

## Integration with Other Services

### Collection Service Integration
- Category selection automatically filters product collections
- Collection service reacts to category changes
- Coordinated loading states between services

### Filter Service Integration
- Category filters work alongside other product filters
- Category changes reset other filters when configured
- Maintains filter state consistency

### URL Parameters Integration
- Category selection can be synced with URL parameters
- Deep linking support for category pages
- Browser navigation compatibility

## Best Practices

### Category Management
- Load categories server-side when possible
- Handle loading states gracefully
- Provide fallback for missing categories
- Sort categories logically (e.g., "All Products" first)

### Navigation
- Use smooth transitions between category changes
- Provide clear visual indication of selected category
- Support keyboard navigation
- Handle navigation errors gracefully

### Performance
- Cache category data when possible
- Implement proper loading states
- Use optimistic updates for category selection
- Minimize API calls during category changes

### User Experience
- Show category names clearly
- Provide category descriptions when available
- Use category images for better visual appeal
- Implement search functionality for large category lists

### Error Handling
- Gracefully handle category loading failures
- Provide fallback categories when API fails
- Show user-friendly error messages
- Implement retry mechanisms for failed requests 