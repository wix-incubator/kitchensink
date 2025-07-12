import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal, ReadOnlySignal } from '../../Signal';
import {
  ModifierRenderType,
  type ConnectedModifier,
  type V3Product,
} from '@wix/auto_sdk_stores_products-v-3';
import { ProductServiceDefinition } from './product-service';

export interface ModifierValue {
  modifierName: string;
  choiceValue?: string; // For SWATCH_CHOICES and TEXT_CHOICES
  freeTextValue?: string; // For FREE_TEXT
}

export interface ProductModifiersServiceAPI {
  modifiers: ReadOnlySignal<ConnectedModifier[]>;
  selectedModifiers: Signal<Record<string, ModifierValue>>;
  hasModifiers: ReadOnlySignal<boolean>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  setModifierChoice: (modifierName: string, choiceValue: string) => void;
  setModifierFreeText: (modifierName: string, freeTextValue: string) => void;
  clearModifier: (modifierName: string) => void;
  clearAllModifiers: () => void;
  getModifierValue: (modifierName: string) => ModifierValue | null;
  isModifierRequired: (modifierName: string) => boolean;
  hasRequiredModifiers: () => boolean;
  areAllRequiredModifiersFilled: () => boolean;
}

export const ProductModifiersServiceDefinition =
  defineService<ProductModifiersServiceAPI>('productModifiers');

export const ProductModifiersService = implementService.withConfig()(
  ProductModifiersServiceDefinition,
  ({ getService }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const productService = getService(ProductServiceDefinition);

    const selectedModifiers: Signal<Record<string, ModifierValue>> =
      signalsService.signal({} as any);
    const isLoading: Signal<boolean> = signalsService.signal(false as any);
    const error: Signal<string | null> = signalsService.signal(null as any);

    // Extract modifiers from product
    const modifiers = signalsService.computed(() => {
      const configProduct = productService.product.get();
      return (configProduct?.modifiers || []) as any;
    }) as unknown as ReadOnlySignal<ConnectedModifier[]>;

    const hasModifiers: ReadOnlySignal<boolean> = signalsService.computed(
      () => {
        const mods = modifiers.get();
        return mods.length > 0;
      }
    );

    const setModifierChoice = (modifierName: string, choiceValue: string) => {
      const current = selectedModifiers.get();
      selectedModifiers.set({
        ...current,
        [modifierName]: {
          modifierName,
          choiceValue,
        },
      });
    };

    const setModifierFreeText = (
      modifierName: string,
      freeTextValue: string
    ) => {
      const current = selectedModifiers.get();
      selectedModifiers.set({
        ...current,
        [modifierName]: {
          modifierName,
          freeTextValue,
        },
      });
    };

    const clearModifier = (modifierName: string) => {
      const current = selectedModifiers.get();
      const updated = { ...current };
      delete updated[modifierName];
      selectedModifiers.set(updated);
    };

    const clearAllModifiers = () => {
      selectedModifiers.set({});
    };

    const getModifierValue = (modifierName: string): ModifierValue | null => {
      const current = selectedModifiers.get();
      return current[modifierName] || null;
    };

    const isModifierRequired = (modifierName: string): boolean => {
      const mods = modifiers.get();
      const modifier = mods.find(m => m.name === modifierName);
      return modifier?.mandatory || false;
    };

    const hasRequiredModifiers = (): boolean => {
      const mods = modifiers.get();
      return mods.some(m => m.mandatory);
    };

    const areAllRequiredModifiersFilled = (): boolean => {
      const mods = modifiers.get();
      const current = selectedModifiers.get();

      return mods.every(modifier => {
        if (!modifier.mandatory) return true;

        const selectedValue = current[modifier.name || ''];
        if (!selectedValue) return false;

        // Check based on modifier type
        const renderType = modifier.modifierRenderType;
        if (!renderType) return false;

        if (
          renderType === ModifierRenderType.SWATCH_CHOICES ||
          renderType === ModifierRenderType.TEXT_CHOICES
        ) {
          return !!selectedValue.choiceValue;
        } else if (renderType === ModifierRenderType.FREE_TEXT) {
          return (
            !!selectedValue.freeTextValue &&
            selectedValue.freeTextValue.trim() !== ''
          );
        }

        return false;
      });
    };

    return {
      modifiers,
      selectedModifiers,
      hasModifiers,
      isLoading,
      error,

      setModifierChoice,
      setModifierFreeText,
      clearModifier,
      clearAllModifiers,
      getModifierValue,
      isModifierRequired,
      hasRequiredModifiers,
      areAllRequiredModifiersFilled,
    };
  }
);

export function createProductModifiersServiceConfig(
  product: V3Product
): ServiceFactoryConfig<typeof ProductModifiersService> {
  return {
    product,
  };
}
