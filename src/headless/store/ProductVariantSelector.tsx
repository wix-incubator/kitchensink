import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { SelectedVariantServiceDefinition } from "./selected-variant-service";
import { productsV3 } from "@wix/stores";

/**
 * Props for ProductOptions headless component
 */
export interface ProductOptionsProps {
  /** Render prop function that receives product options data */
  children: (props: ProductOptionsRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductOptions component
 */
export interface ProductOptionsRenderProps {
  /** Array of product options */
  options: productsV3.ConnectedOption[];
  /** Whether product has options */
  hasOptions: boolean;
  /** Currently selected choices (V3 terminology) */
  selectedChoices: Record<string, string>;
}

/**
 * Headless component for all product options
 */
export const ProductOptions = (props: ProductOptionsProps) => {
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
 * Props for ProductOptionChoices headless component
 */
export interface ProductOptionChoicesProps {
  /** Product option data */
  option: productsV3.ConnectedOption;
  /** Render prop function that receives option choices data */
  children: (props: ProductOptionChoicesRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductOptionChoices component
 */
export interface ProductOptionChoicesRenderProps {
  /** Option name */
  optionName: string;
  /** Option type */
  optionType: productsV3.ProductOptionRenderType | undefined;
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
export const ProductOptionChoices = (props: ProductOptionChoicesProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const { option } = props;

  const optionName = option.name || "";
  const choices = option.choicesSettings?.choices || [];
  const selectedValue = selectedChoices[optionName] || null;

  return props.children({
    optionName,
    optionType: option.optionRenderType,
    choices,
    selectedValue,
    hasChoices: choices.length > 0,
  });
};

/**
 * Props for ChoiceSelection headless component
 */
export interface ChoiceSelectionProps {
  /** Product option data */
  option: productsV3.ConnectedOption;
  /** Choice data */
  choice: productsV3.ConnectedOptionChoice;
  /** Render prop function that receives choice selection data */
  children: (props: ChoiceSelectionRenderProps) => React.ReactNode;
}

/**
 * Render props for ChoiceSelection component
 */
export interface ChoiceSelectionRenderProps {
  /** Choice value to display */
  displayValue: string;
  /** Choice description (for color options) */
  description: string | undefined;
  /** Whether this choice is currently selected */
  isSelected: boolean;
  /** Whether this choice is available for selection */
  isAvailable: boolean;
  /** Function to select this choice */
  selectChoice: () => void;
  /** Option name */
  optionName: string;
  /** Choice value */
  choiceValue: string;
}

/**
 * Headless component for individual choice selection
 */
export const ChoiceSelection = (props: ChoiceSelectionProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const { option, choice } = props;

  const optionName = option.name || "";
  const choiceValue = choice.name || "";

  const isSelected = selectedChoices[optionName] === choiceValue;

  // Check if this choice would result in an available variant
  const testChoices = {
    ...selectedChoices,
    [optionName]: choiceValue,
  };

  // Simple availability check - in a real implementation, this would check against actual variants
  const isAvailable = true; // Simplified for now

  const displayValue = choiceValue;

  const selectChoice = () => {
    variantService.setSelectedChoices(testChoices);
  };

  return props.children({
    displayValue,
    description: undefined, // v3 choices don't have separate description field
    isSelected,
    isAvailable,
    selectChoice,
    optionName,
    choiceValue,
  });
};

/**
 * Props for AddToCartTrigger headless component
 */
export interface AddToCartTriggerProps {
  /** Quantity to add (optional) */
  quantity?: number;
  /** Render prop function that receives add to cart data */
  children: (props: AddToCartTriggerRenderProps) => React.ReactNode;
}

/**
 * Render props for AddToCartTrigger component
 */
export interface AddToCartTriggerRenderProps {
  /** Function to add product to cart */
  addToCart: () => Promise<void>;
  /** Whether add to cart is available */
  canAddToCart: boolean;
  /** Whether add to cart is currently loading */
  isLoading: boolean;
  /** Current product price */
  price: string;
  /** Whether product is in stock */
  inStock: boolean;
  /** Error message if any */
  error: string | null;
}

/**
 * Headless component for add to cart trigger
 */
export const AddToCartTrigger = (props: AddToCartTriggerProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const price = variantService.currentPrice.get();
  const inStock = variantService.isInStock.get();
  const isLoading = variantService.isLoading.get();
  const error = variantService.error.get();

  const quantity = props.quantity || 1;
  const canAddToCart = inStock && !isLoading;

  const addToCart = async () => {
    await variantService.addToCart(quantity);
  };

  return props.children({
    addToCart,
    canAddToCart,
    isLoading,
    price,
    inStock,
    error,
  });
};

/**
 * Props for ProductPrice headless component
 */
export interface ProductPriceProps {
  /** Render prop function that receives product price data */
  children: (props: ProductPriceRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductPrice component
 */
export interface ProductPriceRenderProps {
  /** Current price (formatted) */
  price: string;
  /** Whether price is for a variant */
  isVariantPrice: boolean;
  /** Currency code */
  currency: string;
}

/**
 * Headless component for product price display
 */
export const ProductPrice = (props: ProductPriceProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const price = variantService.currentPrice.get();
  const currentVariant = variantService.currentVariant.get();
  const currency = variantService.currency.get();

  const isVariantPrice = !!currentVariant;

  return props.children({
    price,
    isVariantPrice,
    currency,
  });
};

/**
 * Props for StockStatus headless component
 */
export interface StockStatusProps {
  /** Render prop function that receives stock status data */
  children: (props: StockStatusRenderProps) => React.ReactNode;
}

/**
 * Render props for StockStatus component
 */
export interface StockStatusRenderProps {
  /** Whether product is in stock */
  inStock: boolean;
  /** Stock status message */
  status: string;
  /** Stock quantity (if available) */
  quantity: number | null;
  /** Whether stock tracking is enabled */
  trackInventory: boolean;
}

/**
 * Headless component for product stock status
 */
export const StockStatus = (props: StockStatusProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const inStock = variantService.isInStock.get();
  const currentVariant = variantService.currentVariant.get();
  const product = variantService.product.get();

  const trackInventory = false; // V3 API has different inventory structure
  const quantity = null; // Not directly available in v3 API

  const status = inStock ? "In Stock" : "Out of Stock";

  return props.children({
    inStock,
    status,
    quantity,
    trackInventory,
  });
};

// Namespace export for clean API
export const ProductVariantSelector = {
  ProductOptions,
  ProductOptionChoices,
  ChoiceSelection,
  AddToCartTrigger,
  ProductPrice,
  StockStatus,
} as const;
