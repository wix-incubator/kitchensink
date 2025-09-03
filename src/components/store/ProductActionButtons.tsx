import React from 'react';
import { SelectedVariant } from '@wix/headless-stores/react';
import { Button } from '@/components/ui/button';

interface BaseButtonProps {
  disabled: boolean;
  isLoading: boolean;
  onClick: () => Promise<void>;
}

interface AddToCartButtonProps extends BaseButtonProps {
  isPreOrderEnabled: boolean;
  inStock: boolean;
}

interface BuyNowButtonProps extends BaseButtonProps {}

interface ProductActionButtonsProps {
  isQuickView?: boolean;
}

// Add to Cart / Pre Order Button Component
const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  disabled,
  isLoading,
  onClick,
  isPreOrderEnabled,
  inStock,
}) => {
  const buttonText =
    !inStock && isPreOrderEnabled ? 'Pre Order' : 'Add to Cart';

  return (
    <Button
      data-testid="add-to-cart-button"
      variant="default"
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className="add-to-cart-button flex-1 relative"
    >
      {isLoading ? (
        <>
          <span className="opacity-0">{buttonText}</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin w-5 h-5"
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
    </Button>
  );
};

// Buy Now Button Component
const BuyNowButton: React.FC<BuyNowButtonProps> = ({
  disabled,
  isLoading,
  onClick,
}) => {
  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className="buy-now-button flex-1 transform hover:scale-105 disabled:hover:scale-100"
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
        'Buy Now'
      )}
    </Button>
  );
};

// Main Product Action Buttons Container
export const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({
  isQuickView = false,
}) => {
  return (
    <SelectedVariant.Actions>
      {({
        addToCart,
        buyNow,
        canAddToCart,
        isLoading,
        inStock,
        isPreOrderEnabled,
        error,
        preOrderMessage,
      }) => {
        const handleAddToCart = async () => {
          await addToCart();
          if (isPreOrderEnabled) {
            window.location.href = '/cart';
          }
        };

        const handleBuyNow = async () => {
          try {
            await buyNow();
          } catch (error) {
            console.error('Buy now failed:', error);
          }
        };

        return (
          <div className="space-y-4 w-full">
            {/* Error Display */}
            {error && (
              <div className="bg-status-danger-light border border-status-danger rounded-lg p-3">
                <p className="text-status-danger text-sm">{error}</p>
              </div>
            )}

            {/* Pre-order Message Display */}
            {!inStock && preOrderMessage && isPreOrderEnabled && (
              <div className="bg-status-info-light border border-status-info rounded-lg p-3">
                <p className="text-status-info text-sm">{preOrderMessage}</p>
              </div>
            )}

            {/* Action Buttons */}
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
      }}
    </SelectedVariant.Actions>
  );
};

export default ProductActionButtons;
