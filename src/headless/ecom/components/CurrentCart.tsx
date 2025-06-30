import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { CurrentCartServiceDefinition } from "../services/current-cart-service";
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
 * Props for Trigger headless component
 */
export interface TriggerProps {
  /** Render prop function that receives trigger data */
  children: (props: TriggerRenderProps) => React.ReactNode;
}

/**
 * Render props for Trigger component
 */
export interface TriggerRenderProps {
  /** Number of items in cart */
  itemCount: number;
  /** Whether cart has items */
  hasItems: boolean;
  /** Function to open cart */
  onOpen: () => void;
  /** Whether cart is currently loading */
  isLoading: boolean;
}

/**
 * Headless component for cart trigger with item count
 */
export const Trigger = (props: TriggerProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const itemCount = service.cartCount.get();
  const isLoading = service.isLoading.get();

  return props.children({
    itemCount,
    hasItems: itemCount > 0,
    onOpen: service.openCart,
    isLoading,
  });
};

/**
 * Props for Content headless component
 */
export interface ContentProps {
  /** Render prop function that receives content data */
  children: (props: ContentRenderProps) => React.ReactNode;
}

/**
 * Render props for Content component
 */
export interface ContentRenderProps {
  /** Whether cart content is open */
  isOpen: boolean;
  /** Function to close cart */
  onClose: () => void;
  /** Cart data */
  cart: currentCart.Cart | null;
  /** Whether cart is loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

/**
 * Headless component for cart content/modal
 */
export const Content = (props: ContentProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const isOpen = service.isOpen.get();
  const cart = service.cart.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();

  return props.children({
    isOpen,
    onClose: service.closeCart,
    cart,
    isLoading,
    error,
  });
};

/**
 * Props for Items headless component
 */
export interface ItemsProps {
  /** Render prop function that receives items data */
  children: (props: ItemsRenderProps) => React.ReactNode;
}

/**
 * Render props for Items component
 */
export interface ItemsRenderProps {
  /** Array of line items in cart */
  items: any[];
  /** Whether cart has items */
  hasItems: boolean;
  /** Total number of items */
  totalItems: number;
}

/**
 * Headless component for cart items collection
 */
export const Items = (props: ItemsProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const cart = service.cart.get();
  const items = cart?.lineItems || [];
  const totalItems = service.cartCount.get();

  return props.children({
    items,
    hasItems: items.length > 0,
    totalItems,
  });
};

/**
 * Props for Item headless component
 */
export interface ItemProps {
  /** Line item data */
  item: any;
  /** Render prop function that receives item data */
  children: (props: ItemRenderProps) => React.ReactNode;
}

/**
 * Render props for Item component
 */
export interface ItemRenderProps {
  /** Line item data */
  item: any | null;
  /** Current quantity */
  quantity: number;
  /** Product title */
  title: string;
  /** Product image URL */
  image: string | null;
  /** Line item price */
  price: string;
  /** Selected product options */
  selectedOptions: Array<{
    name: string;
    value: string | { name: string; code: string };
  }>;
  /** Function to increase quantity */
  onIncrease: () => Promise<void>;
  /** Function to decrease quantity */
  onDecrease: () => Promise<void>;
  /** Function to remove item */
  onRemove: () => Promise<void>;
  /** Whether item is loading */
  isLoading: boolean;
}

/**
 * Headless component for individual cart item
 */
export const Item = (props: ItemProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const cart = service.cart.get();
  const item = props.item;
  const isLoading = service.isLoading.get();

  if (!item) {
    const currency = cart?.currency || "USD";
    return props.children({
      item: null,
      quantity: 0,
      title: "",
      image: null,
      price: formatCurrency(0, currency),
      selectedOptions: [],
      onIncrease: async () => {},
      onDecrease: async () => {},
      onRemove: async () => {},
      isLoading: false,
    });
  }

  // Fix image URL access - properly handle null/undefined image
  let image: string | null = null;
  if (item.image) {
    try {
      image = media.getImageUrl(item.image).url;
    } catch (error) {
      console.warn("Failed to get image URL:", error);
      image = null;
    }
  }

  // Extract variant information from description lines
  const selectedOptions: Array<{
    name: string;
    value: string | { name: string; code: string };
  }> = [];

  if (item.descriptionLines) {
    item.descriptionLines.forEach((line: any) => {
      if (line.name?.original) {
        const optionName = line.name.original;

        if (line.colorInfo) {
          selectedOptions.push({
            name: optionName,
            value: {
              name: line.colorInfo.original,
              code: line.colorInfo.code,
            },
          });
        } else if (line.plainText) {
          selectedOptions.push({
            name: optionName,
            value: line.plainText.original,
          });
        }
      }
    });
  }

  // Calculate total price for this line item (unit price × quantity)
  const unitPrice = parseFloat(item.price?.amount || "0");
  const quantity = item.quantity || 0;
  const totalPrice = unitPrice * quantity;
  const currency = cart?.currency || "USD";

  // Format price with proper currency
  const formattedPrice = formatCurrency(totalPrice, currency);

  const lineItemId = item._id || "";

  return props.children({
    item,
    quantity,
    title: item.productName?.original || "",
    image,
    price: formattedPrice,
    selectedOptions,
    onIncrease: () => service.increaseLineItemQuantity(lineItemId),
    onDecrease: () => service.decreaseLineItemQuantity(lineItemId),
    onRemove: () => service.removeLineItem(lineItemId),
    isLoading,
  });
};

/**
 * Props for Summary headless component
 */
export interface SummaryProps {
  /** Render prop function that receives summary data */
  children: (props: SummaryRenderProps) => React.ReactNode;
}

/**
 * Render props for Summary component
 */
export interface SummaryRenderProps {
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
export const Summary = (props: SummaryProps) => {
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
 * Props for Clear headless component
 */
export interface ClearProps {
  /** Render prop function that receives clear action */
  children: (props: ClearRenderProps) => React.ReactNode;
}

/**
 * Render props for Clear component
 */
export interface ClearRenderProps {
  /** Function to clear all items from cart */
  onClear: () => Promise<void>;
  /** Whether cart has items to clear */
  hasItems: boolean;
  /** Whether clear action is loading */
  isLoading: boolean;
}

/**
 * Headless component for clearing the cart
 */
export const Clear = (props: ClearProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const itemCount = service.cartCount.get();
  const isLoading = service.isLoading.get();

  return props.children({
    onClear: service.clearCart,
    hasItems: itemCount > 0,
    isLoading,
  });
};

/**
 * Props for Checkout headless component
 */
export interface CheckoutProps {
  /** Render prop function that receives checkout data */
  children: (props: CheckoutRenderProps) => React.ReactNode;
}

/**
 * Render props for Checkout component
 */
export interface CheckoutRenderProps {
  /** Function to proceed to checkout */
  onProceed: () => Promise<void>;
  /** Whether checkout is available */
  canCheckout: boolean;
  /** Whether checkout action is loading */
  isLoading: boolean;
  /** Error message if checkout fails */
  error: string | null;
}

/**
 * Headless component for checkout action
 */
export const Checkout = (props: CheckoutProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const itemCount = service.cartCount.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();

  return props.children({
    onProceed: service.proceedToCheckout,
    canCheckout: itemCount > 0,
    isLoading,
    error,
  });
};

/**
 * Props for Notes headless component
 */
export interface NotesProps {
  /** Render prop function that receives notes data */
  children: (props: NotesRenderProps) => React.ReactNode;
}

/**
 * Render props for Notes component
 */
export interface NotesRenderProps {
  /** Current notes value */
  notes: string;
  /** Function to update notes */
  onNotesChange: (notes: string) => Promise<void>;
}

/**
 * Headless component for notes
 */
export const Notes = (props: NotesProps) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const notes = service.buyerNotes.get();

  return props.children({
    notes,
    onNotesChange: service.setBuyerNotes,
  });
};

export const CurrentCart = {
  Trigger,
  Content,
  Items,
  Item,
  Summary,
  Checkout,
  Clear,
  Notes,
} as const;
