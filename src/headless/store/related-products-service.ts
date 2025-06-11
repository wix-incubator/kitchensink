import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { products } from "@wix/stores";

// RelatedProductsService
// 🧠 Purpose: Manages related products discovery and display
// Fetches products that are related to the current product based on categories, tags, or collections
// Supports loading state, error handling, and configurable display limits

export interface RelatedProductsServiceAPI {
  // --- State ---
  relatedProducts: Signal<products.Product[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  hasRelatedProducts: Signal<boolean>;

  // --- Actions ---
  loadRelatedProducts: (productId: string, limit?: number) => Promise<void>;
  refreshRelatedProducts: () => Promise<void>;
}

export const RelatedProductsServiceDefinition =
  defineService<RelatedProductsServiceAPI>("relatedProducts");

export const RelatedProductsService = implementService.withConfig<{
  productId: string;
  limit?: number;
}>()(RelatedProductsServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // State signals
  const relatedProducts: Signal<products.Product[]> = signalsService.signal([]);
  const isLoading: Signal<boolean> = signalsService.signal(false);
  const error: Signal<string | null> = signalsService.signal(null);
  const hasRelatedProducts: Signal<boolean> = signalsService.signal(false);

  // Actions
  const loadRelatedProducts = async (productId: string, limit: number = 4) => {
    isLoading.set(true);
    error.set(null);

    try {
      // First, get the current product to understand its categories/collections
      const currentProduct = await products
        .queryProducts()
        .eq("_id", productId)
        .find();

      if (!currentProduct.items?.[0]) {
        throw new Error("Current product not found");
      }

      const product = currentProduct.items[0];

      // Strategy 1: Find products in the same collections
      let relatedQuery = products.queryProducts().ne("_id", productId);

      if (product.collections && product.collections.length > 0) {
        // Find products that share at least one collection
        relatedQuery = relatedQuery.hasSome("collections", product.collections);
      } else {
        // Fallback: Get random products from the same category or just random products
        relatedQuery = relatedQuery.limit(limit);
      }

      const relatedResult = await relatedQuery.limit(limit).find();

      relatedProducts.set(relatedResult.items || []);
      hasRelatedProducts.set((relatedResult.items || []).length > 0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load related products";
      error.set(errorMessage);
      relatedProducts.set([]);
      hasRelatedProducts.set(false);
    } finally {
      isLoading.set(false);
    }
  };

  const refreshRelatedProducts = async () => {
    await loadRelatedProducts(config.productId, config.limit);
  };

  // Initialize with config
  if (config.productId) {
    loadRelatedProducts(config.productId, config.limit);
  }

  return {
    // State
    relatedProducts,
    isLoading,
    error,
    hasRelatedProducts,

    // Actions
    loadRelatedProducts,
    refreshRelatedProducts,
  };
});

export async function loadRelatedProductsServiceConfig(
  productId: string,
  limit: number = 4
): Promise<ServiceFactoryConfig<typeof RelatedProductsService>> {
  return {
    productId,
    limit,
  };
}
