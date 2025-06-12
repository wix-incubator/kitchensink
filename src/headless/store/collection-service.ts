import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { productsV3 } from "@wix/stores";

export interface CollectionServiceAPI {
  products: Signal<productsV3.V3Product[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  currentPage: Signal<number>;
  totalPages: Signal<number>;
  hasMore: Signal<boolean>;

  loadProducts: () => Promise<void>;
  loadMore: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

export const CollectionServiceDefinition =
  defineService<CollectionServiceAPI>("collection");

export const CollectionService = implementService.withConfig<{
  initialProducts?: productsV3.V3Product[];
  pageSize?: number;
  collectionId?: string;
}>()(CollectionServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // State signals
  const productsList: Signal<productsV3.V3Product[]> = signalsService.signal(
    config.initialProducts || ([] as any)
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);
  const currentPage: Signal<number> = signalsService.signal(1 as any);
  const totalPages: Signal<number> = signalsService.signal(1 as any);
  const hasMore: Signal<boolean> = signalsService.signal(false as any);

  const pageSize = config.pageSize || 12;

  // Actions
  const loadProducts = async (page: number = 1) => {
    try {
      isLoading.set(true);
      error.set(null);

      let query = productsV3.queryProducts();

      // Note: v3 API has limited filtering options
      // Collection filtering by collectionId is not available in the current query builder
      // For now, we'll load all visible products

      const productResults = await query.limit(pageSize).find();

      if (page === 1) {
        productsList.set(productResults.items || []);
      } else {
        const currentProducts = productsList.get();
        productsList.set([...currentProducts, ...(productResults.items || [])]);
      }

      currentPage.set(page);
      // v3 API uses cursor-based pagination, simplified for now
      const hasMoreItems = (productResults.items || []).length === pageSize;
      totalPages.set(page + (hasMoreItems ? 1 : 0));
      hasMore.set(hasMoreItems);
    } catch (err) {
      error.set(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      isLoading.set(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore.get() || isLoading.get()) return;
    await loadProducts(currentPage.get() + 1);
  };

  const goToPage = async (page: number) => {
    await loadProducts(page);
  };

  return {
    products: productsList,
    isLoading,
    error,
    currentPage,
    totalPages,
    hasMore,
    loadProducts: () => loadProducts(1),
    loadMore,
    goToPage,
  };
});

export async function loadCollectionServiceConfig(
  collectionId?: string
): Promise<ServiceFactoryConfig<typeof CollectionService>> {
  try {
    let query = productsV3.queryProducts();

    // Note: v3 API has limited filtering options
    // Collection filtering is not available in the current query builder
    // For now, we'll load all visible products

    const productResults = await query.limit(12).find();

    return {
      initialProducts: productResults.items || [],
      pageSize: 12,
      collectionId,
    };
  } catch (error) {
    console.warn("Failed to load initial products:", error);
    return {
      initialProducts: [],
      pageSize: 12,
      collectionId,
    };
  }
}
