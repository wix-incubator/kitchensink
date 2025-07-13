import { PageDocsRegistration } from '../../../../components/DocsMode';
import {
  CurrentCartService,
} from '@wix/headless-ecom/services';
import {
  ProductService,
} from '@wix/headless-stores/services';
import { KitchensinkLayout } from '../../../../layouts/KitchensinkLayout';
import { StoreLayout } from '../../../../layouts/StoreLayout';
import '../../../../styles/theme-1.css';
import type { ServiceFactoryConfig } from '@wix/services-definitions';

import ProductDetailsPage from './productDetailsPage';

interface ProductDetailPageProps {
  productServiceConfig: ServiceFactoryConfig<typeof ProductService>;
  currentCartServiceConfig: ServiceFactoryConfig<typeof CurrentCartService>;
}

export default function ProductDetailPage({
  productServiceConfig,
  currentCartServiceConfig,
}: ProductDetailPageProps) {
  return (
    <>
      <KitchensinkLayout>
        <StoreLayout currentCartServiceConfig={currentCartServiceConfig}>
          {/* Register page documentation */}
          <PageDocsRegistration
            title="Product Detail Page"
            description="A complete product detail interface showcasing Product and CurrentCart headless components working together."
            docsUrl="/docs/examples/product-detail-overview"
          />

          <ProductDetailsPage productServiceConfig={productServiceConfig} />
        </StoreLayout>
      </KitchensinkLayout>
    </>
  );
}
