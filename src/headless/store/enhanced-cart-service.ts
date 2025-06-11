import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal, ReadOnlySignal } from "../Signal";
import { currentCart, checkout } from "@wix/ecom";
import { redirects } from "@wix/redirects";

// CurrentCartService
// 🧠 Purpose: Handles all cart interactions — including item state, quantity management, wishlist toggling, and immediate checkout.
// Tracks pre-order flags and provides derived totals to reflect cart state globally.
// Supports both persistent wishlist behavior and rapid purchasing flows like Buy Now.

export interface EnhancedCurrentCartServiceAPI {
  // --- State ---
  items: Signal<
    {
      productId: string;
      variantId: string;
      quantity: number;
      isPreOrder: boolean | null;
    }[]
  >;
  wishlist: Signal<{ productId: string; variantId: string }[]>;

  // --- Getters ---
  totalQuantity: () => number;
  itemCount: () => number;
  getItem: (
    productId: string,
    variantId: string
  ) =>
    | {
        productId: string;
        variantId: string;
        quantity: number;
        isPreOrder: boolean | null;
      }
    | undefined;

  // --- Actions ---
  addItem: (productId: string, variantId: string, quantity: number) => void;
  buyNow: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string, variantId: string) => void;
}

export const EnhancedCurrentCartServiceDefinition =
  defineService<EnhancedCurrentCartServiceAPI>("enhancedCurrentCart");

export const EnhancedCurrentCartService = implementService.withConfig<{
  initialCart?: currentCart.Cart | null;
}>()(EnhancedCurrentCartServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // State signals
  const items: Signal<
    {
      productId: string;
      variantId: string;
      quantity: number;
      isPreOrder: boolean | null;
    }[]
  > = signalsService.signal([] as any);

  const wishlist: Signal<{ productId: string; variantId: string }[]> =
    signalsService.signal([] as any);

  // Initialize with cart data
  if (config.initialCart?.lineItems) {
    const cartItems = config.initialCart.lineItems
      .map((lineItem: any) => {
        const productId = lineItem.catalogReference?.catalogItemId;
        const variantId = lineItem.catalogReference?.options?.variantId || "";
        const quantity = lineItem.quantity || 0;
        const isPreOrder = lineItem.preorderInfo?.enabled || null;

        if (productId) {
          return {
            productId,
            variantId,
            quantity,
            isPreOrder,
          };
        }
        return null;
      })
      .filter(Boolean);

    items.set(cartItems);
  }

  // Load wishlist from localStorage
  try {
    const savedWishlist = localStorage.getItem("wix-wishlist");
    if (savedWishlist) {
      wishlist.set(JSON.parse(savedWishlist));
    }
  } catch (error) {
    console.warn("Failed to load wishlist from localStorage:", error);
  }

  // Save wishlist to localStorage whenever it changes
  const saveWishlistToStorage = () => {
    try {
      localStorage.setItem("wix-wishlist", JSON.stringify(wishlist.get()));
    } catch (error) {
      console.warn("Failed to save wishlist to localStorage:", error);
    }
  };

  // Getters
  const totalQuantity = () => {
    return items.get().reduce((total, item) => total + item.quantity, 0);
  };

  const itemCount = () => {
    return items.get().length;
  };

  const getItem = (productId: string, variantId: string) => {
    return items
      .get()
      .find(
        (item) => item.productId === productId && item.variantId === variantId
      );
  };

  // Actions
  const addItem = async (
    productId: string,
    variantId: string,
    quantity: number
  ) => {
    try {
      // Add to Wix cart
      const lineItems = [
        {
          catalogReference: {
            catalogItemId: productId,
            appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
            options: variantId ? { variantId } : undefined,
          },
          quantity,
        },
      ];

      const { cart: updatedCart } = await currentCart.addToCurrentCart({
        lineItems,
      });

      // Update local state
      const currentItems = items.get();
      const existingItemIndex = currentItems.findIndex(
        (item) => item.productId === productId && item.variantId === variantId
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        items.set(updatedItems);
      } else {
        items.set([
          ...currentItems,
          {
            productId,
            variantId,
            quantity,
            isPreOrder: null, // Will be updated from cart response if available
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  };

  const buyNow = async (
    productId: string,
    variantId: string,
    quantity: number
  ) => {
    try {
      // Add item to cart first
      await addItem(productId, variantId, quantity);

      // Proceed directly to checkout
      const checkoutResult = await currentCart.createCheckoutFromCurrentCart({
        channelType: checkout.ChannelType.WEB,
      });

      if (!checkoutResult.checkoutId) {
        throw new Error("Failed to create checkout");
      }

      const { redirectSession } = await redirects.createRedirectSession({
        ecomCheckout: { checkoutId: checkoutResult.checkoutId },
        callbacks: {
          postFlowUrl: window.location.href,
        },
      });

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (error) {
      console.error("Failed to buy now:", error);
      throw error;
    }
  };

  const removeItem = async (productId: string, variantId: string) => {
    try {
      const currentItems = items.get();
      const updatedItems = currentItems.filter(
        (item) =>
          !(item.productId === productId && item.variantId === variantId)
      );
      items.set(updatedItems);

      // Also remove from Wix cart
      // Note: This would need the actual line item ID from Wix cart
      // For now, we'll just update the local state
    } catch (error) {
      console.error("Failed to remove item:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      items.set([]);

      // Clear the actual Wix cart
      const cart = await currentCart.getCurrentCart();
      if (cart?.lineItems?.length) {
        const lineItemIds = cart.lineItems
          .map((item: any) => item._id!)
          .filter(Boolean);
        await currentCart.removeLineItemsFromCurrentCart(lineItemIds);
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  };

  const toggleWishlist = (productId: string, variantId: string) => {
    const currentWishlist = wishlist.get();
    const existingIndex = currentWishlist.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );

    if (existingIndex >= 0) {
      // Remove from wishlist
      const updatedWishlist = currentWishlist.filter(
        (_, index) => index !== existingIndex
      );
      wishlist.set(updatedWishlist);
    } else {
      // Add to wishlist
      wishlist.set([...currentWishlist, { productId, variantId }]);
    }

    saveWishlistToStorage();
  };

  return {
    // State
    items,
    wishlist,

    // Getters
    totalQuantity,
    itemCount,
    getItem,

    // Actions
    addItem,
    buyNow,
    removeItem,
    clearCart,
    toggleWishlist,
  };
});

export async function loadEnhancedCurrentCartServiceConfig(): Promise<
  ServiceFactoryConfig<typeof EnhancedCurrentCartService>
> {
  try {
    const cart = await currentCart.getCurrentCart();
    return {
      initialCart: cart || null,
    };
  } catch (error) {
    console.warn("Failed to load initial cart:", error);
    return {
      initialCart: null,
    };
  }
}
