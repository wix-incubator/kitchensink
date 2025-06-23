import { defineService, implementService } from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../../Signal";
import { categories } from "@wix/categories";

export interface CategoryServiceAPI {
  selectedCategory: Signal<string | null>;
  categories: Signal<categories.Category[]>;
  setSelectedCategory: (categoryId: string | null) => void;
}

export const CategoryServiceDefinition =
  defineService<CategoryServiceAPI>("category-service");

export interface CategoryServiceConfig {
  categories: categories.Category[];
  initialCategoryId?: string | null;
  onCategoryChange?: (categoryId: string | null, category: categories.Category | null) => void;
}

export const CategoryService =
  implementService.withConfig<CategoryServiceConfig>()(
    CategoryServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const selectedCategory: Signal<string | null> = signalsService.signal(
        (config.initialCategoryId || null) as any
      );
      const categories: Signal<categories.Category[]> = signalsService.signal(
        config.categories as any
      );

      // Track if this is the initial load to prevent navigation on service creation
      let isInitialLoad = true;

      const setSelectedCategory = (categoryId: string | null) => {
        selectedCategory.set(categoryId);
      };

      // Subscribe to category changes and handle navigation as a side effect
      selectedCategory.subscribe((categoryId) => {
        // Skip navigation on initial load (when service is first created)
        if (isInitialLoad) {
          isInitialLoad = false;
          return;
        }

        // If a navigation handler is provided, use it
        if (config.onCategoryChange) {
          const category = categoryId 
            ? config.categories.find((cat) => cat._id === categoryId) || null
            : null;
          
          config.onCategoryChange(categoryId, category);
        }
      });

      return {
        selectedCategory,
        categories,
        setSelectedCategory,
      };
    }
  );

export async function loadCategoriesConfig() {
  try {
    const categoriesResponse = await categories
      .queryCategories({
        treeReference: {
          appNamespace: "@wix/stores",
          treeKey: null,
        },
      })
      .eq("visible", true)
      .find();

    const fetchedCategories = categoriesResponse.items || [];

    // Sort categories to put "all-products" first, keep the rest in original order
    const allProductsCategory = fetchedCategories.find(cat => cat.slug === "all-products");
    const otherCategories = fetchedCategories.filter(cat => cat.slug !== "all-products");
    
    const allCategories = allProductsCategory 
      ? [allProductsCategory, ...otherCategories]
      : fetchedCategories;

    return {
      categories: allCategories,
    };
  } catch (error) {
    console.warn("Failed to load categories:", error);
    return {
      categories: [],
    };
  }
}
