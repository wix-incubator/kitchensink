import type { CategoriesListServiceConfig } from '@wix/headless-stores/services';
import ProductList from '../../../components/store/ProductList';

interface StoreCollectionPageProps {
  productsListConfig: any;
  categoriesListConfig: any;
  productsListFiltersConfig: any;
  currentCategorySlug: string;
  productPageRoute: string;
  basePath: string;
}

function CategoryPage({
  productsListConfig,
  categoriesListConfig,
  productsListFiltersConfig,
  currentCategorySlug,
  productPageRoute,
  basePath,
}: StoreCollectionPageProps) {
  // Create navigation handler for example-1 specific URLs
  const handleCategoryChange = (
    category: CategoriesListServiceConfig['categories'][0]
  ) => {
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
      productsListFiltersConfig={productsListFiltersConfig}
      categoriesListConfig={categoriesListConfig}
      currentCategorySlug={currentCategorySlug}
      onCategorySelect={handleCategoryChange}
    />
  );
}

export default CategoryPage;
