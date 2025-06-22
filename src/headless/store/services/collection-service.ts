import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../../Signal";
import { productsV3 } from "@wix/stores";
import { FilterServiceDefinition, type Filter } from "./filter-service";
import { CategoryServiceDefinition } from "./category-service";
import { SortServiceDefinition, type SortBy } from "./sort-service";
import { URLParamsUtils } from "../utils/url-params";

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
      "DESCRIPTION",
      "MEDIA_ITEMS_INFO",
      "VARIANT_OPTION_CHOICE_NAMES",
      "CURRENCY",
      "URL",
      "ALL_CATEGORIES_INFO",
    ],
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
  const sortService = getService(SortServiceDefinition);
  const hasMoreProducts: Signal<boolean> = signalsService.signal(
    (config.initialHasMore ?? true) as any
  );
  let nextCursor: string | undefined = config.initialCursor;

  const initialProducts = config.initialProducts || [];

  void collectionFilters.calculateAvailableOptions(initialProducts);

  const pageSize = config.pageSize || 12;
  let allProducts: productsV3.V3Product[] = initialProducts;

  // Helper to apply client-side filtering since the API doesn't support all filter types
  const applyClientSideFilters = (
    products: productsV3.V3Product[],
    filters: Filter,
    selectedCategory: string | null,
    sortBy: SortBy
  ): productsV3.V3Product[] => {
    const filteredProducts = products.filter((product) => {
      if (
        selectedCategory &&
        !product.allCategoriesInfo?.categories?.some(
          (cat: any) => cat._id === selectedCategory
        )
      ) {
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

          const productOption = product.options?.find(
            (opt) => opt._id === optionId
          );
          if (!productOption) return false;

          const productChoices =
            productOption.choicesSettings?.choices?.map((c) => c.choiceId) ||
            [];
          const hasMatchingChoice = choiceIds.some((choiceId) =>
            productChoices.includes(choiceId)
          );

          if (!hasMatchingChoice) return false;
        }
      }

      return true;
    });
    return filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "price-asc": {
          const priceA = parseFloat(
            a.actualPriceRange?.minValue?.amount || "0"
          );
          const priceB = parseFloat(
            b.actualPriceRange?.minValue?.amount || "0"
          );
          return priceA - priceB;
        }
        case "price-desc": {
          const priceA = parseFloat(
            a.actualPriceRange?.minValue?.amount || "0"
          );
          const priceB = parseFloat(
            b.actualPriceRange?.minValue?.amount || "0"
          );
          return priceB - priceA;
        }
        default:
          return 0;
      }
    });
  };

  // Apply initial filters and sorting to products immediately
  const initialFilters = collectionFilters.currentFilters.get();
  const initialSort = sortService.currentSort.get();
  const selectedCategory = categoryService.selectedCategory.get();
  const initialFilteredProducts = applyClientSideFilters(
    initialProducts,
    initialFilters,
    selectedCategory,
    initialSort
  );

  const productsList: Signal<productsV3.V3Product[]> = signalsService.signal(
    initialFilteredProducts as any
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);
  const totalProducts: Signal<number> = signalsService.signal(
    initialFilteredProducts.length as any
  );
  const hasProducts: Signal<boolean> = signalsService.signal(
    (initialFilteredProducts.length > 0) as any
  );

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
      const hasMore = Boolean(
        nextCursor &&
          productResults.items &&
          productResults.items.length === pageSize
      );
      hasMoreProducts.set(hasMore);

      const newProducts = [...currentProducts, ...(productResults.items || [])];
      const filters = collectionFilters.currentFilters.get();
      const sortBy = sortService.currentSort.get();
      const filteredProducts = applyClientSideFilters(
        newProducts,
        filters,
        selectedCategory,
        sortBy
      );

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
      const hasMore = Boolean(
        productResults.cursors?.next &&
          productResults.items &&
          productResults.items.length === pageSize
      );
      hasMoreProducts.set(hasMore);

      const filters = collectionFilters.currentFilters.get();
      const sortBy = sortService.currentSort.get();
      const filteredProducts = applyClientSideFilters(
        productResults.items || [],
        filters,
        selectedCategory,
        sortBy
      );

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

  sortService.currentSort.subscribe(() => {
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

// Helper function to parse URL parameters
function parseURLParams(
  searchParams?: URLSearchParams,
  products: productsV3.V3Product[] = []
) {
  const initialFilters: Filter = {
    priceRange: { min: 0, max: 1000 },
    selectedOptions: {},
  };
  let initialSort: SortBy = "";

  if (!searchParams) return { initialSort, initialFilters };

  const urlParams = URLParamsUtils.parseSearchParams(searchParams);

  // Parse sort parameter
  const sortMap: Record<string, SortBy> = {
    name_asc: "name-asc",
    name_desc: "name-desc",
    price_asc: "price-asc",
    price_desc: "price-desc",
  };
  initialSort = sortMap[urlParams.sort as string] || "";

  if (products.length === 0) return { initialSort, initialFilters };

  // Calculate price range from products
  let minPrice = 0,
    maxPrice = 1000;
  products.forEach((product) => {
    const min = parseFloat(product.actualPriceRange?.minValue?.amount || "0");
    const max = parseFloat(product.actualPriceRange?.maxValue?.amount || "0");
    if (min > 0) minPrice = minPrice === 0 ? min : Math.min(minPrice, min);
    if (max > 0) maxPrice = Math.max(maxPrice, max);
  });
  initialFilters.priceRange = { min: minPrice, max: maxPrice };

  // Parse price filters from URL
  if (urlParams.minPrice) {
    const min = parseFloat(urlParams.minPrice as string);
    if (!isNaN(min)) initialFilters.priceRange.min = min;
  }
  if (urlParams.maxPrice) {
    const max = parseFloat(urlParams.maxPrice as string);
    if (!isNaN(max)) initialFilters.priceRange.max = max;
  }

  // Build options map and parse option filters
  const optionsMap = new Map<
    string,
    { id: string; choices: { id: string; name: string }[] }
  >();
  products.forEach((product) => {
    product.options?.forEach((option) => {
      if (!option._id || !option.name) return;
      if (!optionsMap.has(option.name)) {
        optionsMap.set(option.name, { id: option._id, choices: [] });
      }
      const optionData = optionsMap.get(option.name)!;
      option.choicesSettings?.choices?.forEach((choice) => {
        if (
          choice.choiceId &&
          choice.name &&
          !optionData.choices.find((c) => c.id === choice.choiceId)
        ) {
          optionData.choices.push({ id: choice.choiceId, name: choice.name });
        }
      });
    });
  });

  // Parse option filters from URL
  Object.entries(urlParams).forEach(([key, value]) => {
    if (["sort", "minPrice", "maxPrice"].includes(key)) return;
    const option = optionsMap.get(key);
    if (option) {
      const values = Array.isArray(value) ? value : [value];
      const matchingChoices = option.choices.filter((choice) =>
        values.includes(choice.name)
      );
      if (matchingChoices.length > 0) {
        initialFilters.selectedOptions[option.id] = matchingChoices.map(
          (c) => c.id
        );
      }
    }
  });

  return { initialSort, initialFilters };
}

export async function loadCollectionServiceConfig(
  collectionId?: string,
  searchParams?: URLSearchParams
): Promise<
  ServiceFactoryConfig<typeof CollectionService> & {
    initialCursor?: string;
    initialHasMore?: boolean;
    initialSort?: SortBy;
    initialFilters?: Filter;
  }
> {
  try {
    // Query products with ALL_CATEGORIES_INFO field as required for category filtering
    let query = buildQuery();

    const productResults = await query.limit(100).find();

    // Parse URL parameters for initial state
    const { initialSort, initialFilters } = parseURLParams(
      searchParams,
      productResults.items || []
    );

    return {
      initialProducts: productResults.items || [],
      pageSize: 100,
      collectionId,
      initialCursor: productResults.cursors?.next || undefined,
      initialHasMore: Boolean(
        productResults.cursors?.next &&
          productResults.items &&
          productResults.items.length === 12
      ),
      initialSort,
      initialFilters,
    };
  } catch (error) {
    console.warn("Failed to load initial products:", error);
    const { initialSort, initialFilters } = parseURLParams(searchParams);
    return {
      initialProducts: [],
      pageSize: 12,
      collectionId,
      initialHasMore: false,
      initialSort,
      initialFilters,
    };
  }
}
