import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { SelectedVariantServiceDefinition } from "../services/selected-variant-service";
import { ProductModifiersServiceDefinition } from "../services/product-modifiers-service";
import { productsV3 } from "@wix/stores";

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
  options: productsV3.ConnectedOption[];
  /** Whether product has options */
  hasOptions: boolean;
  /** Currently selected choices */
  selectedChoices: Record<string, string>;
}

/**
 * Headless component for all product options
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
  option: productsV3.ConnectedOption;
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
  choices: productsV3.ConnectedOptionChoice[];
  /** Currently selected value for this option */
  selectedValue: string | null;
  /** Whether this option has choices */
  hasChoices: boolean;
}

/**
 * Headless component for choices within a specific product option
 */
export const Option = (props: OptionProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const { option } = props;

  const name = option.name || "";
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
  option: productsV3.ConnectedOption;
  /** Choice data */
  choice: productsV3.ConnectedOptionChoice;
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
 */
export const Choice = (props: ChoiceProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const { option, choice } = props;

  const optionName = option.name || "";
  const choiceValue = choice.name || "";

  const isSelected = selectedChoices[optionName] === choiceValue;

  // Check if this choice is available based on current selections
  const isVisible = variantService.isChoiceAvailable(optionName, choiceValue);
  
  // Check if this choice results in an in-stock variant
  const isInStock = variantService.isChoiceInStock(optionName, choiceValue);
  
  // Check if this choice is available for pre-order
  const isPreOrderEnabled = variantService.isChoicePreOrderEnabled(optionName, choiceValue);

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
 * Props for Trigger headless component
 */
export interface TriggerProps {
  /** Quantity to add (optional) */
  quantity?: number;
  /** Render prop function that receives trigger data */
  children: (props: TriggerRenderProps) => React.ReactNode;
}

/**
 * Render props for Trigger component
 */
export interface TriggerRenderProps {
  /** Function to add product to cart */
  onAddToCart: () => Promise<void>;
  /** Whether add to cart is available */
  canAddToCart: boolean;
  /** Whether add to cart is currently loading */
  isLoading: boolean;
  /** Current variant price */
  price: string;
  /** Whether variant is in stock */
  inStock: boolean;
  /** Whether pre-order is enabled */
  isPreOrderEnabled: boolean;
  /** Error message if any */
  error: string | null;
  /** Available quantity */
  availableQuantity: number | null;
}

/**
 * Headless component for add to cart trigger
 */
export const Trigger = (props: TriggerProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  // Try to get modifiers service - it may not exist for all products
  let modifiersService: ServiceAPI<
    typeof ProductModifiersServiceDefinition
  > | null = null;
  try {
    modifiersService = useService(
      ProductModifiersServiceDefinition
    ) as ServiceAPI<typeof ProductModifiersServiceDefinition>;
  } catch {
    // Modifiers service not available for this product
    modifiersService = null;
  }

  const price = variantService.currentPrice.get();
  const inStock = variantService.isInStock.get();
  const isPreOrderEnabled = variantService.isPreOrderEnabled.get();
  const isLoading = variantService.isLoading.get();
  const error = variantService.error.get();
  const availableQuantity = variantService.quantityAvailable.get();
  const quantity = variantService.selectedQuantity.get();

  // Check if all required modifiers are filled
  const areAllRequiredModifiersFilled = modifiersService
    ? modifiersService.areAllRequiredModifiersFilled()
    : true; // If no modifiers service, assume no required modifiers

  const canAddToCart =
    (inStock || isPreOrderEnabled) &&
    !isLoading &&
    areAllRequiredModifiersFilled;

  const onAddToCart = async () => {
    // Get modifiers data if available
    let modifiersData: Record<string, any> | undefined;
    if (modifiersService) {
      const selectedModifiers = modifiersService.selectedModifiers.get();
      if (Object.keys(selectedModifiers).length > 0) {
        modifiersData = selectedModifiers;
      }
    }

    await variantService.addToCart(quantity, modifiersData);
  };

  return props.children({
    onAddToCart,
    canAddToCart,
    isLoading,
    price,
    inStock,
    isPreOrderEnabled,
    error,
    availableQuantity,
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
  /** Stock status message */
  status: string;
  /** Whether stock tracking is enabled */
  trackInventory: boolean;
  /** Current variant id */
  currentVariantId: string | null;
  /** Available quantity */
  availableQuantity: number | null;
}

/**
 * Headless component for product stock status
 */
export const Stock = (props: StockProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const inStock = variantService.isInStock.get();
  const isPreOrderEnabled = variantService.isPreOrderEnabled.get();
  const currentVariantId = variantService.selectedVariantId.get();
  const availableQuantity = variantService.quantityAvailable.get();

  const trackInventory = false; // V3 API has different inventory structure

  // Determine status based on stock and pre-order availability
  let status: string;
  if (inStock) {
    status = "In Stock";
  } else if (isPreOrderEnabled) {
    status = "Available for Pre-Order";
  } else {
    status = "Out of Stock";
  }

  return props.children({
    inStock,
    availableQuantity,
    isPreOrderEnabled,
    currentVariantId,
    status,
    trackInventory,
  });
};
