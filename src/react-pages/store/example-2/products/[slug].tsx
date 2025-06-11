import React, { useState } from "react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { KitchensinkLayout } from "../../../../layouts/KitchensinkLayout";
import {
  withDocsWrapper,
  PageDocsRegistration,
} from "../../../../components/DocsMode";
import {
  VariantSelectorServiceDefinition,
  VariantSelectorService,
} from "../../../../headless/store/variant-selector-service";
import {
  ProductGalleryServiceDefinition,
  ProductGalleryService,
} from "../../../../headless/store/product-gallery-service";
import {
  EnhancedCurrentCartServiceDefinition,
  EnhancedCurrentCartService,
} from "../../../../headless/store/enhanced-cart-service";
import {
  RelatedProductsServiceDefinition,
  RelatedProductsService,
} from "../../../../headless/store/related-products-service";
import {
  SocialSharingServiceDefinition,
  SocialSharingService,
} from "../../../../headless/store/social-sharing-service";
import { RelatedProducts } from "../../../../headless/store/RelatedProducts";
import { SocialSharing } from "../../../../headless/store/SocialSharing";

interface ProductPageProps {
  variantSelectorConfig: any;
  productGalleryConfig: any;
  enhancedCartConfig: any;
  relatedProductsConfig: any;
  socialSharingConfig: any;
}

