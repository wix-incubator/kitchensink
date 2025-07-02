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
    />
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
