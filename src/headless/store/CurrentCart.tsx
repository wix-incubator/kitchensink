import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { CurrentCartServiceDefinition } from "./current-cart-service";
import { currentCart } from "@wix/ecom";
import { media } from "@wix/sdk";

/**
 * Helper function to format currency properly
 */
function formatCurrency(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    // Fallback if currency code is invalid
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

/**
 * Props for CartIcon headless component
 */
export interface CartIconProps {
  /** Render prop function that receives cart icon data */
  children: (props: CartIconRenderProps) => React.ReactNode;
}

/**
 * Render props for CartIcon component
 */
export interface CartIconRenderProps {
  /** Number of items in cart */
  itemCount: number;
  /** Whether cart has items */
  hasItems: boolean;
  /** Function to open cart */
  openCart: () => void;
  /** Whether cart is currently loading */
  isLoading: boolean;
}

/**
 * Headless component for cart icon with item count
 */
export const CartIcon = (props: CartIconProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const itemCount = service.cartCount.get();
  const isLoading = service.isLoading.get();

  return props.children({
    itemCount,
    hasItems: itemCount > 0,
    openCart: service.openCart,
    isLoading,
  });
};

/**
 * Props for CartModal headless component
 */
export interface CartModalProps {
  /** Render prop function that receives cart modal data */
  children: (props: CartModalRenderProps) => React.ReactNode;
}

/**
 * Render props for CartModal component
 */
export interface CartModalRenderProps {
  /** Whether cart modal is open */
  isOpen: boolean;
  /** Function to close cart */
  closeCart: () => void;
  /** Cart data */
  cart: currentCart.Cart | null;
  /** Whether cart is loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

/**
 * Headless component for cart modal/drawer
 */
export const CartModal = (props: CartModalProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const isOpen = service.isOpen.get();
  const cart = service.cart.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();

  return props.children({
    isOpen,
    closeCart: service.closeCart,
    cart,
    isLoading,
    error,
  });
};

/**
 * Props for CartLineItems headless component
 */
export interface CartLineItemsProps {
  /** Render prop function that receives line items data */
  children: (props: CartLineItemsRenderProps) => React.ReactNode;
}

/**
 * Render props for CartLineItems component
 */
export interface CartLineItemsRenderProps {
  /** Array of line items in cart */
  lineItems: any[];
  /** Whether cart has items */
  hasItems: boolean;
  /** Total number of items */
  totalItems: number;
}

/**
 * Headless component for cart line items
 */
export const CartLineItems = (props: CartLineItemsProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const cart = service.cart.get();
  const lineItems = cart?.lineItems || [];
  const totalItems = service.cartCount.get();

  return props.children({
    lineItems,
    hasItems: lineItems.length > 0,
    totalItems,
  });
};

/**
 * Props for CartLineItem headless component
 */
export interface CartLineItemProps {
  /** Line item ID */
  lineItemId: string;
  /** Render prop function that receives line item data */
  children: (props: CartLineItemRenderProps) => React.ReactNode;
}

/**
 * Render props for CartLineItem component
 */
export interface CartLineItemRenderProps {
  /** Line item data */
  lineItem: any | null;
  /** Current quantity */
  quantity: number;
  /** Product name */
  productName: string;
  /** Product image URL */
  imageUrl: string | null;
  /** Line item price */
  price: string;
  /** Function to increase quantity */
  increaseQuantity: () => Promise<void>;
  /** Function to decrease quantity */
  decreaseQuantity: () => Promise<void>;
  /** Function to remove item */
  removeItem: () => Promise<void>;
  /** Whether item is loading */
  isLoading: boolean;
}

/**
 * Headless component for individual cart line item
 */
export const CartLineItem = (props: CartLineItemProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const cart = service.cart.get();
  const lineItem = cart?.lineItems?.find(
    (item: any) => item._id === props.lineItemId
  );
  const isLoading = service.isLoading.get();

  if (!lineItem) {
    const currency = cart?.currency || "USD";
    return props.children({
      lineItem: null,
      quantity: 0,
      productName: "",
      imageUrl: null,
      price: formatCurrency(0, currency),
      increaseQuantity: async () => {},
      decreaseQuantity: async () => {},
      removeItem: async () => {},
      isLoading: false,
    });
  }

  // Fix image URL access - check multiple possible paths
  let imageUrl = media.getImageUrl(lineItem.image || "").url;

  // Calculate total price for this line item (unit price × quantity)
  const unitPrice = parseFloat(lineItem.price?.amount || "0");
  const quantity = lineItem.quantity || 0;
  const totalPrice = unitPrice * quantity;
  const currency = cart?.currency || "USD";

  // Format price with proper currency
  const formattedPrice = formatCurrency(totalPrice, currency);

  return props.children({
    lineItem,
    quantity,
    productName: lineItem.productName?.original || "",
    imageUrl,
    price: formattedPrice,
    increaseQuantity: () => service.increaseLineItemQuantity(props.lineItemId),
    decreaseQuantity: () => service.decreaseLineItemQuantity(props.lineItemId),
    removeItem: () => service.removeLineItem(props.lineItemId),
    isLoading,
  });
};

/**
 * Props for CartSummary headless component
 */
export interface CartSummaryProps {
  /** Render prop function that receives cart summary data */
  children: (props: CartSummaryRenderProps) => React.ReactNode;
}

/**
 * Render props for CartSummary component
 */
export interface CartSummaryRenderProps {
  /** Cart subtotal */
  subtotal: string;
  /** Cart total */
  total: string;
  /** Currency code */
  currency: string;
  /** Total number of items */
  itemCount: number;
  /** Whether checkout is available */
  canCheckout: boolean;
}

/**
 * Headless component for cart summary/totals
 */
export const CartSummary = (props: CartSummaryProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const cart = service.cart.get();
  const itemCount = service.cartCount.get();

  // Calculate totals manually since cart.totals doesn't exist
  const subtotalAmount =
    cart?.lineItems?.reduce((acc: number, item: any) => {
      const itemPrice = parseFloat(item.price?.amount || "0");
      const quantity = item.quantity || 0;
      return acc + itemPrice * quantity;
    }, 0) || 0;

  const currency = cart?.currency || "USD";
  const subtotal = formatCurrency(subtotalAmount, currency);
  const total = subtotal; // For now, total = subtotal (no taxes/shipping calculated)

  return props.children({
    subtotal,
    total,
    currency,
    itemCount,
    canCheckout: itemCount > 0,
  });
};

/**
 * Props for ClearCart headless component
 */
export interface ClearCartProps {
  /** Render prop function that receives clear cart action */
  children: (props: ClearCartRenderProps) => React.ReactNode;
}

/**
 * Render props for ClearCart component
 */
export interface ClearCartRenderProps {
  /** Function to clear all items from cart */
  clearCart: () => Promise<void>;
  /** Whether cart has items to clear */
  hasItems: boolean;
  /** Whether clear action is loading */
  isLoading: boolean;
}

/**
 * Headless component for clearing the cart
 */
export const ClearCart = (props: ClearCartProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const itemCount = service.cartCount.get();
  const isLoading = service.isLoading.get();

  return props.children({
    clearCart: service.clearCart,
    hasItems: itemCount > 0,
    isLoading,
  });
};

/**
 * Props for CheckoutButton headless component
 */
export interface CheckoutButtonProps {
  /** Render prop function that receives checkout button data */
  children: (props: CheckoutButtonRenderProps) => React.ReactNode;
}

/**
 * Render props for CheckoutButton component
 */
export interface CheckoutButtonRenderProps {
  /** Function to proceed to checkout */
  proceedToCheckout: () => Promise<void>;
  /** Whether checkout is available */
  canCheckout: boolean;
  /** Whether checkout action is loading */
  isLoading: boolean;
  /** Error message if checkout fails */
  error: string | null;
}

/**
 * Headless component for checkout button
 */
export const CheckoutButton = (props: CheckoutButtonProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const itemCount = service.cartCount.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();

  return props.children({
    proceedToCheckout: service.proceedToCheckout,
    canCheckout: itemCount > 0,
    isLoading,
    error,
  });
};

// Namespace export for clean API
export const CurrentCart = {
  CartIcon,
  CartModal,
  CartLineItems,
  CartLineItem,
  CartSummary,
  CheckoutButton,
  ClearCart,
} as const;
