import { PageDocsRegistration } from '../../../components/DocsMode';
import { StoreLayout } from '../../../layouts/StoreLayout';
import '../../../styles/theme-1.css';
import { KitchensinkLayout } from '../../../layouts/KitchensinkLayout';
import CategoryPage from './categoryPage';

interface StoreCollectionPageProps {
  filteredCollectionServiceConfig: any;
  currentCartServiceConfig: any;
  categoriesConfig: any;
}

export default function StoreCollectionPage({
  filteredCollectionServiceConfig,
  currentCartServiceConfig,
  categoriesConfig,
}: StoreCollectionPageProps) {
  return (
    <KitchensinkLayout>
      <PageDocsRegistration
        title="Product Collection - Example 1"
        description="Browse our collection of amazing products with advanced filtering."
        docsUrl="/docs/examples/store-collection-overview"
      />
      <StoreLayout currentCartServiceConfig={currentCartServiceConfig}>
        <CategoryPage
          filteredCollectionServiceConfig={filteredCollectionServiceConfig}
          categoriesConfig={categoriesConfig}
          productPageRoute="/store/example-1"
        />
      </StoreLayout>
    </KitchensinkLayout>
  );
}
