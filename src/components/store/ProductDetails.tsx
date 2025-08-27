import {
  ProductModifiers as ProductModifiersPrimitive,
  ProductVariantSelector as ProductVariantSelectorPrimitive,
  Product as ProductPrimitive,
  SelectedVariant,
} from '@wix/headless-stores/react';
import { ProductActionButtons } from './ProductActionButtons';
import { CartSummary } from '@/components/ui/ecom/Cart';
import {
  Product,
  ProductName,
  ProductDescription,
  ProductPrice,
  ProductCompareAtPrice,
  ProductVariants,
  ProductVariantOptions,
  ProductVariantOptionRepeater,
  ProductModifierOptions,
  ProductModifierOptionRepeater,
  ProductModifiers,
  ProductQuantityRoot,
  ProductQuantityDecrement,
  ProductQuantityInput,
  ProductQuantityIncrement,
  ProductQuantityRaw,
} from '@/components/ui/store/Product';
import {
  OptionName,
  OptionChoices,
  OptionChoiceRepeater,
  OptionMandatoryIndicator,
} from '@/components/ui/store/Option';
import {
  ChoiceColor,
  ChoiceText,
  ChoiceFreeText,
} from '@/components/ui/store/Choice';

import { productsV3 } from '@wix/stores';

import { SocialSharingButtons } from '../social/SocialSharingButtons';
import { useNavigation } from '../NavigationContext';
import { getStockStatusMessage } from './enums/product-status-enums';
import { Button } from '@/components/ui/button';

import * as StyledMediaGallery from '@/components/ui/media/MediaGallery';

