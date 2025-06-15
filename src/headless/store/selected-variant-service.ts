import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal, ReadOnlySignal } from "../Signal";
import {
  productsV3,
  readOnlyVariantsV3,
  inventoryItemsV3,
  customizationsV3,
  ribbonsV3,
  brandsV3,
} from "@wix/stores";
import { CurrentCartServiceDefinition } from "./current-cart-service";
import { ProductServiceDefinition } from "./product-service";

// V3 API Types
type V3Product = productsV3.V3Product;
type Variant = productsV3.Variant;
type ConnectedOption = productsV3.ConnectedOption;
type PriceInfo = productsV3.PriceInfo;
type FixedMonetaryAmount = productsV3.FixedMonetaryAmount;

export interface SelectedVariantServiceAPI {
  // --- State ---
  selectedChoices: Signal<Record<string, string>>;
  selectedVariantId: ReadOnlySignal<string | null>;
  currentVariant: ReadOnlySignal<productsV3.Variant | null>;
  currentPrice: ReadOnlySignal<string>;
  isInStock: ReadOnlySignal<boolean>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  // Enhanced product data (using v3 API structure)
  variants: Signal<productsV3.Variant[]>;
  options: Signal<Record<string, string[]>>;
  basePrice: Signal<number>;
  discountPrice: Signal<number | null>;
  isOnSale: Signal<boolean | null>;
  quantityAvailable: Signal<number>;
  productId: Signal<string>;
  sku: Signal<string>;
  ribbonLabel: Signal<string | null>;

  // Product data exposed for variant selector components
  product: ReadOnlySignal<productsV3.V3Product | null>;
  productOptions: ReadOnlySignal<productsV3.ConnectedOption[]>;
  currency: ReadOnlySignal<string>;

  // --- Getters ---
  selectedVariant: () => productsV3.Variant | null;
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;

  // --- Actions ---
  setSelectedChoices: (choices: Record<string, string>) => void;
  addToCart: (quantity?: number) => Promise<void>;
  setOption: (group: string, value: string) => void;
  selectVariantById: (id: string) => void;
  loadProductVariants: (data: productsV3.Variant[]) => void;
  resetSelections: () => void;
}

export const SelectedVariantServiceDefinition =
  defineService<SelectedVariantServiceAPI>("selectedVariant");

