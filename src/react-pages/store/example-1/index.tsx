import { PageDocsRegistration } from '../../../components/DocsMode';
import { StoreLayout } from '../../../layouts/StoreLayout';
import '../../../styles/theme-1.css';
import { KitchensinkLayout } from '../../../layouts/KitchensinkLayout';
import CategoryPage from '../main-components/categoryPage';

import {
  type ProductsListSearchServiceConfig,
  type CategoriesListServiceConfig,
  type ProductsListServiceConfig,
} from '@wix/headless-stores/services';

interface StoreCollectionPageProps {
  productsListSearchConfig: ProductsListSearchServiceConfig;
  categoriesListConfig: CategoriesListServiceConfig;
  productsListConfig: ProductsListServiceConfig;
  currentCartServiceConfig: any;
  currentCategorySlug: string;
}

export default function StoreCollectionPage({
  currentCartServiceConfig,
  categoriesListConfig,
  productsListConfig,
  productsListSearchConfig,
  currentCategorySlug,
}: StoreCollectionPageProps) {
  return (
    <KitchensinkLayout>
      <PageDocsRegistration
        title="Product Collection - Example 1"
        description="Browse our collection of amazing products with advanced filtering."
        docsUrl="/docs/examples/store-collection-overview"
      />

      <StoreLayout currentCartServiceConfig={currentCartServiceConfig}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--theme-text-content)] mb-4">
              Product Collection - Example 1
            </h1>
            <p className="text-[var(--theme-text-content-70)] text-lg">
              Browse our collection of amazing products with advanced filtering
            </p>
          </div>

          <CategoryPage
            categoriesListConfig={categoriesListConfig}
            productsListConfig={productsListConfig}
            productsListSearchConfig={productsListSearchConfig}
            currentCategorySlug={currentCategorySlug}
            productPageRoute="/store/example-1"
          />
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
