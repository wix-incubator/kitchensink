import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { useState } from "react";
import { WixMediaImage } from "../../../headless/media/components";
import { CurrentCart } from "../../../headless/ecom/components";
import { 
  Product,
  ProductMediaGallery,
  ProductModifiers,
  ProductVariantSelector,
  RelatedProducts,
  SocialSharing,
} from "../../../headless/store/components";
import {
  CurrentCartServiceDefinition,
} from "../../../headless/ecom/services/current-cart-service";
import { SelectedVariantServiceDefinition } from "../../../headless/store/services/selected-variant-service";

interface ProductDetailPageProps {
  productServiceConfig: any;
  currentCartServiceConfig: any;
  productMediaGalleryServiceConfig: any;
  selectedVariantServiceConfig: any;
  socialSharingServiceConfig: any;
  relatedProductsServiceConfig: any;
  productModifiersServiceConfig?: any;
}

const ProductImageGallery = () => {
  return (
    <div className="space-y-4">
      <ProductMediaGallery.Viewport>
        {({ src, isLoading, totalImages }) => {
          return (
            <div className="relative aspect-square theme-bg-card rounded-2xl overflow-hidden group">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 theme-text-content"></div>
                </div>
              ) : src ? (
                <WixMediaImage
                  media={{ image: src }}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

              {totalImages > 1 && (
                <>
                  <ProductMediaGallery.Previous>
                    {({ onPrevious, canGoPrevious }) => (
                      <>
                        {canGoPrevious && (
                          <button
                            onClick={onPrevious}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 theme-bg-overlay theme-text-content p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                  </ProductMediaGallery.Previous>

                  <ProductMediaGallery.Next>
                    {({ onNext, canGoNext }) => (
                      <>
                        {canGoNext && (
                          <button
                            onClick={onNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 theme-bg-overlay theme-text-content p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                  </ProductMediaGallery.Next>
                </>
              )}

              <ProductMediaGallery.Indicator>
                {({ current, total, hasImages }) => (
                  <>
                    {hasImages && total > 1 && (
                      <div className="absolute bottom-4 left-4 theme-bg-overlay theme-text-content px-2 py-1 rounded text-sm">
                        {current} / {total}
                      </div>
                    )}
                  </>
                )}
              </ProductMediaGallery.Indicator>
            </div>
          );
        }}
      </ProductMediaGallery.Viewport>

      <ProductMediaGallery.Indicator>
        {({ total, hasImages }) => (
          <>
            {hasImages && total > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {Array.from({ length: total }).map((_, index) => (
                  <ProductMediaGallery.Thumbnail key={index} index={index}>
                    {({ src, isActive, onSelect, alt }) => (
                      <button
                        onClick={onSelect}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          isActive
                            ? "theme-color-border-80 ring-2 ring-primary-500/30"
                            : "theme-border-card theme-border-card-hover"
                        }`}
                      >
                        {src && (
                          <WixMediaImage
                            media={{ image: src }}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    )}
                  </ProductMediaGallery.Thumbnail>
                ))}
              </div>
            )}
          </>
        )}
      </ProductMediaGallery.Indicator>
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
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            freeTextPlaceholder || `Enter your ${name.toLowerCase()}...`
          }
          maxLength={textMaxChars}
          className="w-full px-3 py-2 theme-bg-options border theme-border-card rounded-lg theme-text-content placeholder-theme-text-content-50 focus:theme-color-border-80 focus:ring-1 focus:ring-primary-500 resize-none"
          rows={3}
        />
        {textMaxChars && (
          <p
            className={`text-xs text-right ${
              isOverLimit ? "theme-text-error" : "theme-text-content-60"
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
  onAddToCart,
  showRelatedProducts = false,
}: {
  onAddToCart: () => void;
  showRelatedProducts?: boolean;
}) => {
  const [quantity, setQuantity] = useState(1);

  // Get access to variant service for reset functionality
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;
  const cartService = useService(
    CurrentCartServiceDefinition
  );

  return (
    <div className="space-y-6">
      <Product.Name>
        {({ name, hasName }) =>
          hasName ? (
            <h1 className="text-4xl font-bold theme-text-content mb-2">{name}</h1>
          ) : null
        }
      </Product.Name>

      <Product.Description>
        {({ description, hasDescription, isHtml }) =>
          hasDescription ? (
            <div className="theme-text-content-80 text-lg">
              {isHtml ? (
                <div
                  dangerouslySetInnerHTML={{ __html: description }}
                  className="prose prose-invert max-w-none"
                />
              ) : (
                <p>{description}</p>
              )}
            </div>
          ) : null
        }
      </Product.Description>

      <ProductVariantSelector.Price>
        {({ price, compareAtPrice, isVariantPrice, currency }) => (
          <div className="space-y-1">
            <div className="text-3xl font-bold theme-text-content">{price}</div>
            {compareAtPrice &&
              parseFloat(compareAtPrice.replace(/[^\d.]/g, "")) > 0 && (
                <div className="text-lg font-medium theme-text-content-50 line-through">
                  {compareAtPrice}
                </div>
              )}
            {currency && (
              <p className="theme-text-content-60 text-sm">Currency: {currency}</p>
            )}
          </div>
        )}
      </ProductVariantSelector.Price>

      <ProductVariantSelector.Stock>
        {({ inStock, status, quantity, trackInventory }) => {
          const isLowStock =
            trackInventory &&
            quantity !== null &&
            quantity <= 5 &&
            quantity > 0;
          const isPreorder = status && status.toLowerCase().includes("pre");
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isPreorder
                      ? "theme-status-preorder"
                      : inStock
                      ? isLowStock
                        ? "theme-status-warning"
                        : "theme-status-success"
                      : "theme-status-error"
                  }`}
                ></div>
                <span
                  className={`text-sm ${
                    isPreorder
                      ? "theme-text-preorder"
                      : inStock
                      ? isLowStock
                        ? "theme-text-warning"
                        : "theme-text-success"
                      : "theme-text-error"
                  }`}
                >
                  {status}
                  {trackInventory && quantity !== null && (
                    <span className="ml-1">({quantity} available)</span>
                  )}
                </span>
              </div>
              {isPreorder && (
                <div className="theme-bg-preorder theme-border-preorder border rounded-lg p-2">
                  <p className="theme-text-preorder text-xs">
                    🚀 This item is available for pre-order and will ship when
                    available
                  </p>
                </div>
              )}
              {isLowStock && (
                <div className="theme-bg-warning theme-border-warning border rounded-lg p-2">
                  <p className="theme-text-warning text-xs">
                    ⚡ Only {quantity} left in stock - order soon!
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
              <h3 className="text-lg font-semibold theme-text-content">
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
                        <h4 className="text-md font-medium theme-text-content-90">
                          {name}
                          {selectedValue && (
                            <span className="ml-2 text-sm theme-text-primary-400">
                              ({selectedValue})
                            </span>
                          )}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {choices.map((choice: any, choiceIndex: number) => {
                            const isColorOption = String(name)
                              .toLowerCase()
                              .includes("color");
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
                                  isAvailable,
                                  onSelect,
                                }) => (
                                  <>
                                    {isColorOption && hasColorCode ? (
                                      <div className="relative">
                                        <button
                                          onClick={onSelect}
                                          disabled={!isAvailable}
                                          title={value}
                                          className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                                            isSelected
                                              ? "theme-color-border-80 shadow-lg scale-110 ring-2 ring-primary-500/30"
                                              : isAvailable
                                              ? "theme-border-card hover:theme-border-card-hover hover:scale-105"
                                              : "theme-border-card opacity-50 cursor-not-allowed"
                                          } ${!isAvailable ? "grayscale" : ""}`}
                                          style={{
                                            backgroundColor:
                                              choice.colorCode || "#000000",
                                          }}
                                        />
                                        {!isAvailable && (
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <svg
                                              className="w-6 h-6 theme-text-error"
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
                                          disabled={!isAvailable}
                                          className={`px-4 py-2 rounded-lg border transition-all ${
                                            isSelected
                                              ? "theme-btn-primary theme-color-border-80 theme-text-content ring-2 ring-primary-500/30"
                                              : isAvailable
                                              ? "theme-bg-card theme-border-card theme-text-content hover:theme-border-card-hover hover:theme-bg-options"
                                              : "theme-bg-card theme-border-card theme-text-content-30 cursor-not-allowed"
                                          }`}
                                        >
                                          {value}
                                        </button>
                                        {!isAvailable && (
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <svg
                                              className="w-6 h-6 theme-text-error"
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
              {variantService.hasAnySelections() && (
                <div className="pt-2">
                  <button
                    onClick={() => variantService.resetSelections()}
                    className="text-sm theme-text-primary-400 hover:theme-text-primary-300 transition-colors"
                  >
                    Reset Selections
                  </button>
                </div>
              )}
            </div>
          ) : null
        }
      </ProductVariantSelector.Options>

      <ProductModifiers.Modifiers>
        {({
          modifiers,
          hasModifiers,
          selectedModifiers,
          areAllRequiredModifiersFilled,
        }) =>
          hasModifiers ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold theme-text-content">
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
                      maxChars,
                      placeholder,
                    }) => (
                      <div className="space-y-3">
                        <h4 className="text-md font-medium theme-text-content">
                          {name}
                          {mandatory && (
                            <span className="theme-text-error ml-1">*</span>
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
                                  mandatory: toggleMandatory,
                                }) => (
                                  <div className="space-y-3">
                                    <label className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={isTextInputShown}
                                        onChange={onToggle}
                                        className="rounded theme-border-card theme-bg-options theme-text-primary-400 focus:ring-primary-500"
                                      />
                                      <span className="theme-text-content-80">
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
                              const isColorModifier = type === "SWATCH_CHOICES";
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
                                              ? "theme-color-border-80 shadow-lg scale-110 ring-2 ring-primary-500/30"
                                              : "theme-border-card hover:theme-border-card-hover hover:scale-105"
                                          }`}
                                          style={{
                                            backgroundColor:
                                              colorCode || "#000000",
                                          }}
                                        />
                                      ) : (
                                        <button
                                          onClick={onSelect}
                                          className={`px-4 py-2 rounded-lg border transition-all ${
                                            isSelected
                                              ? "theme-btn-primary theme-color-border-80 theme-text-content ring-2 ring-primary-500/30"
                                              : "theme-bg-card theme-border-card theme-text-content hover:theme-border-card-hover hover:theme-bg-options"
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
        <h3 className="text-lg font-semibold theme-text-content">Quantity</h3>
        <div className="flex items-center gap-3">
                      <div className="flex items-center border theme-border-card rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-3 py-2 theme-text-content hover:theme-bg-options disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <span className="px-4 py-2 theme-text-content border-x theme-border-card min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 theme-text-content hover:theme-bg-options transition-colors"
            >
              +
            </button>
          </div>
          <span className="theme-text-content-60 text-sm">Max: 10 per order</span>
        </div>
        <button
          onClick={() => setQuantity(1)}
          className="text-sm theme-text-primary-400 hover:theme-text-primary-300 transition-colors"
        >
          Reset Quantity
        </button>
      </div>

      <ProductVariantSelector.Trigger quantity={quantity}>
        {({ onAddToCart, canAddToCart, isLoading, inStock, error }) => (
          <div className="space-y-4">
            {error && (
              <div className="theme-bg-error theme-border-error border rounded-lg p-3">
                <p className="theme-text-error text-sm">{error}</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    await onAddToCart();
                  }}
                  disabled={!canAddToCart || isLoading}
                  className="flex-1 theme-btn-primary hover:theme-btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed theme-text-content font-semibold py-3 px-6 rounded-lg transition-all duration-200"
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
                    "Out of Stock"
                  ) : (
                    "Add to Cart"
                  )}
                </button>
                <button
                  onClick={async () => {
                    try {
                      await cartService.clearCart();
                      await onAddToCart();
                      await cartService.proceedToCheckout();
                    } catch (error) {
                      console.error("Buy now failed:", error);
                      window.location.href = "/cart";
                    }
                  }}
                  disabled={!canAddToCart || isLoading}
                  className="flex-1 theme-btn-buy-now hover:theme-btn-buy-now-hover disabled:opacity-50 disabled:cursor-not-allowed theme-text-content font-semibold py-3 px-6 rounded-lg transition-all duration-200"
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
                    "Out of Stock"
                  ) : (
                    "Buy Now"
                  )}
                </button>
              </div>
              <SocialSharing.Platforms
                url={typeof window !== "undefined" ? window.location.href : ""}
                title="Check out this amazing product"
                description="An amazing product you'll love"
                hashtags={["product", "shop", "amazing"]}
              >
                {({ shareTwitter, shareFacebook, shareLinkedIn, copyLink }) => {
                  const [copySuccess, setCopySuccess] = useState(false);
                  const handleCopyLink = async () => {
                    const success = await copyLink();
                    if (success) {
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2000);
                    }
                  };
                  return (
                    <div className="flex items-center gap-2 pt-2 border-t theme-border-card">
                      <span className="theme-text-content-60 text-sm">Share:</span>
                      <button
                        onClick={shareTwitter}
                        className="p-2 rounded-full theme-bg-options hover:theme-bg-social-twitter hover:theme-text-social-twitter transition-all"
                        title="Share on Twitter"
                      >
                        <svg
                          className="w-4 h-4 theme-text-content-60 hover:theme-text-social-twitter transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </button>
                      <button
                        onClick={shareFacebook}
                        className="p-2 rounded-full theme-bg-options hover:theme-bg-social-facebook hover:theme-text-social-facebook transition-all"
                        title="Share on Facebook"
                      >
                        <svg
                          className="w-4 h-4 theme-text-content-60 hover:theme-text-social-facebook transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </button>
                      <button
                        onClick={shareLinkedIn}
                        className="p-2 rounded-full theme-bg-options hover:theme-bg-social-linkedin hover:theme-text-social-linkedin transition-all"
                        title="Share on LinkedIn"
                      >
                        <svg
                          className="w-4 h-4 theme-text-content-60 hover:theme-text-social-linkedin transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className="p-2 rounded-full theme-bg-options hover:theme-bg-social-twitter hover:theme-text-primary-400 transition-all relative"
                        title="Copy link"
                      >
                        {copySuccess ? (
                          <svg
                            className="w-4 h-4 theme-text-primary-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 theme-text-content-60 hover:theme-text-primary-400 transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                        )}
                      </button>
                      {copySuccess && (
                        <span className="theme-text-primary-400 text-xs ml-2 animate-fade-in">
                          Copied!
                        </span>
                      )}
                    </div>
                  );
                }}
              </SocialSharing.Platforms>
            </div>
          </div>
        )}
      </ProductVariantSelector.Trigger>

      <Product.Details>
        {({ sku, weight, hasSku, hasWeight }) =>
          hasSku || hasWeight ? (
            <div className="border-t theme-border-card pt-6 space-y-2">
              <h3 className="text-lg font-semibold theme-text-content mb-3">
                Product Details
              </h3>
              {hasSku && (
                <p className="theme-text-content-60 text-sm">
                  <span className="font-medium">SKU:</span> {sku}
                </p>
              )}
              {hasWeight && (
                <p className="theme-text-content-60 text-sm">
                  <span className="font-medium">Weight:</span> {weight}
                </p>
              )}
            </div>
          ) : null
        }
      </Product.Details>
      { showRelatedProducts && (
        <RelatedProducts.List>
        {({ products, isLoading, error, hasProducts }) => (
          <div className="border-t theme-border-card pt-6">
            <h3 className="text-lg font-semibold theme-text-content mb-4">
              You might also like
            </h3>
            {isLoading && (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="theme-bg-card rounded-lg p-4 border theme-border-card animate-pulse"
                  >
                    <div className="aspect-square theme-bg-loading rounded-lg mb-3"></div>
                    <div className="h-4 theme-bg-loading rounded mb-2"></div>
                    <div className="h-3 theme-bg-loading rounded mb-2 w-3/4"></div>
                    <div className="h-4 theme-bg-loading rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}
            {error && (
              <div className="theme-bg-error border theme-border-error rounded-lg p-4">
                <p className="theme-text-error text-sm">
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
                          className="theme-bg-card rounded-lg p-4 border theme-border-card hover:theme-border-card-hover transition-all duration-200 group cursor-pointer block"
                        >
                          <div className="aspect-square theme-bg-loading rounded-lg mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-200">
                            {image ? (
                              <WixMediaImage
                                media={{ image: image }}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 theme-text-content-40"
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
                          <h4 className="theme-text-content font-medium text-sm mb-1 group-hover:theme-text-primary-400 transition-colors line-clamp-2">
                            {title}
                          </h4>
                          {description && (
                            <p className="theme-text-content-60 text-xs mb-2 line-clamp-2">
                              {description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="theme-text-content font-semibold">{price}</p>
                            {!available && (
                              <span className="theme-text-error text-xs">
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
                  className="w-12 h-12 theme-text-content-30 mx-auto mb-3"
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
                <p className="theme-text-content-60 text-sm">
                  No related products found
                </p>
              </div>
            )}
          </div>
        )}
      </RelatedProducts.List>
      )}
    </div>
  );
};

export default function ProductDetailPage({
  setShowSuccessMessage,
  showRelatedProducts,
}: {
  setShowSuccessMessage: (show: boolean) => void
  showRelatedProducts?: boolean;
}) {
  return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <ProductImageGallery />
          </div>

          <div>
            <ProductInfo
              showRelatedProducts={showRelatedProducts}
              onAddToCart={() => {
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
              }}
            />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t theme-border-card">
          <CurrentCart.Summary>
            {({ subtotal, itemCount }) => (
              <>
                {itemCount > 0 && (
                  <div className="theme-bg-card backdrop-blur-sm rounded-xl p-6 border theme-border-card">
                    <h3 className="text-xl font-semibold theme-text-content mb-4">
                      Cart Summary
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="theme-text-content-80">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
                      </span>
                      <span className="text-xl font-bold theme-text-content">
                        {subtotal}
                      </span>
                    </div>
                    <a
                      href="/cart"
                      className="mt-4 w-full theme-btn-view-cart hover:theme-btn-view-cart-hover theme-text-content font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
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
