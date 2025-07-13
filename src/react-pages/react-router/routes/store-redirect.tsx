import { redirect } from 'react-router-dom';
import { loadCategoriesConfig } from '../../../headless/store/services/category-service';

export async function defaultStoreCollectionRouteRedirectLoader() {
  const [categoriesConfig] = await Promise.all([loadCategoriesConfig()]);

  const selectedCategory = categoriesConfig.categories[0];
  return redirect(`/store/${selectedCategory.slug}`);
}

export const storeRedirectRouteDefinition = {
  path: '/store',
  element: <></>,
  loader: defaultStoreCollectionRouteRedirectLoader,
}; 