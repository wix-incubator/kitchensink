import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import type { ReadOnlySignal } from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { currentCart, checkout } from "@wix/ecom";
import { redirects } from "@wix/redirects";

export interface CurrentCartServiceAPI {
  cart: Signal<currentCart.Cart | null>;
  isOpen: Signal<boolean>;
  cartCount: ReadOnlySignal<number>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  addToCart: (
    lineItems: currentCart.AddToCurrentCartRequest["lineItems"]
  ) => Promise<void>;
  removeLineItem: (lineItemId: string) => Promise<void>;
  updateLineItemQuantity: (
    lineItemId: string,
    quantity: number
  ) => Promise<void>;
  increaseLineItemQuantity: (lineItemId: string) => Promise<void>;
  decreaseLineItemQuantity: (lineItemId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => Promise<void>;
  proceedToCheckout: () => Promise<void>;
}

export const CurrentCartServiceDefinition =
  defineService<CurrentCartServiceAPI>("currentCart");

export const CurrentCartService = implementService.withConfig<{
  initialCart?: currentCart.Cart | null;
}>()(CurrentCartServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // State signals
  const cart: Signal<currentCart.Cart | null> = signalsService.signal(
    config.initialCart || (null as any)
  );
  const isOpen: Signal<boolean> = signalsService.signal(false as any);
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);

  // Computed values
  const cartCount: ReadOnlySignal<number> = signalsService.computed(() => {
    const currentCart = cart.get();
    if (!currentCart?.lineItems) return 0;
    return currentCart.lineItems.reduce(
      (acc: number, item: any) => acc + (item.quantity || 0),
      0
    );
  });

  // Actions
  const addToCart = async (
    lineItems: currentCart.AddToCurrentCartRequest["lineItems"]
  ) => {
    try {
      isLoading.set(true);
      error.set(null);

      const { cart: updatedCart } = await currentCart.addToCurrentCart({
        lineItems,
      });
      cart.set(updatedCart || null);
    } catch (err) {
      error.set(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      isLoading.set(false);
    }
  };

  const removeLineItem = async (lineItemId: string) => {
    try {
      isLoading.set(true);
      error.set(null);

      const { cart: updatedCart } =
        await currentCart.removeLineItemsFromCurrentCart([lineItemId]);
      cart.set(updatedCart || null);
    } catch (err) {
      error.set(err instanceof Error ? err.message : "Failed to remove item");
    } finally {
      isLoading.set(false);
    }
  };

  const updateLineItemQuantity = async (
    lineItemId: string,
    quantity: number
  ) => {
    try {
      isLoading.set(true);
      error.set(null);

      const { cart: updatedCart } =
        await currentCart.updateCurrentCartLineItemQuantity([
          {
            _id: lineItemId,
            quantity,
          },
        ]);
      cart.set(updatedCart || null);
    } catch (err) {
      error.set(
        err instanceof Error ? err.message : "Failed to update quantity"
      );
    } finally {
      isLoading.set(false);
    }
  };

  const increaseLineItemQuantity = async (lineItemId: string) => {
    const currentCart = cart.get();
    const lineItem = currentCart?.lineItems?.find(
      (item: any) => item._id === lineItemId
    );
    if (lineItem) {
      await updateLineItemQuantity(lineItemId, (lineItem.quantity || 0) + 1);
    }
  };

  const decreaseLineItemQuantity = async (lineItemId: string) => {
    const currentCart = cart.get();
    const lineItem = currentCart?.lineItems?.find(
      (item: any) => item._id === lineItemId
    );
    if (lineItem && (lineItem.quantity || 0) > 1) {
      await updateLineItemQuantity(lineItemId, (lineItem.quantity || 0) - 1);
    }
  };

  const openCart = () => {
    isOpen.set(true);
  };

  const closeCart = () => {
    isOpen.set(false);
  };

  const clearCart = async () => {
    try {
      isLoading.set(true);
      error.set(null);

      const currentCartData = cart.get();
      if (currentCartData?.lineItems?.length) {
        const lineItemIds = currentCartData.lineItems
          .map((item: any) => item._id!)
          .filter(Boolean);
        const { cart: updatedCart } =
          await currentCart.removeLineItemsFromCurrentCart(lineItemIds);
        cart.set(updatedCart || null);
      }
    } catch (err) {
      error.set(err instanceof Error ? err.message : "Failed to clear cart");
    } finally {
      isLoading.set(false);
    }
  };

  const proceedToCheckout = async () => {
    try {
      isLoading.set(true);
      error.set(null);

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
    } catch (err) {
      error.set(
        err instanceof Error ? err.message : "Failed to proceed to checkout"
      );
    } finally {
      isLoading.set(false);
    }
  };

  return {
    cart,
    isOpen,
    cartCount,
    isLoading,
    error,
    addToCart,
    removeLineItem,
    updateLineItemQuantity,
    increaseLineItemQuantity,
    decreaseLineItemQuantity,
    openCart,
    closeCart,
    clearCart,
    proceedToCheckout,
  };
});

export async function loadCurrentCartServiceConfig(): Promise<
  ServiceFactoryConfig<typeof CurrentCartService>
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
