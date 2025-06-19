import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { categories } from '@wix/categories';


export interface CategoryServiceAPI {
  selectedCategory: Signal<string | null>;
  categories: Signal<categories.Category[]>;
}

export const CategoryServiceDefinition =
  defineService<CategoryServiceAPI>("category-service");

export interface CategoryServiceConfig {
  categories: categories.Category[];
}

export const CategoryService = implementService.withConfig<CategoryServiceConfig>()(CategoryServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const selectedCategory: Signal<string | null> = signalsService.signal(null as any);
  const categories: Signal<categories.Category[]> = signalsService.signal(config.categories as any);

  return {
    selectedCategory,
    categories,
  };
});

export async function loadCategoriesConfig() {
  try {
    const categoriesResponse = await categories.queryCategories({
      treeReference: {
        appNamespace: '@wix/stores',
        treeKey: null
      }
    }).eq('visible', true).find();
    
    const fetchedCategories = categoriesResponse.items || [];
    
    // Filter out "All Products" category as per recipe instructions
    const filteredCategories = fetchedCategories.filter(
      cat => cat.name?.toLowerCase() !== 'all products'
    );

    return {
      categories: filteredCategories,
    };
  } catch (error) {
    console.warn("Failed to load categories:", error);
    return {
      categories: [],
    };
  }
}