export const SelectedVariantService = implementService.withConfig<{
  product: productsV3.V3Product;
}>()(SelectedVariantServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const cartService = getService(CurrentCartServiceDefinition);
  // Note: We maintain our own v3 product state instead of using v1 product service

  // Extract product information from config
  const configProduct = config.product;

  // Helper Functions for v3 API
  const parsePrice = (amount?: string | null): number => {
    if (!amount) return 0;
    const parsed = parseFloat(amount);
    return isNaN(parsed) ? 0 : parsed;
  };

  const processVariantChoices = (variant: Variant): Record<string, string> => {
    const choices: Record<string, string> = {};

    if (variant.choices) {
      for (const choice of variant.choices) {
        if (
          choice.optionChoiceNames?.optionName &&
          choice.optionChoiceNames?.choiceName
        ) {
          choices[choice.optionChoiceNames.optionName] =
            choice.optionChoiceNames.choiceName;
        }
      }
    }

    return choices;
  };

  const findVariantByChoices = (
    variants: productsV3.Variant[],
    selectedChoices: Record<string, string>
  ): productsV3.Variant | null => {
    return (
      variants.find((variant) => {
        const variantChoices = processVariantChoices(variant);
        const choiceKeys = Object.keys(selectedChoices);
        return choiceKeys.every(
          (key) => variantChoices[key] === selectedChoices[key]
        );
      }) || null
    );
  };

  const getDefaultVariant = (): productsV3.Variant | null => {
    const variantsList = variants.get();
    return variantsList[0] || null;
  };

  const updateQuantityFromVariant = (variant: productsV3.Variant | null) => {
    if (variant) {
      const inStock = variant.inventoryStatus?.inStock ?? true;
      quantityAvailable.set(inStock ? 999 : 0);
    }
  };

  // State signals
  const selectedChoices: Signal<Record<string, string>> = signalsService.signal(
    {} as any
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);

  // Enhanced product data signals (v3 API structure)
  const variants: Signal<productsV3.Variant[]> = signalsService.signal(
    [] as any
  );
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

  // Store v3 product data internally
  const v3Product: Signal<V3Product | null> = signalsService.signal(
    configProduct as any
  );

  // Initialize with product data (v3 API structure)
  if (configProduct) {
    productId.set(configProduct._id || "");
    ribbonLabel.set(configProduct.ribbon?.name || null);

    // Use v3 pricing structure
    const actualPrice = configProduct.actualPriceRange?.minValue?.amount;
    const compareAtPrice = configProduct.compareAtPriceRange?.minValue?.amount;

    basePrice.set(parsePrice(actualPrice));
    discountPrice.set(compareAtPrice ? parsePrice(compareAtPrice) : null);
    isOnSale.set(
      !!compareAtPrice && parsePrice(compareAtPrice) > parsePrice(actualPrice)
    );

    // Extract options from v3 product structure
    if (configProduct.options) {
      const optionsMap: Record<string, string[]> = {};
      configProduct.options.forEach((option: any) => {
        if (option.name && option.choicesSettings?.choices) {
          optionsMap[option.name] = option.choicesSettings.choices.map(
            (choice: any) => choice.name || ""
          );
        }
      });
      options.set(optionsMap);
    }

    // Extract variants from v3 product structure
    if (configProduct.variantsInfo?.variants) {
      variants.set(configProduct.variantsInfo.variants);

      // Select first variant by default
      if (configProduct.variantsInfo.variants.length > 0) {
        updateQuantityFromVariant(configProduct.variantsInfo.variants[0]);
      }
    } else {
      // Single variant product - create a default variant
      const singleVariant: productsV3.Variant = {
        _id: "default",
        visible: true,
        choices: [],
        price: {
          actualPrice: configProduct.actualPriceRange?.minValue,
          compareAtPrice: configProduct.compareAtPriceRange?.minValue,
        },
        inventoryStatus: {
          inStock: configProduct.inventory?.availabilityStatus === "IN_STOCK",
          preorderEnabled:
            configProduct.inventory?.preorderStatus === "ENABLED",
        },
      };
      variants.set([singleVariant]);
      updateQuantityFromVariant(singleVariant);
    }
  }

  // Computed values (v3 compatible)
  const currentVariant: ReadOnlySignal<productsV3.Variant | null> =
    signalsService.computed<any>((() => {
      const prod = v3Product.get();
      const choices = selectedChoices.get();

      if (!prod?.variantsInfo?.variants) return null;

      return (
        prod.variantsInfo.variants.find((variant: any) => {
          const variantChoices = processVariantChoices(variant);
          return Object.entries(choices).every(([optionName, optionValue]) => {
            return variantChoices[optionName] === optionValue;
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
    const prod = v3Product.get();

    // Try to get formatted amount first (if fields worked)
    if (variant?.price?.actualPrice?.formattedAmount) {
      return variant.price.actualPrice.formattedAmount;
    }

    if (prod?.actualPriceRange?.minValue?.formattedAmount) {
      return prod.actualPriceRange.minValue.formattedAmount;
    }

    // Fallback: create our own formatted price from amount
    let rawAmount = null;

    if (variant?.price?.actualPrice?.amount) {
      rawAmount = variant.price.actualPrice.amount;
    } else if (prod?.actualPriceRange?.minValue?.amount) {
      rawAmount = prod.actualPriceRange.minValue.amount;
    }

    return rawAmount ? `$${rawAmount}` : "$0.00";
  });

  const isInStock: ReadOnlySignal<boolean> = signalsService.computed(() => {
    const variant = currentVariant.get();
    const prod = v3Product.get();

    if (variant) {
      return variant.inventoryStatus?.inStock ?? false;
    }

    return prod?.inventory?.availabilityStatus === "IN_STOCK";
  });

  // Product data exposed through this service (v3 compatible)
  const product: ReadOnlySignal<productsV3.V3Product | null> = v3Product;

  const productOptions: ReadOnlySignal<productsV3.ConnectedOption[]> =
    signalsService.computed<any>(() => {
      const prod = v3Product.get();
      return prod?.options || [];
    });

  const currency: ReadOnlySignal<string> = signalsService.computed(() => {
    const prod = v3Product.get();
    return prod?.currency || "USD";
  });

  // Enhanced getters (v3 compatible)
  const selectedVariant = (): productsV3.Variant | null => {
    const variantId = selectedVariantId.get();
    const variantsList = variants.get();
    return variantsList.find((v) => v._id === variantId) || getDefaultVariant();
  };

  const finalPrice = (): number => {
    const discount = discountPrice.get();
    const base = basePrice.get();
    return discount !== null ? discount : base;
  };

  const isLowStock = (threshold: number = 5): boolean => {
    // Note: We don't have quantity info in the current structure
    // This would require additional inventory API calls
    return false;
  };

  // Actions (v3 enhanced)
  const setSelectedChoices = (choices: Record<string, string>) => {
    selectedChoices.set(choices);
    const matchingVariant = findVariantByChoices(variants.get(), choices);
    updateQuantityFromVariant(matchingVariant);
  };

  const addToCart = async (quantity: number = 1) => {
    try {
      isLoading.set(true);
      error.set(null);

      const prod = v3Product.get();
      const variant = currentVariant.get();

      if (!prod?._id) {
        throw new Error("Product not found");
      }

      // Create catalogReference with correct format for Wix Stores
      const catalogReference = {
        catalogItemId: prod._id,
        appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e", // Correct Wix Stores app ID
        options: variant?._id ? { variantId: variant._id } : undefined,
      };

      const lineItems = [
        {
          catalogReference,
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

  // Enhanced actions (v3 compatible)
  const setOption = (group: string, value: string) => {
    const currentChoices = selectedChoices.get();
    const newChoices = { ...currentChoices, [group]: value };
    setSelectedChoices(newChoices); // Reuse consolidated logic
  };

  const selectVariantById = (id: string) => {
    const variantsList = variants.get();
    const variant = variantsList.find((v) => v._id === id);
    if (variant) {
      const variantChoices = processVariantChoices(variant);
      selectedChoices.set(variantChoices);
      updateQuantityFromVariant(variant);
    }
  };

  const loadProductVariants = (data: productsV3.Variant[]) => {
    variants.set(data);
    if (data.length > 0) {
      updateQuantityFromVariant(data[0]);
    }
  };

  const resetSelections = () => {
    selectedChoices.set({});
    const defaultVariant = getDefaultVariant();
    updateQuantityFromVariant(defaultVariant);
  };

  return {
    // Variant selection state
    selectedChoices,
    selectedVariantId,
    currentVariant,
    currentPrice,
    isInStock,
    isLoading,
    error,

    // Enhanced product data (v3 API structure)
    variants,
    options,
    basePrice,
    discountPrice,
    isOnSale,
    quantityAvailable,
    productId,
    sku,
    ribbonLabel,

    // Variant selection actions
    setSelectedChoices,
    addToCart,

    // Additional actions (v3 enhanced)
    setOption,
    selectVariantById,
    loadProductVariants,
    resetSelections,

    // Enhanced getters (v3 compatible)
    selectedVariant,
    finalPrice,
    isLowStock,

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
    // First, find the product ID by slug using queryProducts
    const storeProducts = await productsV3
      .queryProducts()
      .eq("slug", productSlug)
      .find();

    if (!storeProducts.items?.[0]) {
      throw new Error("Product not found");
    }

    const productId = storeProducts.items[0]._id;
    if (!productId) {
      throw new Error("Product ID not found");
    }

    // Then get the full product data including variants and media using getProduct
    const fullProduct = await productsV3.getProduct(productId, {
      fields: [
        "MEDIA_ITEMS_INFO" as any, // Required for product media gallery
        "CURRENCY" as any, // Required for formatted pricing (formattedAmount)
        "DESCRIPTION" as any, // For product descriptions
        "PLAIN_DESCRIPTION" as any, // Fallback for descriptions
        "VARIANT_OPTION_CHOICE_NAMES" as any, // For variant option names
      ],
    });

    return {
      product: fullProduct,
    };
  } catch (error) {
    console.error("Failed to load product:", error);
    throw error;
  }
}
