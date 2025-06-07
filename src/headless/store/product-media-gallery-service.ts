import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal, ReadOnlySignal } from "../Signal";
import { products } from "@wix/stores";
import { SelectedVariantServiceDefinition } from "./selected-variant-service";
import { ProductServiceDefinition } from "./product-service";

export interface ProductMediaGalleryServiceAPI {
  // Media gallery state
  selectedImageIndex: Signal<number>;
  selectedImage: ReadOnlySignal<products.MediaItem | null>;

  // Media gallery actions
  setSelectedImageIndex: (index: number) => void;
  nextImage: () => void;
  previousImage: () => void;

  // Product data exposed for media gallery components
  product: ReadOnlySignal<products.Product | null>;
  isLoading: ReadOnlySignal<boolean>;
  totalImages: ReadOnlySignal<number>;
  productName: ReadOnlySignal<string>;
}

export const ProductMediaGalleryServiceDefinition =
  defineService<ProductMediaGalleryServiceAPI>("productMediaGallery");

export const ProductMediaGalleryService = implementService.withConfig<{
  product: products.Product;
}>()(ProductMediaGalleryServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const selectedVariantService = getService(SelectedVariantServiceDefinition);
  const productService = getService(ProductServiceDefinition);

  // State signals
  const selectedImageIndex: Signal<number> = signalsService.signal(0 as any);

  // Computed values
  const selectedImage: ReadOnlySignal<products.MediaItem | null> =
    signalsService.computed<any>(() => {
      const prod = productService.product.get();
      const imageIndex = selectedImageIndex.get();

      if (!prod?.media?.items) return null;
      return prod.media.items[imageIndex] || null;
    });

  // Product data exposed through this service
  const product: ReadOnlySignal<products.Product | null> =
    productService.product;
  const isLoading: ReadOnlySignal<boolean> = productService.isLoading;

  const totalImages: ReadOnlySignal<number> = signalsService.computed(() => {
    const prod = productService.product.get();
    return prod?.media?.items?.length || 0;
  });

  const productName: ReadOnlySignal<string> = signalsService.computed(() => {
    const prod = productService.product.get();
    return prod?.name || "Product";
  });

  // Listen to variant changes and update image accordingly
  const subscribeToVariantChanges = () => {
    return selectedVariantService.selectedOptions.subscribe((options) => {
      const prod = productService.product.get();
      const media = prod?.media;

      if (
        !prod?.productOptions ||
        !media?.items?.length ||
        Object.keys(options).length === 0
      )
        return;

      // Find if any selected option has a matching media item
      Object.entries(options).find(([optionName, optionValue]) => {
        const productOption = prod.productOptions?.find(
          (opt) => opt.name === optionName
        );

        if (productOption) {
          const optionChoice = productOption.choices?.find((choice) => {
            const choiceValue =
              productOption.optionType === products.OptionType.color
                ? choice.description
                : choice.value;
            return choiceValue === optionValue;
          });

          // Check if this choice has associated media
          if (optionChoice && (optionChoice as any).media?.mainMedia?._id) {
            const imageIndex = media.items!.findIndex(
              (mediaItem) =>
                mediaItem._id === (optionChoice as any).media?.mainMedia?._id
            );

            if (imageIndex !== -1) {
              selectedImageIndex.set(imageIndex);
              return true; // Found a match, stop searching
            }
          }
        }
        return false;
      });
    });
  };

  // Set up subscription
  subscribeToVariantChanges();

  // Actions
  const setSelectedImageIndex = (index: number) => {
    const prod = productService.product.get();
    if (!prod?.media?.items) return;

    const maxIndex = prod.media.items.length - 1;
    const validIndex = Math.max(0, Math.min(index, maxIndex));
    selectedImageIndex.set(validIndex);
  };

  const nextImage = () => {
    const prod = productService.product.get();
    const currentIndex = selectedImageIndex.get();

    if (!prod?.media?.items) return;

    const nextIndex =
      currentIndex >= prod.media.items.length - 1 ? 0 : currentIndex + 1;
    selectedImageIndex.set(nextIndex);
  };

  const previousImage = () => {
    const prod = productService.product.get();
    const currentIndex = selectedImageIndex.get();

    if (!prod?.media?.items) return;

    const prevIndex =
      currentIndex <= 0 ? prod.media.items.length - 1 : currentIndex - 1;
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
