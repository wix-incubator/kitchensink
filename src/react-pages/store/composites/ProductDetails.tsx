import { WixMediaImage } from "../../../headless/media/components";
import {
  Product,
  ProductMediaGallery,
  ProductModifiers,
  ProductVariantSelector,
  SelectedVariant,
} from "../../../headless/store/components";
import { SelectedVariantServiceDefinition } from "../../../headless/store/services/selected-variant-service";
import { ProductActionButtons } from "./ProductActionButtons";
import { CurrentCart } from "../../../headless/ecom/components";
import { useService } from "@wix/services-manager-react";


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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            freeTextPlaceholder || `Enter custom ${name.toLowerCase()}...`
          }
          maxLength={maxChars}
          className="w-full p-3 border border-[var(--theme-border-primary-20)] rounded-lg bg-[var(--theme-bg-options)] text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-40)] focus:border-[var(--theme-border-primary-30)] focus:outline-none resize-none"
          rows={3}
        />
        {maxChars && (
          <div
            className={`text-xs text-right ${isOverLimit
              ? "text-[var(--theme-text-error)]"
              : "text-[var(--theme-text-content-60)]"
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
}: {
  setShowSuccessMessage?: (show: boolean) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-[var(--theme-bg-options)] rounded-2xl overflow-hidden border border-[var(--theme-border-primary-10)] relative">
            <ProductMediaGallery.Viewport>
              {({ src, currentIndex, totalImages }) => (
                <>
                  {src ? (
                    <WixMediaImage
                      media={{ image: src }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-24 h-24 text-[var(--theme-text-content-40)]"
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

                  {/* Navigation Arrows */}
                  {totalImages > 1 && (
                    <>
                      <ProductMediaGallery.Previous>
                        {({ onPrevious, canGoPrevious }) => (
                          <button
                            onClick={onPrevious}
                            disabled={!canGoPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[var(--theme-bg-tooltip)] hover:bg-[var(--theme-bg-tooltip)]/90 text-[var(--theme-text-content)] p-2 rounded-full transition-all disabled:opacity-30"
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
                      </ProductMediaGallery.Previous>

                      <ProductMediaGallery.Next>
                        {({ onNext, canGoNext }) => (
                          <button
                            onClick={onNext}
                            disabled={!canGoNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[var(--theme-bg-tooltip)] hover:bg-[var(--theme-bg-tooltip)]/90 text-[var(--theme-text-content)] p-2 rounded-full transition-all disabled:opacity-30"
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
                      </ProductMediaGallery.Next>
                    </>
                  )}

                  {/* Image Counter */}
                  {totalImages > 1 && (
                    <ProductMediaGallery.Indicator>
                      {({ current, total }) => (
                        <div className="absolute bottom-4 right-4 bg-[var(--theme-bg-tooltip)] text-[var(--theme-text-content)] px-3 py-1 rounded-full text-sm">
                          {current} / {total}
                        </div>
                      )}
                    </ProductMediaGallery.Indicator>
                  )}
                </>
              )}
            </ProductMediaGallery.Viewport>
          </div>

          {/* Thumbnail Images */}
          <ProductMediaGallery.Indicator>
            {({ total }) => (
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: total }).map((_, i) => (
                  <ProductMediaGallery.Thumbnail key={i} index={i}>
                    {({ src, isActive, onSelect, alt }) => (
                      <div
                        onClick={onSelect}
                        className={`aspect-square bg-[var(--theme-bg-options)] rounded-lg border cursor-pointer transition-all ${isActive
                          ? "border-[var(--theme-border-primary-30)] ring-2 ring-[var(--theme-border-primary-20)]"
                          : "border-[var(--theme-border-primary-10)] hover:border-[var(--theme-border-primary-20)]"
                          }`}
                      >
                        {src ? (
                          <WixMediaImage
                            media={{ image: src }}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-[var(--theme-text-content-40)]"
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
                  </ProductMediaGallery.Thumbnail>
                ))}
              </div>
            )}
          </ProductMediaGallery.Indicator>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          {/* Product Name & Price */}
          <div>
            <Product.Name>
              {({ name }) => (
                <h1 className="text-4xl font-bold text-[var(--theme-text-content)] mb-4">
                  {name}
                </h1>
              )}
            </Product.Name>
            <SelectedVariant.Price>
              {({ price, compareAtPrice }) => (
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-[var(--theme-text-content)]">
                    {price}
                  </div>
                  {compareAtPrice &&
                    parseFloat(compareAtPrice.replace(/[^\d.]/g, "")) >
                    0 && (
                      <div className="text-lg font-medium text-[var(--theme-text-content-50)] line-through">
                        {compareAtPrice}
                      </div>
                    )}
                </div>
              )}
            </SelectedVariant.Price>
          </div>

          {/* Product Description */}
          <Product.Description>
            {({ description, plainDescription }) => (
              <>
                {plainDescription && (
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--theme-text-content)] mb-3">
                      Description
                    </h3>
                    {
                      <p
                        className="text-[var(--theme-text-content-80)] leading-relaxed"
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
            {({ options, hasOptions, selectedChoices }) => (
              <>
                {hasOptions && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-[var(--theme-text-content)]">
                      Product Options
                    </h3>

                    {options.map((option: any) => (
                      <div key={option.name}>
                        <ProductVariantSelector.Option option={option}>
                          {({ name, choices, hasChoices }) => (
                            <>
                              <h3 className="text-lg font-semibold text-[var(--theme-text-content)] mb-3">
                                {name}
                              </h3>
                              {hasChoices && (
                                <div className="flex flex-wrap gap-3">
                                  {choices.map((choice: any) => {
                                    // Check if this is a color option
                                    const isColorOption = String(name)
                                      .toLowerCase()
                                      .includes("color");
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
                                          onSelect,
                                        }) => (
                                          <>
                                            {isColorOption &&
                                              isVisible &&
                                              hasColorCode ? (
                                              // Color Swatch
                                              <div className="relative">
                                                <button
                                                  onClick={onSelect}
                                                  title={value}
                                                  className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${isSelected
                                                    ? "border-[var(--theme-primary-500)] shadow-lg scale-110 ring-2 ring-[var(--theme-primary-500)]/30"
                                                    : "border-[var(--theme-color-border-40)] hover:border-[var(--theme-color-border-80)] hover:scale-105"
                                                    } ${!isInStock
                                                      ? "grayscale"
                                                      : ""
                                                    }`}
                                                  style={{
                                                    backgroundColor:
                                                      choice.colorCode ||
                                                      "var(--theme-text-content-40)",
                                                  }}
                                                />
                                                {!isInStock && (
                                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <svg
                                                      className="w-6 h-6 text-[var(--theme-text-error)]"
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
                                            ) : isVisible && (
                                              // Regular Text Button
                                              <div className="relative">
                                                <button
                                                  onClick={onSelect}
                                                  className={`px-4 py-2 border rounded-lg transition-all duration-200 ${isSelected
                                                    ? "bg-[var(--theme-bg-primary-20)] border-[var(--theme-border-primary-30)] text-[var(--theme-text-primary-300)]"
                                                    : "bg-[var(--theme-bg-options)] hover:bg-[var(--theme-bg-primary-10)] border-[var(--theme-border-primary-10)] hover:border-[var(--theme-border-primary-20)] text-[var(--theme-text-content)]"
                                                    }`}
                                                >
                                                  {value}
                                                </button>
                                                {!isInStock && (
                                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <svg
                                                      className="w-6 h-6 text-[var(--theme-text-error)]"
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
                              )}
                            </>
                          )}
                        </ProductVariantSelector.Option>
                      </div>
                    ))}

                    {/* Reset Button - appears after all options */}
                    {Object.keys(selectedChoices).length > 0 && (
                      <div className="pt-4">
                        <button
                          onClick={() => {
                            // Reset all selections
                            const variantService =
                              useService(
                                SelectedVariantServiceDefinition
                              );
                            variantService.resetSelections();
                          }}
                          className="text-sm text-[var(--theme-text-primary-400)] hover:text-[var(--theme-text-primary-300)] transition-colors"
                        >
                          Reset Selections
                        </button>
                      </div>
                    )}
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
                    <h3 className="text-lg font-semibold text-[var(--theme-text-content)]">
                      Product Modifiers
                    </h3>

                    {modifiers.map((modifier: any) => (
                      <ProductModifiers.Modifier
                        key={modifier.name}
                        modifier={modifier}
                      >
                        {({
                          name,
                          type,
                          choices,
                          hasChoices,
                          mandatory,
                        }) => (
                          <div className="space-y-3">
                            <h4 className="text-md font-medium text-[var(--theme-text-content)]">
                              {name}{" "}
                              {mandatory && (
                                <span className="text-[var(--theme-text-error)]">
                                  *
                                </span>
                              )}
                            </h4>

                            {type === "SWATCH_CHOICES" &&
                              hasChoices && (
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
                                          onClick={onSelect}
                                          className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${isSelected
                                            ? "border-[var(--theme-text-primary-400)] shadow-lg scale-110 ring-2 ring-[var(--theme-text-primary-400)]/30"
                                            : "border-[var(--theme-border-primary-20)] hover:border-[var(--theme-border-primary-30)] hover:scale-105"
                                            }`}
                                          style={{
                                            backgroundColor:
                                              colorCode ||
                                              "var(--theme-text-content-40)",
                                          }}
                                          title={value}
                                        />
                                      )}
                                    </ProductModifiers.Choice>
                                  ))}
                                </div>
                              )}

                            {type === "TEXT_CHOICES" && hasChoices && (
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
                                      onSelect,
                                    }) => (
                                      <button
                                        onClick={onSelect}
                                        className={`px-4 py-2 border rounded-lg transition-all duration-200 ${isSelected
                                          ? "bg-[var(--theme-bg-primary-20)] border-[var(--theme-border-primary-30)] text-[var(--theme-text-primary-300)]"
                                          : "bg-[var(--theme-bg-options)] hover:bg-[var(--theme-bg-primary-10)] border-[var(--theme-border-primary-10)] hover:border-[var(--theme-border-primary-20)] text-[var(--theme-text-content)]"
                                          }`}
                                      >
                                        {value}
                                      </button>
                                    )}
                                  </ProductModifiers.Choice>
                                ))}
                              </div>
                            )}

                            {type === "FREE_TEXT" && (
                              <>
                                {mandatory ? (
                                  <FreeTextInput
                                    modifier={modifier}
                                    name={name}
                                  />
                                ) : (
                                  <ProductModifiers.ToggleFreeText
                                    modifier={modifier}
                                  >
                                    {({
                                      isTextInputShown,
                                      onToggle,
                                    }) => (
                                      <div className="space-y-3">
                                        <label className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            checked={isTextInputShown}
                                            onChange={onToggle}
                                            className="w-4 h-4 text-[var(--theme-text-primary-400)] rounded border-[var(--theme-border-primary-20)] focus:ring-[var(--theme-text-primary-400)]"
                                          />
                                          <span className="text-[var(--theme-text-content)]">
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
            <h3 className="text-lg font-semibold text-[var(--theme-text-content)]">
              Quantity
            </h3>
            <ProductVariantSelector.Stock>
              {({ inStock, isPreOrderEnabled, availableQuantity }) => {
                const variantService = useService(SelectedVariantServiceDefinition);
                const selectedQuantity = variantService.selectedQuantity.get();

                return (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[var(--theme-border-primary-20)] rounded-lg">
                      <button
                        onClick={() => variantService.decrementQuantity()}
                        disabled={selectedQuantity <= 1 || (!inStock && !isPreOrderEnabled)}
                        className="px-3 py-2 text-[var(--theme-text-content)] hover:bg-[var(--theme-bg-options)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-[var(--theme-text-content)] border-x border-[var(--theme-border-primary-20)] min-w-[3rem] text-center">
                        {selectedQuantity}
                      </span>
                      <button
                        onClick={() => variantService.incrementQuantity()}
                        disabled={!!availableQuantity && selectedQuantity >= availableQuantity || (!inStock && !isPreOrderEnabled)}
                        className="px-3 py-2 text-[var(--theme-text-content)] hover:bg-[var(--theme-bg-options)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    {/* Show max quantity only when out of stock AND preorder enabled */}
                    {!inStock && isPreOrderEnabled && availableQuantity && (
                      <span className="text-[var(--theme-text-content-60)] text-sm">
                        Max: {availableQuantity} Pre Order
                      </span>
                    )}
                    {/* Show stock message when in stock but available quantity < 10 */}
                    {inStock && availableQuantity && availableQuantity < 10 && (
                      <span className="text-[var(--theme-text-content-60)] text-sm">
                        Only {availableQuantity} left in stock
                      </span>
                    )}
                  </div>
                );
              }}
            </ProductVariantSelector.Stock>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <ProductVariantSelector.Trigger>
              {({
                onAddToCart,
                canAddToCart,
                isLoading,
                error,
                isPreOrderEnabled,
                inStock,
              }) => (
                <div className="space-y-4">
                  {error && (
                    <div className="bg-[var(--theme-text-error)]/10 border border-[var(--theme-text-error)]/20 rounded-lg p-3">
                      <p className="text-[var(--theme-text-error)] text-sm">
                        {error}
                      </p>
                    </div>
                  )}

                  <ProductActionButtons
                    onAddToCart={onAddToCart}
                    canAddToCart={canAddToCart}
                    isLoading={isLoading}
                    isPreOrderEnabled={isPreOrderEnabled}
                    inStock={inStock}
                    onShowSuccessMessage={setShowSuccessMessage}
                  />
                </div>
              )}
            </ProductVariantSelector.Trigger>

            {/* Stock Status */}
            <ProductVariantSelector.Stock>
              {({
                inStock,
                isPreOrderEnabled,
                status,
                availableQuantity,
                trackInventory,
                currentVariantId,
              }) =>
                currentVariantId && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${inStock || isPreOrderEnabled
                        ? "bg-[var(--theme-text-success)]"
                        : "bg-[var(--theme-text-error)]"
                        }`}
                    ></div>
                    <span
                      className={`text-sm ${inStock || isPreOrderEnabled
                        ? "text-[var(--theme-text-success)]"
                        : "text-[var(--theme-text-error)]"
                        }`}
                    >
                      {status}
                      {trackInventory && availableQuantity !== null && (
                        <span className="text-[var(--theme-text-content-60)] ml-1">
                          ({availableQuantity} available)
                        </span>
                      )}
                    </span>
                  </div>
                )
              }
            </ProductVariantSelector.Stock>
          </div>

          {/* Product Details */}
          <SelectedVariant.Details>
            {({ sku, weight }) => (
              <div className="border-t border-[var(--theme-border-primary-20)] pt-8">
                <h3 className="text-xl font-semibold text-[var(--theme-text-content)] mb-4">
                  Product Details
                </h3>
                <div className="space-y-3 text-[var(--theme-text-content-80)]">
                  <div className="flex justify-between">
                    <span>SKU:</span>
                    <span>{sku ? sku : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight:</span>
                    <span>{weight ? weight : "N/A"}</span>
                  </div>
                </div>
              </div>
            )}
          </SelectedVariant.Details>
        </div>
      </div>

      {/* Current Cart Summary */}
      <div className="mt-12 pt-8 border-t border-[var(--theme-border-primary-10)]">
        <CurrentCart.Summary>
          {({ subtotal, itemCount }) => (
            <>
              {itemCount > 0 && (
                <div className="bg-[var(--theme-bg-options)] backdrop-blur-sm rounded-xl p-6 border border-[var(--theme-border-primary-10)]">
                  <h3 className="text-xl font-semibold text-[var(--theme-text-content)] mb-4">
                    Cart Summary
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--theme-text-content-80)]">
                      {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
                    </span>
                    <span className="text-xl font-bold text-[var(--theme-text-content)]">
                      {subtotal}
                    </span>
                  </div>
                  <a
                    href="/cart"
                    className="mt-4 w-full text-[var(--theme-text-content)] font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      background: "var(--theme-btn-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "var(--theme-btn-secondary-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "var(--theme-btn-secondary)";
                    }}
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
    </>
  );
}