export default function ProductDetails({
  isQuickView = false,
  product,
}: {
  isQuickView?: boolean;
  product: productsV3.V3Product;
}) {
  const Navigation = useNavigation();

  return (
    <Product product={product}>
      <StyledMediaGallery.Root
        mediaGalleryServiceConfig={{
          media: product.media?.itemsInfo?.items ?? [],
        }}
      >
        <ProductModifiersPrimitive.Root>
          <ProductVariantSelectorPrimitive.Root>
            <SelectedVariant.Root>
              <>
                <div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  data-testid="product-details"
                >
                  {/* Product Images */}
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square bg-surface-primary rounded-2xl overflow-hidden border border-brand-subtle relative">
                      <StyledMediaGallery.Viewport />
                      <StyledMediaGallery.Previous />
                      <StyledMediaGallery.Next />
                      <StyledMediaGallery.Indicator />
                    </div>

                    {/* Thumbnail Images */}
                    <StyledMediaGallery.Thumbnails>
                      <StyledMediaGallery.ThumbnailRepeater>
                        <StyledMediaGallery.ThumbnailItem />
                      </StyledMediaGallery.ThumbnailRepeater>
                    </StyledMediaGallery.Thumbnails>
                  </div>
                  {/* Product Info */}
                  <div className="space-y-8 px-3">
                    {/* Product Name & Price */}
                    <div>
                      <ProductName asChild>
                        <h2 />
                      </ProductName>
                      <div className="space-y-1">
                        <ProductPrice />
                        <ProductCompareAtPrice asChild>
                          <div></div>
                        </ProductCompareAtPrice>
                      </div>
                    </div>

                    {/* Product Description */}
                    <ProductDescription as="html" asChild>
                      {({ description }) => (
                        <>
                          {description && !isQuickView && (
                            <div>
                              <h3 className="text-xl font-semibold text-content-primary mb-3">
                                Description
                              </h3>
                              {
                                <p
                                  className="text-content-secondary leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: description,
                                  }}
                                />
                              }
                            </div>
                          )}
                        </>
                      )}
                    </ProductDescription>

                    {/* Product Options (if any) */}
                    <ProductVariants>
                      <div className="space-y-6" data-testid="product-options">
                        <h3 className="text-lg font-semibold text-content-primary">
                          Product Options
                        </h3>

                        <ProductVariantOptions>
                          <ProductVariantOptionRepeater>
                            <div className="space-y-3 mb-4">
                              <OptionName />
                              <OptionChoices>
                                <div className="flex flex-wrap gap-3">
                                  <OptionChoiceRepeater>
                                    <>
                                      <ChoiceColor />
                                      <ChoiceText />
                                    </>
                                  </OptionChoiceRepeater>
                                </div>
                              </OptionChoices>
                            </div>
                          </ProductVariantOptionRepeater>
                        </ProductVariantOptions>

                        <ProductVariantSelectorPrimitive.Reset>
                          {({ reset, hasSelections }) =>
                            hasSelections && (
                              <div className="pt-4">
                                <button
                                  onClick={reset}
                                  className="text-sm text-brand-primary hover:text-brand-light transition-colors"
                                >
                                  Reset Selections
                                </button>
                              </div>
                            )
                          }
                        </ProductVariantSelectorPrimitive.Reset>
                      </div>
                    </ProductVariants>

                    {/* Product Modifiers */}
                    <ProductModifiers>
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-content-primary">
                          Product Modifiers
                        </h3>

                        <ProductModifierOptions>
                          <ProductModifierOptionRepeater
                            allowedTypes={['color', 'text', 'free-text']}
                          >
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center gap-1">
                                <OptionName />
                                <OptionMandatoryIndicator />
                              </div>

                              <OptionChoices>
                                <div className="flex flex-wrap gap-3">
                                  <OptionChoiceRepeater>
                                    <>
                                      <ChoiceColor />
                                      <ChoiceText asChild>
                                        <Button variant={'outline'}></Button>
                                      </ChoiceText>
                                      <ChoiceFreeText placeholder="dsfd" />
                                    </>
                                  </OptionChoiceRepeater>
                                </div>
                              </OptionChoices>
                            </div>
                          </ProductModifierOptionRepeater>
                        </ProductModifierOptions>
                      </div>
                    </ProductModifiers>

                    {/* Quantity Selector */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-content-primary">
                        Quantity
                      </h3>
                      <ProductQuantityRoot className="flex items-center gap-3">
                        <>
                          <div className="flex items-center border border-brand-light rounded-lg">
                            <ProductQuantityDecrement variant="button" />
                            <ProductQuantityInput variant="input" />
                            <ProductQuantityIncrement variant="button" />
                          </div>
                          <ProductQuantityRaw asChild>
                            {({
                              availableQuantity,
                              inStock,
                              isPreOrderEnabled,
                            }) => (
                              <div>
                                {/* Show max quantity only when out of stock AND preorder enabled */}
                                {!inStock &&
                                  isPreOrderEnabled &&
                                  availableQuantity && (
                                    <span className="text-content-muted text-sm">
                                      Max: {availableQuantity} Pre Order
                                    </span>
                                  )}
                                {/* Show stock message when in stock but available quantity < 10 */}
                                {inStock &&
                                  availableQuantity &&
                                  availableQuantity < 10 && (
                                    <span className="text-content-muted text-sm">
                                      Only {availableQuantity} left in stock
                                    </span>
                                  )}
                              </div>
                            )}
                          </ProductQuantityRaw>
                        </>
                      </ProductQuantityRoot>
                    </div>

                    <SocialSharingButtons />

                    {/* Add to Cart */}
                    <div className="space-y-4">
                      <ProductActionButtons showBuyNow={true} />

                      {/* Stock Status */}
                      <ProductVariantSelectorPrimitive.Stock>
                        {({
                          inStock,
                          isPreOrderEnabled,
                          availabilityStatus,
                          availableQuantity,
                          trackInventory,
                          currentVariantId,
                        }) => {
                          const displayMessage = getStockStatusMessage(
                            availabilityStatus,
                            isPreOrderEnabled
                          );
                          return (
                            (!!availabilityStatus || currentVariantId) && (
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    inStock || isPreOrderEnabled
                                      ? 'status-dot-success'
                                      : 'status-dot-danger'
                                  }`}
                                ></div>
                                <span
                                  className={`text-sm ${
                                    inStock || isPreOrderEnabled
                                      ? 'text-status-success'
                                      : 'text-status-error'
                                  }`}
                                >
                                  {displayMessage}
                                  {trackInventory &&
                                    availableQuantity !== null && (
                                      <span className="text-content-muted ml-1">
                                        ({availableQuantity} available)
                                      </span>
                                    )}
                                </span>
                              </div>
                            )
                          );
                        }}
                      </ProductVariantSelectorPrimitive.Stock>
                    </div>

                    {/* Product Details */}
                    {
                      <SelectedVariant.Details>
                        {({ sku, weight }) => (
                          <>
                            {(sku || weight) && (
                              <div className="border-t border-brand-light pt-8">
                                <h3 className="text-xl font-semibold text-content-primary mb-4">
                                  Product Details
                                </h3>
                                <div className="space-y-3 text-content-secondary">
                                  {sku && (
                                    <div className="flex justify-between">
                                      <span>SKU:</span>
                                      <span>{sku}</span>
                                    </div>
                                  )}
                                  {weight && (
                                    <div className="flex justify-between">
                                      <span>Weight:</span>
                                      <span>{weight}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </SelectedVariant.Details>
                    }
                  </div>
                </div>

                {/* Current Cart Summary */}
                {!isQuickView && (
                  <div className="mt-12 pt-8 border-t border-brand-subtle">
                    <CartSummary>
                      {({ subtotal, totalItems }) => (
                        <>
                          {totalItems > 0 && (
                            <div className="bg-surface-primary backdrop-blur-sm rounded-xl p-6 border border-brand-subtle">
                              <h3 className="text-xl font-semibold text-content-primary mb-4">
                                Cart Summary
                              </h3>
                              <div className="flex items-center justify-between">
                                <span className="text-content-secondary">
                                  {totalItems} item{totalItems !== 1 ? 's' : ''}{' '}
                                  in cart
                                </span>
                                <span className="text-xl font-bold text-content-primary">
                                  {subtotal}
                                </span>
                              </div>
                              <Navigation
                                data-testid="view-cart-button"
                                route="/cart"
                                className="mt-4 w-full text-content-primary font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 btn-secondary"
                              >
                                View Cart
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </Navigation>
                            </div>
                          )}
                        </>
                      )}
                    </CartSummary>
                  </div>
                )}
              </>
            </SelectedVariant.Root>
          </ProductVariantSelectorPrimitive.Root>
        </ProductModifiersPrimitive.Root>
      </StyledMediaGallery.Root>
    </Product>
  );
}
