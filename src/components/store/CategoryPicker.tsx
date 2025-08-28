import React from 'react';
import { CategoryList, Category } from '@wix/headless-stores/react';
import type { CategoriesListServiceConfig } from '@wix/headless-stores/services';
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
          <CategoryList.CategoryRepeater>
            <Category.Trigger asChild>
              <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap text-content-secondary hover:bg-brand-light hover:text-content-primary data-[selected=true]:[background:var(--theme-btn-primary)] data-[selected=true]:text-[var(--theme-btn-primary-text)] data-[selected=true]:border-[var(--theme-btn-primary-border)] data-[selected=true]:shadow-lg data-[selected=true]:transform data-[selected=true]:scale-105">
                <Category.Label />
              </button>
            </Category.Trigger>
          </CategoryList.CategoryRepeater>
        </div>
      </div>
    </CategoryList.Root>
  );
}

export default CategoryPicker;
