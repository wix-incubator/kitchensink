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

  // Enhanced product data (merged from variant-selector-service)
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

  // Variant selection actions
  setSelectedOptions: (options: Record<string, string>) => void;
  addToCart: (quantity?: number) => Promise<void>;

  // Additional actions (merged from variant-selector-service)
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

  // Enhanced getters (merged from variant-selector-service)
  selectedVariant: () => {
    id: string;
    label: string;
    stock: number;
    ribbon: string | null;
    isPreOrder: boolean | null;
  };
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;

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

  // Extract product information from config
  const configProduct = config.product;

  // State signals
  const selectedOptions: Signal<Record<string, string>> = signalsService.signal(
    {} as any
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);

  // Enhanced product data signals (merged from variant-selector-service)
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

  // Initialize with product data (enhanced from variant-selector-service)
  if (configProduct) {
    productId.set(configProduct._id || "");
    sku.set(configProduct.sku || "");
    ribbonLabel.set(configProduct.ribbon || null);

    // Fix price parsing - ensure we're parsing strings
    const priceString = configProduct.priceData?.price?.toString() || "0";
    const discountPriceString =
      configProduct.priceData?.discountedPrice?.toString();

    basePrice.set(parseFloat(priceString));
    discountPrice.set(
      discountPriceString ? parseFloat(discountPriceString) : null
    );
    isOnSale.set(!!configProduct.priceData?.discountedPrice);

    // Extract options from product
    if (configProduct.productOptions) {
      const optionsMap: Record<string, string[]> = {};
      configProduct.productOptions.forEach((option) => {
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
    if (configProduct.variants) {
      const variantsList = configProduct.variants.map((variant) => ({
        id: variant._id || "",
        label: variant.choices
          ? Object.values(variant.choices).join(" / ")
          : "",
        stock: variant.stock?.quantity || 0,
        ribbon: null, // Ribbon property doesn't exist on Variant type
        isPreOrder: null, // PreorderInfo property doesn't exist on Variant type
      }));
      variants.set(variantsList);

      // Select first variant by default
      if (variantsList.length > 0) {
        quantityAvailable.set(variantsList[0].stock);
      }
    } else {
      // Single variant product
      quantityAvailable.set(configProduct.stock?.quantity || 0);
    }
  }

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

  // Enhanced getters (merged from variant-selector-service)
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

  // Enhanced actions (merged from variant-selector-service)
  const setOption = (group: string, value: string) => {
    const currentOptions = selectedOptions.get();
    const newOptions = { ...currentOptions, [group]: value };
    selectedOptions.set(newOptions);

    // Find matching variant
    const variantsList = variants.get();
    const matchingVariant = variantsList.find((variant) => {
      if (!configProduct.variants) return false;
      const productVariant = configProduct.variants.find(
        (pv) => pv._id === variant.id
      );
      if (!productVariant?.choices) return false;

      return Object.entries(newOptions).every(([optionName, optionValue]) => {
        return productVariant.choices![optionName] === optionValue;
      });
    });

    if (matchingVariant) {
      quantityAvailable.set(matchingVariant.stock);
    }
  };

  const selectVariantById = (id: string) => {
    const variantsList = variants.get();
    const variant = variantsList.find((v) => v.id === id);
    if (variant) {
      quantityAvailable.set(variant.stock);

      // Update selected options to match this variant
      if (configProduct.variants) {
        const productVariant = configProduct.variants.find(
          (pv) => pv._id === id
        );
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
      quantityAvailable.set(data[0].stock);
    }
  };

  const resetSelections = () => {
    selectedOptions.set({});
    const variantsList = variants.get();
    if (variantsList.length > 0) {
      quantityAvailable.set(variantsList[0].stock);
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

    // Enhanced product data (merged from variant-selector-service)
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
    setSelectedOptions,
    addToCart,

    // Additional actions (merged from variant-selector-service)
    setOption,
    selectVariantById,
    loadProductVariants,
    resetSelections,

    // Enhanced getters (merged from variant-selector-service)
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
