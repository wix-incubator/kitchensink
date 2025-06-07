import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal, ReadOnlySignal } from "../Signal";
import { products } from "@wix/stores";
import { CurrentCartServiceDefinition } from "./current-cart-service";
import { ProductServiceDefinition } from "./product-service";

export interface SelectedVariantServiceAPI {
  // Variant selection state
  selectedOptions: Signal<Record<string, string>>;
  selectedVariantId: ReadOnlySignal<string | null>;
  currentVariant: ReadOnlySignal<products.Variant | null>;
  currentPrice: ReadOnlySignal<string>;
  isInStock: ReadOnlySignal<boolean>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  // Variant selection actions
  setSelectedOptions: (options: Record<string, string>) => void;
  addToCart: (quantity?: number) => Promise<void>;

  // Product data exposed for variant selector components
  product: ReadOnlySignal<products.Product | null>;
  productOptions: ReadOnlySignal<products.ProductOption[]>;
  currency: ReadOnlySignal<string>;
}

export const SelectedVariantServiceDefinition =
  defineService<SelectedVariantServiceAPI>("selectedVariant");

export const SelectedVariantService = implementService.withConfig<{
  product: products.Product;
}>()(SelectedVariantServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const cartService = getService(CurrentCartServiceDefinition);
  const productService = getService(ProductServiceDefinition);

  // State signals
  const selectedOptions: Signal<Record<string, string>> = signalsService.signal(
    {} as any
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);

  // Computed values
  const currentVariant: ReadOnlySignal<products.Variant | null> =
    signalsService.computed<any>((() => {
      const prod = productService.product.get();
      const options = selectedOptions.get();

      if (!prod?.manageVariants || !prod.variants) return null;

      return (
        prod.variants.find((variant: any) => {
          if (!variant.choices) return false;
          return Object.entries(options).every(([optionName, optionValue]) => {
            const choice = variant.choices![optionName];
            return choice === optionValue;
          });
        }) || null
      );
    }) as any);

  const selectedVariantId: ReadOnlySignal<string | null> =
    signalsService.computed(() => {
      const variant = currentVariant.get();
      return variant?._id || null;
    });

  const currentPrice: ReadOnlySignal<string> = signalsService.computed(() => {
    const variant = currentVariant.get();
    const prod = productService.product.get();

    if (variant?.variant?.priceData?.formatted?.price) {
      return variant.variant.priceData.formatted.price;
    }

    if (prod?.priceData?.formatted?.price) {
      return prod.priceData.formatted.price;
    }

    return "$0.00";
  });

  const isInStock: ReadOnlySignal<boolean> = signalsService.computed(() => {
    const variant = currentVariant.get();
    const prod = productService.product.get();

    if (variant) {
      return variant.stock?.trackQuantity
        ? (variant.stock?.quantity || 0) > 0
        : true;
    }

    if (prod?.stock) {
      return prod.stock.trackInventory ? (prod.stock.quantity || 0) > 0 : true;
    }

    return true;
  });

  // Product data exposed through this service
  const product: ReadOnlySignal<products.Product | null> =
    productService.product;

  const productOptions: ReadOnlySignal<products.ProductOption[]> =
    signalsService.computed<any>(() => {
      const prod = productService.product.get();
      return prod?.productOptions || [];
    });

  const currency: ReadOnlySignal<string> = signalsService.computed(() => {
    const prod = productService.product.get();
    return prod?.priceData?.currency || "USD";
  });

  // Actions
  const setSelectedOptions = (options: Record<string, string>) => {
    selectedOptions.set(options);
  };

  const addToCart = async (quantity: number = 1) => {
    try {
      isLoading.set(true);
      error.set(null);

      const prod = productService.product.get();
      const options = selectedOptions.get();

      if (!prod?._id) {
        throw new Error("Product not found");
      }

      const lineItems = [
        {
          catalogReference: {
            catalogItemId: prod._id,
            appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
            options: Object.keys(options).length > 0 ? { options } : undefined,
          },
          quantity,
        },
      ];

      await cartService.addToCart(lineItems);
    } catch (err) {
      error.set(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      isLoading.set(false);
    }
  };

  return {
    // Variant selection state
    selectedOptions,
    selectedVariantId,
    currentVariant,
    currentPrice,
    isInStock,
    isLoading,
    error,

    // Variant selection actions
    setSelectedOptions,
    addToCart,

    // Product data exposed for variant selector components
    product,
    productOptions,
    currency,
  };
});

export async function loadSelectedVariantServiceConfig(
  productSlug: string
): Promise<ServiceFactoryConfig<typeof SelectedVariantService>> {
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
