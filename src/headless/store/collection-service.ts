import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { products } from "@wix/stores";

export interface CollectionServiceAPI {
  products: Signal<products.Product[]>;
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
  initialProducts?: products.Product[];
  pageSize?: number;
  collectionId?: string;
}>()(CollectionServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // State signals
  const productsList: Signal<products.Product[]> = signalsService.signal(
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

      let query = products.queryProducts();

      if (config.collectionId) {
        query = query.hasSome("collectionIds", [config.collectionId]);
      }

      const productResults = await query
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .find();

      if (page === 1) {
        productsList.set(productResults.items || []);
      } else {
        const currentProducts = productsList.get();
        productsList.set([...currentProducts, ...(productResults.items || [])]);
      }

      currentPage.set(page);
      const total = productResults.totalCount || 0;
      totalPages.set(Math.ceil(total / pageSize));
      hasMore.set(page * pageSize < total);
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
    let query = products.queryProducts();

    if (collectionId) {
      query = query.hasSome("collectionIds", [collectionId]);
    }

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
