# CategoryPicker Component

## Overview

The `CategoryPicker` component provides category filtering functionality for store pages. It displays a horizontal scrollable list of category buttons and integrates with Wix's category service to manage category selection. The component includes both a presentational component and a context-aware wrapper that connects to the store's category state.

## Exports

### CategoryPicker

```typescript
interface CategoryPickerProps {
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategory: string | null;
  categories: categories.Category[];
  className?: string;
}

function CategoryPicker({
  onCategorySelect,
  selectedCategory,
  categories,
  className = "",
}: CategoryPickerProps): JSX.Element | null
```

Presentational component that renders category buttons based on provided data.

**Props:**
- `onCategorySelect`: Function to handle category selection
- `selectedCategory`: Currently selected category ID
- `categories`: Array of category objects from Wix
- `className`: Optional CSS classes for styling

### CategoryPickerWithContext (Default Export)

```typescript
interface CategoryPickerWithContextProps {
  className?: string;
}

function CategoryPickerWithContext({ className }: CategoryPickerWithContextProps): JSX.Element
```

Context-aware wrapper that provides category data and state management through Wix's Category components.

**Props:**
- `className`: Optional CSS classes for styling

## Usage Examples

### Basic Category Picker with Context

```typescript
import CategoryPicker from './components/store/CategoryPicker';

function StorePage() {
  return (
    <div>
      <CategoryPicker />
      <div className="products">
        {/* Product grid filtered by selected category */}
      </div>
    </div>
  );
}
```

### With Custom Styling

```typescript
import CategoryPicker from './components/store/CategoryPicker';

function StyledStorePage() {
  return (
    <div>
      <CategoryPicker className="mb-8 border-b pb-4" />
      <div className="product-container">
        {/* Products */}
      </div>
    </div>
  );
}
```

### Direct CategoryPicker Usage

```typescript
import { CategoryPicker } from './components/store/CategoryPicker';

function CustomCategoryInterface() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load categories from API
    loadCategories().then(setCategories);
  }, []);

  return (
    <CategoryPicker
      categories={categories}
      selectedCategory={selectedCategory}
      onCategorySelect={setSelectedCategory}
      className="custom-category-picker"
    />
  );
}
```

### In Store Header

```typescript
import CategoryPicker from './components/store/CategoryPicker';

function StoreHeader() {
  return (
    <div className="store-header">
      <div className="flex justify-between items-center">
        <CategoryPicker className="flex-1" />
        <SortDropdown />
      </div>
    </div>
  );
}
```

### Mobile-Responsive Layout

```typescript
import CategoryPicker from './components/store/CategoryPicker';

function ResponsiveStore() {
  return (
    <div className="container mx-auto px-4">
      <CategoryPicker className="md:hidden mb-4" />
      <div className="flex gap-6">
        <aside className="hidden md:block w-64">
          <CategoryPicker className="sticky top-4" />
        </aside>
        <main className="flex-1">
          {/* Product grid */}
        </main>
      </div>
    </div>
  );
}
```

## Key Features

- **Horizontal Scrolling**: Categories scroll horizontally on mobile devices
- **Auto-Selection**: Automatically selects first category if none is selected
- **Active State**: Visual feedback for selected category with scaling and color changes
- **Context Integration**: Seamlessly integrates with Wix's Category context
- **Responsive Design**: Adapts to different screen sizes with flex-wrap
- **Empty State Handling**: Returns null when no categories are available
- **Smooth Transitions**: CSS transitions for hover and selection states
- **Accessibility**: Proper button semantics and keyboard navigation
- **Scrollbar Hiding**: Clean appearance with hidden scrollbars on mobile

## Dependencies

- **@wix/categories**: Wix SDK for category types and data
- **Category components**: Headless category components for state management

The component provides both controlled (CategoryPicker) and uncontrolled (CategoryPickerWithContext) variants for different use cases.
