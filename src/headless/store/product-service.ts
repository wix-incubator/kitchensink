import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { productsV3 } from "@wix/stores";

/**
 * V3 Product Service API
 *
 * Aligned with Wix Stores Catalog V3 APIs
 * @see https://dev.wix.com/docs/sdk/backend-modules/stores/catalog-v3/introduction
 */
export interface ProductServiceAPI {
  // --- State ---
  product: Signal<productsV3.V3Product | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
}

export const ProductServiceDefinition =
  defineService<ProductServiceAPI>("product");

export const ProductService = implementService.withConfig<{
  product: productsV3.V3Product;
}>()(ProductServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // State signals (only product-level state)
  const product: Signal<productsV3.V3Product | null> = signalsService.signal(
    config.product as any
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);

  return {
    // Product-level properties
    product,
    isLoading,
    error,
  };
});

export type ProductServiceConfigResult =
  | { type: "success"; config: ServiceFactoryConfig<typeof ProductService> }
  | { type: "notFound" };

/**
 * Load product service configuration using Catalog V3 APIs
 *
 * @param productSlug - Product slug to load
 * @returns Service factory configuration with complete v3 product data
 */
export async function loadProductServiceConfig(
  productSlug: string
): Promise<ProductServiceConfigResult> {
  try {
    // First, find the product ID by slug using v3 queryProducts
    const storeProducts = await productsV3
      .queryProducts()
      .eq("slug", productSlug)
      .find();

    if (!storeProducts.items?.[0]) {
      return { type: "notFound" };
    }

    const productId = storeProducts.items[0]._id;
    if (!productId) {
      throw new Error("Product ID not found");
    }

    // Get complete product data using v3 getProduct
    // Note: The fields parameter may not be fully working in early preview
    // The v3 API currently returns basic product structure with media.main
    const fullProduct = await productsV3.getProduct(productId);

    return {
      type: "success",
      config: {
        product: fullProduct,
      },
    };
  } catch (error) {
    console.error("Failed to load product:", error);
    return { type: "notFound" };
  }
}
