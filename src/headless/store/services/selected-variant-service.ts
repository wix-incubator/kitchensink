import { defineService, implementService } from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal, ReadOnlySignal } from "../../Signal";
import { productsV3, inventoryItemsV3 } from "@wix/stores";
import { CurrentCartServiceDefinition } from "../../ecom/services/current-cart-service";
import { ProductServiceDefinition } from "./product-service";
import { MediaGalleryServiceDefinition } from "../../media/services/media-gallery-service";

type V3Product = productsV3.V3Product;
type Variant = productsV3.Variant;

const fetchedVariants = {
  variants: [
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "11d9ed62-6471-4d68-a3c7-53d3a6a6d785",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "8",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "92ac92ea-b925-4025-8e02-872fc10f1a41",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Black",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "5fd77963-2756-4b0d-a353-5f7d387a1646",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "1",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: true,
        preorderEnabled: false,
      },
      _id: "cd44e966-0bdc-4b56-bbb8-0a758c382599",
    },
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "11d9ed62-6471-4d68-a3c7-53d3a6a6d785",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "8",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "92ac92ea-b925-4025-8e02-872fc10f1a41",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Black",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "ad743633-060a-4551-b070-6a01873f9524",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "2",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: false,
        preorderEnabled: false,
      },
      _id: "67726289-f8f6-43a5-9675-3657e6076ba5",
    },
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "11d9ed62-6471-4d68-a3c7-53d3a6a6d785",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "8",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "60d2c02b-8bff-4f03-aa66-a93b536116c4",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Cognac",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "5fd77963-2756-4b0d-a353-5f7d387a1646",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "1",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: false,
        preorderEnabled: false,
      },
      _id: "6c687066-6cd8-4469-ac88-962cb980c1b4",
    },
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "11d9ed62-6471-4d68-a3c7-53d3a6a6d785",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "8",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "60d2c02b-8bff-4f03-aa66-a93b536116c4",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Cognac",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "ad743633-060a-4551-b070-6a01873f9524",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "2",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: false,
        preorderEnabled: false,
      },
      _id: "839766e2-13e6-438e-8fb0-5bb71e3ba568",
    },
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "3853cc77-7cc3-4cc8-b0db-1c0175b99d6f",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "9",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "92ac92ea-b925-4025-8e02-872fc10f1a41",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Black",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "5fd77963-2756-4b0d-a353-5f7d387a1646",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "1",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: false,
        preorderEnabled: false,
      },
      _id: "64637e81-f70c-4f0c-aec1-92f3dc1b3ba8",
    },
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "3853cc77-7cc3-4cc8-b0db-1c0175b99d6f",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "9",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "92ac92ea-b925-4025-8e02-872fc10f1a41",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Black",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "ad743633-060a-4551-b070-6a01873f9524",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "2",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: false,
        preorderEnabled: false,
      },
      _id: "1285c600-a7bd-45a5-b088-d5215dbc7d63",
    },
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "3853cc77-7cc3-4cc8-b0db-1c0175b99d6f",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "9",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "60d2c02b-8bff-4f03-aa66-a93b536116c4",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Cognac",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "5fd77963-2756-4b0d-a353-5f7d387a1646",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "1",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: false,
        preorderEnabled: false,
      },
      _id: "f46394ab-08fb-4c97-851f-232f5af0eb49",
    },
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "3853cc77-7cc3-4cc8-b0db-1c0175b99d6f",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "9",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "60d2c02b-8bff-4f03-aa66-a93b536116c4",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Cognac",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "ad743633-060a-4551-b070-6a01873f9524",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "2",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: false,
        preorderEnabled: false,
      },
      _id: "d90b833a-b781-4908-b201-cde240ca6c7c",
    },
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "2c341d5e-cfae-403d-bcb4-55d6d20c9214",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "10",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "92ac92ea-b925-4025-8e02-872fc10f1a41",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Black",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "5fd77963-2756-4b0d-a353-5f7d387a1646",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "1",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: false,
        preorderEnabled: false,
      },
      _id: "1a0e21c4-e886-4faa-bfd9-0a15dde82342",
    },
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "2c341d5e-cfae-403d-bcb4-55d6d20c9214",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "10",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "92ac92ea-b925-4025-8e02-872fc10f1a41",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Black",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "ad743633-060a-4551-b070-6a01873f9524",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "2",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: false,
        preorderEnabled: false,
      },
      _id: "fb518278-982f-4399-8ebf-c8e796d7bd95",
    },
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "2c341d5e-cfae-403d-bcb4-55d6d20c9214",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "10",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "60d2c02b-8bff-4f03-aa66-a93b536116c4",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Cognac",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "5fd77963-2756-4b0d-a353-5f7d387a1646",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "1",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: false,
        preorderEnabled: false,
      },
      _id: "d0bc6ea8-18fd-435e-bd91-0026a24dac78",
    },
    {
      visible: true,
      choices: [
        {
          optionChoiceIds: {
            optionId: "c7647f03-2af1-4e78-96ea-373f5b563236",
            choiceId: "2c341d5e-cfae-403d-bcb4-55d6d20c9214",
          },
          optionChoiceNames: {
            optionName: "Size",
            choiceName: "10",
            renderType: "TEXT_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "ea9db20d-2e1a-4fe7-825f-b45a82a9d1e7",
            choiceId: "60d2c02b-8bff-4f03-aa66-a93b536116c4",
          },
          optionChoiceNames: {
            optionName: "Color",
            choiceName: "Cognac",
            renderType: "SWATCH_CHOICES",
          },
        },
        {
          optionChoiceIds: {
            optionId: "7bd46ae0-6a02-48c0-8c04-3a3feb491314",
            choiceId: "ad743633-060a-4551-b070-6a01873f9524",
          },
          optionChoiceNames: {
            optionName: "Something",
            choiceName: "2",
            renderType: "TEXT_CHOICES",
          },
        },
      ],
      price: {
        actualPrice: {
          amount: "0",
        },
      },
      physicalProperties: {},
      inventoryStatus: {
        inStock: false,
        preorderEnabled: false,
      },
      _id: "888b44ba-3f21-4819-b045-eff2f78db923",
    },
  ],
};

