import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../../Signal";
import { productsV3 } from "@wix/stores";

export interface RelatedProductsServiceAPI {
  relatedProducts: Signal<productsV3.V3Product[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  hasRelatedProducts: Signal<boolean>;

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

  const relatedProducts: Signal<productsV3.V3Product[]> = signalsService.signal(
    [] as any
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);
  const hasRelatedProducts: Signal<boolean> = signalsService.signal(
    false as any
  );

  const loadRelatedProducts = async (productId: string, limit: number = 4) => {
    isLoading.set(true);
    error.set(null);

    try {
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

  if (config.productId) {
    loadRelatedProducts(config.productId, config.limit);
  }

  return {
    relatedProducts,
    isLoading,
    error,
    hasRelatedProducts,

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
