import type { CategoriesListServiceConfig } from '../../pages/store/example-1/categories-list';
import { CategoryPicker } from './CategoryPicker';
import { SortDropdown } from './SortDropdown';

export default function StoreHeader({
  className,
  categoriesListConfig,
  currentCategorySlug,
}: {
  className?: string;
  categoriesListConfig: CategoriesListServiceConfig;
  currentCategorySlug: string;
}) {
  return (
    <div
      className={`${className} bg-surface-primary backdrop-blur-sm rounded-xl border border-surface-subtle p-4 mb-6`}
    >
      <div className="flex items-top justify-between">
        <CategoryPicker
          categoriesListConfig={categoriesListConfig}
          currentCategorySlug={currentCategorySlug}
          onCategorySelect={slug => {
            window.location.href = `./${slug}`;
          }}
        />
        <SortDropdown />
      </div>
    </div>
  );
}
