import React, { useState } from 'react';
import { productsV3 } from '@wix/stores';

interface BaseButtonProps {
  disabled: boolean;
  isLoading: boolean;
  onClick: () => Promise<void>;
  className?: string;
}

interface AddToCartButtonProps extends BaseButtonProps {
  isPreOrderEnabled?: boolean;
  inStock?: boolean;
}

interface BuyNowButtonProps extends BaseButtonProps {}

interface ProductActionButtonsProps {
  isQuickView?: boolean;
  product?: productsV3.V3Product;
  selectedVariant?: any;
}

// Add to Cart / Pre Order Button Component
const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  disabled,
  isLoading,
  onClick,
  isPreOrderEnabled = false,
  inStock = true,
  className = '',
}) => {
  const buttonText =
    !inStock && isPreOrderEnabled ? 'Pre Order' : 'Add to Cart';

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
  onClick,
  className = '',
}) => {
  return (
    <button
      data-testid="buy-now-button"
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 text-content-primary font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 relative ${
        disabled ? 'bg-surface-primary cursor-not-allowed' : 'btn-secondary'
      } ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
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
        'Buy Now'
      )}
    </button>
  );
};

// Main Product Action Buttons Container
export const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({
  isQuickView = false,
  product,
  selectedVariant,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic availability logic - simplified for now
  const availabilityStatus =
    selectedVariant?.inventory?.availabilityStatus ||
    (product?.inventory?.availabilityStatus ??
      productsV3.InventoryAvailabilityStatus.IN_STOCK);
  const inStock =
    availabilityStatus === productsV3.InventoryAvailabilityStatus.IN_STOCK ||
    availabilityStatus ===
      productsV3.InventoryAvailabilityStatus.PARTIALLY_OUT_OF_STOCK;
  const isPreOrderEnabled = false; // Simplified for now
  const canAddToCart = inStock || isPreOrderEnabled;

  const handleAddToCart = async () => {
    if (!canAddToCart) return;

    setIsLoading(true);
    setError(null);

    try {
      // Placeholder - this would integrate with cart API
      console.log('Add to cart clicked for product:', product?._id);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      alert('Product added to cart!');

      if (isPreOrderEnabled) {
        window.location.href = '/cart';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      console.error('Add to cart failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await handleAddToCart();
      if (!isPreOrderEnabled) {
        // Redirect to cart for immediate purchase
        setTimeout(() => {
          window.location.href = '/cart';
        }, 500);
      }
    } catch (error) {
      console.error('Buy now failed:', error);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-status-danger-light border border-status-danger rounded-lg p-2">
          <p className="text-status-error text-xs">{error}</p>
        </div>
      )}

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
            onClick={handleBuyNow}
          />
        )}
      </div>
    </div>
  );
};

export default ProductActionButtons;
