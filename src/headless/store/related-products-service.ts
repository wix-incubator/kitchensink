import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { productsV3 } from "@wix/stores";

// RelatedProductsService
// 🧠 Purpose: Manages related products discovery and display
// Fetches products that are related to the current product based on categories, tags, or collections
// Supports loading state, error handling, and configurable display limits

export interface RelatedProductsServiceAPI {
  // --- State ---
  relatedProducts: Signal<productsV3.V3Product[]>;
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
  const relatedProducts: Signal<productsV3.V3Product[]> = signalsService.signal(
    [] as any
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);
  const hasRelatedProducts: Signal<boolean> = signalsService.signal(
    false as any
  );

  // Actions
  const loadRelatedProducts = async (productId: string, limit: number = 4) => {
    isLoading.set(true);
    error.set(null);

    try {
      // First, get the current product to understand its categories/collections
      const currentProduct = await productsV3
        .queryProducts()
        .eq("_id", productId)
        .find();

      if (!currentProduct.items?.[0]) {
        throw new Error("Current product not found");
      }

      const product = currentProduct.items[0];

      // Strategy: Get related products (excluding current product)
      // Note: v3 API has limited query filtering options
      // For now, we'll get random products excluding the current one
      let relatedQuery = productsV3.queryProducts().ne("_id", productId);

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
