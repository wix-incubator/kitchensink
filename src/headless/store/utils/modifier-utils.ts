import { productsV3 } from '@wix/stores';

/**
 * Helper function to check if render type supports choices
 */
export function isChoiceBasedRenderType(
  renderType: productsV3.ModifierRenderType | string
): boolean {
  return (
    renderType === productsV3.ModifierRenderType.SWATCH_CHOICES ||
    renderType === productsV3.ModifierRenderType.TEXT_CHOICES
  );
}

/**
 * Helper function to check if render type supports free text
 */
export function isFreeTextRenderType(
  renderType: productsV3.ModifierRenderType | string
): boolean {
  return renderType === productsV3.ModifierRenderType.FREE_TEXT;
}
