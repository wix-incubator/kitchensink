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

## Usage Example

```tsx
function CategoryNavigationMenu() {
  const categoryService = useService(CategoryServiceDefinition);
  
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();
  const isLoading = categoryService.isLoading.get();
  
  if (isLoading) {
    return (
      <div className="category-navigation-loading">
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-300 rounded w-24"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <nav className="category-navigation">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Shop by Category
      </h3>
      
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => categoryService.setSelectedCategory(null)}
            className={`
              w-full text-left px-3 py-2 rounded-lg transition-colors
              ${!selectedCategory
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            All Products
          </button>
        </li>
        
        {categories.map(category => (
          <li key={category._id}>
            <button
              onClick={() => categoryService.setSelectedCategory(category)}
              className={`
                w-full text-left px-3 py-2 rounded-lg transition-colors
                ${selectedCategory?._id === category._id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {category.name}
              {category.numberOfProducts > 0 && (
                <span className="text-sm text-gray-500 ml-1">
                  ({category.numberOfProducts})
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
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