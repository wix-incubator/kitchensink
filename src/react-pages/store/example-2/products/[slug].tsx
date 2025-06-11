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

interface ProductPageProps {
  variantSelectorConfig: any;
  productGalleryConfig: any;
  enhancedCartConfig: any;
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
}: ProductPageProps) {
  // Create services manager with all three services
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

              {/* Additional Information Placeholder */}
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
        </div>
      </div>
    </KitchensinkLayout>
  );
}
