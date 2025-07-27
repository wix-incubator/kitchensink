import { ProductService } from '@wix/headless-stores/services';
import ProductDetails from '../../../components/store/ProductDetails';
import { MediaGallery } from '@wix/headless-media/react';
import type { ServiceFactoryConfig } from '@wix/services-definitions';

import {
  Product,
  ProductModifiers,
  SelectedVariant,
} from '@wix/headless-stores/react';

interface ProductDetailPageProps {
  productServiceConfig: ServiceFactoryConfig<typeof ProductService>;
}

function ProductDetailsPage({ productServiceConfig }: ProductDetailPageProps) {
  return (
    <Product.Root productServiceConfig={productServiceConfig}>
      <SelectedVariant.Root>
        <MediaGallery.Root
          mediaGalleryServiceConfig={{
            media: productServiceConfig.product?.media?.itemsInfo?.items ?? [],
          }}
        >
          <ProductModifiers.Root>
            <ProductDetails />
          </ProductModifiers.Root>
        </MediaGallery.Root>
      </SelectedVariant.Root>
    </Product.Root>
  );
}

export default ProductDetailsPage;
