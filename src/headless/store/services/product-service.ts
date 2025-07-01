import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../../Signal";
import { productsV3 } from "@wix/stores";

export interface ProductServiceAPI {
  product: Signal<productsV3.V3Product>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
}

export const ProductServiceDefinition =
  defineService<ProductServiceAPI>("product");

export const ProductService = implementService.withConfig<{
  product: productsV3.V3Product;
}>()(ProductServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const product: Signal<productsV3.V3Product> = signalsService.signal(
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
    // Use getProductBySlug directly - single API call with comprehensive fields
    const productResponse = await productsV3.getProductBySlug(productSlug, {
      fields: [
        "DESCRIPTION" as any,
        "DIRECT_CATEGORIES_INFO" as any,
        "BREADCRUMBS_INFO" as any,
        "INFO_SECTION" as any,
        "MEDIA_ITEMS_INFO" as any,
        "PLAIN_DESCRIPTION" as any,
        "THUMBNAIL" as any,
        "URL" as any,
        "VARIANT_OPTION_CHOICE_NAMES" as any,
        "WEIGHT_MEASUREMENT_UNIT_INFO" as any,
      ],
    });

    if (!productResponse.product) {
      return { type: "notFound" };
    }

    return {
      type: "success",
      config: {
        product: productResponse.product!,
      },
    };
  } catch (error) {
    console.error(`Failed to load product for slug "${productSlug}":`, error);
    return { type: "notFound" };
  }
}