export interface SelectedVariantServiceAPI {
  selectedQuantity: Signal<number>;
  selectedChoices: Signal<Record<string, string>>;
  selectedVariantId: ReadOnlySignal<string | null>;
  currentVariant: ReadOnlySignal<productsV3.Variant | null>;
  currentPrice: ReadOnlySignal<string>;
  currentCompareAtPrice: ReadOnlySignal<string | null>;
  isInStock: ReadOnlySignal<boolean>;
  isPreOrderEnabled: ReadOnlySignal<boolean>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  variants: Signal<productsV3.Variant[]>;
  options: Signal<Record<string, string[]>>;
  basePrice: Signal<number>;
  discountPrice: Signal<number | null>;
  isOnSale: Signal<boolean | null>;
  quantityAvailable: Signal<number | null>;
  trackQuantity: Signal<boolean>;
  productId: Signal<string>;
  ribbonLabel: Signal<string | null>;

  product: ReadOnlySignal<productsV3.V3Product | null>;
  productOptions: ReadOnlySignal<productsV3.ConnectedOption[]>;
  currency: ReadOnlySignal<string>;

  selectedVariant: () => productsV3.Variant | null;
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;

  setSelectedChoices: (choices: Record<string, string>) => void;
  addToCart: (
    quantity?: number,
    modifiers?: Record<string, any>
  ) => Promise<void>;
  setOption: (group: string, value: string) => void;
  // Quantity management methods
  setSelectedQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  selectVariantById: (id: string) => void;
  resetSelections: () => void;

  // New methods for smart variant selection
  getAvailableChoicesForOption: (optionName: string) => string[];
  getChoiceInfo: (
    optionName: string,
    choiceValue: string
  ) => { isAvailable: boolean; isInStock: boolean; isPreOrderEnabled: boolean };
  isChoiceAvailable: (optionName: string, choiceValue: string) => boolean;
  isChoiceInStock: (optionName: string, choiceValue: string) => boolean;
  isChoicePreOrderEnabled: (optionName: string, choiceValue: string) => boolean;
  hasAnySelections: () => boolean;
}

export const SelectedVariantServiceDefinition =
  defineService<SelectedVariantServiceAPI>("selectedVariant");

