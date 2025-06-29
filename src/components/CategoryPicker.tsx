import React from "react";
import { categories } from "@wix/categories";
import { Category } from "../headless/store/components";

// Use the Wix SDK category type directly
type Category = categories.Category;

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
}: CategoryPickerProps) {
  if (categories.length === 0) {
    return null; // No categories to show
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[var(--theme-text-content)] font-semibold text-sm uppercase tracking-wide">
          Shop by Category
        </h3>
      </div>

      {/* Category Navigation - Horizontal scrollable for mobile */}
      <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
        {/* Category buttons */}
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategorySelect(category._id || null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              selectedCategory === category._id
                ? "text-[var(--theme-text-content)] shadow-lg transform scale-105"
                : "bg-[var(--theme-bg-options)] text-[var(--theme-text-content-80)] hover:bg-[var(--theme-bg-primary-10)] hover:text-[var(--theme-text-content)]"
            }`}
            style={
              selectedCategory === category._id
                ? { background: 'var(--theme-btn-primary)' }
                : {}
            }
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CategoryPickerWithContext({
  className,
}: {
  className?: string;
}) {
  return (
    <Category.Provider>
      <Category.List>
        {({ categories, selectedCategory, setSelectedCategory }) => (
          <CategoryPicker
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            className={className}
          />
        )}
      </Category.List>
    </Category.Provider>
  );
}
