import { useState } from "react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { KitchensinkLayout } from "../../../../layouts/KitchensinkLayout";
import { StoreLayout } from "../../../../layouts/StoreLayout";
import {
  ProductServiceDefinition,
  ProductService,
} from "../../../../headless/store/product-service";
import {
  SelectedVariantServiceDefinition,
  SelectedVariantService,
} from "../../../../headless/store/selected-variant-service";
import {
  ProductMediaGalleryServiceDefinition,
  ProductMediaGalleryService,
} from "../../../../headless/store/product-media-gallery-service";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../../../../headless/store/current-cart-service";
import { ProductMediaGallery } from "../../../../headless/store/ProductMediaGallery";
import { ProductVariantSelector } from "../../../../headless/store/ProductVariantSelector";
import { Product } from "../../../../headless/store/Product";
import { CurrentCart } from "../../../../headless/store/CurrentCart";
import {
  withDocsWrapper,
  PageDocsRegistration,
} from "../../../../components/DocsMode";
import WixMediaImage from "../../../../headless/media/Image";

interface ProductDetailPageProps {
  productServiceConfig: any;
  currentCartServiceConfig: any;
  productMediaGalleryServiceConfig: any;
  selectedVariantServiceConfig: any;
}

export default function ProductDetailPage({
  productServiceConfig,
  currentCartServiceConfig,
  productMediaGalleryServiceConfig,
  selectedVariantServiceConfig,
}: ProductDetailPageProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
        {/* Register page documentation */}
        <PageDocsRegistration
          title="Product Detail Page"
          description="A complete product detail interface showcasing Product and CurrentCart headless components working together."
          docsUrl="/docs/examples/product-detail-overview"
        />

        {/* Main Content */}
        <div className="min-h-screen p-6">
          <div className="max-w-7xl mx-auto">
            {/* Back to Store */}
            <div className="mb-8">
              <a
                href="/store/example-1"
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

            {/* Product Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative">
                  <ProductMediaGallery.SelectedImage>
                    {withDocsWrapper(
                      ({
                        imageUrl,
                        altText,
                        isLoading,
                        currentIndex,
                        totalImages,
                      }) => (
                        <>
                          {imageUrl ? (
                            <WixMediaImage
                              media={{ image: imageUrl }}
                              className="w-full h-full object-cover"
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
                                    <button
                                      onClick={prevImage}
                                      disabled={!hasPrev}
                                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all disabled:opacity-30"
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
                                  ),
                                  "ProductMediaGallery.PrevImageButton",
                                  "/docs/components/product-media-gallery#previmagebutton"
                                )}
                              </ProductMediaGallery.PrevImageButton>

                              <ProductMediaGallery.NextImageButton>
                                {withDocsWrapper(
                                  ({ nextImage, hasNext }) => (
                                    <button
                                      onClick={nextImage}
                                      disabled={!hasNext}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all disabled:opacity-30"
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
                                  ),
                                  "ProductMediaGallery.NextImageButton",
                                  "/docs/components/product-media-gallery#nextimagebutton"
                                )}
                              </ProductMediaGallery.NextImageButton>
                            </>
                          )}

                          {/* Image Counter */}
                          {totalImages > 1 && (
                            <ProductMediaGallery.MediaGalleryInfo>
                              {withDocsWrapper(
                                ({ currentImage, totalImages }) => (
                                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                    {currentImage} / {totalImages}
                                  </div>
                                ),
                                "ProductMediaGallery.MediaGalleryInfo",
                                "/docs/components/product-media-gallery#mediagalleryinfo"
                              )}
                            </ProductMediaGallery.MediaGalleryInfo>
                          )}
                        </>
                      ),
                      "ProductMediaGallery.SelectedImage",
                      "/docs/components/product-media-gallery#selectedimage"
                    )}
                  </ProductMediaGallery.SelectedImage>
                </div>

                {/* Thumbnail Images */}
                <ProductMediaGallery.MediaGalleryInfo>
                  {withDocsWrapper(
                    ({ totalImages }) => (
                      <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: totalImages || 4 }).map(
                          (_, i) => (
                            <ProductMediaGallery.MediaItemThumbnail
                              key={i}
                              index={i}
                            >
                              {withDocsWrapper(
                                ({
                                  imageUrl,
                                  isActive,
                                  selectImage,
                                  altText,
                                }) => (
                                  <div
                                    onClick={selectImage}
                                    className={`aspect-square bg-white/5 rounded-lg border cursor-pointer transition-all ${
                                      isActive
                                        ? "border-blue-400/50 ring-2 ring-blue-400/30"
                                        : "border-white/10 hover:border-white/20"
                                    }`}
                                  >
                                    {imageUrl ? (
                                      <WixMediaImage
                                        media={{ image: imageUrl }}
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <svg
                                          className="w-6 h-6 text-white/40"
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
                                ),
                                "ProductMediaGallery.MediaItemThumbnail",
                                "/docs/components/product-media-gallery#mediaitemthumbnail"
                              )}
                            </ProductMediaGallery.MediaItemThumbnail>
                          )
                        )}
                      </div>
                    ),
                    "ProductMediaGallery.MediaGalleryInfo",
                    "/docs/components/product-media-gallery#mediagalleryinfo"
                  )}
                </ProductMediaGallery.MediaGalleryInfo>
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                {/* Product Name & Price */}
                <div>
                  <Product.Name>
                    {withDocsWrapper(
                      ({ name, hasName }) => (
                        <h1 className="text-4xl font-bold text-white mb-4">
                          {hasName ? name : "Product Name"}
                        </h1>
                      ),
                      "Product.Name",
                      "/docs/components/product#name"
                    )}
                  </Product.Name>
                  <ProductVariantSelector.ProductPrice>
                    {withDocsWrapper(
                      ({ price, isVariantPrice }) => (
                        <div className="text-3xl font-bold text-white">
                          {price}
                          {isVariantPrice && (
                            <span className="text-sm text-white/60 ml-2">
                              (variant price)
                            </span>
                          )}
                        </div>
                      ),
                      "ProductVariantSelector.ProductPrice",
                      "/docs/components/product-variant-selector#productprice"
                    )}
                  </ProductVariantSelector.ProductPrice>
                </div>

                {/* Product Description */}
                <Product.Description>
                  {withDocsWrapper(
                    ({ description, hasDescription, isHtml }) => (
                      <>
                        {hasDescription && (
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                              Description
                            </h3>
                            {isHtml ? (
                              <div
                                className="text-white/80 leading-relaxed prose prose-invert prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: description,
                                }}
                              />
                            ) : (
                              <p className="text-white/80 leading-relaxed">
                                {description}
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    ),
                    "Product.Description",
                    "/docs/components/product#description"
                  )}
                </Product.Description>

                {/* Product Options (if any) */}
                <ProductVariantSelector.ProductOptions>
                  {withDocsWrapper(
                    ({ options, hasOptions }) => (
                      <>
                        {hasOptions && (
                          <div className="space-y-6">
                            {options.map((option: any) => (
                              <div key={option.name}>
                                <ProductVariantSelector.ProductOptionChoices
                                  option={option}
                                >
                                  {withDocsWrapper(
                                    ({ optionName, choices, hasChoices }) => (
                                      <>
                                        <h3 className="text-lg font-semibold text-white mb-3">
                                          {optionName}
                                        </h3>
                                        {hasChoices && (
                                          <div className="flex flex-wrap gap-3">
                                            {choices.map((choice: any) => (
                                              <ProductVariantSelector.ChoiceSelection
                                                key={
                                                  choice.value ||
                                                  choice.description
                                                }
                                                option={option}
                                                choice={choice}
                                              >
                                                {withDocsWrapper(
                                                  ({
                                                    displayValue,
                                                    isSelected,
                                                    selectChoice,
                                                  }) => (
                                                    <button
                                                      onClick={selectChoice}
                                                      className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                                                        isSelected
                                                          ? "bg-blue-500/20 border-blue-400/50 text-blue-300"
                                                          : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white"
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
                                        )}
                                      </>
                                    ),
                                    "ProductVariantSelector.ProductOptionChoices",
                                    "/docs/components/product-variant-selector#productoptionchoices"
                                  )}
                                </ProductVariantSelector.ProductOptionChoices>
                              </div>
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
                    <span className="text-white/60 text-sm">
                      Max: 10 per order
                    </span>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="space-y-4">
                  <ProductVariantSelector.AddToCartTrigger quantity={quantity}>
                    {withDocsWrapper(
                      ({ addToCart, canAddToCart, isLoading, error }) => (
                        <div className="space-y-4">
                          {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                              <p className="text-red-400 text-sm">{error}</p>
                            </div>
                          )}

                          <button
                            onClick={async () => {
                              await addToCart();
                              setShowSuccessMessage(true);
                              setTimeout(
                                () => setShowSuccessMessage(false),
                                3000
                              );
                            }}
                            disabled={!canAddToCart || isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 relative"
                          >
                            {isLoading ? (
                              <>
                                <span className="opacity-0">Add to Cart</span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg
                                    className="animate-spin w-5 h-5 text-white"
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
                              "Add to Cart"
                            )}
                          </button>
                        </div>
                      ),
                      "ProductVariantSelector.AddToCartTrigger",
                      "/docs/components/product-variant-selector#addtocarttrigger"
                    )}
                  </ProductVariantSelector.AddToCartTrigger>

                  {/* Stock Status */}
                  <ProductVariantSelector.StockStatus>
                    {withDocsWrapper(
                      ({ inStock, status, quantity, trackInventory }) => (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              inStock ? "bg-green-400" : "bg-red-400"
                            }`}
                          ></div>
                          <span
                            className={`text-sm ${
                              inStock ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {status}
                            {trackInventory && quantity !== null && (
                              <span className="text-white/60 ml-1">
                                ({quantity} available)
                              </span>
                            )}
                          </span>
                        </div>
                      ),
                      "ProductVariantSelector.StockStatus",
                      "/docs/components/product-variant-selector#stockstatus"
                    )}
                  </ProductVariantSelector.StockStatus>
                </div>

                {/* Product Details */}
                <Product.Details>
                  {withDocsWrapper(
                    ({
                      sku,
                      weight,
                      dimensions,
                      hasSku,
                      hasWeight,
                      hasDimensions,
                    }) => (
                      <div className="border-t border-white/20 pt-8">
                        <h3 className="text-xl font-semibold text-white mb-4">
                          Product Details
                        </h3>
                        <div className="space-y-3 text-white/80">
                          <div className="flex justify-between">
                            <span>SKU:</span>
                            <span>{hasSku ? sku : "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Weight:</span>
                            <span>{hasWeight ? weight : "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dimensions:</span>
                            <span>{hasDimensions ? dimensions : "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    ),
                    "Product.Details",
                    "/docs/components/product#details"
                  )}
                </Product.Details>
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
