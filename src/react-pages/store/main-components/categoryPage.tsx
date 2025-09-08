import ProductList from '@/components/store/ProductList';
import type { CurrentCartServiceConfig } from '@wix/headless-ecom/services';

import {
  type CategoriesListServiceConfig,
  type ProductsListServiceConfig,
} from '@wix/headless-stores/services';

interface StoreCollectionPageProps {
  productsListConfig: ProductsListServiceConfig;
  categoriesListConfig: CategoriesListServiceConfig;
  currentCartServiceConfig: CurrentCartServiceConfig;
  currentCategorySlug: string;
  productPageRoute: string;
}

function CategoryPage({
  productsListConfig,
  categoriesListConfig,
  currentCartServiceConfig,
  currentCategorySlug,
  productPageRoute,
}: StoreCollectionPageProps) {
  return (
    <ProductList
      productPageRoute={productPageRoute}
      productsListConfig={productsListConfig}
      categoriesListConfig={categoriesListConfig}
      currentCategorySlug={currentCategorySlug}
      currentCartServiceConfig={currentCartServiceConfig}
    />
  );
}

export default CategoryPage;
