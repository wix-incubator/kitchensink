import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal, ReadOnlySignal } from "../Signal";
import { products } from "@wix/stores";

// ProductGalleryService
// 🧠 Purpose: Manages dynamic image gallery behavior, including syncing selected product variant with specific images and allowing user-driven image navigation.
// Enables image selection either manually or programmatically based on variant selection.
// Maintains state of currently displayed image and allows fine-grained control over how variants are visually represented.

export interface ProductGalleryServiceAPI {
  // --- State ---
  images: Signal<string[]>;
  selectedImageIndex: Signal<number>;
  variantImageMap: Signal<Record<string, number>>;

  // --- Getters ---
  currentImage: () => string;
  variantMappedImage: (variantId: string) => string;

  // --- Actions ---
  loadImages: (images: string[]) => void;
  setImageIndex: (index: number) => void;
  resetGallery: () => void;
  mapVariantToImage: (variantId: string, index: number) => void;
}

export const ProductGalleryServiceDefinition =
  defineService<ProductGalleryServiceAPI>("productGallery");

export const ProductGalleryService = implementService.withConfig<{
  product: products.Product;
}>()(ProductGalleryServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // Extract product information
  const product = config.product;

  // State signals
  const images: Signal<string[]> = signalsService.signal([] as any);
  const selectedImageIndex: Signal<number> = signalsService.signal(0 as any);
  const variantImageMap: Signal<Record<string, number>> = signalsService.signal(
    {} as any
  );

  // Initialize with product data
  if (product) {
    // Extract images from product media
    const imageUrls: string[] = [];
    if (product.media?.items) {
      product.media.items.forEach((item) => {
        if (item.image?.url) {
          imageUrls.push(item.image.url);
        } else if (item.video?.thumbnailUrl) {
          imageUrls.push(item.video.thumbnailUrl);
        }
      });
    }
    images.set(imageUrls);

    // Create variant to image mapping
    const variantImageMapping: Record<string, number> = {};
    if (product.variants && product.productOptions) {
      product.variants.forEach((variant) => {
        if (variant.choices && variant._id) {
          // Try to find matching media for this variant
          Object.entries(variant.choices).forEach(
            ([optionName, optionValue]) => {
              const productOption = product.productOptions?.find(
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
                if (
                  optionChoice &&
                  (optionChoice as any).media?.mainMedia?._id
                ) {
                  const imageIndex = product.media?.items?.findIndex(
                    (mediaItem) =>
                      mediaItem._id ===
                      (optionChoice as any).media?.mainMedia?._id
                  );

                  if (imageIndex !== undefined && imageIndex !== -1) {
                    variantImageMapping[variant._id] = imageIndex;
                  }
                }
              }
            }
          );
        }
      });
    }
    variantImageMap.set(variantImageMapping);
  }

  // Getters
  const currentImage = () => {
    const imagesList = images.get();
    const index = selectedImageIndex.get();
    return imagesList[index] || "";
  };

  const variantMappedImage = (variantId: string) => {
    const imagesList = images.get();
    const mapping = variantImageMap.get();
    const index = mapping[variantId];
    return index !== undefined ? imagesList[index] || "" : "";
  };

  // Actions
  const loadImages = (newImages: string[]) => {
    images.set(newImages);
    selectedImageIndex.set(0);
  };

  const setImageIndex = (index: number) => {
    const imagesList = images.get();
    if (index >= 0 && index < imagesList.length) {
      selectedImageIndex.set(index);
    }
  };

  const resetGallery = () => {
    selectedImageIndex.set(0);
  };

  const mapVariantToImage = (variantId: string, index: number) => {
    const mapping = variantImageMap.get();
    const imagesList = images.get();

    if (index >= 0 && index < imagesList.length) {
      variantImageMap.set({
        ...mapping,
        [variantId]: index,
      });
    }
  };

  return {
    // State
    images,
    selectedImageIndex,
    variantImageMap,

    // Getters
    currentImage,
    variantMappedImage,

    // Actions
    loadImages,
    setImageIndex,
    resetGallery,
    mapVariantToImage,
  };
});

export async function loadProductGalleryServiceConfig(
  productSlug: string
): Promise<ServiceFactoryConfig<typeof ProductGalleryService>> {
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
