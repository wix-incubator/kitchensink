import type { ServiceFactoryConfig } from '@wix/services-definitions';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { useState } from 'react';
import { PageDocsRegistration } from '../../../../components/DocsMode';
import {
  MediaGallery,
  WixMediaImage,
} from '../../../../headless/media/components';
import { CurrentCart } from '@wix/headless-ecom/react';
import { Product, SelectedVariant } from '@wix/headless-stores/react';
import {
  ProductModifiers,
  ProductVariantSelector,
  RelatedProducts,
  ProductActions,
} from '@wix/headless-stores/react';
import { SocialSharingButtons } from '../../../../components/social/SocialSharingButtons';
import {
  CurrentCartService,
  CurrentCartServiceDefinition,
} from '@wix/headless-ecom/services';
import {
  ProductModifiersService,
  ProductModifiersServiceDefinition,
} from '@wix/headless-stores/services';
import {
  ProductService,
  ProductServiceDefinition,
} from '@wix/headless-stores/services';
import {
  RelatedProductsService,
  RelatedProductsServiceDefinition,
} from '@wix/headless-stores/services';
import {
  SelectedVariantService,
  SelectedVariantServiceDefinition,
} from '@wix/headless-stores/services';
import {
  SocialSharingService,
  SocialSharingServiceDefinition,
} from '@wix/headless-stores/services';
import { KitchensinkLayout } from '../../../../layouts/KitchensinkLayout';
import { StoreLayout } from '../../../../layouts/StoreLayout';
import '../../../../styles/theme-2.css';
import { getStockStatusMessage } from '../../../../components/store/enums/product-status-enums';
import {
  MediaGalleryService,
  MediaGalleryServiceDefinition,
} from '@wix/headless-media/services';

interface ProductDetailPageProps {
  productServiceConfig: ServiceFactoryConfig<typeof ProductService>;
  currentCartServiceConfig: ServiceFactoryConfig<typeof CurrentCartService>;
  relatedProductsServiceConfig: ServiceFactoryConfig<
    typeof RelatedProductsService
  >;
}

