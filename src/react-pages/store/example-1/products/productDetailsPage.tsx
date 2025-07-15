import {
  ProductModifiersService,
  ProductModifiersServiceDefinition,
} from '@wix/headless-stores/services';
import {
  ProductService,
  ProductServiceDefinition,
} from '@wix/headless-stores/services';
import {
  SelectedVariantService,
  SelectedVariantServiceDefinition,
} from '@wix/headless-stores/services';
import '../../../../styles/theme-1.css';
import ProductDetails from '../../../../components/store/ProductDetails';
import {
  MediaGalleryService,
  MediaGalleryServiceDefinition,
} from '@wix/headless-media/services';
import type { ServiceFactoryConfig } from '@wix/services-definitions';
import {
  SocialSharingService,
  SocialSharingServiceDefinition,
} from '@wix/headless-stores/services';
import { createServicesMap } from '@wix/services-manager';
import { WixServices } from '@wix/services-manager-react';

interface ProductDetailPageProps {
  productServiceConfig: ServiceFactoryConfig<typeof ProductService>;
}

function ProductDetailsPage({ productServiceConfig }: ProductDetailPageProps) {
  // Create services manager with all required services
  const servicesMap = createServicesMap()
    .addService(ProductServiceDefinition, ProductService, productServiceConfig)
    .addService(SocialSharingServiceDefinition, SocialSharingService)
    .addService(SelectedVariantServiceDefinition, SelectedVariantService)
    .addService(ProductModifiersServiceDefinition, ProductModifiersService)
    .addService(MediaGalleryServiceDefinition, MediaGalleryService, {
      media: productServiceConfig.product?.media?.itemsInfo?.items ?? [],
    });

  return (
    <WixServices servicesMap={servicesMap}>
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

          <ProductDetails />
        </div>
      </div>
    </WixServices>
  );
}

export default ProductDetailsPage;
