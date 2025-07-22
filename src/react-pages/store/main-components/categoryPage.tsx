import {
  LoadMoreSection,
  ProductGridContent,
} from '../../../components/store/ProductList';
import type { CategoriesListServiceConfig } from '../../../pages/store/example-1/categories-list';
import type { ProductsListServiceConfig } from '../../../pages/store/example-1/products-list';
import { ProductsList } from '../../../pages/store/example-1/products-list-components';
import { ProductsListPagination } from '../../../pages/store/example-1/products-list-pagination-components';

interface StoreCollectionPageProps {
  productsListConfig: ProductsListServiceConfig;
  categoriesListConfig: CategoriesListServiceConfig;
  currentCategorySlug: string;
  productPageRoute: string;
}

function CategoryPage({
  productsListConfig,
  categoriesListConfig,
  currentCategorySlug,
  productPageRoute,
}: StoreCollectionPageProps) {
  return (
    <ProductsList.Root productsListConfig={productsListConfig}>
      <ProductsListPagination.Root>
        <div>
          <ProductGridContent
            productPageRoute={productPageRoute}
            categoriesListConfig={categoriesListConfig}
            currentCategorySlug={currentCategorySlug}
          />
          <LoadMoreSection />
        </div>
      </ProductsListPagination.Root>
    </ProductsList.Root>
  );
}

export default CategoryPage;
