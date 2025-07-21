import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { categories } from '@wix/categories';

export type CategoriesListServiceConfig = {
  categories: categories.Category[];
  selectedCategoryId: string | null;
  onCategorySelect?: (categoryId: string | null) => void;
};

export const CategoriesListServiceDefinition = defineService<
  {
    categories: Signal<categories.Category[]>;
    selectedCategoryId: Signal<string | null>;
    isLoading: Signal<boolean>;
    error: Signal<string | null>;
    selectCategory: (categoryId: string | null) => void;
  },
  CategoriesListServiceConfig
>('categories-list');

export const CategoriesListService =
  implementService.withConfig<CategoriesListServiceConfig>()(
    CategoriesListServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const categoriesSignal = signalsService.signal<categories.Category[]>(
        config.categories
      );
      const selectedCategoryIdSignal = signalsService.signal<string | null>(
        config.selectedCategoryId
      );
      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      const selectCategory = (categoryId: string | null) => {
        selectedCategoryIdSignal.set(categoryId);
        if (config.onCategorySelect) {
          config.onCategorySelect(categoryId);
        }
      };

      return {
        categories: categoriesSignal,
        selectedCategoryId: selectedCategoryIdSignal,
        isLoading: isLoadingSignal,
        error: errorSignal,
        selectCategory,
      };
    }
  );

export async function loadCategoriesListServiceConfig(
  onCategorySelect?: (categoryId: string | null) => void
): Promise<CategoriesListServiceConfig> {
  const categoriesResponse = await categories
    .queryCategories({
      treeReference: {
        appNamespace: '@wix/stores',
        treeKey: null,
      },
    })
    .eq('visible', true)
    .find();

  const fetchedCategories = categoriesResponse.items || [];

  // Sort categories to put "all-products" first, keep the rest in original order
  const allProductsCategory = fetchedCategories.find(
    cat => cat.slug === 'all-products'
  );
  const otherCategories = fetchedCategories.filter(
    cat => cat.slug !== 'all-products'
  );

  const allCategories = allProductsCategory
    ? [allProductsCategory, ...otherCategories]
    : fetchedCategories;

  // Select the first category as default (preferably "all-products")
  const defaultSelectedCategoryId =
    allCategories.length > 0 ? (allCategories[0]._id ?? null) : null;

  return {
    categories: allCategories,
    selectedCategoryId: defaultSelectedCategoryId,
    onCategorySelect,
  };
}
