import { categories } from '@wix/categories';

import { CategoriesList } from '../../pages/store/example-1/categories-list-components';
import type { CategoriesListServiceConfig } from '../../pages/store/example-1/categories-list';
import { Category } from '../../pages/store/example-1/category-components';

// Use the Wix SDK category type directly
type Category = categories.Category;

interface CategoryPickerProps {
  onCategorySelect: (categorySlug: string) => void;
  categoriesListConfig: CategoriesListServiceConfig;
  currentCategorySlug: string;
}

export function CategoryPicker({
  onCategorySelect,
  categoriesListConfig,
  currentCategorySlug,
}: CategoryPickerProps) {
  return (
    <CategoriesList.Root categoriesListConfig={categoriesListConfig}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-content-primary font-semibold text-sm uppercase tracking-wide">
            Shop by Category
          </h3>
        </div>

        {/* Category Navigation - Horizontal scrollable for mobile */}
        <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
          <CategoriesList.ItemContent>
            <Category.Slug>
              {({ slug }) => (
                <button
                  onClick={() => onCategorySelect(slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    currentCategorySlug === slug
                      ? 'text-content-primary shadow-lg transform scale-105 btn-primary'
                      : 'bg-surface-primary text-content-secondary hover:bg-brand-light hover:text-content-primary'
                  }`}
                >
                  <Category.Name>{({ name }) => name}</Category.Name>
                </button>
              )}
            </Category.Slug>
          </CategoriesList.ItemContent>
        </div>
      </div>
    </CategoriesList.Root>
  );
}
