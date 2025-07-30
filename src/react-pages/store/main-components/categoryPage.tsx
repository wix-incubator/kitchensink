import type { Category } from '@wix/headless-stores/services';
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
  basePath: string;
}

function CategoryPage({
  productsListConfig,
  categoriesListConfig,
  productsListSearchConfig,
  currentCategorySlug,
  productPageRoute,
  basePath,
}: StoreCollectionPageProps) {
  // Create navigation handler for example-1 specific URLs
  const handleCategoryChange = (category: Category) => {
    if (typeof window !== 'undefined') {
      let newPath: string = basePath;

      if (category.slug !== null) {
        // Use category slug for URL
        if (!category?.slug) {
          console.warn(
            `Category ${category.name} has no slug, using category ID as fallback`
          );
        }
        const categorySlug = category?.slug || category.slug;
        newPath = `${basePath}/${categorySlug}`;
      }

      window.history.pushState(
        null,
        'Showing Category ' + category?.name,
        newPath
      );
    }
  };

  return (
    <ProductList
      productPageRoute={productPageRoute}
      productsListConfig={productsListConfig}
      productsListSearchConfig={productsListSearchConfig}
      categoriesListConfig={categoriesListConfig}
      currentCategorySlug={currentCategorySlug}
      onCategorySelect={handleCategoryChange}
    />
  );
}

export default CategoryPage;
