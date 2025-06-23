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

const searchProducts = async (searchOptions: any) => {
  const searchParams = {
    filter: searchOptions.search?.filter,
    sort: searchOptions.search?.sort,
    ...(searchOptions.paging && { cursorPaging: searchOptions.paging })
  };

  const options = {
    fields: searchOptions.fields || []
  };

  return await productsV3.searchProducts(searchParams, options);
};

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

// Helper to build search options with supported filters
const buildSearchOptions = (filters?: Filter, selectedCategory?: string | null, sortBy?: SortBy, categories?: any[]) => {
  const searchOptions: any = {
    search: {},
    fields: [
      'PLAIN_DESCRIPTION',
      'MEDIA_ITEMS_INFO',
      'CURRENCY',
      'THUMBNAIL',
      'URL',
      'ALL_CATEGORIES_INFO'
    ]
  };

  // Build filter conditions array
  const filterConditions: any[] = [];

  // Add category filter if selected
  if (selectedCategory) {
    filterConditions.push({
      'allCategoriesInfo.categories': {
        $matchItems: [
          {
            id: {
              $in: [selectedCategory],
            },
          },
        ],
      },
    });
  }

  // Add price range filter if provided
  if (filters?.priceRange) {
    const { min, max } = filters.priceRange;
    if (min > 0) {
      filterConditions.push({
        "actualPriceRange.minValue.amount": { "$gte": min.toString() }
      });
    }
    if (max < 999999) {
      filterConditions.push({
        "actualPriceRange.maxValue.amount": { "$lte": max.toString() }
      });
    }
  }

  // Add product options filter if provided
  if (filters?.selectedOptions && Object.keys(filters.selectedOptions).length > 0) {
    for (const [optionId, choiceIds] of Object.entries(filters.selectedOptions)) {
      if (choiceIds.length > 0) {
        filterConditions.push({
          "options.choicesSettings.choices.choiceId": {
            "$hasSome": choiceIds
          }
        });
      }
    }
  }

  // Apply filters
  if (filterConditions.length > 0) {
    if (filterConditions.length === 1) {
      // Single condition - no need for $and wrapper
      searchOptions.search.filter = filterConditions[0];
    } else {
      // Multiple conditions - use $and
      searchOptions.search.filter = {
        $and: filterConditions
      };
    }
  }

  // Add sort if provided
  if (sortBy) {
    switch (sortBy) {
      case 'name-asc':
        searchOptions.search.sort = [{ fieldName: 'name', order: 'ASC' }];
        break;
      case 'name-desc':
        searchOptions.search.sort = [{ fieldName: 'name', order: 'DESC' }];
        break;
      case 'price-asc':
        searchOptions.search.sort = [{ fieldName: 'actualPriceRange.minValue.amount', order: 'ASC' }];
        break;
      case 'price-desc':
        searchOptions.search.sort = [{ fieldName: 'actualPriceRange.minValue.amount', order: 'DESC' }];
        break;
    }
  }

  return searchOptions;
};

export const CollectionServiceDefinition =
  defineService<CollectionServiceAPI>("collection");

