import { useState } from "react";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { KitchensinkLayout } from "../../../layouts/KitchensinkLayout";
import {
  ProductServiceDefinition,
  ProductService,
} from "../../../headless/store/product-service";
import {
  SelectedVariantServiceDefinition,
  SelectedVariantService,
} from "../../../headless/store/selected-variant-service";
import {
  ProductMediaGalleryServiceDefinition,
  ProductMediaGalleryService,
} from "../../../headless/store/product-media-gallery-service";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../../../headless/store/current-cart-service";
import { CurrentCart } from "../../../headless/store/CurrentCart";
import { ProductMediaGallery } from "../../../headless/store/ProductMediaGallery";
import { ProductVariantSelector } from "../../../headless/store/ProductVariantSelector";
import { Product } from "../../../headless/store/Product";
import {
  withDocsWrapper,
  PageDocsRegistration,
} from "../../../components/DocsMode";

interface ProductDetailPageProps {
  productServiceConfig: any;
  currentCartServiceConfig: any;
}

export default function ProductDetailPage({
  productServiceConfig,
  currentCartServiceConfig,
}: ProductDetailPageProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Create services manager with all required services
  const servicesManager = createServicesManager(
    createServicesMap()
      .addService(
        SelectedVariantServiceDefinition,
        SelectedVariantService,
        productServiceConfig
      )
      .addService(
        ProductMediaGalleryServiceDefinition,
        ProductMediaGalleryService,
        productServiceConfig
      )
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
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <KitchensinkLayout>
        {/* Register page documentation */}
        <PageDocsRegistration
          title="Product Detail Page"
          description="A complete product detail interface showcasing Product and CurrentCart headless components working together."
          docsUrl="/docs/examples/product-detail-overview"
        />

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg border border-green-400/30 animate-pulse">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
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
              Added to cart successfully!
            </div>
          </div>
        )}

        {/* Fixed Cart Icon */}
        <div className="fixed top-6 right-6 z-50">
          <CurrentCart.CartIcon>
            {withDocsWrapper(
              ({ itemCount, hasItems, openCart, isLoading }) => (
                <button
                  onClick={openCart}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 relative"
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                  {hasItems && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                      <svg
                        className="animate-spin w-4 h-4 text-white"
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
                  )}
                </button>
              ),
              "CurrentCart.CartIcon",
              "/docs/components/current-cart#carticon"
            )}
          </CurrentCart.CartIcon>
        </div>

        {/* Main Content */}
        <div className="min-h-screen p-6">
          <div className="max-w-7xl mx-auto">
            {/* Back to Store */}
            <div className="mb-8">
              <a
                href="/store"
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
                            <img
                              src={imageUrl}
                              alt={altText}
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
                                      <img
                                        src={imageUrl}
                                        alt={altText}
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

                {/* Add to Cart */}
                <div className="space-y-4">
                  <ProductVariantSelector.AddToCartTrigger quantity={1}>
                    {withDocsWrapper(
                      ({ addToCart, canAddToCart, isLoading, error }) => (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-white/20 rounded-lg">
                            <button className="px-4 py-2 text-white hover:bg-white/10 transition-colors">
                              -
                            </button>
                            <span className="px-4 py-2 text-white border-x border-white/20">
                              1
                            </span>
                            <button className="px-4 py-2 text-white hover:bg-white/10 transition-colors">
                              +
                            </button>
                          </div>
                          <button
                            onClick={async () => {
                              await addToCart();
                              setShowSuccessMessage(true);
                              setTimeout(
                                () => setShowSuccessMessage(false),
                                3000
                              );
                            }}
                            disabled={!canAddToCart}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 relative"
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
          </div>
        </div>

        {/* Cart Modal - Same as in collection page */}
        <CurrentCart.CartModal>
          {withDocsWrapper(
            ({ isOpen, closeCart, cart, isLoading, error }) => (
              <>
                {isOpen && (
                  <div className="fixed inset-0 z-50 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                      onClick={closeCart}
                    ></div>
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white/10 backdrop-blur-lg border-l border-white/20 p-6 overflow-y-auto">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">
                          Shopping Cart
                        </h2>
                        <button
                          onClick={closeCart}
                          className="text-white/60 hover:text-white transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                          <p className="text-red-400">{error}</p>
                        </div>
                      )}

                      <CurrentCart.CartLineItems>
                        {withDocsWrapper(
                          ({ lineItems, hasItems }) => (
                            <>
                              {hasItems ? (
                                <div className="space-y-4 mb-6">
                                  {lineItems.map((item: any) => (
                                    <CurrentCart.CartLineItem
                                      key={item._id}
                                      lineItemId={item._id}
                                    >
                                      {withDocsWrapper(
                                        ({
                                          productName,
                                          quantity,
                                          price,
                                          increaseQuantity,
                                          decreaseQuantity,
                                          removeItem,
                                          imageUrl,
                                        }) => (
                                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex gap-4">
                                              <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden">
                                                {imageUrl ? (
                                                  <img
                                                    src={imageUrl}
                                                    alt={productName}
                                                    className="w-full h-full object-cover"
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
                                              <div className="flex-1">
                                                <h3 className="text-white font-medium mb-2">
                                                  {productName}
                                                </h3>
                                                <p className="text-white/80 font-semibold">
                                                  {price}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                  <button
                                                    onClick={decreaseQuantity}
                                                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                                  >
                                                    <svg
                                                      className="w-4 h-4 text-white"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M20 12H4"
                                                      />
                                                    </svg>
                                                  </button>
                                                  <span className="text-white font-medium w-8 text-center">
                                                    {quantity}
                                                  </span>
                                                  <button
                                                    onClick={increaseQuantity}
                                                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                                  >
                                                    <svg
                                                      className="w-4 h-4 text-white"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                      />
                                                    </svg>
                                                  </button>
                                                  <button
                                                    onClick={removeItem}
                                                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
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
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                      />
                                                    </svg>
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ),
                                        "CurrentCart.CartLineItem",
                                        "/docs/components/current-cart#cartlineitem"
                                      )}
                                    </CurrentCart.CartLineItem>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                      className="w-8 h-8 text-white/60"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                                      />
                                    </svg>
                                  </div>
                                  <h3 className="text-white font-medium mb-2">
                                    Your cart is empty
                                  </h3>
                                  <p className="text-white/60 text-sm">
                                    Add some products to get started!
                                  </p>
                                </div>
                              )}
                            </>
                          ),
                          "CurrentCart.CartLineItems",
                          "/docs/components/current-cart#cartlineitems"
                        )}
                      </CurrentCart.CartLineItems>

                      <CurrentCart.CartSummary>
                        {withDocsWrapper(
                          ({ subtotal, total, itemCount, canCheckout }) => (
                            <>
                              {canCheckout && (
                                <div className="border-t border-white/20 pt-6">
                                  <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-white/80">
                                      <span>Subtotal ({itemCount} items)</span>
                                      <span>{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-white font-semibold text-lg">
                                      <span>Total</span>
                                      <span>{total}</span>
                                    </div>
                                  </div>
                                  <CurrentCart.CheckoutButton>
                                    {withDocsWrapper(
                                      ({
                                        proceedToCheckout,
                                        canCheckout: canProceed,
                                        isLoading,
                                      }) => (
                                        <button
                                          onClick={proceedToCheckout}
                                          disabled={!canProceed || isLoading}
                                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                        >
                                          {isLoading
                                            ? "Processing..."
                                            : "Proceed to Checkout"}
                                        </button>
                                      ),
                                      "CurrentCart.CheckoutButton",
                                      "/docs/components/current-cart#checkoutbutton"
                                    )}
                                  </CurrentCart.CheckoutButton>
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
                )}
              </>
            ),
            "CurrentCart.CartModal",
            "/docs/components/current-cart#cartmodal"
          )}
        </CurrentCart.CartModal>
      </KitchensinkLayout>
    </ServicesManagerProvider>
  );
}
