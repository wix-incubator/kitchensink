import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import { SelectedVariantServiceDefinition } from '../services/selected-variant-service';
import { ProductModifiersServiceDefinition } from '../services/product-modifiers-service';
import { CurrentCartServiceDefinition } from '../../ecom/services/current-cart-service';

/**
 * Props for Actions headless component
 */
export interface ActionsProps {
  /** Quantity to add (optional) */
  quantity?: number;
  /** Render prop function that receives actions data */
  children: (props: ActionsRenderProps) => React.ReactNode;
}

/**
 * Render props for Actions component
 */
export interface ActionsRenderProps {
  /** Function to add product to cart */
  onAddToCart: () => Promise<void>;
  /** Function to buy now (clear cart, add product, proceed to checkout) */
  onBuyNow: () => Promise<void>;
  /** Function to open cart */
  onOpenCart: () => void;
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
  /** Pre-order message */
  preOrderMessage: string | null;
  /** Error message if any */
  error: string | null;
  /** Available quantity */
  availableQuantity: number | null;
}

/**
 * Headless component for product actions (add to cart, buy now)
 */
export const Actions = (props: ActionsProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const cartService = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

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
  const preOrderMessage = variantService.preOrderMessage.get();
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

  const onBuyNow = async () => {
    try {
      // Clear the cart first
      await cartService.clearCart();

      // Add the product to cart
      await onAddToCart();

      // Proceed to checkout
      await cartService.proceedToCheckout();
    } catch (error) {
      console.error('Buy now failed:', error);
      throw error;
    }
  };

  const onOpenCart = () => {
    cartService.openCart();
  };

  return props.children({
    onAddToCart,
    onBuyNow,
    onOpenCart,
    canAddToCart,
    isLoading,
    price,
    inStock,
    isPreOrderEnabled,
    preOrderMessage,
    error,
    availableQuantity,
  });
};
