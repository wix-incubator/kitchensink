import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { useState } from "react";
import { PageDocsRegistration } from "../../../../components/DocsMode";

import {
  CurrentCartService,
  CurrentCartServiceDefinition,
} from "../../../../headless/ecom/services/current-cart-service";
import {
  ProductMediaGalleryService,
  ProductMediaGalleryServiceDefinition,
} from "../../../../headless/store/services/product-media-gallery-service";
import {
  ProductModifiersService,
  ProductModifiersServiceDefinition,
} from "../../../../headless/store/services/product-modifiers-service";
import {
  ProductService,
  ProductServiceDefinition,
} from "../../../../headless/store/services/product-service";
import {
  RelatedProductsService,
  RelatedProductsServiceDefinition,
} from "../../../../headless/store/services/related-products-service";
import {
  SelectedVariantService,
  SelectedVariantServiceDefinition,
} from "../../../../headless/store/services/selected-variant-service";
import {
  SocialSharingService,
  SocialSharingServiceDefinition,
} from "../../../../headless/store/services/social-sharing-service";
import { KitchensinkLayout } from "../../../../layouts/KitchensinkLayout";
import { StoreLayout } from "../../../../layouts/StoreLayout";
import ProductDetails from "../../composites/product";

interface ProductDetailPageProps {
  productServiceConfig: any;
  currentCartServiceConfig: any;
  productMediaGalleryServiceConfig: any;
  selectedVariantServiceConfig: any;
  socialSharingServiceConfig: any;
  relatedProductsServiceConfig: any;
  productModifiersServiceConfig?: any;
}

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
    .addService(ProductServiceDefinition, ProductService, productServiceConfig)
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

            <ProductDetails />
          </div>
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}