import { useLoaderData, redirect } from 'react-router-dom';
import {
  loadCategoriesListServiceConfig,
  parseUrlToSearchOptions,
} from '@wix/stores/services';
import { loadProductsListServiceConfig } from '@wix/stores/services';
import CategoryPage from '../../store/main-components/categoryPage';
import { customizationsV3 } from '@wix/stores';

// Error fallback for collection loading
function CollectionError() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <div className="text-status-danger text-2xl mb-4">⚠️</div>
        <h2 className="text-content-primary text-xl mb-2">
          Failed to load products
        </h2>
        <p className="text-content-secondary">Please try refreshing the page</p>
      </div>
    </div>
  );
}

export async function storeCollectionRouteLoader({
  params,
  request,
}: {
  params: { categorySlug?: string };
  request: Request;
}) {
  // Load categories first so we can pass them to parseUrlForProductsListSearch
  const categoriesListConfig = await loadCategoriesListServiceConfig();

  // Find category by its real slug
  let selectedCategory = null;
  if (params.categorySlug) {
    selectedCategory = categoriesListConfig.categories.find(
      (cat: any) => cat.slug === params.categorySlug
    );
  } else {
    selectedCategory = categoriesListConfig.categories[0];
    return redirect(`/store/${selectedCategory.slug}`);
  }

  // If category not found, return 404
  if (!selectedCategory) {
    throw new Response('Not Found', { status: 404 });
  }

  const { items: customizations = [] } = await customizationsV3
    .queryCustomizations()
    .find();

  const parsedSearchOptions = await parseUrlToSearchOptions(
    request.url,
    categoriesListConfig.categories,
    customizations,
    {
      cursorPaging: {
        limit: 20,
      },
      filter: {
        'allCategoriesInfo.categories': {
          $matchItems: [{ _id: selectedCategory._id! }],
        },
      },
    }
  );
  const productListConfig =
    await loadProductsListServiceConfig(parsedSearchOptions);

  return {
    productListConfig,
    categoriesListConfig,
    currentCategorySlug: params.categorySlug,
  };
}

export function StoreCollectionRoute({
  productPageRoute,
}: {
  productPageRoute: string;
}) {
  const { categoriesListConfig, productListConfig, currentCategorySlug } =
    useLoaderData<typeof storeCollectionRouteLoader>();

  return (
    <div className="wix-verticals-container">
      <CategoryPage
        categoriesListConfig={categoriesListConfig}
        productsListConfig={productListConfig}
        currentCategorySlug={currentCategorySlug}
        productPageRoute={productPageRoute}
      />
    </div>
  );
}
