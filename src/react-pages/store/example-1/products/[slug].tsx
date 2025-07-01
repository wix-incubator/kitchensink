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
  ProductModifiersService,
  ProductModifiersServiceDefinition,
} from "../../../../headless/store/services/product-modifiers-service";
import {
  ProductService,
  ProductServiceDefinition,
} from "../../../../headless/store/services/product-service";
import {
  SelectedVariantService,
  SelectedVariantServiceDefinition,
} from "../../../../headless/store/services/selected-variant-service";
import { KitchensinkLayout } from "../../../../layouts/KitchensinkLayout";
import { StoreLayout } from "../../../../layouts/StoreLayout";
import "../../../../styles/theme-1.css";
import ProductDetails from "../../../../components/store/ProductDetails";
import {
  MediaGalleryService,
  MediaGalleryServiceDefinition,
} from "../../../../headless/media/services/media-gallery-service";
import { SEOTagsServiceDefinition } from "../../../../headless/seo/services/seo-tags-service";
import type { ServiceFactoryConfig } from "@wix/services-definitions";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import { SEO } from "../../../../headless/seo/components";
import { seoTags } from "@wix/seo";
import { SEOTagsService } from "../../../../headless/seo/services/seo-tags-service";

interface ProductDetailPageProps {
  productServiceConfig: ServiceFactoryConfig<typeof ProductService>;
  currentCartServiceConfig: ServiceFactoryConfig<typeof CurrentCartService>;
  seoTagsServiceConfig: ServiceFactoryConfig<typeof SEOTagsService>;
}

export default function ProductDetailPage({
  productServiceConfig,
  currentCartServiceConfig,
  seoTagsServiceConfig,
}: ProductDetailPageProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Create services manager with all required services
  let servicesMap = createServicesMap()
    .addService(ProductServiceDefinition, ProductService, productServiceConfig)
    .addService(
      CurrentCartServiceDefinition,
      CurrentCartService,
      currentCartServiceConfig
    )
    .addService(SelectedVariantServiceDefinition, SelectedVariantService)
    .addService(ProductModifiersServiceDefinition, ProductModifiersService)
    .addService(MediaGalleryServiceDefinition, MediaGalleryService, {
      media: productServiceConfig.product?.media?.itemsInfo?.items ?? [],
    });

  const [servicesManager] = useState(() => createServicesManager(servicesMap));

  const seoTagsServiceManager = createServicesManager(
    createServicesMap().addService(
      SEOTagsServiceDefinition,
      SEOTagsService,
      seoTagsServiceConfig
    )
  );
  return (
    <>
      <ServicesManagerProvider servicesManager={seoTagsServiceManager}>
        <SEO.UpdateTagsTrigger>
          {({ updateSeoTags }) => (
            <button
              onClick={() =>
                updateSeoTags(seoTags.ItemType.STORES_PRODUCT, {
                  slug: "urban-street-sneakers",
                })
              }
            >
              Update SEO Tags
            </button>
          )}
        </SEO.UpdateTagsTrigger>
      </ServicesManagerProvider>
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
                  className="inline-flex items-center gap-2 text-[var(--theme-text-content-60)] hover:text-[var(--theme-text-content)] transition-colors"
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

              <ProductDetails setShowSuccessMessage={setShowSuccessMessage} />
            </div>
          </div>
        </StoreLayout>
      </KitchensinkLayout>
    </>
  );
}