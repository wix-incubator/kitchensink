import { useState } from "react";
import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { ProductModifiersServiceDefinition } from "../services/product-modifiers-service";
import { productsV3 } from "@wix/stores";

/**
 * Custom hook to safely get the modifiers service
 */
function useModifiersService() {
  try {
    return useService(ProductModifiersServiceDefinition) as ServiceAPI<typeof ProductModifiersServiceDefinition>;
  } catch {
    return null;
  }
}

/**
 * Props for Modifiers headless component
 */
export interface ModifiersProps {
  /** Render prop function that receives modifiers data */
  children: (props: ModifiersRenderProps) => React.ReactNode;
}

/**
 * Render props for Modifiers component
 */
export interface ModifiersRenderProps {
  /** Array of product modifiers */
  modifiers: productsV3.ConnectedModifier[];
  /** Whether product has modifiers */
  hasModifiers: boolean;
  /** Currently selected modifier values */
  selectedModifiers: Record<string, any>;
  /** Whether all required modifiers are filled */
  areAllRequiredModifiersFilled: boolean;
}

/**
 * Headless component for all product modifiers
 */
export const Modifiers = (props: ModifiersProps) => {
  const modifiersService = useModifiersService();

  if (!modifiersService) {
    return props.children({
      modifiers: [],
      hasModifiers: false,
      selectedModifiers: {},
      areAllRequiredModifiersFilled: true,
    });
  }

  const modifiers = modifiersService.modifiers.get();
  const hasModifiers = modifiersService.hasModifiers.get();
  const selectedModifiers = modifiersService.selectedModifiers.get();
  const areAllRequiredModifiersFilled = modifiersService.areAllRequiredModifiersFilled();

  return props.children({
    modifiers,
    hasModifiers,
    selectedModifiers,
    areAllRequiredModifiersFilled,
  });
};

/**
 * Props for Modifier headless component
 */
export interface ModifierProps {
  /** Product modifier data */
  modifier: productsV3.ConnectedModifier;
  /** Render prop function that receives modifier data */
  children: (props: ModifierRenderProps) => React.ReactNode;
}

/**
 * Render props for Modifier component
 */
export interface ModifierRenderProps {
  /** Modifier name */
  name: string;
  /** Modifier type */
  type: any;
  /** Whether this modifier is mandatory */
  mandatory: boolean;
  /** Array of choices for this modifier (for choice-based modifiers) */
  choices: productsV3.ConnectedModifierChoice[];
  /** Currently selected value for this modifier */
  selectedValue: any;
  /** Whether this modifier has choices */
  hasChoices: boolean;
  /** Whether this modifier is a free text type */
  isFreeText: boolean;
  /** Maximum characters for free text */
  maxChars?: number;
  /** Placeholder text for free text */
  placeholder?: string;
}

/**
 * Headless component for a specific product modifier
 */
export const Modifier = (props: ModifierProps) => {
  const modifiersService = useModifiersService();
  const { modifier } = props;
  
  const name = modifier.name || "";
  const type = modifier.modifierRenderType;
  const mandatory = modifier.mandatory || false;
  const choices = modifier.choicesSettings?.choices || [];
  const hasChoices = choices.length > 0;
  const isFreeText = type === "FREE_TEXT";
  const freeTextSettings = modifier.freeTextSettings;
  const maxChars = (freeTextSettings as any)?.maxLength;
  const placeholder = (freeTextSettings as any)?.placeholder;

  const selectedValue = modifiersService?.selectedModifiers.get()[name] || null;

  return props.children({
    name,
    type,
    mandatory,
    choices,
    selectedValue,
    hasChoices,
    isFreeText,
    maxChars,
    placeholder,
  });
};

/**
 * Props for ModifierChoice headless component
 */
export interface ChoiceProps {
  /** Product modifier data */
  modifier: productsV3.ConnectedModifier;
  /** Choice data */
  choice: productsV3.ConnectedModifierChoice;
  /** Render prop function that receives choice data */
  children: (props: ChoiceRenderProps) => React.ReactNode;
}

/**
 * Render props for ModifierChoice component
 */
export interface ChoiceRenderProps {
  /** Choice value to display */
  value: string;
  /** Choice description (for color options) */
  description: string | undefined;
  /** Whether this choice is currently selected */
  isSelected: boolean;
  /** Function to select this choice */
  onSelect: () => void;
  /** Modifier name */
  modifierName: string;
  /** Choice value */
  choiceValue: string;
  /** Color code for swatch choices */
  colorCode?: string;
}

