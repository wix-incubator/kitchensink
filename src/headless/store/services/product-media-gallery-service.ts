import { defineService, implementService } from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import { productsV3 } from "@wix/stores";
import type { ReadOnlySignal, Signal } from "../../Signal";
import { ProductServiceDefinition } from "./product-service";
import { SelectedVariantServiceDefinition } from "./selected-variant-service";

export interface ProductMediaGalleryServiceAPI {
  selectedImageIndex: Signal<number>;
  relevantImages: ReadOnlySignal<string[]>;

  product: ReadOnlySignal<productsV3.V3Product | null>;
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
  ({ getService }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const selectedVariantService = getService(SelectedVariantServiceDefinition);
    const productService = getService(ProductServiceDefinition);

    const selectedImageIndex: Signal<number> = signalsService.signal(0 as any);

    const relevantImages: ReadOnlySignal<string[]> = signalsService.computed(
      () => {
        const product = productService.product.get();
        const selectedChoices =
          selectedVariantService.selectedChoices?.get() || {};

        // Get images based on selected choices if available
        let selectedChoicesImages: string[] = [];

        Object.keys(selectedChoices).forEach((choiceKey) => {
          const productOption = product?.options
            ?.find((option: any) => option.name === choiceKey)
            ?.choicesSettings?.choices?.find(
              (choice: any) => choice.name === selectedChoices[choiceKey]
            );
          if (productOption) {
            selectedChoicesImages.push(
              ...(productOption?.linkedMedia?.map(
                (media: any) => media.image
              ) || [])
            );
          }
        });

        if (selectedChoicesImages?.length) {
          return selectedChoicesImages;
        }

        const productItemsImages = product?.media?.itemsInfo?.items
          ?.map((item: any) => item.image)
          .filter(Boolean);
        if (productItemsImages?.length) {
          return productItemsImages;
        }

        if (product?.media?.main) {
          return [product.media.main.image];
        }

        return [];
      }
    );

    const product: ReadOnlySignal<productsV3.V3Product | null> =
      productService.product;

    const totalImages: ReadOnlySignal<number> = signalsService.computed(() => {
      return relevantImages.get().length;
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
      const images = relevantImages.get();
      if (!images.length) return;

      const maxIndex = images.length - 1;
      const validIndex = Math.max(0, Math.min(index, maxIndex));
      selectedImageIndex.set(validIndex);
    };

    const nextImage = () => {
      const images = relevantImages.get();
      const currentIndex = selectedImageIndex.get();

      if (!images.length) return;

      const nextIndex =
        currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
      selectedImageIndex.set(nextIndex);
    };

    const previousImage = () => {
      const images = relevantImages.get();
      const currentIndex = selectedImageIndex.get();

      if (!images.length) return;

      const prevIndex =
        currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
      selectedImageIndex.set(prevIndex);
    };

    return {
      selectedImageIndex,
      relevantImages,

      setSelectedImageIndex,
      nextImage,
      previousImage,

      product,
      totalImages,
      productName,
    };
  }
);
