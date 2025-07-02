# Category Service

## Overview

The `CategoryService` provides category management functionality for store applications. It handles category selection, loading categories from Wix's categories API, and managing category state through reactive signals. The service supports initial category selection, category change callbacks, and automatic category loading with proper error handling.

## Exports

### CategoryServiceAPI

```typescript
interface CategoryServiceAPI {
  selectedCategory: Signal<string | null>;
  categories: Signal<categories.Category[]>;
  setSelectedCategory: (categoryId: string | null) => void;
  loadCategories: () => Promise<void>;
}
```

Interface defining the category service API with signals for reactive state management.

### CategoryServiceDefinition

```typescript
const CategoryServiceDefinition = defineService<CategoryServiceAPI>("category-service")
```

Service definition for dependency injection and service registration.

### CategoryServiceConfig

```typescript
interface CategoryServiceConfig {
  categories: categories.Category[];
  initialCategoryId?: string | null;
  onCategoryChange?: (categoryId: string | null, category: categories.Category | null) => void;
}
```

Configuration interface for initializing the category service.

**Properties:**
- `categories`: Initial categories array
- `initialCategoryId`: Optional initial selected category ID
- `onCategoryChange`: Optional callback for category change events

### CategoryService

```typescript
const CategoryService = implementService.withConfig<CategoryServiceConfig>()(
  CategoryServiceDefinition,
  ({ getService, config }) => CategoryServiceAPI
)
```

Service implementation with configuration support.

### loadCategoriesConfig

```typescript
async function loadCategoriesConfig(): Promise<{
  categories: categories.Category[];
}>
```

Utility function to load categories from Wix's categories API with automatic sorting.

## Usage Examples

### Basic Category Service Setup

```typescript
import { CategoryService, CategoryServiceDefinition } from './headless/store/services/category-service';

// Configure and register the service
const categoryServiceConfig = {
  categories: [],
  initialCategoryId: null,
  onCategoryChange: (categoryId, category) => {
    console.log('Category changed:', category?.name);
  }
};

// Use in component
function CategoryComponent() {
  const categoryService = useService(CategoryServiceDefinition);
  
  useEffect(() => {
    categoryService.loadCategories();
  }, []);

  return (
    <div>
      <p>Selected: {categoryService.selectedCategory.get()}</p>
      <button onClick={() => categoryService.setSelectedCategory('category-1')}>
        Select Category 1
      </button>
    </div>
  );
}
```

### With Navigation Integration

```typescript
import { CategoryService } from './headless/store/services/category-service';
import { useRouter } from 'next/router';

function StoreWithCategoryNavigation() {
  const router = useRouter();
  
  const categoryServiceConfig = {
    categories: [],
    initialCategoryId: router.query.category as string,
    onCategoryChange: (categoryId, category) => {
      // Update URL when category changes
      if (categoryId) {
        router.push(`/store/category/${category?.slug}`);
      } else {
        router.push('/store');
      }
    }
  };

  return (
    <ServiceProvider services={[
      [CategoryServiceDefinition, categoryServiceConfig]
    ]}>
      <StoreLayout />
    </ServiceProvider>
  );
}
```

### Category List Component

```typescript
import { CategoryServiceDefinition } from './headless/store/services/category-service';
import { useService } from '@wix/services-manager-react';

function CategoryList() {
  const categoryService = useService(CategoryServiceDefinition);
  const categories = categoryService.categories.get();
  const selectedCategory = categoryService.selectedCategory.get();

  return (
    <div>
      <h3>Categories</h3>
      <ul>
        <li>
          <button
            onClick={() => categoryService.setSelectedCategory(null)}
            className={selectedCategory === null ? 'active' : ''}
          >
            All Products
          </button>
        </li>
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

### Auto-Loading Categories

```typescript
import { CategoryServiceDefinition, loadCategoriesConfig } from './headless/store/services/category-service';

async function setupCategoryService() {
  // Load categories from API
  const { categories } = await loadCategoriesConfig();
  
  const config = {
    categories,
    initialCategoryId: categories[0]?._id || null,
    onCategoryChange: (categoryId, category) => {
      // Track category selection
      analytics.track('Category Selected', {
        categoryId,
        categoryName: category?.name
      });
    }
  };

  return config;
}
```

### Reactive Category Display

```typescript
import { CategoryServiceDefinition } from './headless/store/services/category-service';
import { useSignal } from '@wix/services-manager-react';

function CategoryBreadcrumb() {
  const categoryService = useService(CategoryServiceDefinition);
  const selectedCategory = useSignal(categoryService.selectedCategory);
  const categories = useSignal(categoryService.categories);
  
  const currentCategory = selectedCategory 
    ? categories.find(cat => cat._id === selectedCategory)
    : null;

  return (
    <nav className="breadcrumb">
      <a href="/store">Store</a>
      {currentCategory && (
        <>
          <span> / </span>
          <span>{currentCategory.name}</span>
        </>
      )}
    </nav>
  );
}
```

### Category Filter Integration

```typescript
import { CategoryServiceDefinition } from './headless/store/services/category-service';
import { ProductServiceDefinition } from './product-service';

function CategoryFilteredProducts() {
  const categoryService = useService(CategoryServiceDefinition);
  const productService = useService(ProductServiceDefinition);
  
  // Update product filter when category changes
  useEffect(() => {
    const unsubscribe = categoryService.selectedCategory.subscribe(categoryId => {
      productService.setFilter({
        categoryId,
      });
    });
    
    return unsubscribe;
  }, []);

  return <ProductGrid />;
}
```

## Key Features

- **Reactive State**: Uses signals for reactive category state management
- **Navigation Support**: Optional callback for handling category navigation
- **Auto-Loading**: Built-in category loading from Wix Categories API
- **Initial Selection**: Support for setting initial category on service creation
- **Error Handling**: Graceful error handling with fallback empty categories
- **Category Sorting**: Automatically sorts categories with "all-products" first
- **Visibility Filtering**: Only loads visible categories from the API
- **Side Effect Management**: Prevents navigation during initial service setup

## API Integration

The service integrates with Wix's Categories API:
- Queries categories with `@wix/stores` namespace
- Filters for visible categories only
- Handles API errors gracefully
- Provides structured category data

## Dependencies

- **@wix/services-definitions**: Service definition framework
- **@wix/categories**: Wix Categories SDK
- **SignalsServiceDefinition**: For reactive state management

The service provides a complete category management solution with reactive state, API integration, and navigation support.
