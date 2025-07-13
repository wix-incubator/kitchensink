import { useLoaderData, redirect } from 'react-router-dom';
import { loadCategoriesConfig } from '../../../headless/store/services/category-service';
import { loadCollectionServiceConfig } from '../../../headless/store/services/collection-service';
import { loadCurrentCartServiceConfig } from '../../../headless/ecom/services/current-cart-service';
import CategoryPage from '../../store/example-1/categoryPage';

export async function storeCollectionRouteLoader({
  params,
}: {
  params: { categorySlug?: string };
}): Promise<
  | {
      filteredCollectionServiceConfig: Awaited<
        ReturnType<typeof loadCollectionServiceConfig>
      >;
      currentCartServiceConfig: Awaited<
        ReturnType<typeof loadCurrentCartServiceConfig>
      >;
      categoriesConfig: Awaited<ReturnType<typeof loadCategoriesConfig>>;
      selectedCategory: Awaited<
        ReturnType<typeof loadCategoriesConfig>
      >['categories'][number];
    }
  | ReturnType<typeof redirect>
> {
  // Load categories and cart config in parallel (cart is independent)
  const [categoriesConfig, currentCartServiceConfig] = await Promise.all([
    loadCategoriesConfig(),
    loadCurrentCartServiceConfig(),
  ]);

  // Find category by its real slug
  let selectedCategory = null;
  if (params.categorySlug) {
    selectedCategory = categoriesConfig.categories.find(
      (cat: any) => cat.slug === params.categorySlug
    );
  } else {
    selectedCategory = categoriesConfig.categories[0];
    return redirect(`/store/${selectedCategory.slug}`);
  }

  // Load collection config with selected category (pass pre-loaded categories)
  const filteredCollectionServiceConfig = await loadCollectionServiceConfig(
    selectedCategory?._id || undefined,
    new URLSearchParams(),
    categoriesConfig.categories
  );

  // If category not found, return 404
  if (!selectedCategory) {
    throw new Response('Not Found', { status: 404 });
  }

  return {
    filteredCollectionServiceConfig,
    currentCartServiceConfig,
    categoriesConfig,
    selectedCategory,
  };
}

export function StoreCollectionRoute() {
  const {
    filteredCollectionServiceConfig,
    categoriesConfig,
    selectedCategory,
  } = useLoaderData<typeof storeCollectionRouteLoader>();
  return (
    <CategoryPage
      filteredCollectionServiceConfig={filteredCollectionServiceConfig}
      categoriesConfig={{
        ...categoriesConfig,
        initialCategoryId: selectedCategory._id,
      }}
      productPageRoute="/products"
    />
  );
}

export const storeCollectionRouteDefinition = {
  path: '/store/:categorySlug',
  element: <StoreCollectionRoute />,
  loader: storeCollectionRouteLoader,
}; 