const ProductImageGallery = () => {
  return (
    <div className="space-y-4">
      <MediaGallery.Viewport>
        {({ src }) => {
          return (
            <div className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden group">
              {src ? (
                <WixMediaImage media={{ image: src }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-white/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              <MediaGallery.Previous>
                {({ onPrevious, canGoPrevious }) => (
                  <>
                    {canGoPrevious && (
                      <button
                        onClick={onPrevious}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </MediaGallery.Previous>

              <MediaGallery.Next>
                {({ onNext, canGoNext }) => (
                  <>
                    {canGoNext && (
                      <button
                        onClick={onNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="w-6 h-6"
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
                      </button>
                    )}
                  </>
                )}
              </MediaGallery.Next>

              <MediaGallery.Indicator>
                {({ current, total }) => (
                  <>
                    {total > 1 && (
                      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                        {current} / {total}
                      </div>
                    )}
                  </>
                )}
              </MediaGallery.Indicator>
            </div>
          );
        }}
      </MediaGallery.Viewport>

      <MediaGallery.ThumbnailList>
        {({ items }) => (
          <div className="flex gap-2 overflow-x-auto">
            {items.map((_, index) => (
              <MediaGallery.ThumbnailItem key={index} index={index}>
                {({ src, isActive, onSelect }) => (
                  <button
                    onClick={onSelect}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      isActive
                        ? 'border-teal-500 ring-2 ring-teal-500/30'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {src && <WixMediaImage media={{ image: src }} />}
                  </button>
                )}
              </MediaGallery.ThumbnailItem>
            ))}
          </div>
        )}
      </MediaGallery.ThumbnailList>
    </div>
  );
};

// Reusable component for free text inputs
const FreeTextInput = ({ modifier, name }: { modifier: any; name: string }) => (
  <ProductModifiers.FreeText modifier={modifier}>
    {({
      value,
      onChange,
      charCount,
      isOverLimit,
      maxChars: textMaxChars,
      placeholder: freeTextPlaceholder,
    }) => (
      <div className="space-y-1">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={
            freeTextPlaceholder || `Enter your ${name.toLowerCase()}...`
          }
          maxLength={textMaxChars}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
          rows={3}
        />
        {textMaxChars && (
          <p
            className={`text-xs text-right ${
              isOverLimit ? 'text-red-400' : 'text-white/60'
            }`}
          >
            {charCount}/{textMaxChars}
          </p>
        )}
      </div>
    )}
  </ProductModifiers.FreeText>
);

const ProductInfo = ({
  onAddToCart: _onAddToCart,
}: {
  onAddToCart: () => void;
  servicesManager: any;
}) => {
  const [quantity, setQuantity] = useState(1);

  // Get access to variant service for reset functionality
  // const variantService = useService(SelectedVariantServiceDefinition); // Unused

  return (
    <div className="space-y-6">
      <Product.Name>
        {({ name }) =>
          name ? (
            <h1 className="text-4xl font-bold text-white mb-2">{name}</h1>
          ) : null
        }
      </Product.Name>

      <Product.Description>
        {({ plainDescription }) => (
          <div className="text-white/80 text-lg">
            {
              <div
                dangerouslySetInnerHTML={{ __html: plainDescription }}
                className="prose prose-invert max-w-none"
              />
            }
          </div>
        )}
      </Product.Description>

      <SelectedVariant.Price>
        {({ price, compareAtPrice, currency }) => (
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white">{price}</div>
            {compareAtPrice &&
              parseFloat(compareAtPrice.replace(/[^\d.]/g, '')) > 0 && (
                <div className="text-lg font-medium text-white/50 line-through">
                  {compareAtPrice}
                </div>
              )}
            {currency && (
              <p className="text-white/60 text-sm">Currency: {currency}</p>
            )}
          </div>
        )}
      </SelectedVariant.Price>

      <ProductVariantSelector.Stock>
        {({
          inStock,
          availabilityStatus,
          availableQuantity,
          trackInventory,
          isPreOrderEnabled,
        }) => {
          const displayMessage = getStockStatusMessage(
            availabilityStatus,
            isPreOrderEnabled
          );
          const isLowStock =
            trackInventory &&
            availableQuantity !== null &&
            availableQuantity <= 5 &&
            availableQuantity > 0;

          const isNotInStockButPreOrderEnabled = isPreOrderEnabled && !inStock;

          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isNotInStockButPreOrderEnabled
                      ? 'bg-orange-500'
                      : inStock
                        ? isLowStock
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-red-500'
                  }`}
                ></div>
                <span
                  className={`text-sm ${
                    isNotInStockButPreOrderEnabled
                      ? 'text-orange-400'
                      : inStock
                        ? isLowStock
                          ? 'text-yellow-400'
                          : 'text-green-400'
                        : 'text-red-400'
                  }`}
                >
                  {displayMessage}
                  {trackInventory && availableQuantity !== null && (
                    <span className="ml-1">
                      ({availableQuantity} available)
                    </span>
                  )}
                </span>
              </div>
              {isNotInStockButPreOrderEnabled && (
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-2">
                  <p className="text-orange-300 text-xs">
                    🚀 This item is available for pre-order and will ship when
                    available
                  </p>
                </div>
              )}
              {isLowStock && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2">
                  <p className="text-yellow-300 text-xs">
                    ⚡ Only {availableQuantity} left in stock - order soon!
                  </p>
                </div>
              )}
            </div>
          );
        }}
      </ProductVariantSelector.Stock>

      <ProductVariantSelector.Options>
        {({ options, hasOptions }) =>
          hasOptions ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Product Options
              </h3>
              {options.map((option: any) => (
                <ProductVariantSelector.Option
                  key={option.name}
                  option={option}
                >
                  {({ name, choices, selectedValue, hasChoices }) =>
                    hasChoices ? (
                      <div className="space-y-3">
                        <h4 className="text-md font-medium text-white/90">
                          {name}
                          {selectedValue && (
                            <span className="ml-2 text-sm text-teal-400">
                              ({selectedValue})
                            </span>
                          )}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {choices.map((choice: any, choiceIndex: number) => {
                            const isColorOption = String(name)
                              .toLowerCase()
                              .includes('color');
                            const hasColorCode = choice.colorCode;
                            return (
                              <ProductVariantSelector.Choice
                                key={choiceIndex}
                                option={option}
                                choice={choice}
                              >
                                {({
                                  value,
                                  isSelected,
                                  onSelect,
                                  isInStock,
                                  isPreOrderEnabled,
                                }) => (
                                  <>
                                    {isColorOption && hasColorCode ? (
                                      <div className="relative">
                                        <button
                                          onClick={onSelect}
                                          disabled={
                                            !isInStock && !isPreOrderEnabled
                                          }
                                          title={value}
                                          className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                                            isSelected
                                              ? 'border-teal-400 shadow-lg scale-110 ring-2 ring-teal-500/30'
                                              : isInStock || isPreOrderEnabled
                                                ? 'border-white/30 hover:border-white/60 hover:scale-105'
                                                : 'border-white/10 opacity-50 cursor-not-allowed'
                                          } ${
                                            !isInStock && !isPreOrderEnabled
                                              ? 'grayscale'
                                              : ''
                                          }`}
                                          style={{
                                            backgroundColor:
                                              choice.colorCode || '#000000',
                                          }}
                                        />
                                        {!isInStock && !isPreOrderEnabled && (
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <svg
                                              className="w-6 h-6 text-red-400"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="relative">
                                        <button
                                          onClick={onSelect}
                                          disabled={
                                            !isInStock && !isPreOrderEnabled
                                          }
                                          className={`px-4 py-2 rounded-lg border transition-all ${
                                            isSelected
                                              ? 'bg-teal-500 border-teal-500 text-white ring-2 ring-teal-500/30'
                                              : isInStock || isPreOrderEnabled
                                                ? 'bg-white/5 border-white/20 text-white hover:border-white/40 hover:bg-white/10'
                                                : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                                          }`}
                                        >
                                          {value}
                                        </button>
                                        {!isInStock && !isPreOrderEnabled && (
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <svg
                                              className="w-6 h-6 text-red-400"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </ProductVariantSelector.Choice>
                            );
                          })}
                        </div>
                      </div>
                    ) : null
                  }
                </ProductVariantSelector.Option>
              ))}
              <ProductVariantSelector.Reset>
                {({ onReset, hasSelections }) =>
                  hasSelections && (
                    <div className="pt-2">
                      <button
                        onClick={onReset}
                        className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                      >
                        Reset Selections
                      </button>
                    </div>
                  )
                }
              </ProductVariantSelector.Reset>
            </div>
          ) : null
        }
      </ProductVariantSelector.Options>

      <ProductModifiers.Modifiers>
        {({
          modifiers,
          hasModifiers,
          selectedModifiers: _selectedModifiers,
          areAllRequiredModifiersFilled: _areAllRequiredModifiersFilled,
        }) =>
          hasModifiers ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">
                Product Customizations
              </h3>
              {modifiers.map((modifier: any) => (
                <div key={modifier.name}>
                  <ProductModifiers.Modifier modifier={modifier}>
                    {({
                      name,
                      type,
                      mandatory,
                      choices,
                      hasChoices,
                      isFreeText,
                      maxChars: _maxChars,
                      placeholder: _placeholder,
                    }) => (
                      <div className="space-y-3">
                        <h4 className="text-md font-medium text-white">
                          {name}
                          {mandatory && (
                            <span className="text-red-400 ml-1">*</span>
                          )}
                        </h4>
                        {isFreeText ? (
                          <div className="space-y-2">
                            {!mandatory ? (
                              <ProductModifiers.ToggleFreeText
                                modifier={modifier}
                              >
                                {({
                                  isTextInputShown,
                                  onToggle,
                                  mandatory: _toggleMandatory,
                                }) => (
                                  <div className="space-y-3">
                                    <label className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={isTextInputShown}
                                        onChange={onToggle}
                                        className="rounded border-white/20 bg-white/10 text-teal-500 focus:ring-teal-500"
                                      />
                                      <span className="text-white/80">
                                        Enable
                                      </span>
                                    </label>
                                    {isTextInputShown && (
                                      <FreeTextInput
                                        modifier={modifier}
                                        name={name}
                                      />
                                    )}
                                  </div>
                                )}
                              </ProductModifiers.ToggleFreeText>
                            ) : (
                              <FreeTextInput modifier={modifier} name={name} />
                            )}
                          </div>
                        ) : hasChoices ? (
                          <div className="flex flex-wrap gap-3">
                            {choices.map((choice: any, choiceIndex: number) => {
                              const isColorModifier = type === 'SWATCH_CHOICES';
                              const hasColorCode = choice.colorCode;
                              return (
                                <ProductModifiers.Choice
                                  key={choiceIndex}
                                  modifier={modifier}
                                  choice={choice}
                                >
                                  {({
                                    value,
                                    isSelected,
                                    onSelect,
                                    colorCode,
                                  }) => (
                                    <>
                                      {isColorModifier && hasColorCode ? (
                                        <button
                                          onClick={onSelect}
                                          title={value}
                                          className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                                            isSelected
                                              ? 'border-teal-400 shadow-lg scale-110 ring-2 ring-teal-500/30'
                                              : 'border-white/30 hover:border-white/60 hover:scale-105'
                                          }`}
                                          style={{
                                            backgroundColor:
                                              colorCode || '#000000',
                                          }}
                                        />
                                      ) : (
                                        <button
                                          onClick={onSelect}
                                          className={`px-4 py-2 rounded-lg border transition-all ${
                                            isSelected
                                              ? 'bg-teal-500 border-teal-500 text-white ring-2 ring-teal-500/30'
                                              : 'bg-white/5 border-white/20 text-white hover:border-white/40 hover:bg-white/10'
                                          }`}
                                        >
                                          {value}
                                        </button>
                                      )}
                                    </>
                                  )}
                                </ProductModifiers.Choice>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </ProductModifiers.Modifier>
                </div>
              ))}
            </div>
          ) : null
        }
      </ProductModifiers.Modifiers>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Quantity</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-white/20 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-3 py-2 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <span className="px-4 py-2 text-white border-x border-white/20 min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-white hover:bg-white/10 transition-colors"
            >
              +
            </button>
          </div>
          <span className="text-white/60 text-sm">Max: 10 per order</span>
        </div>
        <button
          onClick={() => setQuantity(1)}
          className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          Reset Quantity
        </button>
      </div>

      <ProductActions.Actions>
        {({
          onAddToCart,
          onBuyNow,
          canAddToCart,
          isLoading,
          inStock,
          error,
        }) => (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    await onAddToCart();
                  }}
                  disabled={!canAddToCart || isLoading}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
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
                      Adding...
                    </span>
                  ) : !inStock ? (
                    'Out of Stock'
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                <button
                  onClick={async () => {
                    try {
                      await onBuyNow();
                    } catch (error) {
                      console.error('Buy now failed:', error);
                      window.location.href = '/cart';
                    }
                  }}
                  disabled={!canAddToCart || isLoading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
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
                      Processing...
                    </span>
                  ) : !inStock ? (
                    'Out of Stock'
                  ) : (
                    'Buy Now'
                  )}
                </button>
              </div>
              <SocialSharingButtons />
            </div>
          </div>
        )}
      </ProductActions.Actions>

      <SelectedVariant.Details>
        {({ sku, weight }) =>
          sku || weight ? (
            <div className="border-t border-white/10 pt-6 space-y-2">
              <h3 className="text-lg font-semibold text-white mb-3">
                Product Details
              </h3>
              {sku && (
                <p className="text-white/60 text-sm">
                  <span className="font-medium">SKU:</span> {sku}
                </p>
              )}
              {weight && (
                <p className="text-white/60 text-sm">
                  <span className="font-medium">Weight:</span> {weight}
                </p>
              )}
            </div>
          ) : null
        }
      </SelectedVariant.Details>

      <RelatedProducts.List>
        {({ products, isLoading, error, hasProducts }) => (
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              You might also like
            </h3>
            {isLoading && (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(item => (
                  <div
                    key={item}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 animate-pulse"
                  >
                    <div className="aspect-square bg-white/10 rounded-lg mb-3"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">
                  Failed to load related products: {error}
                </p>
              </div>
            )}
            {!isLoading && hasProducts && (
              <div className="grid grid-cols-2 gap-4">
                {products.map((product: any) => {
                  return (
                    <RelatedProducts.Item key={product._id} product={product}>
                      {({
                        title,
                        image,
                        price,
                        available,
                        href,
                        description,
                      }) => (
                        <a
                          href={href}
                          className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-200 group cursor-pointer block"
                        >
                          <div className="aspect-square bg-white/10 rounded-lg mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-200">
                            {image ? (
                              <WixMediaImage media={{ image: image }} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-white/40"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <h4 className="text-white font-medium text-sm mb-1 group-hover:text-teal-400 transition-colors line-clamp-2">
                            {title}
                          </h4>
                          {description && (
                            <p className="text-white/60 text-xs mb-2 line-clamp-2">
                              {description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-white font-semibold">{price}</p>
                            {!available && (
                              <span className="text-red-400 text-xs">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </a>
                      )}
                    </RelatedProducts.Item>
                  );
                })}
              </div>
            )}
            {!isLoading && !hasProducts && !error && (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 text-white/20 mx-auto mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p className="text-white/60 text-sm">
                  No related products found
                </p>
              </div>
            )}
          </div>
        )}
      </RelatedProducts.List>
    </div>
  );
};

export default function ProductDetailPage({
  productServiceConfig,
  currentCartServiceConfig,
  relatedProductsServiceConfig,
}: ProductDetailPageProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  let servicesMap = createServicesMap()
    .addService(ProductServiceDefinition, ProductService, productServiceConfig)
    .addService(
      CurrentCartServiceDefinition,
      CurrentCartService,
      currentCartServiceConfig
    )
    .addService(SelectedVariantServiceDefinition, SelectedVariantService)
    .addService(MediaGalleryServiceDefinition, MediaGalleryService, {
      media: productServiceConfig.product?.media?.itemsInfo?.items ?? [],
    })
    .addService(SelectedVariantServiceDefinition, SelectedVariantService)
    .addService(SocialSharingServiceDefinition, SocialSharingService)
    .addService(
      RelatedProductsServiceDefinition,
      RelatedProductsService,
      relatedProductsServiceConfig
    )
    .addService(ProductModifiersServiceDefinition, ProductModifiersService);

  const [servicesManager] = useState(() => createServicesManager(servicesMap));

  return (
    <KitchensinkLayout>
      <StoreLayout
        currentCartServiceConfig={currentCartServiceConfig}
        servicesMap={servicesMap}
        showSuccessMessage={showSuccessMessage}
        onSuccessMessageChange={setShowSuccessMessage}
      >
        <PageDocsRegistration
          title="Advanced Product Detail Page"
          description="Complete product detail page using Product, ProductVariantSelector, ProductMediaGallery, and CurrentCart headless components with enhanced UI patterns."
          docsUrl="/docs/examples/advanced-product-detail"
        />

        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <a
                href="/store/example-2"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Store
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <ProductImageGallery />
              </div>

              <div>
                <ProductInfo
                  servicesManager={servicesManager}
                  onAddToCart={() => {
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 3000);
                  }}
                />
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <CurrentCart.Summary>
                {({ subtotal, itemCount }) => (
                  <>
                    {itemCount > 0 && (
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-xl font-semibold text-white mb-4">
                          Cart Summary
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">
                            {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
                          </span>
                          <span className="text-xl font-bold text-white">
                            {subtotal}
                          </span>
                        </div>
                        <a
                          href="/cart"
                          className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
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
                        </a>
                      </div>
                    )}
                  </>
                )}
              </CurrentCart.Summary>
            </div>
          </div>
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
