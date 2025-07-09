import React from 'react';
import { CurrentCartServiceDefinition } from '../../headless/ecom/services/current-cart-service';
import { useService } from '@wix/services-manager-react';
import type { ServiceAPI } from '@wix/services-definitions';
import {
  StoreActionLabels,
  StoreStatusMessages,
} from '../../headless/store/enums';

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
  onAddToCart: () => Promise<void>;
  className?: string;
}

interface ProductActionButtonsProps {
  onAddToCart: () => Promise<void>;
  canAddToCart: boolean;
  isLoading: boolean;
  isPreOrderEnabled: boolean;
  inStock: boolean;
  onShowSuccessMessage: (show: boolean) => void;
  isQuickView?: boolean;
}

// Add to Cart / Pre Order Button Component
const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  disabled,
  isLoading,
  onClick,
  isPreOrderEnabled,
  inStock,
  className = '',
}) => {
  const buttonText =
    !inStock && isPreOrderEnabled ? StoreActionLabels.PRE_ORDER : StoreActionLabels.ADD_TO_CART;

  return (
    <button
      data-testid="add-to-cart-button"
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 text-content-primary font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 relative ${
        disabled ? 'bg-surface-primary cursor-not-allowed' : 'btn-primary'
      } ${className}`}
    >
      {isLoading ? (
        <>
          <span className="opacity-0">{buttonText}</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin w-5 h-5 text-content-primary"
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
  className = '',
}) => {
  const cartService = useService(CurrentCartServiceDefinition);

  const handleBuyNow = async () => {
    try {
      await cartService.clearCart();
      await onAddToCart();
      await cartService.proceedToCheckout();
    } catch (error) {
      console.error('Buy now failed:', error);
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={disabled}
      className={`flex-1 btn-warning disabled:opacity-50 disabled:cursor-not-allowed text-content-primary font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 ${className}`}
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
          {StoreStatusMessages.PROCESSING}
        </span>
              ) : (
        StoreActionLabels.BUY_NOW
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
  onShowSuccessMessage,
  isQuickView = false,
}) => {
  const service = useService(CurrentCartServiceDefinition) as ServiceAPI<
    typeof CurrentCartServiceDefinition
  >;

  const handleAddToCart = async () => {
    await onAddToCart();
    onShowSuccessMessage(true);
    setTimeout(() => {
      onShowSuccessMessage(false);
      if (!isPreOrderEnabled) {
        service.openCart();
      }
    }, 3000);

    if (isPreOrderEnabled) {
      window.location.href = '/cart';
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

      {/* Buy Now Button - Only show for in-stock items and not in QuickView */}
      {inStock && !isQuickView && (
        <BuyNowButton
          disabled={!canAddToCart || isLoading}
          isLoading={isLoading}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};

export default ProductActionButtons;
