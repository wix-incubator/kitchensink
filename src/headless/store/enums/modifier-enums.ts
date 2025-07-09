/**
 * Enum for product modifier render types
 */
export enum ModifierRenderType {
  SWATCH_CHOICES = 'SWATCH_CHOICES',
  TEXT_CHOICES = 'TEXT_CHOICES',
  FREE_TEXT = 'FREE_TEXT',
  DROPDOWN = 'DROPDOWN',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
}

/**
 * Enum for modifier input types
 */
export enum ModifierInputType {
  CHOICE = 'CHOICE',
  FREE_TEXT = 'FREE_TEXT',
  NUMERIC = 'NUMERIC',
  DATE = 'DATE',
  TIME = 'TIME',
}

/**
 * Enum for modifier validation types
 */
export enum ModifierValidationType {
  REQUIRED = 'REQUIRED',
  OPTIONAL = 'OPTIONAL',
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_LENGTH = 'MAX_LENGTH',
  PATTERN = 'PATTERN',
}

/**
 * Helper function to check if render type supports choices
 */
export function isChoiceBasedRenderType(
  renderType: ModifierRenderType
): boolean {
  return (
    renderType === ModifierRenderType.SWATCH_CHOICES ||
    renderType === ModifierRenderType.TEXT_CHOICES ||
    renderType === ModifierRenderType.DROPDOWN ||
    renderType === ModifierRenderType.CHECKBOX ||
    renderType === ModifierRenderType.RADIO
  );
}

/**
 * Helper function to check if render type supports free text
 */
export function isFreeTextRenderType(renderType: ModifierRenderType): boolean {
  return renderType === ModifierRenderType.FREE_TEXT;
}

/**
 * Helper function to determine the input type based on render type
 */
export function getInputTypeForRenderType(
  renderType: ModifierRenderType
): ModifierInputType {
  if (isChoiceBasedRenderType(renderType)) {
    return ModifierInputType.CHOICE;
  }
  if (isFreeTextRenderType(renderType)) {
    return ModifierInputType.FREE_TEXT;
  }
  return ModifierInputType.CHOICE; // Default fallback
}
