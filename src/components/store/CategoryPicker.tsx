import React from 'react';
import { categories } from '@wix/categories';
import {
  CategoryList,
  Category,
  ProductList as ProductListPrimitive,
} from '@wix/headless-stores/react';
import type { CategoriesListServiceConfig } from '@wix/headless-stores/services';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CategoryPickerProps {
  categoriesListConfig: CategoriesListServiceConfig;
}

export function CategoryPicker({ categoriesListConfig }: CategoryPickerProps) {
  return (
    <CategoryList.Root categoriesListConfig={categoriesListConfig}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-content-primary font-semibold text-sm uppercase tracking-wide">
            Shop by Category
          </Label>
        </div>

        {/* Category Navigation - Horizontal scrollable for mobile */}
        <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
          <ProductListPrimitive.CategoryFilter>
            {({ selectedCategory, setSelectedCategory }) => (
              <CategoryList.CategoryRepeater>
                <Category.Trigger asChild>
                  {({ category }) => (
                    <CategoryButton
                      key={category._id}
                      category={category}
                      isSelected={selectedCategory?.slug === category.slug}
                      onSelect={() => setSelectedCategory(category)}
                    />
                  )}
                </Category.Trigger>
              </CategoryList.CategoryRepeater>
            )}
          </ProductListPrimitive.CategoryFilter>
        </div>
      </div>
    </CategoryList.Root>
  );
}

// Individual Category Button Component
interface CategoryButtonProps {
  category: categories.Category;
  isSelected: boolean;
  onSelect: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  isSelected,
  onSelect,
}) => {
  return (
    <Category.Root categoryServiceConfig={{ category }}>
      <Button
        variant={isSelected ? 'default' : 'outline'}
        onClick={onSelect}
        className={
          isSelected
            ? ''
            : 'text-content-primary border-surface-subtle hover:bg-primary/10'
        }
      >
        <Category.Label></Category.Label>
      </Button>
    </Category.Root>
  );
};

export default CategoryPicker;
