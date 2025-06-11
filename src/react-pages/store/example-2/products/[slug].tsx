import React, { useState } from "react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { KitchensinkLayout } from "../../../../layouts/KitchensinkLayout";
import { StoreLayout } from "../../../../layouts/StoreLayout";
import {
  withDocsWrapper,
  PageDocsRegistration,
} from "../../../../components/DocsMode";
import {
  ProductServiceDefinition,
  ProductService,
} from "../../../../headless/store/product-service";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../../../../headless/store/current-cart-service";
import {
  ProductMediaGalleryServiceDefinition,
  ProductMediaGalleryService,
} from "../../../../headless/store/product-media-gallery-service";
import {
  SelectedVariantServiceDefinition,
  SelectedVariantService,
} from "../../../../headless/store/selected-variant-service";
import { Product } from "../../../../headless/store/Product";
import { ProductVariantSelector } from "../../../../headless/store/ProductVariantSelector";
import { ProductMediaGallery } from "../../../../headless/store/ProductMediaGallery";
import { CurrentCart } from "../../../../headless/store/CurrentCart";

interface ProductDetailPageProps {
  productServiceConfig: any;
  currentCartServiceConfig: any;
  productMediaGalleryServiceConfig: any;
  selectedVariantServiceConfig: any;
}