/**
 * Headless component for individual modifier choice selection
 */
export const Choice = (props: ChoiceProps) => {
  const modifiersService = useModifiersService();
  const { modifier, choice } = props;

  const modifierName = modifier.name || "";
  const renderType = modifier.modifierRenderType;
  
  // For TEXT_CHOICES, use choice.key; for SWATCH_CHOICES, use choice.name
  const choiceValue = renderType === "TEXT_CHOICES" 
    ? ((choice as any).key || choice.name || "")
    : (choice.name || "");
    
  const value = choice.name || ""; // Display name is always choice.name
  const description = (choice as any).description;
  const colorCode = (choice as any).colorCode;
  
  const selectedValue = modifiersService?.getModifierValue(modifierName);
  const isSelected = selectedValue?.choiceValue === choiceValue;

  const onSelect = () => {
    modifiersService?.setModifierChoice(modifierName, choiceValue);
  };

  return props.children({
    value,
    description,
    isSelected,
    onSelect,
    modifierName,
    choiceValue,
    colorCode,
  });
};

/**
 * Props for ModifierFreeText headless component
 */
export interface FreeTextProps {
  /** Product modifier data */
  modifier: productsV3.ConnectedModifier;
  /** Render prop function that receives free text data */
  children: (props: FreeTextRenderProps) => React.ReactNode;
}

/**
 * Render props for ModifierFreeText component
 */
export interface FreeTextRenderProps {
  /** Current text value */
  value: string;
  /** Function to update text value */
  onChange: (value: string) => void;
  /** Whether this modifier is mandatory */
  mandatory: boolean;
  /** Maximum characters allowed */
  maxChars?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Character count */
  charCount: number;
  /** Whether character limit is exceeded */
  isOverLimit: boolean;
  /** Modifier name */
  modifierName: string;
}

/**
 * Headless component for free text modifier input
 */
export const FreeText = (props: FreeTextProps) => {
  const modifiersService = useModifiersService();
  const { modifier } = props;
  
  const modifierName = modifier.name || "";
  const mandatory = modifier.mandatory || false;
  const freeTextSettings = modifier.freeTextSettings;
  const maxChars = (freeTextSettings as any)?.maxLength;
  const placeholder = (freeTextSettings as any)?.placeholder;

  const selectedValue = modifiersService?.getModifierValue(modifierName);
  const value = selectedValue?.freeTextValue || "";
  const charCount = value.length;
  const isOverLimit = maxChars ? charCount > maxChars : false;

  const onChange = (newValue: string) => {
    if (maxChars && newValue.length > maxChars) return;
    modifiersService?.setModifierFreeText(modifierName, newValue);
  };

  return props.children({
    value,
    onChange,
    mandatory,
    maxChars,
    placeholder,
    charCount,
    isOverLimit,
    modifierName,
  });
};

/**
 * Props for ModifierToggleFreeText headless component  
 */
export interface ToggleFreeTextProps {
  /** Product modifier data */
  modifier: productsV3.ConnectedModifier;
  /** Render prop function that receives toggle data */
  children: (props: ToggleFreeTextRenderProps) => React.ReactNode;
}

/**
 * Render props for ModifierToggleFreeText component
 */
export interface ToggleFreeTextRenderProps {
  /** Whether the text input is shown */
  isTextInputShown: boolean;
  /** Function to toggle text input visibility */
  onToggle: () => void;
  /** Whether this modifier is mandatory */
  mandatory: boolean;
  /** Modifier name */
  modifierName: string;
}

/**
 * Headless component for toggling free text modifier input
 * Used for optional free text modifiers where a checkbox shows/hides the input
 */
export const ToggleFreeText = (props: ToggleFreeTextProps) => {
  const modifiersService = useModifiersService();
  const { modifier } = props;
  
  const modifierName = modifier.name || "";
  const mandatory = modifier.mandatory || false;
  const [isTextInputShown, setIsTextInputShown] = useState(mandatory);

  const onToggle = () => {
    const newState = !isTextInputShown;
    setIsTextInputShown(newState);
    
    if (!newState) {
      modifiersService?.clearModifier(modifierName);
    }
  };

  return props.children({
    isTextInputShown,
    onToggle,
    mandatory,
    modifierName,
  });
};
