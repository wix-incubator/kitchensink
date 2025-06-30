import React from "react";
import { CurrentCartServiceDefinition } from "../../../headless/ecom/services/current-cart-service";

interface BaseButtonProps {
  disabled: boolean;
  isLoading: boolean;
  onClick: () => Promise<void>;
  className?: string;
}

interface AddToCartButtonProps extends BaseButtonProps {
  isPreOrderEnabled: boolean;
  inStock: boolean;
}

interface BuyNowButtonProps {
  disabled: boolean;
  isLoading: boolean;
  servicesManager: any;
  onAddToCart: () => Promise<void>;
  className?: string;
}

interface ProductActionButtonsProps {
  onAddToCart: () => Promise<void>;
  canAddToCart: boolean;
  isLoading: boolean;
  isPreOrderEnabled: boolean;
  inStock: boolean;
  servicesManager: any;
  onShowSuccessMessage: (show: boolean) => void;
}

// Add to Cart / Pre Order Button Component
const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  disabled,
  isLoading,
  onClick,
  isPreOrderEnabled,
  inStock,
  className = "",
}) => {
  const buttonText =
    !inStock && isPreOrderEnabled ? "Pre Order" : "Add to Cart";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 text-[var(--theme-text-content)] font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 relative ${className}`}
      style={{
        background: !disabled
          ? "var(--theme-btn-primary)"
          : "var(--theme-bg-options)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = "var(--theme-btn-primary-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = "var(--theme-btn-primary)";
        }
      }}
    >
      {isLoading ? (
        <>
          <span className="opacity-0">{buttonText}</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin w-5 h-5 text-[var(--theme-text-content)]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </>
      ) : (
        buttonText
      )}
    </button>
  );
};

// Buy Now Button Component
const BuyNowButton: React.FC<BuyNowButtonProps> = ({
  disabled,
  isLoading,
  onAddToCart,
  servicesManager,
  className = "",
}) => {
  const handleBuyNow = async () => {
    try {
      const cartService = servicesManager.getService(
        CurrentCartServiceDefinition
      );
      await cartService.clearCart();
      await onAddToCart();
      await cartService.proceedToCheckout();
    } catch (error) {
      console.error("Buy now failed:", error);
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={disabled}
      className={`flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        "Buy Now"
      )}
    </button>
  );
};

// Main Product Action Buttons Container
export const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({
  onAddToCart,
  canAddToCart,
  isLoading,
  isPreOrderEnabled,
  inStock,
  servicesManager,
  onShowSuccessMessage,
}) => {
  const handleAddToCart = async () => {
    await onAddToCart();
    onShowSuccessMessage(true);
    setTimeout(() => onShowSuccessMessage(false), 3000);

    if (isPreOrderEnabled) {
      window.location.href = "/cart";
    }
  };

  return (
    <div className="flex gap-3">
      {/* Add to Cart / Pre Order Button */}
      <AddToCartButton
        disabled={!canAddToCart || isLoading}
        isLoading={isLoading}
        onClick={handleAddToCart}
        isPreOrderEnabled={isPreOrderEnabled}
        inStock={inStock}
      />

      {/* Buy Now Button - Only show for in-stock items */}
      {inStock && (
        <BuyNowButton
          disabled={!canAddToCart || isLoading}
          isLoading={isLoading}
          onAddToCart={onAddToCart}
          servicesManager={servicesManager}
        />
      )}
    </div>
  );
};

export default ProductActionButtons;