export const CollectionService = implementService.withConfig<{
  initialProducts?: productsV3.V3Product[];
  pageSize?: number;
  initialCursor?: string;
  initialHasMore?: boolean;
  categories?: any[];
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

  // Signal declarations
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
  
  // Debouncing mechanism to prevent multiple simultaneous refreshes
  let refreshTimeout: NodeJS.Timeout | null = null;
  let isRefreshing = false;
  let hasInitialized = false;

  const loadMore = async () => {
    // Don't load more if there are no more products available
    if (!hasMoreProducts.get()) {
      return;
    }

    try {
      isLoading.set(true);
      error.set(null);

      // For loadMore, use no filters or sorting to work with cursor pagination
      const searchOptions = buildSearchOptions(undefined, undefined, undefined, undefined);

      // Add pagination
      searchOptions.paging = { limit: pageSize };
      if (nextCursor) {
        searchOptions.paging.cursor = nextCursor;
      }

      const currentProducts = productsList.get();
      const productResults = await searchProducts(searchOptions);

      // Update cursor for next pagination
      nextCursor = productResults.pagingMetadata?.cursors?.next || undefined;

      // Check if there are more products to load
      const hasMore = Boolean(
        nextCursor &&
          productResults.products &&
          productResults.products.length === pageSize
      );
      hasMoreProducts.set(hasMore);

      // Update allProducts with the new data
      allProducts = [...allProducts, ...(productResults.products || [])];

      // Add new products to the list
      const additionalProducts = productResults.products || [];
      productsList.set([...currentProducts, ...additionalProducts]);
      totalProducts.set(currentProducts.length + additionalProducts.length);
      hasProducts.set((currentProducts.length + additionalProducts.length) > 0);
    } catch (err) {
      error.set(
        err instanceof Error ? err.message : "Failed to load more products"
      );
    } finally {
      isLoading.set(false);
    }
  };

  const refresh = async (setTotalProducts: boolean = true) => {
    if (isRefreshing) return;
    
    try {
      isRefreshing = true;
      isLoading.set(true);
      error.set(null);

      const filters = collectionFilters.currentFilters.get();
      const selectedCategory = categoryService.selectedCategory.get();
      const sortBy = sortService.currentSort.get();
      const categories = config.categories || categoryService.categories.get();
      const searchOptions = buildSearchOptions(filters, selectedCategory, sortBy, categories);

      // Add pagination
      searchOptions.paging = { limit: pageSize };

      const productResults = await searchProducts(searchOptions);

      // Reset pagination state
      nextCursor = productResults.pagingMetadata?.cursors?.next || undefined;
      const hasMore = Boolean(
        productResults.pagingMetadata?.cursors?.next &&
          productResults.products &&
          productResults.products.length === pageSize
      );
      hasMoreProducts.set(hasMore);

      // Update allProducts with the new data
      allProducts = productResults.products || [];

      // All filtering is handled server-side
      productsList.set(allProducts);
      if (setTotalProducts) {
        totalProducts.set(allProducts.length);
      }

      hasProducts.set(allProducts.length > 0);
    } catch (err) {
      error.set(
        err instanceof Error ? err.message : "Failed to refresh products"
      );
    } finally {
      isLoading.set(false);
      isRefreshing = false;
    }
  };
  
  // Debounced refresh function
  const debouncedRefresh = async (setTotalProducts: boolean = true): Promise<void> => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    
    return new Promise<void>((resolve) => {
      refreshTimeout = setTimeout(async () => {
        await refresh(setTotalProducts);
        resolve();
      }, 50); // 50ms debounce delay
    });
  };

  // Refresh with server-side filtering when any filters change
  collectionFilters.currentFilters.subscribe(() => {
    // All filtering (categories, price, options) is now handled server-side
    debouncedRefresh(false);
  });

  categoryService.selectedCategory.subscribe(async () => {
    // Reload catalog price range and options for the new category
    const selectedCategory = categoryService.selectedCategory.get();
    await collectionFilters.loadCatalogPriceRange(selectedCategory || undefined);
    await collectionFilters.loadCatalogOptions(selectedCategory || undefined);
    
    // Only trigger refresh if this isn't the initial load
    if (hasInitialized) {
      debouncedRefresh(false);
    } else {
      hasInitialized = true;
    }
  });

  sortService.currentSort.subscribe(() => {
    debouncedRefresh(false);
  });

  return {
    products: productsList,
    isLoading,
    error,
    totalProducts,
    hasProducts,
    hasMoreProducts,
    loadMore,
    refresh: debouncedRefresh,
  };
});

// Helper function to parse URL parameters
function parseURLParams(
  searchParams?: URLSearchParams,
  products: productsV3.V3Product[] = []
) {
  const defaultFilters: Filter = {
    priceRange: { min: 0, max: 1000 },
    selectedOptions: {},
  };
  
  if (!searchParams) {
    return { initialSort: "" as SortBy, initialFilters: defaultFilters };
  }

  const urlParams = URLParamsUtils.parseSearchParams(searchParams);

  // Parse sort parameter
  const sortMap: Record<string, SortBy> = {
    name_asc: "name-asc",
    name_desc: "name-desc",
    price_asc: "price-asc",
    price_desc: "price-desc",
  };
  const initialSort = sortMap[urlParams.sort as string] || ("" as SortBy);

  // Check if there are any filter parameters (excluding sort)
  const filterParams = Object.keys(urlParams).filter(key => key !== 'sort');
  
  if (filterParams.length === 0 || products.length === 0) {
    return { initialSort, initialFilters: defaultFilters };
  }

  // Calculate available price range from products
  const priceRange = calculatePriceRange(products);
  const initialFilters: Filter = {
    priceRange,
    selectedOptions: {},
  };

  // Apply price filters from URL
  if (urlParams.minPrice) {
    const min = parseFloat(urlParams.minPrice as string);
    if (!isNaN(min)) initialFilters.priceRange.min = min;
  }
  if (urlParams.maxPrice) {
    const max = parseFloat(urlParams.maxPrice as string);
    if (!isNaN(max)) initialFilters.priceRange.max = max;
  }

  // Parse option filters
  const optionsMap = buildOptionsMap(products);
  parseOptionFilters(urlParams, optionsMap, initialFilters);

  return { initialSort, initialFilters };
}

