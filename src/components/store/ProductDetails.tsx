import { MediaGallery, WixMediaImage } from '../../headless/media/components';
import {
  Product,
  ProductModifiers,
  ProductVariantSelector,
  SelectedVariant,
  ProductActions,
} from '../../headless/store/components';
import { ProductActionButtons } from './ProductActionButtons';
import { CurrentCart } from '../../headless/ecom/components';
import { SocialSharingButtons } from '../social/SocialSharingButtons';
import { useNavigation } from '../NavigationContext';
import { getStockStatusMessage } from './enums/product-status-enums';

// Reusable FreeText Input Component
const FreeTextInput = ({ modifier, name }: { modifier: any; name: string }) => (
  <ProductModifiers.FreeText modifier={modifier}>
    {({
      value,
      onChange,
      placeholder: freeTextPlaceholder,
      charCount,
      isOverLimit,
      maxChars,
    }) => (
      <div className="space-y-2">
        <textarea
          data-testid="product-modifier-free-text-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={
            freeTextPlaceholder || `Enter custom ${name.toLowerCase()}...`
          }
          maxLength={maxChars}
          className="w-full p-3 border border-brand-light rounded-lg bg-surface-primary text-content-primary placeholder-text-content-subtle focus:border-brand-medium focus:outline-none resize-none"
          rows={3}
        />
        {maxChars && (
          <div
            className={`text-xs text-right ${
              isOverLimit ? 'text-status-error' : 'text-content-muted'
            }`}
          >
            {charCount}/{maxChars} characters
          </div>
        )}
      </div>
    )}
  </ProductModifiers.FreeText>
);

