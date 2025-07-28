import { categories } from '@wix/categories';
import { Category } from '@wix/headless-stores/react';

// Use the Wix SDK category type directly
type Category = categories.Category;

interface CategoryPickerProps {
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategory: string | null;
  categories: categories.Category[];
}

function CategoryPicker({
  onCategorySelect,
  selectedCategory,
  categories,
}: CategoryPickerProps) {
  if (!categories || categories.length === 0) {
    return null; // No categories to show
  }
  if (selectedCategory === null) {
    onCategorySelect(categories[0]._id || null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-content-primary font-semibold text-sm uppercase tracking-wide">
          Shop by Category
        </h3>
      </div>

      {/* Category Navigation - Horizontal scrollable for mobile */}
      <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
        {/* Category buttons */}
        {categories.map(category => (
          <button
            key={category._id}
            onClick={() => onCategorySelect(category._id || null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              selectedCategory === category._id
                ? 'text-content-primary shadow-lg transform scale-105 btn-primary'
                : 'bg-surface-primary text-content-secondary hover:bg-brand-light hover:text-content-primary'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CategoryPickerWithContext() {
  return (
    <Category.Root>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => (
          <CategoryPicker
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        )}
      </Category.List>
    </Category.Root>
  );
}
