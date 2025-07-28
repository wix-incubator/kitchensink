import { redirect } from 'react-router-dom';
import { loadCategoriesListServiceConfig } from '@wix/headless-stores/services';

export async function defaultStoreCollectionRouteRedirectLoader() {
  const [categoriesConfig] = await Promise.all([
    loadCategoriesListServiceConfig(),
  ]);

  const selectedCategory = categoriesConfig.categories[0];
  return redirect(`/store/${selectedCategory.slug}`);
}
