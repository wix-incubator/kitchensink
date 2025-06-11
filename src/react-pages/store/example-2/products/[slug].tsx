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
  return (
    <div className="space-y-6">
      {/* Product Name */}
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

      {/* Stock Status */}
      <ProductVariantSelector.StockStatus>
        {withDocsWrapper(
          ({ inStock, status, quantity, trackInventory }) => (
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  inStock ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`text-sm ${
                  inStock ? "text-green-400" : "text-red-400"
                }`}
              >
                {status}
                {trackInventory && quantity !== null && (
                  <span className="ml-1">({quantity} available)</span>
                )}
              </span>
            </div>
          ),
          "ProductVariantSelector.StockStatus",
          "/docs/components/product-variant-selector#stockstatus"
        )}
      </ProductVariantSelector.StockStatus>

      {/* Product Options */}
      <ProductVariantSelector.ProductOptions>
        {withDocsWrapper(
          ({ options, hasOptions, selectedOptions }) => (
            <>
              {hasOptions && (
                <div className="space-y-4">
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
                                <h3 className="text-lg font-semibold text-white">
                                  {optionName}
                                </h3>
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
                                                ? "bg-teal-500 border-teal-500 text-white"
                                                : isAvailable
                                                ? "bg-white/5 border-white/20 text-white hover:border-white/40"
                                                : "bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
                                            }`}
                                          >
                                            {displayValue}
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

      {/* Add to Cart */}
      <ProductVariantSelector.AddToCartTrigger>
        {withDocsWrapper(
          ({ addToCart, canAddToCart, isLoading, inStock, error }) => (
            <div className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
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
