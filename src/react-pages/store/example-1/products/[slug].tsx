import { PageDocsRegistration } from '@/components/DocsMode';
import { CurrentCartService } from '@wix/headless-ecom/services';
import { ProductService } from '@wix/headless-stores/services';
import { KitchensinkLayout } from '../../../../layouts/KitchensinkLayout';
import { StoreLayout } from '../../../../layouts/StoreLayout';
import '../../../../styles/theme-1.css';
import type { ServiceFactoryConfig } from '@wix/services-definitions';

import ProductDetailsPage from '../../main-components/productDetailsPage';

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

              <ProductDetailsPage productServiceConfig={productServiceConfig} />
            </div>
          </div>
        </StoreLayout>
      </KitchensinkLayout>
    </>
  );
}
