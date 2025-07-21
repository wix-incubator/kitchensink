import type { APIRoute } from 'astro';
import { loadCategoriesConfig } from '@wix/stores/services';

export const GET: APIRoute = async ({ url, redirect }) => {
  // Redirect to the first category (typically "All Products") for consistent URL structure
  const categoriesConfig = await loadCategoriesConfig();
  const firstCategory = categoriesConfig.categories[0];

  if (!firstCategory) {
    throw new Error('No categories found');
  }

  // Use the real category slug from Wix API
  if (!firstCategory.slug) {
    throw new Error(`Category "${firstCategory.name}" has no slug`);
  }

  const categorySlug = firstCategory.slug;
  const redirectUrl = `/store/example-1/category/${categorySlug}${url.search}`;
  return redirect(redirectUrl);
};
