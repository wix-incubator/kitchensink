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
  // Media gallery state
  selectedImageIndex: Signal<number>;
  selectedImage: ReadOnlySignal<any | null>; // Simplified type for v3 compatibility

  // Media gallery actions
  setSelectedImageIndex: (index: number) => void;
  nextImage: () => void;
  previousImage: () => void;

  // Product data exposed for media gallery components
  product: ReadOnlySignal<productsV3.V3Product | null>;
  isLoading: ReadOnlySignal<boolean>;
  totalImages: ReadOnlySignal<number>;
  productName: ReadOnlySignal<string>;
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

      if (!prod?.media?.itemsInfo?.items) return null;
      return prod.media.itemsInfo.items[imageIndex] || null;
    });

  // Product data exposed through this service
  const product: ReadOnlySignal<productsV3.V3Product | null> =
    productService.product;
  const isLoading: ReadOnlySignal<boolean> = productService.isLoading;

  const totalImages: ReadOnlySignal<number> = signalsService.computed(() => {
    const prod = productService.product.get();
    return prod?.media?.itemsInfo?.items?.length || 0;
  });

  const productName: ReadOnlySignal<string> = signalsService.computed(() => {
    const prod = productService.product.get();
    return prod?.name || "Product";
  });

  // Listen to variant changes and update image accordingly
  const subscribeToVariantChanges = () => {
    return selectedVariantService.selectedChoices.subscribe((choices) => {
      const prod = productService.product.get();
      const media = prod?.media;

      if (
        !prod?.options ||
        !media?.itemsInfo?.items?.length ||
        Object.keys(choices).length === 0
      )
        return;

      // Simplified variant to image mapping for v3 API
      // This would need more sophisticated logic based on actual v3 media structure
      // For now, just reset to first image when variant changes
      selectedImageIndex.set(0);
    });
  };

  // Set up subscription
  subscribeToVariantChanges();

  // Actions
  const setSelectedImageIndex = (index: number) => {
    const prod = productService.product.get();
    if (!prod?.media?.itemsInfo?.items) return;

    const maxIndex = prod.media.itemsInfo.items.length - 1;
    const validIndex = Math.max(0, Math.min(index, maxIndex));
    selectedImageIndex.set(validIndex);
  };

  const nextImage = () => {
    const prod = productService.product.get();
    const currentIndex = selectedImageIndex.get();

    if (!prod?.media?.itemsInfo?.items) return;

    const nextIndex =
      currentIndex >= prod.media.itemsInfo.items.length - 1
        ? 0
        : currentIndex + 1;
    selectedImageIndex.set(nextIndex);
  };

  const previousImage = () => {
    const prod = productService.product.get();
    const currentIndex = selectedImageIndex.get();

    if (!prod?.media?.itemsInfo?.items) return;

    const prevIndex =
      currentIndex <= 0
        ? prod.media.itemsInfo.items.length - 1
        : currentIndex - 1;
    selectedImageIndex.set(prevIndex);
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
    const storeProducts = await productsV3
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
