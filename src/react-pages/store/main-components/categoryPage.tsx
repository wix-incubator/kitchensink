import ProductList from '../../../components/store/ProductList';

interface StoreCollectionPageProps {
  productsListConfig: any;
  categoriesListConfig: any;
  productsListFiltersConfig: any;
  slug: string;
  productPageRoute: string;
  basePath: string;
}

function CategoryPage({
  productsListConfig,
  categoriesListConfig,
  productsListFiltersConfig,
  slug,
  productPageRoute,
  basePath,
}: StoreCollectionPageProps) {
  // Create navigation handler for example-1 specific URLs
  const handleCategoryChange = (categoryId: string | null, category: any) => {
    if (typeof window !== 'undefined') {
      let newPath: string = basePath;

      if (categoryId !== null) {
        // Use category slug for URL
        if (!category?.slug) {
          console.warn(
            `Category ${categoryId} has no slug, using category ID as fallback`
          );
        }
        const categorySlug = category?.slug || categoryId;
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
    />
  );
}

export default CategoryPage;