const ProductImageGallery = () => {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <ProductMediaGallery.SelectedImage>
        {withDocsWrapper(
          ({ imageUrl, altText, isLoading, currentIndex, totalImages }) => (
            <div className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden group">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt={altText}
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

              {/* Navigation Arrows */}
              {totalImages > 1 && (
                <>
                  <ProductMediaGallery.PrevImageButton>
                    {withDocsWrapper(
                      ({ prevImage, hasPrev }) => (
                        <>
                          {hasPrev && (
                            <button
                              onClick={prevImage}
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
                      "ProductMediaGallery.PrevImageButton",
                      "/docs/components/product-media-gallery#previmagebutton"
                    )}
                  </ProductMediaGallery.PrevImageButton>

                  <ProductMediaGallery.NextImageButton>
                    {withDocsWrapper(
                      ({ nextImage, hasNext }) => (
                        <>
                          {hasNext && (
                            <button
                              onClick={nextImage}
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
                      "ProductMediaGallery.NextImageButton",
                      "/docs/components/product-media-gallery#nextimagebutton"
                    )}
                  </ProductMediaGallery.NextImageButton>
                </>
              )}

              {/* Image Counter */}
              <ProductMediaGallery.MediaGalleryInfo>
                {withDocsWrapper(
                  ({ currentImage, totalImages, hasImages }) => (
                    <>
                      {hasImages && totalImages > 1 && (
                        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          {currentImage} / {totalImages}
                        </div>
                      )}
                    </>
                  ),
                  "ProductMediaGallery.MediaGalleryInfo",
                  "/docs/components/product-media-gallery#mediagalleryinfo"
                )}
              </ProductMediaGallery.MediaGalleryInfo>
            </div>
          ),
          "ProductMediaGallery.SelectedImage",
          "/docs/components/product-media-gallery#selectedimage"
        )}
      </ProductMediaGallery.SelectedImage>

      {/* Thumbnails */}
      <ProductMediaGallery.MediaGalleryInfo>
        {withDocsWrapper(
          ({ totalImages, hasImages }) => (
            <>
              {hasImages && totalImages > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {Array.from({ length: totalImages }).map((_, index) => (
                    <ProductMediaGallery.MediaItemThumbnail
                      key={index}
                      index={index}
                    >
                      {withDocsWrapper(
                        ({ imageUrl, isActive, selectImage, altText }) => (
                          <button
                            onClick={selectImage}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              isActive
                                ? "border-teal-500 ring-2 ring-teal-500/30"
                                : "border-white/20 hover:border-white/40"
                            }`}
                          >
                            {imageUrl && (
                              <img
                                src={imageUrl}
                                alt={altText}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </button>
                        ),
                        "ProductMediaGallery.MediaItemThumbnail",
                        "/docs/components/product-media-gallery#mediaitemthumbnail"
                      )}
                    </ProductMediaGallery.MediaItemThumbnail>
                  ))}
                </div>
              )}
            </>
          ),
          "ProductMediaGallery.MediaGalleryInfo",
          "/docs/components/product-media-gallery#mediagalleryinfo"
        )}
      </ProductMediaGallery.MediaGalleryInfo>
    </div>
  );
};

const ProductInfo = ({ onAddToCart }: { onAddToCart: () => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  return (
    <div className="space-y-6">
      {/* Product Name & Wishlist */}
      <div className="flex items-start justify-between gap-4">
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

        {/* Wishlist Toggle */}
        <button
          onClick={() => setIsWishlist(!isWishlist)}
          className="flex-shrink-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            className={`w-6 h-6 ${
              isWishlist ? "text-red-400 fill-current" : "text-white/60"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Product Description */}
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

      {/* Ratings & Reviews (Stubbed) */}
      <div className="border-y border-white/10 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  star <= 4 ? "text-yellow-400 fill-current" : "text-white/20"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-white/80">4.0 (247 reviews)</span>
          <button className="text-teal-400 hover:text-teal-300 text-sm transition-colors">
            Read Reviews
          </button>
        </div>
      </div>

      {/* Product Price */}
      <ProductVariantSelector.ProductPrice>
        {withDocsWrapper(
          ({ price, isVariantPrice, currency }) => (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white">{price}</span>
                {isVariantPrice && (
                  <span className="bg-teal-500/20 text-teal-300 text-sm px-2 py-1 rounded-full">
                    Variant Price
                  </span>
                )}
              </div>
              {currency && (
                <p className="text-white/60 text-sm">Currency: {currency}</p>
              )}
            </div>
          ),
          "ProductVariantSelector.ProductPrice",
          "/docs/components/product-variant-selector#productprice"
        )}
      </ProductVariantSelector.ProductPrice>

      {/* Enhanced Stock Status with Low Stock Warning & Pre-order */}
      <ProductVariantSelector.StockStatus>
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

                {/* Pre-order Badge */}
                {isPreorder && (
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-2">
                    <p className="text-orange-300 text-xs">
                      🚀 This item is available for pre-order and will ship when
                      available
                    </p>
                  </div>
                )}

                {/* Low Stock Warning */}
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
          "ProductVariantSelector.StockStatus",
          "/docs/components/product-variant-selector#stockstatus"
        )}
      </ProductVariantSelector.StockStatus>

      {/* Product Options with Reset */}
      <ProductVariantSelector.ProductOptions>
        {withDocsWrapper(
          ({ options, hasOptions, selectedOptions }) => (
            <>
              {hasOptions && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Product Options
                    </h3>
                    {/* Reset Quantity Button */}
                    <button
                      onClick={() => setQuantity(1)}
                      className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      Reset Quantity
                    </button>
                  </div>

                  {options.map((option) => (
                    <ProductVariantSelector.ProductOptionChoices
                      key={option.name}
                      option={option}
                    >
                      {withDocsWrapper(
                        ({
                          optionName,
                          choices,
                          selectedValue,
                          hasChoices,
                        }) => (
                          <>
                            {hasChoices && (
                              <div className="space-y-3">
                                <h4 className="text-md font-medium text-white/90">
                                  {optionName}
                                  {selectedValue && (
                                    <span className="ml-2 text-sm text-teal-400">
                                      ({selectedValue})
                                    </span>
                                  )}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {choices.map((choice) => (
                                    <ProductVariantSelector.ChoiceSelection
                                      key={choice.value}
                                      option={option}
                                      choice={choice}
                                    >
                                      {withDocsWrapper(
                                        ({
                                          displayValue,
                                          isSelected,
                                          isAvailable,
                                          selectChoice,
                                        }) => (
                                          <button
                                            onClick={selectChoice}
                                            disabled={!isAvailable}
                                            className={`px-4 py-2 rounded-lg border transition-all ${
                                              isSelected
                                                ? "bg-teal-500 border-teal-500 text-white ring-2 ring-teal-500/30"
                                                : isAvailable
                                                ? "bg-white/5 border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                                                : "bg-white/5 border-white/10 text-white/50 cursor-not-allowed line-through"
                                            }`}
                                          >
                                            {displayValue}
                                            {!isAvailable && (
                                              <span className="ml-1 text-xs">
                                                (unavailable)
                                              </span>
                                            )}
                                          </button>
                                        ),
                                        "ProductVariantSelector.ChoiceSelection",
                                        "/docs/components/product-variant-selector#choiceselection"
                                      )}
                                    </ProductVariantSelector.ChoiceSelection>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ),
                        "ProductVariantSelector.ProductOptionChoices",
                        "/docs/components/product-variant-selector#productoptionchoices"
                      )}
                    </ProductVariantSelector.ProductOptionChoices>
                  ))}
                </div>
              )}
            </>
          ),
          "ProductVariantSelector.ProductOptions",
          "/docs/components/product-variant-selector#productoptions"
        )}
      </ProductVariantSelector.ProductOptions>

      {/* Quantity Selector */}
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
      </div>

      {/* Add to Cart & Buy Now */}
      <ProductVariantSelector.AddToCartTrigger quantity={quantity}>
        {withDocsWrapper(
          ({ addToCart, canAddToCart, isLoading, inStock, error }) => (
            <div className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  {/* Add to Cart Button */}
                  <button
                    onClick={async () => {
                      await addToCart();
                      onAddToCart();
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

                  {/* Buy Now Button */}
                  <button
                    onClick={async () => {
                      await addToCart();
                      onAddToCart();
                      // Simulate redirect to checkout
                      setTimeout(() => {
                        window.location.href = "/checkout";
                      }, 1000);
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

                {/* Social Sharing (Stubbed) */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <span className="text-white/60 text-sm">Share:</span>
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <svg
                      className="w-4 h-4 text-white/60"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <svg
                      className="w-4 h-4 text-white/60"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <svg
                      className="w-4 h-4 text-white/60"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ),
          "ProductVariantSelector.AddToCartTrigger",
          "/docs/components/product-variant-selector#addtocarttrigger"
        )}
      </ProductVariantSelector.AddToCartTrigger>

      {/* Product Details */}
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

      {/* Related Products (Stubbed) */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          You might also like
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
            >
              <div className="aspect-square bg-white/10 rounded-lg mb-3 flex items-center justify-center">
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
              <h4 className="text-white font-medium text-sm mb-1">
                Related Product {item}
              </h4>
              <p className="text-white/60 text-xs mb-2">Sample description</p>
              <p className="text-white font-semibold">$49.99</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ProductDetailPage({
  productServiceConfig,
  currentCartServiceConfig,
  productMediaGalleryServiceConfig,
  selectedVariantServiceConfig,
}: ProductDetailPageProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Create services manager with all required services
  const servicesManager = createServicesManager(
    createServicesMap()
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
  );

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
            {/* Breadcrumb */}
            <nav className="mb-8">
              <div className="flex items-center gap-2 text-white/60">
                <a href="/store" className="hover:text-white transition-colors">
                  Store
                </a>
                <span>/</span>
                <a
                  href="/store/example-2"
                  className="hover:text-white transition-colors"
                >
                  Example 2
                </a>
                <span>/</span>
                <span className="text-white">Product</span>
              </div>
            </nav>

            {/* Product Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div>
                <ProductImageGallery />
              </div>

              {/* Product Information */}
              <div>
                <ProductInfo
                  onAddToCart={() => {
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 3000);
                  }}
                />
              </div>
            </div>

            {/* Current Cart Summary */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <CurrentCart.CartSummary>
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
                  "CurrentCart.CartSummary",
                  "/docs/components/current-cart#cartsummary"
                )}
              </CurrentCart.CartSummary>
            </div>
          </div>
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
