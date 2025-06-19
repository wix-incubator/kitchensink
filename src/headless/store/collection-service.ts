import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { productsV3 } from "@wix/stores";
import { FilterServiceDefinition, type Filter } from "./filter-service";
import { CategoryServiceDefinition } from "./category-service";

export interface CollectionServiceAPI {
  products: Signal<productsV3.V3Product[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  totalProducts: Signal<number>;
  hasProducts: Signal<boolean>;
  hasMoreProducts: Signal<boolean>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

// Helper to build query with supported filters only
const buildQuery = () => {
  let query = productsV3.queryProducts({
    fields: [
      'DESCRIPTION',
      'MEDIA_ITEMS_INFO',
      'VARIANT_OPTION_CHOICE_NAMES',
      'CURRENCY',
      'URL',
      'ALL_CATEGORIES_INFO'
    ]
  });
  return query;
};

export const CollectionServiceDefinition =
  defineService<CollectionServiceAPI>("collection");

export const CollectionService = implementService.withConfig<{
  initialProducts?: productsV3.V3Product[];
  pageSize?: number;
  collectionId?: string;
  initialCursor?: string;
  initialHasMore?: boolean;
}>()(CollectionServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const collectionFilters = getService(FilterServiceDefinition);
  const categoryService = getService(CategoryServiceDefinition);
  const hasMoreProducts: Signal<boolean> = signalsService.signal((config.initialHasMore ?? true) as any);
  let nextCursor: string | undefined = config.initialCursor;

  const initialProducts = config.initialProducts || [];

  void collectionFilters.calculateAvailableOptions(initialProducts);

  const productsList: Signal<productsV3.V3Product[]> = signalsService.signal(
    initialProducts as any
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);
  const totalProducts: Signal<number> = signalsService.signal(
    initialProducts.length as any
  );
  const hasProducts: Signal<boolean> = signalsService.signal(
    (initialProducts.length > 0) as any
  );

  const pageSize = config.pageSize || 12;
  let allProducts: productsV3.V3Product[] = initialProducts;

  // Helper to apply client-side filtering since the API doesn't support all filter types
  const applyClientSideFilters = (
    products: productsV3.V3Product[],
    filters: Filter,
    selectedCategory: string | null
  ): productsV3.V3Product[] => {
    const filteredProducts = products.filter((product) => {
      if (selectedCategory && !product.allCategoriesInfo?.categories?.some((cat: any) => cat._id === selectedCategory)) {
        return false;
      }
      // Check price range
      const productPrice =
        product.actualPriceRange?.minValue?.amount ||
        product.actualPriceRange?.maxValue?.amount;

      if (productPrice) {
        const price = parseFloat(productPrice);
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }

      // Check product options
      if (Object.keys(filters.selectedOptions).length > 0) {
        for (const [optionId, choiceIds] of Object.entries(
          filters.selectedOptions
        )) {
          if (choiceIds.length === 0) continue;

          const productOption = product.options?.find((opt) => opt._id === optionId);
          if (!productOption) return false;

          const productChoices =
            productOption.choicesSettings?.choices?.map((c) => c.choiceId) || [];
          const hasMatchingChoice = choiceIds.some((choiceId) =>
            productChoices.includes(choiceId)
          );

          if (!hasMatchingChoice) return false;
        }
      }

      return true;
    });
    return filteredProducts.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'price-asc': {
          const priceA = parseFloat(a.actualPriceRange?.minValue?.amount || '0');
          const priceB = parseFloat(b.actualPriceRange?.minValue?.amount || '0');
          return priceA - priceB;
        }
        case 'price-desc': {
          const priceA = parseFloat(a.actualPriceRange?.minValue?.amount || '0');
          const priceB = parseFloat(b.actualPriceRange?.minValue?.amount || '0');
          return priceB - priceA;
        }
        default:
          return 0;
      }
    });
  };

  const loadMore = async () => {
    // Don't load more if there are no more products available
    if (!hasMoreProducts.get()) {
      return;
    }

    try {
      isLoading.set(true);
      error.set(null);

      let query = buildQuery();
      if (nextCursor) {
        query = query.skipTo(nextCursor);
      }

      // Apply cursor pagination if we have a next cursor
      if (nextCursor) {
        query = query.skipTo(nextCursor);
      }

      const currentProducts = productsList.get();
      const selectedCategory = categoryService.selectedCategory.get();
      const productResults = await query.limit(pageSize).find();

      // Update cursor for next pagination
      nextCursor = productResults.cursors?.next || undefined;

      // Check if there are more products to load
      const hasMore = Boolean(nextCursor && productResults.items && productResults.items.length === pageSize);
      hasMoreProducts.set(hasMore);

      const newProducts = [...currentProducts, ...(productResults.items || [])];
      const filters = collectionFilters.currentFilters.get();
      const filteredProducts = applyClientSideFilters(allProducts, filters, selectedCategory);

      productsList.set(filteredProducts);
      totalProducts.set(newProducts.length);
      hasProducts.set(newProducts.length > 0);
    } catch (err) {
      error.set(
        err instanceof Error ? err.message : "Failed to load more products"
      );
    } finally {
      isLoading.set(false);
    }
  };

  const refresh = async (setTotalProducts: boolean = true) => {
    try {
      isLoading.set(true);
      error.set(null);

      const query = buildQuery();
      const productResults = await query.limit(pageSize).find();
      const selectedCategory = categoryService.selectedCategory.get();

      // Reset pagination state
      nextCursor = productResults.cursors?.next || undefined;
      const hasMore = Boolean(productResults.cursors?.next && productResults.items && productResults.items.length === pageSize);
      hasMoreProducts.set(hasMore);

      const filters = collectionFilters.currentFilters.get();
      const filteredProducts = applyClientSideFilters(productResults.items || [], filters, selectedCategory);

      productsList.set(filteredProducts);
      if (setTotalProducts) {
        totalProducts.set(filteredProducts.length);
      }

      totalProducts.set((productResults.items || []).length);
      hasProducts.set((productResults.items || []).length > 0);
    } catch (err) {
      error.set(
        err instanceof Error ? err.message : "Failed to refresh products"
      );
    } finally {
      isLoading.set(false);
    }
  };

  collectionFilters.currentFilters.subscribe(() => {
    refresh(false);
  });

  categoryService.selectedCategory.subscribe(() => {
    refresh(false);
  });

  return {
    products: productsList,
    isLoading,
    error,
    totalProducts,
    hasProducts,
    hasMoreProducts,
    loadMore,
    refresh,
  };
});

export async function loadCollectionServiceConfig(
  collectionId?: string
): Promise<ServiceFactoryConfig<typeof CollectionService> & { initialCursor?: string; initialHasMore?: boolean }> {
  try {
    // Query products with ALL_CATEGORIES_INFO field as required for category filtering
    let query = buildQuery();

    const productResults = await query.limit(100).find();

    return {
      initialProducts: productResults.items || [],
      pageSize: 100,
      collectionId,
      initialCursor: productResults.cursors?.next || undefined,
      initialHasMore: Boolean(productResults.cursors?.next && productResults.items && productResults.items.length === 12),
    };
  } catch (error) {
    console.warn("Failed to load initial products:", error);
    return {
      initialProducts: [],
      pageSize: 12,
      collectionId,
      initialHasMore: false,
    };
  }
}