// Helper function to calculate price range from products
function calculatePriceRange(products: productsV3.V3Product[]): { min: number; max: number } {
  let minPrice = 0;
  let maxPrice = 1000;
  
  products.forEach((product) => {
    const min = parseFloat(product.actualPriceRange?.minValue?.amount || "0");
    const max = parseFloat(product.actualPriceRange?.maxValue?.amount || "0");
    if (min > 0) minPrice = minPrice === 0 ? min : Math.min(minPrice, min);
    if (max > 0) maxPrice = Math.max(maxPrice, max);
  });
  
  return { min: minPrice, max: maxPrice };
}

// Helper function to build options map from products
function buildOptionsMap(products: productsV3.V3Product[]) {
  const optionsMap = new Map<string, { id: string; choices: { id: string; name: string }[] }>();
  
  products.forEach((product) => {
    product.options?.forEach((option) => {
      if (!option._id || !option.name) return;
      
      if (!optionsMap.has(option.name)) {
        optionsMap.set(option.name, { id: option._id, choices: [] });
      }
      
      const optionData = optionsMap.get(option.name)!;
      option.choicesSettings?.choices?.forEach((choice) => {
        if (choice.choiceId && choice.name && !optionData.choices.find(c => c.id === choice.choiceId)) {
          optionData.choices.push({ id: choice.choiceId, name: choice.name });
        }
      });
    });
  });
  
  return optionsMap;
}

// Helper function to parse option filters from URL parameters
function parseOptionFilters(
  urlParams: Record<string, string | string[]>,
  optionsMap: Map<string, { id: string; choices: { id: string; name: string }[] }>,
  filters: Filter
) {
  Object.entries(urlParams).forEach(([key, value]) => {
    if (["sort", "minPrice", "maxPrice"].includes(key)) return;
    
    const option = optionsMap.get(key);
    if (option) {
      const values = Array.isArray(value) ? value : [value];
      const matchingChoices = option.choices.filter(choice => values.includes(choice.name));
      
      if (matchingChoices.length > 0) {
        filters.selectedOptions[option.id] = matchingChoices.map(c => c.id);
      }
    }
  });
}

export async function loadCollectionServiceConfig(
  categoryId?: string,
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
    // Load categories for service configuration
    const { loadCategoriesConfig } = await import('./category-service');
    const categoriesConfig = await loadCategoriesConfig();
    const categories = categoriesConfig.categories;

    // Build search options with category filter
    const searchOptions = buildSearchOptions(undefined, categoryId, undefined, categories);
    const pageSize = 12;
    searchOptions.paging = { limit: pageSize };

    const productResults = await searchProducts(searchOptions);

    // Parse URL parameters for initial state
    const { initialSort, initialFilters } = parseURLParams(
      searchParams,
      productResults.products || []
    );

    return {
      initialProducts: productResults.products || [],
      pageSize,
      initialCursor: productResults.pagingMetadata?.cursors?.next || undefined,
      initialHasMore: Boolean(
        productResults.pagingMetadata?.cursors?.next &&
          productResults.products &&
          productResults.products.length === pageSize
      ),
      initialSort,
      initialFilters,
      categories,
    };
  } catch (error) {
    console.warn("Failed to load initial products:", error);
    const { initialSort, initialFilters } = parseURLParams(searchParams);
    return {
      initialProducts: [],
      pageSize: 12,
      initialHasMore: false,
      initialSort,
      initialFilters,
      categories: [],
    };
  }
}
