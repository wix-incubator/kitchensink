# CategoryList Interface Documentation

A comprehensive category selection component system built with composable primitives, similar to Radix UI architecture, for displaying and selecting product categories.

## Architecture

The CategoryList component follows a compound component pattern where each part can be composed together to create flexible category selection interfaces. It supports both simple category pickers and complex hierarchical category navigation.

## Components

### CategoryList.Root

The root container that provides category list context to all child components.

**Props**
```tsx
interface CategoryListRootProps {
  categories?: Category[];
  categoriesListConfig?: CategoriesListServiceConfig;
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}
```

**Data Attributes**
- `data-testid="category-list"` - Applied to root container

**Example**
```tsx
<CategoryList.Root categoriesListConfig={categoriesListConfig}>
  {/* All category list components */}
</CategoryList.Root>
```

---

### CategoryList.Loading

Displays loading state while category data is being fetched.

**Props**
```tsx
interface CategoryListLoadingProps {
  children?: React.ReactNode;
  asChild?: boolean;
}
```
---

### CategoryList.CategoryRepeater

Repeats for each category in the list, providing individual category context.

**Props**
```tsx
interface CategoryListCategoryRepeaterProps {
  children: React.ReactNode;
  maxDepth?: number; // default - undefined - maximum nesting depth for hierarchical categories
  asChild?: boolean;
}
```

**Example**
```tsx
<CategoryList.CategoryRepeater maxDepth={3}>
  <Category.Trigger />
  <Category.Label />
  <Category.ID />
</CategoryList.CategoryRepeater>
```

**Data Attributes**
- `data-testid="category-repeater"` - Applied to repeater container


---

### Category.Root

The root container for a single category item.

**Props**
```tsx
interface CategoryRootProps {
  category?: Category;
  categoryServiceConfig?: CategoryServiceConfig;
  children: React.ReactNode;
  asChild?: boolean;
}
```

**Example**
```tsx
<Category.Root categoryServiceConfig={{ category }}>
  <Category.Trigger />
  <Category.Label />
  <Category.ID />
</Category.Root>
```

**Data Attributes**
- `data-testid="category-item"` - Applied to category container
- `data-category-id` - Category ID
- `data-selected` - Is category selected
- `data-has-children` - Category has subcategories

---

### Category.Trigger

Interactive element for selecting or triggering category actions.

**Props**
```tsx
interface CategoryTriggerProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {
    category: Category;
    isSelected: boolean;
    onSelect: () => void;
  }>;
  onSelect?: (category: Category) => void;
}
```

**Example**
```tsx
// Default usage
<Category.Trigger className="px-4 py-2 rounded border hover:bg-surface-hover" />

// Custom rendering with forwardRef
<Category.Trigger asChild>
  {React.forwardRef(({category, isSelected, onSelect, ...props}, ref) => (
    <button 
      ref={ref}
      {...props}
      onClick={onSelect}
      className={`px-4 py-2 rounded transition-colors ${
        isSelected 
          ? 'bg-brand-primary text-white' 
          : 'border border-surface-subtle hover:bg-surface-hover'
      }`}
    >
      {category.name}
    </button>
  ))}
</Category.Trigger>
```

**Data Attributes**
- `data-testid="category-trigger"` - Applied to trigger element
- `data-selected` - Is category selected

---

### Category.Label

Displays the category name or label.

**Props**
```tsx
interface CategoryLabelProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    name: string;
    category: Category;
  }>;
}
```

**Example**
```tsx
// Default usage
<Category.Label className="text-lg font-medium text-content-primary" />

// Custom rendering with forwardRef
<Category.Label asChild>
  {React.forwardRef(({name, category, ...props}, ref) => (
    <span ref={ref} {...props} className="text-lg font-medium text-content-primary">
      {name}
      {category.childCount > 0 && (
        <span className="text-sm text-content-muted ml-2">
          ({category.childCount})
        </span>
      )}
    </span>
  ))}
</Category.Label>
```

**Data Attributes**
- `data-testid="category-label"` - Applied to label element
- `data-selected` - Is category selected

---

### Category.ID

Provides access to the category ID for advanced use cases.

**Props**
```tsx
interface CategoryIDProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    id: string;
    category: Category;
  }>;
}
```

**Example**
```tsx
// Default usage (hidden by default)
<Category.ID className="hidden" />

// Custom rendering with forwardRef
<Category.ID asChild>
  {React.forwardRef(({id, category, ...props}, ref) => (
    <span 
      ref={ref} 
      {...props} 
      data-category-id={id}
      className="sr-only"
    >
      Category ID: {id}
    </span>
  ))}
</Category.ID>
```

### Category.Raw

Provides access to the category data for advanced use cases.

**Props**
```tsx
interface CategoryRawProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    category: Category;
  }>;
}
```

**Example**
```tsx
// Custom rendering with forwardRef
<Category.Raw asChild>
  {React.forwardRef(({category, ...props}, ref) => (
    <span 
      ref={ref} 
      {...props} 
      data-category-id={category.id}
      className="sr-only"
    >
      Category ID: {category.id}
    </span>
  ))}
</Category.ID>
```

**Data Attributes**
- `data-testid="category-id"` - Applied to ID element
- `data-selected` - Is category selected
