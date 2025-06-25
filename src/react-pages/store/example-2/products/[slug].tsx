import React, { useState } from "react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { useService } from "@wix/services-manager-react";
import type { ServiceAPI } from "@wix/services-definitions";
import { KitchensinkLayout } from "../../../../layouts/KitchensinkLayout";
import { StoreLayout } from "../../../../layouts/StoreLayout";
import {
  withDocsWrapper,
  PageDocsRegistration,
} from "../../../../components/DocsMode";
import {
  ProductServiceDefinition,
  ProductService,
} from "../../../../headless/store/services/product-service";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../../../../headless/store/services/current-cart-service";
import {
  ProductMediaGalleryServiceDefinition,
  ProductMediaGalleryService,
} from "../../../../headless/store/services/product-media-gallery-service";
import {
  SelectedVariantServiceDefinition,
  SelectedVariantService,
} from "../../../../headless/store/services/selected-variant-service";
import {
  SocialSharingServiceDefinition,
  SocialSharingService,
  loadSocialSharingServiceConfig,
} from "../../../../headless/store/services/social-sharing-service";
import {
  RelatedProductsServiceDefinition,
  RelatedProductsService,
  loadRelatedProductsServiceConfig,
} from "../../../../headless/store/services/related-products-service";
import {
  ProductModifiersServiceDefinition,
  ProductModifiersService,
} from "../../../../headless/store/services/product-modifiers-service";
import { Product } from "../../../../headless/store/components/Product";
import { ProductVariantSelector } from "../../../../headless/store/components/ProductVariantSelector";
import { ProductMediaGallery } from "../../../../headless/store/components/ProductMediaGallery";
import { CurrentCart } from "../../../../headless/store/components/CurrentCart";
import { SocialSharing } from "../../../../headless/store/components/SocialSharing";
import { RelatedProducts } from "../../../../headless/store/components/RelatedProducts";
import { ProductModifiers } from "../../../../headless/store/components/ProductModifiers";
import WixMediaImage from "../../../../headless/media/components/Image";

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
        {withDocsWrapper(
          ({ src, alt, isLoading, currentIndex, totalImages }) => {
            return (
              <div className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden group">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                ) : src ? (
                  <WixMediaImage
                    media={{ image: src }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
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

                {totalImages > 1 && (
                  <>
                    <ProductMediaGallery.Previous>
                      {withDocsWrapper(
                        ({ onPrevious, canGoPrevious }) => (
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
                        ),
                        "ProductMediaGallery.Previous",
                        "/docs/components/product-media-gallery#previous"
                      )}
                    </ProductMediaGallery.Previous>

                    <ProductMediaGallery.Next>
                      {withDocsWrapper(
                        ({ onNext, canGoNext }) => (
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
                        ),
                        "ProductMediaGallery.Next",
                        "/docs/components/product-media-gallery#next"
                      )}
                    </ProductMediaGallery.Next>
                  </>
                )}

                <ProductMediaGallery.Indicator>
                  {withDocsWrapper(
                    ({ current, total, hasImages }) => (
                      <>
                        {hasImages && total > 1 && (
                          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                            {current} / {total}
                          </div>
                        )}
                      </>
                    ),
                    "ProductMediaGallery.Indicator",
                    "/docs/components/product-media-gallery#indicator"
                  )}
                </ProductMediaGallery.Indicator>
              </div>
            );
          },
          "ProductMediaGallery.Viewport",
          "/docs/components/product-media-gallery#viewport"
        )}
      </ProductMediaGallery.Viewport>

      <ProductMediaGallery.Indicator>
        {withDocsWrapper(
          ({ total, hasImages }) => (
            <>
              {hasImages && total > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {Array.from({ length: total }).map((_, index) => (
                    <ProductMediaGallery.Thumbnail key={index} index={index}>
                      {withDocsWrapper(
                        ({ src, isActive, onSelect, alt }) => (
                          <button
                            onClick={onSelect}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              isActive
                                ? "border-teal-500 ring-2 ring-teal-500/30"
                                : "border-white/20 hover:border-white/40"
                            }`}
                          >
                            {src && (
                              <WixMediaImage
                                media={{ image: src }}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </button>
                        ),
                        "ProductMediaGallery.Thumbnail",
                        "/docs/components/product-media-gallery#thumbnail"
                      )}
                    </ProductMediaGallery.Thumbnail>
                  ))}
                </div>
              )}
            </>
          ),
          "ProductMediaGallery.Indicator",
          "/docs/components/product-media-gallery#indicator"
        )}
      </ProductMediaGallery.Indicator>
    </div>
  );
};

// Reusable component for free text inputs
const FreeTextInput = ({ 
  modifier, 
  name 
}: { 
  modifier: any; 
  name: string; 
}) => (
  <ProductModifiers.FreeText modifier={modifier}>
    {withDocsWrapper(
      ({ value, onChange, charCount, isOverLimit, maxChars: textMaxChars, placeholder: freeTextPlaceholder }) => (
        <div className="space-y-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={freeTextPlaceholder || `Enter your ${name.toLowerCase()}...`}
            maxLength={textMaxChars}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            rows={3}
          />
          {textMaxChars && (
            <p className={`text-xs text-right ${isOverLimit ? 'text-red-400' : 'text-white/60'}`}>
              {charCount}/{textMaxChars}
            </p>
          )}
        </div>
      ),
      "ProductModifiers.FreeText",
      "/docs/components/product-modifiers#free-text"
    )}
  </ProductModifiers.FreeText>
);

const ProductInfo = ({ onAddToCart, servicesManager }: { onAddToCart: () => void; servicesManager: any }) => {
  const [quantity, setQuantity] = useState(1);
  
  // Get access to variant service for reset functionality
  const variantService = useService(SelectedVariantServiceDefinition) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  return (
    <div className="space-y-6">
      <div>
        <Product.Name>
          {withDocsWrapper(
            ({ name, hasName }) => (
              <>
                {hasName && (
                  <h1 className="text-4xl font-bold text-white mb-2">{name}</h1>
                )}
              </>
            ),
            "Product.Name",
            "/docs/components/product#name"
          )}
        </Product.Name>
      </div>

      <Product.Description>
        {withDocsWrapper(
          ({ description, hasDescription, isHtml }) => (
            <>
              {hasDescription && (
                <div className="text-white/80 text-lg">
                  {isHtml ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: description }}
                      className="prose prose-invert max-w-none"
                    />
                  ) : (
                    <p>{description}</p>
                  )}
                </div>
              )}
            </>
          ),
          "Product.Description",
          "/docs/components/product#description"
        )}
      </Product.Description>

      <ProductVariantSelector.Price>
        {withDocsWrapper(
          ({ price, compareAtPrice, isVariantPrice, currency }) => (
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white">{price}</div>
              {compareAtPrice && parseFloat(compareAtPrice.replace(/[^\d.]/g, '')) > 0 && (
                <div className="text-lg font-medium text-white/50 line-through">
                  {compareAtPrice}
              </div>
              )}
            </div>
          ),
          "ProductVariantSelector.Price",
          "/docs/components/product-variant-selector#price"
        )}
      </ProductVariantSelector.Price>

      <ProductVariantSelector.Stock>
        {withDocsWrapper(
          ({ inStock, status, quantity, trackInventory }) => {
            const isLowStock =
              trackInventory &&
              quantity !== null &&
              quantity <= 5 &&
              quantity > 0;

            // Simulate pre-order logic based on status
            const isPreorder = status && status.toLowerCase().includes("pre");

            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isPreorder
                        ? "bg-orange-500"
                        : inStock
                        ? isLowStock
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-sm ${
                      isPreorder
                        ? "text-orange-400"
                        : inStock
                        ? isLowStock
                          ? "text-yellow-400"
                          : "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {status}
                    {trackInventory && quantity !== null && (
                      <span className="ml-1">({quantity} available)</span>
                    )}
                  </span>
                </div>

                {isPreorder && (
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
                      ⚡ Only {quantity} left in stock - order soon!
                    </p>
                  </div>
                )}
              </div>
            );
          },
          "ProductVariantSelector.Stock",
          "/docs/components/product-variant-selector#stock"
        )}
      </ProductVariantSelector.Stock>

      <ProductVariantSelector.Options>
        {withDocsWrapper(
          ({ options, hasOptions }) => (
            <>
              {hasOptions && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Product Options
                    </h3>

                  {options.map((option: any) => (
                    <ProductVariantSelector.Option
                      key={option.name}
                      option={option}
                    >
                      {withDocsWrapper(
                        ({ name, choices, selectedValue, hasChoices }) => (
                          <>
                            {hasChoices && (
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
                                  {choices.map(
                                    (choice: any, choiceIndex: number) => {
                                      // Check if this is a color option
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
                                          {withDocsWrapper(
                                            ({
                                              value,
                                              isSelected,
                                              isAvailable,
                                              onSelect,
                                            }) => (
                                              <>
                                                {isColorOption &&
                                                hasColorCode ? (
                                                  // Color Swatch
                                                  <div className="relative">
                                                  <button
                                                    onClick={onSelect}
                                                    disabled={!isAvailable}
                                                    title={value}
                                                    className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                                                      isSelected
                                                        ? "border-teal-400 shadow-lg scale-110 ring-2 ring-teal-500/30"
                                                        : isAvailable
                                                        ? "border-white/30 hover:border-white/60 hover:scale-105"
                                                        : "border-white/10 opacity-50 cursor-not-allowed"
                                                    } ${
                                                      !isAvailable
                                                        ? "grayscale"
                                                        : ""
                                                    }`}
                                                    style={{
                                                      backgroundColor:
                                                        choice.colorCode ||
                                                        "#000000",
                                                    }}
                                                  />
                                                    {!isAvailable && (
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
                                                  // Regular Text Button
                                                  <div className="relative">
                                                  <button
                                                    onClick={onSelect}
                                                    disabled={!isAvailable}
                                                    className={`px-4 py-2 rounded-lg border transition-all ${
                                                      isSelected
                                                        ? "bg-teal-500 border-teal-500 text-white ring-2 ring-teal-500/30"
                                                        : isAvailable
                                                        ? "bg-white/5 border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                                                          : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                                                    }`}
                                                  >
                                                    {value}
                                                    </button>
                                                    {!isAvailable && (
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
                                            ),
                                            "ProductVariantSelector.Choice",
                                            "/docs/components/product-variant-selector#choice"
                                          )}
                                        </ProductVariantSelector.Choice>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        ),
                        "ProductVariantSelector.Option",
                        "/docs/components/product-variant-selector#option"
                      )}
                    </ProductVariantSelector.Option>
                  ))}
                  
                  {/* Reset Button - appears after all options */}
                  {variantService.hasAnySelections() && (
                    <div className="pt-2">
                      <button
                        onClick={() => variantService.resetSelections()}
                        className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                      >
                        Reset Selections
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ),
          "ProductVariantSelector.Options",
          "/docs/components/product-variant-selector#options"
        )}
      </ProductVariantSelector.Options>

      {/* Product Modifiers */}
      <ProductModifiers.Modifiers>
        {withDocsWrapper(
          ({ modifiers, hasModifiers, selectedModifiers, areAllRequiredModifiersFilled }) => (
            <>
              {hasModifiers && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">
                    Product Customizations
                  </h3>
                  
                  {modifiers.map((modifier: any) => (
                    <div key={modifier.name}>
                      <ProductModifiers.Modifier modifier={modifier}>
                        {withDocsWrapper(
                          ({ name, type, mandatory, choices, hasChoices, isFreeText, maxChars, placeholder }) => (
                            <div className="space-y-3">
                              <h4 className="text-md font-medium text-white">
                                {name}
                                {mandatory && <span className="text-red-400 ml-1">*</span>}
                              </h4>
                              
                              {isFreeText ? (
                                // FREE_TEXT modifier
                                <div className="space-y-2">
                                  {!mandatory ? (
                                    // Optional free text with toggle
                                    <ProductModifiers.ToggleFreeText modifier={modifier}>
                                      {withDocsWrapper(
                                        ({ isTextInputShown, onToggle, mandatory: toggleMandatory }) => (
                                          <div className="space-y-3">
                                            <label className="flex items-center gap-2">
                                              <input
                                                type="checkbox"
                                                checked={isTextInputShown}
                                                onChange={onToggle}
                                                className="rounded border-white/20 bg-white/10 text-teal-500 focus:ring-teal-500"
                                              />
                                              <span className="text-white/80">Enable</span>
                                            </label>
                                            
                                            {isTextInputShown && (
                                              <FreeTextInput modifier={modifier} name={name} />
                                            )}
                                          </div>
                                        ),
                                        "ProductModifiers.ToggleFreeText",
                                        "/docs/components/product-modifiers#toggle-free-text"
                                      )}
                                    </ProductModifiers.ToggleFreeText>
                                  ) : (
                                    // Mandatory free text (always shown)
                                    <FreeTextInput modifier={modifier} name={name} />
                                  )}
                                </div>
                              ) : hasChoices ? (
                                // SWATCH_CHOICES or TEXT_CHOICES modifier
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
                                        {withDocsWrapper(
                                          ({ value, isSelected, onSelect, colorCode }) => (
                                            <>
                                              {isColorModifier && hasColorCode ? (
                                                // Color Swatch for modifiers
                                                <button
                                                  onClick={onSelect}
                                                  title={value}
                                                  className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                                                    isSelected
                                                      ? "border-teal-400 shadow-lg scale-110 ring-2 ring-teal-500/30"
                                                      : "border-white/30 hover:border-white/60 hover:scale-105"
                                                  }`}
                                                  style={{
                                                    backgroundColor: colorCode || "#000000",
                                                  }}
                                                />
                                              ) : (
                                                // Regular Text Button for modifiers
                                                <button
                                                  onClick={onSelect}
                                                  className={`px-4 py-2 rounded-lg border transition-all ${
                                                    isSelected
                                                      ? "bg-teal-500 border-teal-500 text-white ring-2 ring-teal-500/30"
                                                      : "bg-white/5 border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                                                  }`}
                                                >
                                                  {value}
                                                </button>
                                              )}
                                            </>
                                          ),
                                          "ProductModifiers.Choice",
                                          "/docs/components/product-modifiers#choice"
                                        )}
                                      </ProductModifiers.Choice>
                                    );
                                  })}
                                </div>
                              ) : null}
                            </div>
                          ),
                          "ProductModifiers.Modifier",
                          "/docs/components/product-modifiers#modifier"
                        )}
                      </ProductModifiers.Modifier>
                    </div>
                  ))}
                </div>
              )}
            </>
          ),
          "ProductModifiers.Modifiers",
          "/docs/components/product-modifiers#modifiers"
        )}
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

      <ProductVariantSelector.Trigger quantity={quantity}>
        {withDocsWrapper(
          ({ onAddToCart, canAddToCart, isLoading, inStock, error }) => (
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
                      "Out of Stock"
                    ) : (
                      "Add to Cart"
                    )}
                  </button>

                  <button
                    onClick={async () => {
                      // Clear cart first, then add this product and proceed to checkout
                      try {
                        const cartService = servicesManager.getService(CurrentCartServiceDefinition);
                        await cartService.clearCart();
                      await onAddToCart();
                        await cartService.proceedToCheckout();
                      } catch (error) {
                        console.error('Buy now failed:', error);
                        // Fallback to cart page if checkout fails
                        window.location.href = "/cart";
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
                      "Out of Stock"
                    ) : (
                      "Buy Now"
                    )}
                  </button>
                </div>

                <SocialSharing.Platforms
                  url={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                  title="Check out this amazing product"
                  description="An amazing product you'll love"
                  hashtags={["product", "shop", "amazing"]}
                >
                  {withDocsWrapper(
                    ({
                      shareTwitter,
                      shareFacebook,
                      shareLinkedIn,
                      copyLink,
                    }) => {
                      const [copySuccess, setCopySuccess] = useState(false);

                      const handleCopyLink = async () => {
                        const success = await copyLink();
                        if (success) {
                          setCopySuccess(true);
                          setTimeout(() => setCopySuccess(false), 2000);
                        }
                      };

                      return (
                        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                          <span className="text-white/60 text-sm">Share:</span>

                          <button
                            onClick={shareTwitter}
                            className="p-2 rounded-full bg-white/10 hover:bg-blue-500/20 hover:text-blue-400 transition-all"
                            title="Share on Twitter"
                          >
                            <svg
                              className="w-4 h-4 text-white/60 hover:text-blue-400 transition-colors"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                          </button>

                          <button
                            onClick={shareFacebook}
                            className="p-2 rounded-full bg-white/10 hover:bg-blue-600/20 hover:text-blue-500 transition-all"
                            title="Share on Facebook"
                          >
                            <svg
                              className="w-4 h-4 text-white/60 hover:text-blue-500 transition-colors"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </button>

                          <button
                            onClick={shareLinkedIn}
                            className="p-2 rounded-full bg-white/10 hover:bg-blue-700/20 hover:text-blue-600 transition-all"
                            title="Share on LinkedIn"
                          >
                            <svg
                              className="w-4 h-4 text-white/60 hover:text-blue-600 transition-colors"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </button>

                          <button
                            onClick={handleCopyLink}
                            className="p-2 rounded-full bg-white/10 hover:bg-teal-500/20 hover:text-teal-400 transition-all relative"
                            title="Copy link"
                          >
                            {copySuccess ? (
                              <svg
                                className="w-4 h-4 text-teal-400"
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
                                className="w-4 h-4 text-white/60 hover:text-teal-400 transition-colors"
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
                            <span className="text-teal-400 text-xs ml-2 animate-fade-in">
                              Copied!
                            </span>
                          )}
                        </div>
                      );
                    },
                    "SocialSharing.Platforms",
                    "/docs/components/social-sharing#platforms"
                  )}
                </SocialSharing.Platforms>
              </div>
            </div>
          ),
          "ProductVariantSelector.Trigger",
          "/docs/components/product-variant-selector#trigger"
        )}
      </ProductVariantSelector.Trigger>

      <Product.Details>
        {withDocsWrapper(
          ({ sku, weight, hasSku, hasWeight }) => (
            <>
              {(hasSku || hasWeight) && (
                <div className="border-t border-white/10 pt-6 space-y-2">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Product Details
                  </h3>
                  {hasSku && (
                    <p className="text-white/60 text-sm">
                      <span className="font-medium">SKU:</span> {sku}
                    </p>
                  )}
                  {hasWeight && (
                    <p className="text-white/60 text-sm">
                      <span className="font-medium">Weight:</span> {weight}
                    </p>
                  )}
                </div>
              )}
            </>
          ),
          "Product.Details",
          "/docs/components/product#details"
        )}
      </Product.Details>

      <RelatedProducts.List>
        {withDocsWrapper(
          ({ products, isLoading, error, hasProducts }) => (
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                You might also like
              </h3>

              {isLoading && (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
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
                        {withDocsWrapper(
                          ({
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
                                  <WixMediaImage
                                    media={{ image: image }}
                                    className="w-full h-full object-cover"
                                  />
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
                                <p className="text-white font-semibold">
                                  {price}
                                </p>
                                {!available && (
                                  <span className="text-red-400 text-xs">
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                            </a>
                          ),
                          "RelatedProducts.Item",
                          "/docs/components/related-products#item"
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
          ),
          "RelatedProducts.List",
          "/docs/components/related-products#list"
        )}
      </RelatedProducts.List>
    </div>
  );
};

export default function ProductDetailPage({
  productServiceConfig,
  currentCartServiceConfig,
  productMediaGalleryServiceConfig,
  selectedVariantServiceConfig,
  socialSharingServiceConfig,
  relatedProductsServiceConfig,
  productModifiersServiceConfig,
}: ProductDetailPageProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  let servicesMap = createServicesMap()
    .addService(
      ProductServiceDefinition,
      ProductService,
      productServiceConfig
    )
    .addService(
      CurrentCartServiceDefinition,
      CurrentCartService,
      currentCartServiceConfig
    )
    .addService(
      SelectedVariantServiceDefinition,
      SelectedVariantService,
      selectedVariantServiceConfig
    )
    .addService(
      ProductMediaGalleryServiceDefinition,
      ProductMediaGalleryService,
      productMediaGalleryServiceConfig
    )
    .addService(
      SocialSharingServiceDefinition,
      SocialSharingService,
      socialSharingServiceConfig
    )
    .addService(
      RelatedProductsServiceDefinition,
      RelatedProductsService,
      relatedProductsServiceConfig
    );

  // Add product modifiers service if available
  if (productModifiersServiceConfig) {
    servicesMap = servicesMap.addService(
      ProductModifiersServiceDefinition,
      ProductModifiersService,
      productModifiersServiceConfig
    );
  }

  const servicesManager = createServicesManager(servicesMap);

  return (
    <KitchensinkLayout>
      <StoreLayout
        currentCartServiceConfig={currentCartServiceConfig}
        servicesManager={servicesManager}
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
                {withDocsWrapper(
                  ({ subtotal, itemCount }) => (
                    <>
                      {itemCount > 0 && (
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                          <h3 className="text-xl font-semibold text-white mb-4">
                            Cart Summary
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-white/80">
                              {itemCount} item{itemCount !== 1 ? "s" : ""} in
                              cart
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
                  ),
                  "CurrentCart.Summary",
                  "/docs/components/current-cart#summary"
                )}
              </CurrentCart.Summary>
            </div>
          </div>
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
