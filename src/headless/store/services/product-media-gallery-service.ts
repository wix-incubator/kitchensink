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

      const product = productService.product.get();
      const selectedChoices = selectedVariantService.selectedChoices?.get() || {};

       // Get images based on selected choices if available
      let selectedChoicesImages: string[] = [];
      
      Object.keys(selectedChoices).forEach((choiceKey) => {
        const productOption = product?.options?.find((option: any) => option.name === choiceKey)?.choicesSettings?.choices?.find((choice: any) => choice.name === selectedChoices[choiceKey]);
        if (productOption) {
          selectedChoicesImages.push(...(productOption?.linkedMedia?.map((media: any) => media.image) || []));
        }
      });

      if (selectedChoicesImages?.length) {
        return selectedChoicesImages.length;
      }

      return product?.media?.itemsInfo?.items?.length || 0;
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