export default function ProductDetails({
  setShowSuccessMessage = () => {},
  isQuickView = false,
}: {
  setShowSuccessMessage?: (show: boolean) => void;
  isQuickView?: boolean;
}) {
  const Navigation = useNavigation();

  return (
    <>
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        data-testid="product-details"
      >
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-surface-primary rounded-2xl overflow-hidden border border-brand-subtle relative">
            <MediaGallery.Viewport>
              {({ src, alt }) => (
                <>
                  {src ? (
                    <WixMediaImage
                      media={{ image: src }}
                      className="w-full h-full object-cover"
                      alt={alt}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-24 h-24 text-content-subtle"
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
                      <button
                        onClick={onPrevious}
                        disabled={!canGoPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 btn-nav p-2 rounded-full transition-all"
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
                      </button>
                    )}
                  </MediaGallery.Previous>

                  <MediaGallery.Next>
                    {({ onNext, canGoNext }) => (
                      <button
                        onClick={onNext}
                        disabled={!canGoNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 btn-nav p-2 rounded-full transition-all"
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}
                  </MediaGallery.Next>

                  {/* Image Counter */}
                  {
                    <MediaGallery.Indicator>
                      {({ current, total }) => (
                        <div className="absolute bottom-4 right-4 bg-surface-tooltip text-nav px-3 py-1 rounded-full text-sm">
                          {current} / {total}
                        </div>
                      )}
                    </MediaGallery.Indicator>
                  }
                </>
              )}
            </MediaGallery.Viewport>
          </div>

          {/* Thumbnail Images */}
          <MediaGallery.ThumbnailList>
            {({ items }) => (
              <div className="grid grid-cols-4 gap-4">
                {items.map((_, i) => (
                  <MediaGallery.ThumbnailItem key={i} index={i}>
                    {({ src, isActive, onSelect, alt }) => (
                      <div
                        onClick={onSelect}
                        className={`aspect-square bg-surface-primary rounded-lg border cursor-pointer transition-all ${
                          isActive
                            ? 'border-brand-medium ring-2 ring-brand-light'
                            : 'border-brand-subtle hover:border-brand-light'
                        }`}
                      >
                        {src ? (
                          <WixMediaImage
                            media={{ image: src }}
                            className="w-full h-full object-cover rounded-lg"
                            alt={alt}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-content-subtle"
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
                    )}
                  </MediaGallery.ThumbnailItem>
                ))}
              </div>
            )}
          </MediaGallery.ThumbnailList>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          {/* Product Name & Price */}
          <div>
            <Product.Name>
              {({ name }) => (
                <h1
                  className="text-4xl font-bold text-content-primary mb-4"
                  data-testid="product-name"
                >
                  {name}
                </h1>
              )}
            </Product.Name>
            <SelectedVariant.Price>
              {({ price, compareAtPrice }) => (
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-content-primary">
                    {price}
                  </div>
                  {compareAtPrice &&
                    parseFloat(compareAtPrice.replace(/[^\d.]/g, '')) > 0 && (
                      <div className="text-lg font-medium text-content-faded line-through">
                        {compareAtPrice}
                      </div>
                    )}
                </div>
              )}
            </SelectedVariant.Price>
            {isQuickView && (
              <SelectedVariant.SKU>
                {({ sku }) =>
                  sku && (
                    <>
                      <br />
                      <div className="text-base text-content-muted">
                        SKU: {sku}
                      </div>
                    </>
                  )
                }
              </SelectedVariant.SKU>
            )}
          </div>

          {/* Product Description */}
          <Product.Description>
            {({ plainDescription }) => (
              <>
                {plainDescription && !isQuickView && (
                  <div>
                    <h3 className="text-xl font-semibold text-content-primary mb-3">
                      Description
                    </h3>
                    {
                      <p
                        className="text-content-secondary leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: plainDescription,
                        }}
                      />
                    }
                  </div>
                )}
              </>
            )}
          </Product.Description>

          {/* Product Options (if any) */}
          <ProductVariantSelector.Options>
            {({ options, hasOptions }) => (
              <>
                {hasOptions && (
                  <div className="space-y-6" data-testid="product-options">
                    <h3 className="text-lg font-semibold text-content-primary">
                      Product Options
                    </h3>

                    {options.map((option: any) => (
                      <div key={option.name} data-testid="product-option">
                        <ProductVariantSelector.Option option={option}>
                          {({ name, choices, hasChoices }) => (
                            <>
                              <h3 className="text-lg font-semibold text-content-primary mb-3">
                                {name}
                              </h3>
                              {hasChoices && (
                                <div className="flex flex-wrap gap-3">
                                  {choices.map((choice: any) => {
                                    // Check if this is a color option
                                    const isColorOption = String(name)
                                      .toLowerCase()
                                      .includes('color');
                                    const hasColorCode = choice.colorCode;

                                    return (
                                      <ProductVariantSelector.Choice
                                        key={
                                          choice.value ||
                                          choice.description ||
                                          choice.name
                                        }
                                        option={option}
                                        choice={choice}
                                      >
                                        {({
                                          value,
                                          isSelected,
                                          isVisible,
                                          isInStock,
                                          isPreOrderEnabled,
                                          onSelect,
                                        }) => (
                                          <>
                                            {isColorOption &&
                                            isVisible &&
                                            hasColorCode &&
                                            (!isQuickView || isInStock) ? (
                                              // Color Swatch
                                              <div className="relative">
                                                <button
                                                  data-testid="product-modifier-choice-button"
                                                  onClick={onSelect}
                                                  title={value}
                                                  className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                                                    isSelected
                                                      ? 'border-brand-primary shadow-lg scale-110 ring-2 ring-brand-primary/30'
                                                      : 'border-color-swatch hover:border-color-swatch-hover hover:scale-105'
                                                  } ${
                                                    !isInStock &&
                                                    !isPreOrderEnabled &&
                                                    !isQuickView
                                                      ? 'grayscale'
                                                      : ''
                                                  }`}
                                                  style={{
                                                    backgroundColor:
                                                      choice.colorCode ||
                                                      'var(--theme-text-content-40)',
                                                  }}
                                                />
                                                {!isInStock &&
                                                  !isPreOrderEnabled &&
                                                  !isQuickView && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                      <svg
                                                        className="w-6 h-6 text-status-error"
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
                                              isVisible &&
                                              (!isQuickView || isInStock) && (
                                                // Regular Text Button
                                                <div className="relative">
                                                  <button
                                                    data-testid="product-modifier-choice-button"
                                                    onClick={onSelect}
                                                    className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                                                      isSelected
                                                        ? 'product-option-active'
                                                        : 'product-option-inactive'
                                                    }`}
                                                  >
                                                    {value}
                                                  </button>
                                                  {!isInStock &&
                                                    !isPreOrderEnabled &&
                                                    !isQuickView && (
                                                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <svg
                                                          className="w-6 h-6 text-status-error"
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
                                              )
                                            )}
                                          </>
                                        )}
                                      </ProductVariantSelector.Choice>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          )}
                        </ProductVariantSelector.Option>
                      </div>
                    ))}

                    <ProductVariantSelector.Reset>
                      {({ onReset, hasSelections }) =>
                        hasSelections && (
                          <div className="pt-4">
                            <button
                              onClick={onReset}
                              className="text-sm text-brand-primary hover:text-brand-light transition-colors"
                            >
                              Reset Selections
                            </button>
                          </div>
                        )
                      }
                    </ProductVariantSelector.Reset>
                  </div>
                )}
              </>
            )}
          </ProductVariantSelector.Options>

          {/* Product Modifiers */}
          <ProductModifiers.Modifiers>
            {({ modifiers, hasModifiers }) => (
              <>
                {hasModifiers && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-content-primary">
                      Product Modifiers
                    </h3>

                    {modifiers.map((modifier: any) => (
                      <ProductModifiers.Modifier
                        key={modifier.name}
                        modifier={modifier}
                      >
                        {({ name, type, choices, hasChoices, mandatory }) => (
                          <div
                            className="space-y-3"
                            data-testid="product-modifiers"
                          >
                            <h4 className="text-md font-medium text-content-primary">
                              {name}{' '}
                              {mandatory && (
                                <span className="text-status-error">*</span>
                              )}
                            </h4>

                            {type === 'SWATCH_CHOICES' && hasChoices && (
                              <div className="flex flex-wrap gap-2">
                                {choices.map((choice: any) => (
                                  <ProductModifiers.Choice
                                    key={choice.value}
                                    modifier={modifier}
                                    choice={choice}
                                  >
                                    {({
                                      value,
                                      isSelected,
                                      colorCode,
                                      onSelect,
                                    }) => (
                                      <button
                                        data-testid="product-modifier-choice-button"
                                        onClick={onSelect}
                                        className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                                          isSelected
                                            ? 'border-brand-primary shadow-lg scale-110 ring-2 ring-brand-primary/30'
                                            : 'border-brand-light hover:border-brand-medium hover:scale-105'
                                        }`}
                                        style={{
                                          backgroundColor:
                                            colorCode ||
                                            'var(--theme-text-content-40)',
                                        }}
                                        title={value}
                                      />
                                    )}
                                  </ProductModifiers.Choice>
                                ))}
                              </div>
                            )}

                            {type === 'TEXT_CHOICES' && hasChoices && (
                              <div className="flex flex-wrap gap-2">
                                {choices.map((choice: any) => (
                                  <ProductModifiers.Choice
                                    key={choice.value}
                                    modifier={modifier}
                                    choice={choice}
                                  >
                                    {({ value, isSelected, onSelect }) => (
                                      <button
                                        data-testid="product-modifier-choice-button"
                                        onClick={onSelect}
                                        className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                                          isSelected
                                            ? 'product-option-active'
                                            : 'product-option-inactive'
                                        }`}
                                      >
                                        {value}
                                      </button>
                                    )}
                                  </ProductModifiers.Choice>
                                ))}
                              </div>
                            )}

                            {type === 'FREE_TEXT' && (
                              <>
                                {mandatory ? (
                                  <FreeTextInput
                                    data-testid="product-modifier-free-text"
                                    modifier={modifier}
                                    name={name}
                                  />
                                ) : (
                                  <ProductModifiers.ToggleFreeText
                                    modifier={modifier}
                                  >
                                    {({ isTextInputShown, onToggle }) => (
                                      <div className="space-y-3">
                                        <label className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            checked={isTextInputShown}
                                            onChange={onToggle}
                                            className="w-4 h-4 text-brand-primary rounded border-brand-light focus:ring-brand-primary"
                                          />
                                          <span className="text-content-primary">
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
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </ProductModifiers.Modifier>
                    ))}
                  </div>
                )}
              </>
            )}
          </ProductModifiers.Modifiers>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-content-primary">
              Quantity
            </h3>
            <ProductVariantSelector.Stock>
              {({
                inStock,
                isPreOrderEnabled,
                availableQuantity,
                selectedQuantity,
                incrementQuantity,
                decrementQuantity,
              }) => {
                return (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-brand-light rounded-lg">
                      <button
                        onClick={decrementQuantity}
                        disabled={
                          selectedQuantity <= 1 ||
                          (!inStock && !isPreOrderEnabled)
                        }
                        className="px-3 py-2 text-content-primary hover:bg-surface-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-content-primary border-x border-brand-light min-w-[3rem] text-center">
                        {selectedQuantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        disabled={
                          (!!availableQuantity &&
                            selectedQuantity >= availableQuantity) ||
                          (!inStock && !isPreOrderEnabled)
                        }
                        className="px-3 py-2 text-content-primary hover:bg-surface-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    {/* Show max quantity only when out of stock AND preorder enabled */}
                    {!inStock && isPreOrderEnabled && availableQuantity && (
                      <span className="text-content-muted text-sm">
                        Max: {availableQuantity} Pre Order
                      </span>
                    )}
                    {/* Show stock message when in stock but available quantity < 10 */}
                    {inStock && availableQuantity && availableQuantity < 10 && (
                      <span className="text-content-muted text-sm">
                        Only {availableQuantity} left in stock
                      </span>
                    )}
                  </div>
                );
              }}
            </ProductVariantSelector.Stock>
          </div>

          <SocialSharingButtons />

          {/* Add to Cart */}
          <div className="space-y-4">
            <ProductActions.Actions>
              {({ error, isPreOrderEnabled, preOrderMessage, inStock }) => (
                <div className="space-y-4">
                  {error && (
                    <div className="bg-status-danger-light border border-status-danger rounded-lg p-3">
                      <p className="text-status-error text-sm">{error}</p>
                    </div>
                  )}
                  {!inStock && preOrderMessage && isPreOrderEnabled && (
                    <div className="bg-status-info-light border border-status-info rounded-lg p-3">
                      <p className="text-status-info text-sm">
                        {preOrderMessage}
                      </p>
                    </div>
                  )}

                  <ProductActionButtons
                    onShowSuccessMessage={setShowSuccessMessage}
                    isQuickView={isQuickView}
                  />
                </div>
              )}
            </ProductActions.Actions>

            {/* Stock Status */}
            <ProductVariantSelector.Stock>
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
                        {trackInventory && availableQuantity !== null && (
                          <span className="text-content-muted ml-1">
                            ({availableQuantity} available)
                          </span>
                        )}
                      </span>
                    </div>
                  )
                );
              }}
            </ProductVariantSelector.Stock>
          </div>

          {/* Product Details */}
          {!isQuickView && (
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
          )}
        </div>
      </div>

      {/* Current Cart Summary */}
      {!isQuickView && (
        <div className="mt-12 pt-8 border-t border-brand-subtle">
          <CurrentCart.Summary>
            {({ subtotal, itemCount }) => (
              <>
                {itemCount > 0 && (
                  <div className="bg-surface-primary backdrop-blur-sm rounded-xl p-6 border border-brand-subtle">
                    <h3 className="text-xl font-semibold text-content-primary mb-4">
                      Cart Summary
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-content-secondary">
                        {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
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
          </CurrentCart.Summary>
        </div>
      )}
    </>
  );
}
