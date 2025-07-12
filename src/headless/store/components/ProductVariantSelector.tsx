import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import { SelectedVariantServiceDefinition } from '../services/selected-variant-service';
import {
  type ConnectedOption,
  type ConnectedOptionChoice,
  InventoryAvailabilityStatus,
} from '@wix/auto_sdk_stores_products-v-3';

/**
 * Props for Options headless component
 */
export interface OptionsProps {
  /** Render prop function that receives options data */
  children: (props: OptionsRenderProps) => React.ReactNode;
}

/**
 * Render props for Options component
 */
export interface OptionsRenderProps {
  /** Array of product options */
  options: ConnectedOption[];
  /** Whether product has options */
  hasOptions: boolean;
  /** Currently selected choices */
  selectedChoices: Record<string, string>;
}

/**
 * Headless component for all product options
 * 
 * @component
 */
export const Options = (props: OptionsProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const options = variantService.productOptions.get();

  return props.children({
    options,
    hasOptions: options.length > 0,
    selectedChoices,
  });
};

/**
 * Props for Option headless component
 */
export interface OptionProps {
  /** Product option data */
  option: ConnectedOption;
  /** Render prop function that receives option data */
  children: (props: OptionRenderProps) => React.ReactNode;
}

/**
 * Render props for Option component
 */
export interface OptionRenderProps {
  /** Option name */
  name: string;
  /** Option type */
  type: any;
  /** Array of choices for this option */
  choices: ConnectedOptionChoice[];
  /** Currently selected value for this option */
  selectedValue: string | null;
  /** Whether this option has choices */
  hasChoices: boolean;
}

/**
 * Headless component for choices within a specific product option
 * 
 * @component
 */
export const Option = (props: OptionProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const { option } = props;

  const name = option.name || '';
  const choices = option.choicesSettings?.choices || [];
  const selectedValue = selectedChoices[name] || null;

  return props.children({
    name,
    type: option.optionRenderType,
    choices,
    selectedValue,
    hasChoices: choices.length > 0,
  });
};

/**
 * Props for Choice headless component
 */
export interface ChoiceProps {
  /** Product option data */
  option: ConnectedOption;
  /** Choice data */
  choice: ConnectedOptionChoice;
  /** Render prop function that receives choice data */
  children: (props: ChoiceRenderProps) => React.ReactNode;
}

/**
 * Render props for Choice component
 */
export interface ChoiceRenderProps {
  /** Choice value to display */
  value: string;
  /** Choice description (for color options) */
  description: string | undefined;
  /** Whether this choice is currently selected */
  isSelected: boolean;
  /** Whether this choice is visible */
  isVisible: boolean;
  /** Whether this choice is in stock */
  isInStock: boolean;
  /** Whether this choice is available for pre-order */
  isPreOrderEnabled: boolean;
  /** Function to select this choice */
  onSelect: () => void;
  /** Option name */
  optionName: string;
  /** Choice value */
  choiceValue: string;
}

/**
 * Headless component for individual choice selection
 * 
 * @component
 */
export const Choice = (props: ChoiceProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const { option, choice } = props;

  const optionName = option.name || '';
  const choiceValue = choice.name || '';

  const isSelected = selectedChoices[optionName] === choiceValue;

  // Check if this choice is available based on current selections
  const isVisible = variantService.isChoiceAvailable(optionName, choiceValue);

  // Check if this choice results in an in-stock variant
  const isInStock = variantService.isChoiceInStock(optionName, choiceValue);

  // Check if this choice is available for pre-order
  const isPreOrderEnabled = variantService.isChoicePreOrderEnabled(
    optionName,
    choiceValue
  );

  const value = choiceValue;

  const onSelect = () => {
    const newChoices = {
      ...selectedChoices,
      [optionName]: choiceValue,
    };
    variantService.setSelectedChoices(newChoices);
  };

  return props.children({
    value,
    description: undefined, // v3 choices don't have separate description field
    isSelected,
    isVisible,
    isInStock,
    isPreOrderEnabled,
    onSelect,
    optionName,
    choiceValue,
  });
};

/**
 * Props for Stock headless component
 */
export interface StockProps {
  /** Render prop function that receives stock data */
  children: (props: StockRenderProps) => React.ReactNode;
}

/**
 * Render props for Stock component
 */
export interface StockRenderProps {
  /** Whether product is in stock */
  inStock: boolean;
  /** Whether pre-order is enabled */
  isPreOrderEnabled: boolean;
  /** Raw inventory availability status */
  availabilityStatus: InventoryAvailabilityStatus | string;
  /** Whether stock tracking is enabled */
  trackInventory: boolean;
  /** Current variant id */
  currentVariantId: string | null;
  /** Available quantity */
  availableQuantity: number | null;
  /** Currently selected quantity */
  selectedQuantity: number;
  /** Function to increment quantity */
  incrementQuantity: () => void;
  /** Function to decrement quantity */
  decrementQuantity: () => void;
}

/**
 * Headless component for product stock status
 * 
 * @component
 */
export const Stock = (props: StockProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const inStock = variantService.isInStock.get();
  const isPreOrderEnabled = variantService.isPreOrderEnabled.get();
  const trackInventory = variantService.trackQuantity.get();
  const currentVariantId = variantService.selectedVariantId.get();
  const availableQuantity = variantService.quantityAvailable.get();
  const selectedQuantity = variantService.selectedQuantity.get();
  const currentVariant = variantService.currentVariant.get();
  const allVariantsAreOutOfStock = variantService.IsAllVariantsAreOutOfStock();

  // Return raw availability status - UI components will handle display conversion
  const availabilityStatus = inStock
    ? InventoryAvailabilityStatus.IN_STOCK
    : InventoryAvailabilityStatus.OUT_OF_STOCK;

  const incrementQuantity = () => {
    variantService.incrementQuantity();
  };

  const decrementQuantity = () => {
    variantService.decrementQuantity();
  };

  return props.children({
    inStock,
    availableQuantity,
    isPreOrderEnabled,
    currentVariantId,
    availabilityStatus,
    trackInventory,
    selectedQuantity,
    incrementQuantity,
    decrementQuantity,
  });
};

/**
 * Props for Reset headless component
 */
export interface ResetProps {
  /** Render prop function that receives reset data */
  children: (props: ResetRenderProps) => React.ReactNode;
}

/**
 * Render props for Reset component
 */
export interface ResetRenderProps {
  /** Function to reset all selections */
  onReset: () => void;
  /** Whether the reset button should be rendered */
  hasSelections: boolean;
}

/**
 * Headless component for resetting variant selections
 * 
 * @component
 */
export const Reset = (props: ResetProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const hasSelections = Object.keys(selectedChoices).length > 0;

  const onReset = () => {
    variantService.resetSelections();
  };

  return props.children({
    onReset,
    hasSelections,
  });
};
