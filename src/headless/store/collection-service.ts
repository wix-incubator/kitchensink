import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { productsV3 } from "@wix/stores";

/**
 * V3 Collection Service API
 *
 * Manages product collections using Wix Stores Catalog V3 APIs
 * @see https://dev.wix.com/docs/sdk/backend-modules/stores/catalog-v3/introduction
 */
export interface CollectionServiceAPI {
  // --- State ---
  products: Signal<productsV3.V3Product[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  totalProducts: Signal<number>;
  hasProducts: Signal<boolean>;

  // --- Actions ---
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const CollectionServiceDefinition =
  defineService<CollectionServiceAPI>("collection");

export const CollectionService = implementService.withConfig<{
  initialProducts?: productsV3.V3Product[];
  pageSize?: number;
  collectionId?: string;
}>()(CollectionServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const initialProducts = config.initialProducts || [];

  // State signals
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

  // Actions
  const loadMore = async () => {
    try {
      isLoading.set(true);
      error.set(null);

      let query = productsV3.queryProducts();

      // Note: v3 API has limited filtering options
      // Collection filtering by collectionId is not available in the current query builder
      // For now, we'll load more products and append to existing list

      const currentProducts = productsList.get();
      const productResults = await query.limit(pageSize).find();

      const newProducts = [...currentProducts, ...(productResults.items || [])];
      productsList.set(newProducts);
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

  const refresh = async () => {
    try {
      isLoading.set(true);
      error.set(null);

      let query = productsV3.queryProducts();

      // Note: v3 API has limited filtering options
      // Collection filtering by collectionId is not available in the current query builder
      // For now, we'll load all visible products

      const productResults = await query.limit(pageSize).find();

      productsList.set(productResults.items || []);
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

  return {
    products: productsList,
    isLoading,
    error,
    totalProducts,
    hasProducts,
    loadMore,
    refresh,
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
