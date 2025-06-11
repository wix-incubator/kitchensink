import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal, ReadOnlySignal } from "../Signal";
import { products } from "@wix/stores";

// VariantSelectorService
// 🧠 Purpose: Handles the entire product configuration and selection flow.
// Enables users to select from available options (e.g., size, color), resolve the appropriate variant, and retrieve associated data such as SKU, price, availability, ribbons, and stock level.
// Supports pre-order state logic and calculates dynamic pricing based on variant and discount status.
// Core to enabling all other product-related behaviors on the page — gallery, cart, stock messages, and price display rely on this selection state.

export interface VariantSelectorServiceAPI {
  // --- State ---
  selectedOptions: Signal<Record<string, string>>;
  selectedVariantId: Signal<string>;
  variants: Signal<
    {
      id: string;
      label: string;
      stock: number;
      ribbon: string | null;
      isPreOrder: boolean | null;
    }[]
  >;
  options: Signal<Record<string, string[]>>;
  basePrice: Signal<number>;
  discountPrice: Signal<number | null>;
  isOnSale: Signal<boolean | null>;
  quantityAvailable: Signal<number>;
  productId: Signal<string>;
  sku: Signal<string>;
  ribbonLabel: Signal<string | null>;

  // --- Getters ---
  selectedVariant: () => {
    id: string;
    label: string;
    stock: number;
    ribbon: string | null;
    isPreOrder: boolean | null;
  };
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;

  // --- Actions ---
  setOption: (group: string, value: string) => void;
  selectVariantById: (id: string) => void;
  loadProductVariants: (
    data: {
      id: string;
      label: string;
      stock: number;
      ribbon: string | null;
      isPreOrder: boolean | null;
    }[]
  ) => void;
  resetSelections: () => void;
}

export const VariantSelectorServiceDefinition =
  defineService<VariantSelectorServiceAPI>("variantSelector");

export const VariantSelectorService = implementService.withConfig<{
  product: products.Product;
}>()(VariantSelectorServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // Extract product information
  const product = config.product;

  // State signals
  const selectedOptions: Signal<Record<string, string>> = signalsService.signal(
    {} as any
  );
  const selectedVariantId: Signal<string> = signalsService.signal("" as any);
  const variants: Signal<
    {
      id: string;
      label: string;
      stock: number;
      ribbon: string | null;
      isPreOrder: boolean | null;
    }[]
  > = signalsService.signal([] as any);
  const options: Signal<Record<string, string[]>> = signalsService.signal(
    {} as any
  );
  const basePrice: Signal<number> = signalsService.signal(0 as any);
  const discountPrice: Signal<number | null> = signalsService.signal(
    null as any
  );
  const isOnSale: Signal<boolean | null> = signalsService.signal(null as any);
  const quantityAvailable: Signal<number> = signalsService.signal(0 as any);
  const productId: Signal<string> = signalsService.signal("" as any);
  const sku: Signal<string> = signalsService.signal("" as any);
  const ribbonLabel: Signal<string | null> = signalsService.signal(null as any);

  // Initialize with product data
  if (product) {
    productId.set(product._id || "");
    sku.set(product.sku || "");
    ribbonLabel.set(product.ribbon || null);
    basePrice.set(parseFloat(product.priceData?.price || "0"));
    discountPrice.set(
      product.priceData?.discountedPrice
        ? parseFloat(product.priceData.discountedPrice)
        : null
    );
    isOnSale.set(!!product.priceData?.discountedPrice);

    // Extract options from product
    if (product.productOptions) {
      const optionsMap: Record<string, string[]> = {};
      product.productOptions.forEach((option) => {
        if (option.name && option.choices) {
          optionsMap[option.name] = option.choices.map((choice) => {
            return option.optionType === products.OptionType.color
              ? choice.description || choice.value || ""
              : choice.value || "";
          });
        }
      });
      options.set(optionsMap);
    }

    // Extract variants from product
    if (product.variants) {
      const variantsList = product.variants.map((variant) => ({
        id: variant._id || "",
        label: variant.choices
          ? Object.values(variant.choices).join(" / ")
          : "",
        stock: variant.stock?.quantity || 0,
        ribbon: variant.ribbon || null,
        isPreOrder: variant.preorderInfo?.enabled || null,
      }));
      variants.set(variantsList);

      // Select first variant by default
      if (variantsList.length > 0) {
        selectedVariantId.set(variantsList[0].id);
        quantityAvailable.set(variantsList[0].stock);
      }
    } else {
      // Single variant product
      quantityAvailable.set(product.stock?.quantity || 0);
    }
  }

  // Getters
  const selectedVariant = () => {
    const variantId = selectedVariantId.get();
    const variantsList = variants.get();
    return (
      variantsList.find((v) => v.id === variantId) || {
        id: "",
        label: "",
        stock: 0,
        ribbon: null,
        isPreOrder: null,
      }
    );
  };

  const finalPrice = () => {
    const discount = discountPrice.get();
    const base = basePrice.get();
    return discount !== null ? discount : base;
  };

  const isLowStock = (threshold: number = 5) => {
    const variant = selectedVariant();
    return variant.stock > 0 && variant.stock <= threshold;
  };

  // Actions
  const setOption = (group: string, value: string) => {
    const currentOptions = selectedOptions.get();
    const newOptions = { ...currentOptions, [group]: value };
    selectedOptions.set(newOptions);

    // Find matching variant
    const variantsList = variants.get();
    const matchingVariant = variantsList.find((variant) => {
      if (!product.variants) return false;
      const productVariant = product.variants.find(
        (pv) => pv._id === variant.id
      );
      if (!productVariant?.choices) return false;

      return Object.entries(newOptions).every(([optionName, optionValue]) => {
        return productVariant.choices![optionName] === optionValue;
      });
    });

    if (matchingVariant) {
      selectedVariantId.set(matchingVariant.id);
      quantityAvailable.set(matchingVariant.stock);
    }
  };

  const selectVariantById = (id: string) => {
    const variantsList = variants.get();
    const variant = variantsList.find((v) => v.id === id);
    if (variant) {
      selectedVariantId.set(id);
      quantityAvailable.set(variant.stock);

      // Update selected options to match this variant
      if (product.variants) {
        const productVariant = product.variants.find((pv) => pv._id === id);
        if (productVariant?.choices) {
          selectedOptions.set(productVariant.choices);
        }
      }
    }
  };

  const loadProductVariants = (
    data: {
      id: string;
      label: string;
      stock: number;
      ribbon: string | null;
      isPreOrder: boolean | null;
    }[]
  ) => {
    variants.set(data);
    if (data.length > 0) {
      selectedVariantId.set(data[0].id);
      quantityAvailable.set(data[0].stock);
    }
  };

  const resetSelections = () => {
    selectedOptions.set({});
    const variantsList = variants.get();
    if (variantsList.length > 0) {
      selectedVariantId.set(variantsList[0].id);
      quantityAvailable.set(variantsList[0].stock);
    }
  };

  return {
    // State
    selectedOptions,
    selectedVariantId,
    variants,
    options,
    basePrice,
    discountPrice,
    isOnSale,
    quantityAvailable,
    productId,
    sku,
    ribbonLabel,

    // Getters
    selectedVariant,
    finalPrice,
    isLowStock,

    // Actions
    setOption,
    selectVariantById,
    loadProductVariants,
    resetSelections,
  };
});

export async function loadVariantSelectorServiceConfig(
  productSlug: string
): Promise<ServiceFactoryConfig<typeof VariantSelectorService>> {
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
