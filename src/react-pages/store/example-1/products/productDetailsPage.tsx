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
      <ProductDetails />
    </WixServices>
  );
}

export default ProductDetailsPage;
