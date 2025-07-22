import { defineService, implementService } from '@wix/services-definitions';
import { categories } from '@wix/categories';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';

export const CategoryServiceDefinition = defineService<{
  category: Signal<categories.Category>;
}>('category');

export type CategoryServiceConfig = {
  category: categories.Category;
};

export const CategoryService =
  implementService.withConfig<CategoryServiceConfig>()(
    CategoryServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const categorySignal = signalsService.signal(config.category);

      return {
        category: categorySignal,
      };
    }
  );

export async function loadCategoryServiceConfig(slug: string): Promise<
  | {
      type: 'success';
      config: CategoryServiceConfig;
    }
  | {
      type: 'not-found';
    }
> {
  const category = await categories
    .queryCategories({
      treeReference: {
        appNamespace: '@wix/stores',
      },
    })
    .eq('slug', slug)
    .find();

  if (category.items.length === 0) {
    return {
      type: 'not-found',
    };
  }

  return {
    type: 'success',
    config: {
      category: category.items[0]!,
    },
  };
}
