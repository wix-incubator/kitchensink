import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal, ReadOnlySignal } from "../../Signal";
import { productsV3 } from "@wix/stores";
import { SelectedVariantServiceDefinition } from "./selected-variant-service";
import { ProductServiceDefinition } from "./product-service";

export interface ProductMediaGalleryServiceAPI {
  selectedImageIndex: Signal<number>;
  selectedImage: ReadOnlySignal<any | null>;

  product: ReadOnlySignal<productsV3.V3Product | null>;
  isLoading: ReadOnlySignal<boolean>;
  totalImages: ReadOnlySignal<number>;
  productName: ReadOnlySignal<string>;

  setSelectedImageIndex: (index: number) => void;
  nextImage: () => void;
  previousImage: () => void;
}

export const ProductMediaGalleryServiceDefinition =
  defineService<ProductMediaGalleryServiceAPI>("productMediaGallery");

export const ProductMediaGalleryService = implementService.withConfig<{}>()(
  ProductMediaGalleryServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const selectedVariantService = getService(SelectedVariantServiceDefinition);
    const productService = getService(ProductServiceDefinition);

    const selectedImageIndex: Signal<number> = signalsService.signal(0 as any);

    const selectedImage: ReadOnlySignal<any | null> =
      signalsService.computed<any>(() => {
        const prod = productService.product.get();
        const imageIndex = selectedImageIndex.get();

        if (imageIndex === 0 && prod?.media?.main) {
          return prod.media.main;
        }

        return null;
      });

    const product: ReadOnlySignal<productsV3.V3Product | null> =
      productService.product;
    const isLoading: ReadOnlySignal<boolean> = productService.isLoading;

    const totalImages: ReadOnlySignal<number> = signalsService.computed(() => {
      const prod = productService.product.get();
      return prod?.media?.main ? 1 : 0;
    });

    const productName: ReadOnlySignal<string> = signalsService.computed(() => {
      const prod = productService.product.get();
      return prod?.name || "Product";
    });

    const subscribeToVariantChanges = () => {
      return selectedVariantService.selectedChoices.subscribe(() => {
        selectedImageIndex.set(0);
      });
    };

    subscribeToVariantChanges();

    const setSelectedImageIndex = (index: number) => {
      const validIndex = index === 0 ? 0 : 0;
      selectedImageIndex.set(validIndex);
    };

    const nextImage = () => {
      selectedImageIndex.set(0);
    };

    const previousImage = () => {
      selectedImageIndex.set(0);
    };

    return {
      selectedImageIndex,
      selectedImage,

      setSelectedImageIndex,
      nextImage,
      previousImage,

      product,
      isLoading,
      totalImages,
      productName,
    };
  }
);

export async function loadProductMediaGalleryServiceConfig(
  productSlug: string
): Promise<ServiceFactoryConfig<typeof ProductMediaGalleryService>> {
  try {
    // No need to fetch product data here since this service depends on ProductServiceDefinition
    // which already loads the product data. We just need to return an empty config.
    return {};
  } catch (error) {
    console.error("Failed to load product media gallery config:", error);
    throw error;
  }
}
