import React from 'react';
import { categories } from '@wix/categories';
import { CategoryList, Category } from '@wix/headless-stores/react';
import type { CategoriesListServiceConfig } from '@wix/headless-stores/services';

interface CategoryPickerProps {
  onCategorySelect: (categorySlug: string) => void;
  categoriesListConfig: CategoriesListServiceConfig;
  currentCategorySlug?: string;
}

export function CategoryPicker({
  onCategorySelect,
  categoriesListConfig,
  currentCategorySlug,
}: CategoryPickerProps) {
  return (
    <CategoryList.Root categoriesListConfig={categoriesListConfig}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-content-primary font-semibold text-sm uppercase tracking-wide">
            Shop by Category
          </h3>
        </div>

        {/* Category Navigation - Horizontal scrollable for mobile */}
        <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
          <CategoryList.ItemContent>
            {({ category }) => (
              <CategoryButton
                key={category._id}
                category={category}
                isSelected={currentCategorySlug === category.slug}
                onSelect={onCategorySelect}
              />
            )}
          </CategoryList.ItemContent>
        </div>
      </div>
    </CategoryList.Root>
  );
}

// Individual Category Button Component
interface CategoryButtonProps {
  category: categories.Category;
  isSelected: boolean;
  onSelect: (slug: string) => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  isSelected,
  onSelect,
}) => {
  return (
    <Category.Root categoryServiceConfig={{ category }}>
      <Category.Slug>
        {({ slug }) => (
          <button
            onClick={() => onSelect(slug)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              isSelected
                ? 'text-content-primary shadow-lg transform scale-105 btn-primary'
                : 'bg-surface-primary text-content-secondary hover:bg-brand-light hover:text-content-primary'
            }`}
          >
            <Category.Name>{({ name }) => name}</Category.Name>
          </button>
        )}
      </Category.Slug>
    </Category.Root>
  );
};

export default CategoryPicker;
