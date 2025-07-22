import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { categories } from '@wix/categories';

export type CategoriesListServiceConfig = {
  categories: categories.Category[];
};

export const CategoriesListServiceDefinition = defineService<
  {
    categories: Signal<categories.Category[]>;
    isLoading: Signal<boolean>;
    error: Signal<string | null>;
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
      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      return {
        categories: categoriesSignal,
        isLoading: isLoadingSignal,
        error: errorSignal,
      };
    }
  );

export async function loadCategoriesListServiceConfig(): Promise<CategoriesListServiceConfig> {
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

  return {
    categories: allCategories,
  };
}
