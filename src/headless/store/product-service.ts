import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { products } from "@wix/stores";

export interface ProductServiceAPI {
  product: Signal<products.Product | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
}

export const ProductServiceDefinition =
  defineService<ProductServiceAPI>("product");

export const ProductService = implementService.withConfig<{
  product: products.Product;
}>()(ProductServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // State signals (only product-level state)
  const product: Signal<products.Product | null> = signalsService.signal(
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

export async function loadProductServiceConfig(
  productSlug: string
): Promise<ServiceFactoryConfig<typeof ProductService>> {
  try {
    const storeProducts = await products
      .queryProducts()
      .eq("slug", productSlug)
      .find();

    if (!storeProducts.items?.[0]) {
      throw new Error("Product not found");
    }

    return {
      product: storeProducts.items[0],
    };
  } catch (error) {
    console.error("Failed to load product:", error);
    throw error;
  }
}