export const SelectedVariantService = implementService.withConfig<{}>()(
  SelectedVariantServiceDefinition,
  ({ getService }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const cartService = getService(CurrentCartServiceDefinition);
    const productService = getService(ProductServiceDefinition);
    const mediaService = getService(MediaGalleryServiceDefinition);

    const selectedChoices: Signal<Record<string, string>> =
      signalsService.signal({} as any);

    const initialProduct = productService.product.get();

    signalsService.effect(() => {
      const product = productService.product.get();
      const selectedChoicesValue = selectedChoices.get() || {};
      let mediaToDisplay: productsV3.ProductMedia[] = [];

      const productItemsImages =
        product?.media?.itemsInfo?.items?.map((item) => item).filter(Boolean) ??
        [];

      if (productItemsImages.length) {
        mediaToDisplay = productItemsImages;
      } else if (product?.media?.main) {
        mediaToDisplay = [product.media.main];
      }

      // Get images based on selected choices if available
      let selectedChoicesImages: productsV3.ProductMedia[] = [];

      Object.keys(selectedChoicesValue).forEach((choiceKey) => {
        const productOption = product?.options
          ?.find((option: any) => option.name === choiceKey)
          ?.choicesSettings?.choices?.find(
            (choice: any) => choice.name === selectedChoicesValue[choiceKey]
          );
        if (productOption) {
          selectedChoicesImages.push(...(productOption.linkedMedia ?? []));
        }
      });

      if (selectedChoicesImages?.length) {
        mediaToDisplay = selectedChoicesImages;
      }

      mediaService.setMediaToDisplay(mediaToDisplay ?? []);
    });

    const parsePrice = (amount?: string | null): number => {
      if (!amount) return 0;
      const parsed = parseFloat(amount);
      return isNaN(parsed) ? 0 : parsed;
    };

    const processVariantChoices = (
      variant: Variant
    ): Record<string, string> => {
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

    const updateVariantInventoryQuantities = async (
      variantId: string | null | undefined,
      inStock: boolean,
      preOrderEnabled: boolean
    ) => {
      if (!variantId) return;

      try {
        // Use the correct Wix inventoryItemsV3.queryInventoryItems() API
        const queryResult = await inventoryItemsV3
          .queryInventoryItems()
          .eq("variantId", variantId)
          .find();

        const inventoryItem = queryResult.items?.[0];
        const isTrackingQuantity = inventoryItem?.trackQuantity ?? false;
        trackQuantity.set(isTrackingQuantity);

        if (!inventoryItem || !isTrackingQuantity) {
          quantityAvailable.set(null);
          return;
        }

        if (inStock && inventoryItem?.quantity) {
          quantityAvailable.set(inventoryItem.quantity);
        } else if (preOrderEnabled && inventoryItem.preorderInfo?.limit) {
          quantityAvailable.set(inventoryItem.preorderInfo.limit);
        } else {
          quantityAvailable.set(null);
        }
      } catch (error) {
        console.error("Failed to fetch inventory quantity:", error);
        // Fallback on error
        quantityAvailable.set(null);
        trackQuantity.set(false);
      }
    };

    const updateQuantityFromVariant = (variant: productsV3.Variant | null) => {
      if (variant) {
        const inStock = variant.inventoryStatus?.inStock ?? true;
        const preOrderEnabled =
          variant.inventoryStatus?.preorderEnabled ?? false;

        // update the quantity available and tracking insication from the inventory API
        updateVariantInventoryQuantities(variant._id, inStock, preOrderEnabled);
      } else {
        quantityAvailable.set(0);
        trackQuantity.set(false);
      }
    };

    const isLoading: Signal<boolean> = signalsService.signal(false as any);
    const error: Signal<string | null> = signalsService.signal(null as any);

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
    const quantityAvailable: Signal<number | null> = signalsService.signal(
      null as any
    );
    const trackQuantity: Signal<boolean> = signalsService.signal(false as any);
    const selectedQuantity: Signal<number> = signalsService.signal(1 as any);
    const productId: Signal<string> = signalsService.signal("" as any);
    const sku: Signal<string> = signalsService.signal("" as any);
    const ribbonLabel: Signal<string | null> = signalsService.signal(
      null as any
    );

    const v3Product: Signal<V3Product | null> = signalsService.signal(
      initialProduct as any
    );

    const init = (currentProduct: V3Product | null) => {
      if (currentProduct) {
        v3Product.set(currentProduct);
        productId.set(currentProduct._id || "");
        ribbonLabel.set(currentProduct.ribbon?.name || null);

        const actualPrice = currentProduct.actualPriceRange?.minValue?.amount;
        const compareAtPrice =
          currentProduct.compareAtPriceRange?.minValue?.amount;

        basePrice.set(parsePrice(actualPrice));
        discountPrice.set(compareAtPrice ? parsePrice(compareAtPrice) : null);
        isOnSale.set(
          !!compareAtPrice &&
            parsePrice(compareAtPrice) > parsePrice(actualPrice)
        );

        if (currentProduct.options) {
          const optionsMap: Record<string, string[]> = {};
          currentProduct.options.forEach((option: any) => {
            if (option.name && option.choicesSettings?.choices) {
              optionsMap[option.name] = option.choicesSettings.choices.map(
                (choice: any) => choice.name || ""
              );
            }
          });
          options.set(optionsMap);
        }

        if (currentProduct.variantsInfo?.variants) {
          variants.set(currentProduct.variantsInfo.variants);

          if (currentProduct.variantsInfo.variants.length > 0) {
            updateQuantityFromVariant(currentProduct.variantsInfo.variants[0]);
          }
        } else {
          if (currentProduct.variantSummary!.variantCount! > 1) {
            variants.set(fetchedVariants.variants as any);
            if (fetchedVariants.variants.length > 0) {
              updateQuantityFromVariant(fetchedVariants.variants[0] as any);
            }
          } else {
            const singleVariant: productsV3.Variant = {
              _id: "default",
              visible: true,
              choices: [],
              price: {
                actualPrice: initialProduct.actualPriceRange?.minValue,
                compareAtPrice: initialProduct.compareAtPriceRange?.minValue,
              },
              inventoryStatus: {
                inStock:
                  initialProduct.inventory?.availabilityStatus === "IN_STOCK" ||
                  initialProduct.inventory?.availabilityStatus ===
                    "PARTIALLY_OUT_OF_STOCK",
                preorderEnabled:
                  initialProduct.inventory?.preorderStatus === "ENABLED",
              },
            };
            variants.set([singleVariant]);
            updateQuantityFromVariant(singleVariant);
          }
        }
      }
    };

    signalsService.effect(() => {
      const currentProduct = productService.product.get();
      init(currentProduct);
    });

    const currentVariant: ReadOnlySignal<productsV3.Variant | null> =
      signalsService.computed<any>((() => {
        const prod = v3Product.get();
        const choices = selectedChoices.get();

        if (!prod?.variantsInfo?.variants) return null;

        return (
          prod.variantsInfo.variants.find((variant: any) => {
            const variantChoices = processVariantChoices(variant);

            if (
              Object.keys(choices).length !== Object.keys(variantChoices).length
            )
              return false;
            return Object.entries(choices).every(
              ([optionName, optionValue]) => {
                return variantChoices[optionName] === optionValue;
              }
            );
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

      return rawAmount ? `$${rawAmount}` : "";
    });

    const currentCompareAtPrice: ReadOnlySignal<string | null> =
      signalsService.computed(() => {
        const variant = currentVariant.get();
        const prod = v3Product.get();

        // Try to get formatted compare-at price first
        if (variant?.price?.compareAtPrice?.formattedAmount) {
          return variant.price.compareAtPrice.formattedAmount;
        }

        if (prod?.compareAtPriceRange?.minValue?.formattedAmount) {
          return prod.compareAtPriceRange.minValue.formattedAmount;
        }

        // Fallback: create our own formatted price from amount
        let rawAmount = null;

        if (variant?.price?.compareAtPrice?.amount) {
          rawAmount = variant.price.compareAtPrice.amount;
        } else if (prod?.compareAtPriceRange?.minValue?.amount) {
          rawAmount = prod.compareAtPriceRange.minValue.amount;
        }

        return rawAmount ? `$${rawAmount}` : null;
      });

    const isInStock: ReadOnlySignal<boolean> = signalsService.computed(() => {
      const variant = currentVariant.get();

      if (variant) {
        return variant.inventoryStatus?.inStock ?? false;
      } else {
        return false;
      }
    });

    const isPreOrderEnabled: ReadOnlySignal<boolean> = signalsService.computed(
      () => {
        const variant = currentVariant.get();
        return variant?.inventoryStatus?.preorderEnabled ?? false;
      }
    );

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

    const selectedVariant = (): productsV3.Variant | null => {
      const variantId = selectedVariantId.get();
      const variantsList = variants.get();
      return variantsList.find((v) => v._id === variantId) || null;
    };

    const finalPrice = (): number => {
      const discount = discountPrice.get();
      const base = basePrice.get();
      return discount !== null ? discount : base;
    };

    const isLowStock = (threshold: number = 5): boolean => {
      return false;
    };

    const setSelectedChoices = (choices: Record<string, string>) => {
      selectedChoices.set(choices);
      selectedQuantity.set(1); // Reset quantity when choices change
      const matchingVariant = findVariantByChoices(variants.get(), choices);
      updateQuantityFromVariant(matchingVariant);
    };

    const addToCart = async (
      quantity: number = 1,
      modifiers?: Record<string, any>
    ) => {
      try {
        isLoading.set(true);
        error.set(null);

        const prod = v3Product.get();
        const variant = currentVariant.get();

        if (!prod?._id) {
          throw new Error("Product not found");
        }

        // Build catalog reference with modifiers if provided
        const catalogReference: any = {
          catalogItemId: prod._id,
          appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e",
          options: variant?._id
            ? {
                variantId: variant._id,
                preOrderRequested: !!variant?.inventoryStatus?.preorderEnabled,
              }
            : undefined,
        };

        // Transform and add modifiers to catalog reference if they exist
        if (modifiers && Object.keys(modifiers).length > 0) {
          const options: Record<string, string> = {};
          const customTextFields: Record<string, string> = {};

          // Get product modifiers to determine types and keys
          const productModifiers = prod.modifiers || [];

          Object.values(modifiers).forEach((modifierValue: any) => {
            const modifierName = modifierValue.modifierName;
            const productModifier = productModifiers.find(
              (m) => m.name === modifierName
            );

            if (!productModifier) return;

            const renderType = productModifier.modifierRenderType;

            if (
              renderType === "TEXT_CHOICES" ||
              renderType === "SWATCH_CHOICES"
            ) {
              // For choice modifiers, use the modifier key and choice value
              const modifierKey = (productModifier as any).key || modifierName;
              if (modifierValue.choiceValue) {
                options[modifierKey] = modifierValue.choiceValue;
              }
            } else if (renderType === "FREE_TEXT") {
              // For free text modifiers, use the freeTextSettings key
              const freeTextKey =
                (productModifier.freeTextSettings as any)?.key || modifierName;
              if (modifierValue.freeTextValue) {
                customTextFields[freeTextKey] = modifierValue.freeTextValue;
              }
            }
          });

          // Add formatted modifiers to catalog reference
          if (Object.keys(options).length > 0) {
            catalogReference.options = {
              ...catalogReference.options,
              options,
            };
          }

          if (Object.keys(customTextFields).length > 0) {
            catalogReference.options = {
              ...catalogReference.options,
              customTextFields,
            };
          }
        }

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

    const setOption = (group: string, value: string) => {
      const currentChoices = selectedChoices.get();
      const newChoices = { ...currentChoices, [group]: value };
      setSelectedChoices(newChoices);
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

    const resetSelections = () => {
      selectedChoices.set({});
      selectedQuantity.set(1); // Reset quantity when resetting selections
    };

    // Quantity management methods
    const setSelectedQuantity = (quantity: number) => {
      const maxQuantity = quantityAvailable.get();
      const validQuantity = Math.max(1, Math.min(quantity, maxQuantity || 999));
      selectedQuantity.set(validQuantity);
    };

    const incrementQuantity = () => {
      const current = selectedQuantity.get();
      const maxQuantity = quantityAvailable.get();
      const newQuantity = Math.min(current + 1, maxQuantity || 999);
      selectedQuantity.set(newQuantity);
    };

    const decrementQuantity = () => {
      const current = selectedQuantity.get();
      const newQuantity = Math.max(1, current - 1);
      selectedQuantity.set(newQuantity);
    };

    // New methods for smart variant selection
    const getAvailableChoicesForOption = (optionName: string): string[] => {
      const currentChoices = selectedChoices.get();
      const variantsList = variants.get();

      // Get all possible choices for this option that result in valid variants
      const availableChoices = new Set<string>();

      variantsList.forEach((variant) => {
        const variantChoices = processVariantChoices(variant);

        // Check if this variant matches all currently selected choices (except for the option we're checking)
        const matchesOtherChoices = Object.entries(currentChoices)
          .filter(([key]) => key !== optionName)
          .every(([key, value]) => variantChoices[key] === value);

        if (matchesOtherChoices && variantChoices[optionName]) {
          availableChoices.add(variantChoices[optionName]);
        }
      });

      return Array.from(availableChoices);
    };

    // Core method that provides both availability and stock info efficiently
    const getChoiceInfo = (
      optionName: string,
      choiceValue: string
    ): {
      isAvailable: boolean;
      isInStock: boolean;
      isPreOrderEnabled: boolean;
    } => {
      // Create hypothetical choices with this choice selected
      const currentChoices = selectedChoices.get();
      const hypotheticalChoices = {
        ...currentChoices,
        [optionName]: choiceValue,
      };

      // Get all variants and find one that matches these choices
      const variantsList = variants.get();
      const matchingVariant = variantsList.find((variant) => {
        if (!variant.choices) return false;

        const variantChoices: Record<string, string> = {};
        for (const choice of variant.choices) {
          if (
            choice.optionChoiceNames?.optionName &&
            choice.optionChoiceNames?.choiceName
          ) {
            variantChoices[choice.optionChoiceNames.optionName] =
              choice.optionChoiceNames.choiceName;
          }
        }

        // Check if this variant matches our hypothetical choices
        return Object.entries(hypotheticalChoices).every(
          ([key, value]) => variantChoices[key] === value
        );
      });

      const isAvailable = !!matchingVariant;
      const isInStock = matchingVariant?.inventoryStatus?.inStock === true;
      const isPreOrderEnabled =
        matchingVariant?.inventoryStatus?.preorderEnabled === true;

      return { isAvailable, isInStock, isPreOrderEnabled };
    };

    // Simplified methods using the core getChoiceInfo
    const isChoiceAvailable = (
      optionName: string,
      choiceValue: string
    ): boolean => {
      return getChoiceInfo(optionName, choiceValue).isAvailable;
    };

    const isChoiceInStock = (
      optionName: string,
      choiceValue: string
    ): boolean => {
      return getChoiceInfo(optionName, choiceValue).isInStock;
    };

    const isChoicePreOrderEnabled = (
      optionName: string,
      choiceValue: string
    ): boolean => {
      return getChoiceInfo(optionName, choiceValue).isPreOrderEnabled;
    };

    const hasAnySelections = (): boolean => {
      const currentChoices = selectedChoices.get();
      return Object.keys(currentChoices).length > 0;
    };

    return {
      selectedChoices,
      selectedVariantId,
      currentVariant,
      currentPrice,
      currentCompareAtPrice,
      isInStock,
      isPreOrderEnabled,
      isLoading,
      error,

      variants,
      options,
      basePrice,
      discountPrice,
      isOnSale,
      quantityAvailable,
      trackQuantity,
      selectedQuantity,
      productId,
      ribbonLabel,

      setSelectedChoices,
      addToCart,

      setOption,
      selectVariantById,
      resetSelections,

      // New methods for smart variant selection
      getAvailableChoicesForOption,
      getChoiceInfo,
      isChoiceAvailable,
      isChoiceInStock,
      isChoicePreOrderEnabled,
      hasAnySelections,

      // Quantity management methods
      setSelectedQuantity,
      incrementQuantity,
      decrementQuantity,

      selectedVariant,
      finalPrice,
      isLowStock,

      product,
      productOptions,
      currency,
    };
  }
);
