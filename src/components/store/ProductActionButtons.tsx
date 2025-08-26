import React from 'react';
import { SelectedVariant } from '@wix/headless-stores/react';
import { Button } from '@/components/ui/button';
import {
  ProductActionAddToCart,
  ProductActionBuyNow,
  ProductActionPreOrder,
} from '../ui/store/Product';

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
  showBuyNow?: boolean;
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
      className="flex-1 relative"
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
      className="flex-1 transform hover:scale-105 disabled:hover:scale-100"
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
  showBuyNow = false,
}) => {
  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-3">
        <ProductActionAddToCart
          label="Add to Cart"
          loadingState={
            <>
              <span className="opacity-0">Add to Cart</span>
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
          }
        />
        {showBuyNow && (
          <ProductActionBuyNow
            label="Buy Now"
            loadingState={
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
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
                Processing...
              </span>
            }
          />
        )}
        <ProductActionPreOrder label="Pre Order" />
      </div>
    </div>
  );
};

export default ProductActionButtons;
