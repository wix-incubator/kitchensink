import ProductList from '../../../components/store/ProductList';

import {
  type ProductsListSearchServiceConfig,
  type CategoriesListServiceConfig,
  type ProductsListServiceConfig,
} from '@wix/headless-stores/services';

interface StoreCollectionPageProps {
  productsListConfig: ProductsListServiceConfig;
  categoriesListConfig: CategoriesListServiceConfig;
  productsListSearchConfig: ProductsListSearchServiceConfig;
  currentCategorySlug: string;
  productPageRoute: string;
}

function CategoryPage({
  productsListConfig,
  categoriesListConfig,
  productsListSearchConfig,
  currentCategorySlug,
  productPageRoute,
}: StoreCollectionPageProps) {
  return (
    <ProductList
      productPageRoute={productPageRoute}
      productsListConfig={productsListConfig}
      productsListSearchConfig={productsListSearchConfig}
      categoriesListConfig={categoriesListConfig}
      currentCategorySlug={currentCategorySlug}
    />
  );
}

export default CategoryPage;