// Product Gallery Component
const ProductGallery = ({ servicesManager }: { servicesManager: any }) => {
  const galleryService = servicesManager.getService(
    ProductGalleryServiceDefinition
  );
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [images, setImages] = React.useState<string[]>([]);

  React.useEffect(() => {
    const unsubscribe = galleryService.images.subscribe(
      (newImages: string[]) => {
        setImages(newImages);
      }
    );
    return unsubscribe;
  }, [galleryService]);

  React.useEffect(() => {
    const unsubscribe = galleryService.selectedImageIndex.subscribe(
      (index: number) => {
        setCurrentImageIndex(index);
      }
    );
    return unsubscribe;
  }, [galleryService]);

  const handleImageClick = (index: number) => {
    galleryService.setImageIndex(index);
  };

  const handlePrevious = () => {
    const newIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    galleryService.setImageIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    galleryService.setImageIndex(newIndex);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden group">
        {images[currentImageIndex] && (
          <img
            src={images[currentImageIndex]}
            alt="Product"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
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
            <button
              onClick={handleNext}
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
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? "border-blue-500 ring-2 ring-blue-500/30"
                  : "border-white/20 hover:border-white/40"
              }`}
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Variant Selector Component
const VariantSelector = ({ servicesManager }: { servicesManager: any }) => {
  const variantService = servicesManager.getService(
    VariantSelectorServiceDefinition
  );
  const [options, setOptions] = React.useState<Record<string, string[]>>({});
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<string, string>
  >({});
  const [isOnSale, setIsOnSale] = React.useState<boolean | null>(null);
  const [basePrice, setBasePrice] = React.useState(0);
  const [discountPrice, setDiscountPrice] = React.useState<number | null>(null);
  const [sku, setSku] = React.useState("");
  const [ribbonLabel, setRibbonLabel] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribes = [
      variantService.options.subscribe(setOptions),
      variantService.selectedOptions.subscribe(setSelectedOptions),
      variantService.isOnSale.subscribe(setIsOnSale),
      variantService.basePrice.subscribe(setBasePrice),
      variantService.discountPrice.subscribe(setDiscountPrice),
      variantService.sku.subscribe(setSku),
      variantService.ribbonLabel.subscribe(setRibbonLabel),
    ];
    return () => unsubscribes.forEach((fn) => fn());
  }, [variantService]);

  const handleOptionChange = (optionName: string, value: string) => {
    variantService.setOption(optionName, value);
  };

  const finalPrice = variantService.finalPrice();
  const isLowStock = variantService.isLowStock();
  const selectedVariant = variantService.selectedVariant();

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {isOnSale && discountPrice !== null ? (
            <>
              <span className="text-3xl font-bold text-white">
                ${discountPrice.toFixed(2)}
              </span>
              <span className="text-xl text-white/60 line-through">
                ${basePrice.toFixed(2)}
              </span>
              <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                Sale
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-white">
              ${finalPrice.toFixed(2)}
            </span>
          )}
        </div>
        {sku && <p className="text-white/60 text-sm">SKU: {sku}</p>}
      </div>

      {/* Ribbon/Badge */}
      {ribbonLabel && (
        <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {ribbonLabel}
        </div>
      )}

      {/* Options */}
      {Object.entries(options).map(([optionName, optionValues]) => (
        <div key={optionName} className="space-y-3">
          <h3 className="text-lg font-semibold text-white">{optionName}</h3>
          <div className="flex flex-wrap gap-2">
            {optionValues.map((value) => (
              <button
                key={value}
                onClick={() => handleOptionChange(optionName, value)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedOptions[optionName] === value
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-white/5 border-white/20 text-white hover:border-white/40"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Reset Options Button */}
      {Object.keys(selectedOptions).length > 0 && (
        <button
          onClick={() => variantService.resetSelections()}
          className="text-white/60 hover:text-white text-sm underline transition-colors"
        >
          Reset all selections
        </button>
      )}

      {/* Stock Information */}
      <div className="space-y-2">
        {selectedVariant.stock > 0 ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400">
              In Stock ({selectedVariant.stock} available)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-400">Out of Stock</span>
          </div>
        )}

        {isLowStock && selectedVariant.stock > 0 && (
          <p className="text-yellow-400 text-sm">
            ⚠️ Low stock - only {selectedVariant.stock} left!
          </p>
        )}

        {selectedVariant.isPreOrder && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-300 text-sm">
              🚀 This item is available for pre-order
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Actions Component
const ProductActions = ({ servicesManager }: { servicesManager: any }) => {
  const variantService = servicesManager.getService(
    VariantSelectorServiceDefinition
  );
  const cartService = servicesManager.getService(
    EnhancedCurrentCartServiceDefinition
  );
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlist, setWishlist] = useState<
    { productId: string; variantId: string }[]
  >([]);

  React.useEffect(() => {
    const unsubscribe = cartService.wishlist.subscribe((newWishlist: any[]) => {
      setWishlist(newWishlist);
      const productId = variantService.productId.get();
      const variantId = variantService.selectedVariantId.get();
      setIsInWishlist(
        newWishlist.some(
          (item) => item.productId === productId && item.variantId === variantId
        )
      );
    });
    return unsubscribe;
  }, [cartService, variantService]);

  const handleAddToCart = async () => {
    try {
      const productId = variantService.productId.get();
      const variantId = variantService.selectedVariantId.get();
      await cartService.addItem(productId, variantId, quantity);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    try {
      const productId = variantService.productId.get();
      const variantId = variantService.selectedVariantId.get();
      await cartService.buyNow(productId, variantId, quantity);
    } catch (error) {
      console.error("Failed to buy now:", error);
    }
  };

  const handleToggleWishlist = () => {
    const productId = variantService.productId.get();
    const variantId = variantService.selectedVariantId.get();
    cartService.toggleWishlist(productId, variantId);
  };

  const selectedVariant = variantService.selectedVariant();
  const isOutOfStock = selectedVariant.stock <= 0;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <label className="text-white font-medium">Quantity:</label>
        <div className="flex items-center border border-white/20 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 text-white hover:bg-white/10 transition-colors"
          >
            -
          </button>
          <span className="px-4 py-2 text-white min-w-12 text-center">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(Math.min(selectedVariant.stock, quantity + 1))
            }
            className="p-2 text-white hover:bg-white/10 transition-colors"
            disabled={quantity >= selectedVariant.stock}
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
        >
          {isOutOfStock ? "Out of Stock" : "Buy Now"}
        </button>

        <button
          onClick={handleToggleWishlist}
          className={`p-3 rounded-lg border transition-all ${
            isInWishlist
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white/5 border-white/20 text-white hover:border-white/40"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill={isInWishlist ? "currentColor" : "none"}
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
    </div>
  );
};

export default function ProductPage({
  variantSelectorConfig,
  productGalleryConfig,
  enhancedCartConfig,
  relatedProductsConfig,
  socialSharingConfig,
}: ProductPageProps) {
  // Create services manager with all services
  const servicesManager = createServicesManager(
    createServicesMap()
      .addService(
        VariantSelectorServiceDefinition,
        VariantSelectorService,
        variantSelectorConfig
      )
      .addService(
        ProductGalleryServiceDefinition,
        ProductGalleryService,
        productGalleryConfig
      )
      .addService(
        EnhancedCurrentCartServiceDefinition,
        EnhancedCurrentCartService,
        enhancedCartConfig
      )
      .addService(
        RelatedProductsServiceDefinition,
        RelatedProductsService,
        relatedProductsConfig
      )
      .addService(
        SocialSharingServiceDefinition,
        SocialSharingService,
        socialSharingConfig
      )
  );

  const variantService = servicesManager.getService(
    VariantSelectorServiceDefinition
  );
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");

  React.useEffect(() => {
    // Get product data from variant service
    const product = variantSelectorConfig.product;
    setProductName(product.name || "Product");
    setProductDescription(product.description || "");
  }, [variantSelectorConfig]);

  return (
    <KitchensinkLayout>
      <PageDocsRegistration
        title="Advanced Product Page"
        description="Complete product page with advanced variant selection, dynamic pricing, wishlist functionality, and comprehensive product interactions."
        docsUrl="/docs/examples/advanced-product-page"
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
              <span className="text-white">{productName}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <div>
              <ProductGallery servicesManager={servicesManager} />
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {productName}
                </h1>
                {productDescription && (
                  <p className="text-white/80 text-lg leading-relaxed">
                    {productDescription}
                  </p>
                )}
              </div>

              {/* Variant Selection */}
              <VariantSelector servicesManager={servicesManager} />

              {/* Product Actions */}
              <ProductActions servicesManager={servicesManager} />

              {/* Social Sharing */}
              {/* <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Share this product
                </h3>
                <SocialSharing.Actions servicesManager={servicesManager}>
                  {({
                    shareToFacebook,
                    shareToTwitter,
                    shareToLinkedIn,
                    shareToWhatsApp,
                    copyToClipboard,
                  }) => {
                    const currentUrl = `/store/example-2/products/${variantSelectorConfig.product.slug}`;
                    const handleCopyLink = async () => {
                      await copyToClipboard(currentUrl);
                    };

                    return (
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            shareToFacebook(
                              currentUrl,
                              productName,
                              productDescription
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2]/80 text-white rounded-lg transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook
                        </button>

                        <button
                          onClick={() =>
                            shareToTwitter(currentUrl, productName, [
                              "product",
                              "store",
                              "shopping",
                            ])
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/80 text-white rounded-lg transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                          Twitter
                        </button>

                        <button
                          onClick={() =>
                            shareToLinkedIn(
                              currentUrl,
                              productName,
                              productDescription
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white rounded-lg transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          LinkedIn
                        </button>

                        <button
                          onClick={() =>
                            shareToWhatsApp(
                              currentUrl,
                              `${productName} - ${productDescription}`
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#25D366]/80 text-white rounded-lg transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                          </svg>
                          WhatsApp
                        </button>

                        <button
                          onClick={handleCopyLink}
                          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
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
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy Link
                        </button>
                      </div>
                    );
                  }}
                </SocialSharing.Actions>
              </div> */}

              {/* Additional Information */}
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Product Features
                </h3>
                <ul className="space-y-2 text-white/80">
                  <li>• High-quality materials and construction</li>
                  <li>• Available in multiple variants and colors</li>
                  <li>• Fast and reliable shipping</li>
                  <li>• 30-day return policy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* <div className="mt-16">
            <RelatedProducts.List>
              {({ relatedProducts, isLoading, error, hasRelatedProducts }) => (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-8">
                    You might also like
                  </h2>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                      <p className="text-red-400">{error}</p>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-white/5 rounded-xl p-4 animate-pulse"
                        >
                          <div className="aspect-square bg-white/10 rounded-lg mb-4"></div>
                          <div className="h-4 bg-white/10 rounded mb-2"></div>
                          <div className="h-3 bg-white/10 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : hasRelatedProducts ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {relatedProducts.map((product) => (
                        <RelatedProducts.ProductCard
                          key={product._id}
                          product={product}
                        >
                          {({
                            name,
                            imageUrl,
                            price,
                            inStock,
                            productUrl,
                            description,
                          }) => (
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 group">
                              <div className="aspect-square bg-white/10 rounded-lg mb-4 overflow-hidden relative">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg
                                      className="w-12 h-12 text-white/40"
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

                              <h3 className="text-white font-semibold mb-2 line-clamp-2">
                                {name}
                              </h3>

                              <div className="flex items-center justify-between mb-3">
                                <span className="text-lg font-bold text-white">
                                  {price}
                                </span>
                                <div className="flex items-center gap-2">
                                  {inStock ? (
                                    <span className="text-green-400 text-sm flex items-center gap-1">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      In Stock
                                    </span>
                                  ) : (
                                    <span className="text-red-400 text-sm flex items-center gap-1">
                                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                      Out of Stock
                                    </span>
                                  )}
                                </div>
                              </div>

                              <a
                                href={productUrl}
                                className="block w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-center text-sm"
                              >
                                View Product
                              </a>
                            </div>
                          )}
                        </RelatedProducts.ProductCard>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/60">
                        No related products found.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </RelatedProducts.List>
          </div> */}
        </div>
      </div>
    </KitchensinkLayout>
  );
}
