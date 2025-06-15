import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { productsV3 } from "@wix/stores";

export interface ProductServiceAPI {
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

  const product: Signal<productsV3.V3Product | null> = signalsService.signal(
    config.product as any
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);

  return {
    product,
    isLoading,
    error,
  };
});

export type ProductServiceConfigResult =
  | { type: "success"; config: ServiceFactoryConfig<typeof ProductService> }
  | { type: "notFound" };

export async function loadProductServiceConfig(
  productSlug: string
): Promise<ProductServiceConfigResult> {
  try {
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
