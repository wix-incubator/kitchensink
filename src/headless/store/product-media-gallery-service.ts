import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal, ReadOnlySignal } from "../Signal";
import { productsV3 } from "@wix/stores";
import { SelectedVariantServiceDefinition } from "./selected-variant-service";
import { ProductServiceDefinition } from "./product-service";

export interface ProductMediaGalleryServiceAPI {
  // --- State ---
  selectedImageIndex: Signal<number>;
  selectedImage: ReadOnlySignal<any | null>; // Simplified type for v3 compatibility

  // Product data exposed for media gallery components
  product: ReadOnlySignal<productsV3.V3Product | null>;
  isLoading: ReadOnlySignal<boolean>;
  totalImages: ReadOnlySignal<number>;
  productName: ReadOnlySignal<string>;

  // --- Actions ---
  setSelectedImageIndex: (index: number) => void;
  nextImage: () => void;
  previousImage: () => void;
}

export const ProductMediaGalleryServiceDefinition =
  defineService<ProductMediaGalleryServiceAPI>("productMediaGallery");

export const ProductMediaGalleryService = implementService.withConfig<{
  product: productsV3.V3Product;
}>()(ProductMediaGalleryServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const selectedVariantService = getService(SelectedVariantServiceDefinition);
  const productService = getService(ProductServiceDefinition);

  // State signals
  const selectedImageIndex: Signal<number> = signalsService.signal(0 as any);

  // Computed values
  const selectedImage: ReadOnlySignal<any | null> =
    signalsService.computed<any>(() => {
      const prod = productService.product.get();
      const imageIndex = selectedImageIndex.get();

      // Use actual v3 media structure - only main image available
      if (imageIndex === 0 && prod?.media?.main) {
        return prod.media.main;
      }

      return null;
    });

  // Product data exposed through this service
  const product: ReadOnlySignal<productsV3.V3Product | null> =
    productService.product;
  const isLoading: ReadOnlySignal<boolean> = productService.isLoading;

  const totalImages: ReadOnlySignal<number> = signalsService.computed(() => {
    const prod = productService.product.get();
    // For v3 API, typically only one main image is available
    return prod?.media?.main ? 1 : 0;
  });

  const productName: ReadOnlySignal<string> = signalsService.computed(() => {
    const prod = productService.product.get();
    return prod?.name || "Product";
  });

  // Listen to variant changes and update image accordingly
  const subscribeToVariantChanges = () => {
    return selectedVariantService.selectedChoices.subscribe((choices) => {
      // For now, just keep showing the main image since that's what's available
      selectedImageIndex.set(0);
    });
  };

  // Set up subscription
  subscribeToVariantChanges();

  // Actions
  const setSelectedImageIndex = (index: number) => {
    // Only allow index 0 since we typically only have main image
    const validIndex = index === 0 ? 0 : 0;
    selectedImageIndex.set(validIndex);
  };

  const nextImage = () => {
    // No next image since we typically only have main image
    selectedImageIndex.set(0);
  };

  const previousImage = () => {
    // No previous image since we typically only have main image
    selectedImageIndex.set(0);
  };

  return {
    // Media gallery state
    selectedImageIndex,
    selectedImage,

    // Media gallery actions
    setSelectedImageIndex,
    nextImage,
    previousImage,

    // Product data exposed for media gallery components
    product,
    isLoading,
    totalImages,
    productName,
  };
});

export async function loadProductMediaGalleryServiceConfig(
  productSlug: string
): Promise<ServiceFactoryConfig<typeof ProductMediaGalleryService>> {
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
