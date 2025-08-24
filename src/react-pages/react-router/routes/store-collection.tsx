import { useLoaderData, redirect, Await } from 'react-router-dom';
import React from 'react';
import {
  loadCategoriesListServiceConfig,
  parseUrlToSearchOptions,
} from '@wix/headless-stores/services';
import { loadProductsListServiceConfig } from '@wix/headless-stores/services';
import CategoryPage from '../../store/main-components/categoryPage';
import { ProductListSkeleton } from '../../../components/store/ProductList';
import { Card, CardContent } from '@/components/ui/card';
import { customizationsV3 } from '@wix/stores';
// Skeleton component for product collection loading
function CollectionSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category skeleton */}
      <Card className="overflow-hidden relative bg-surface-card border-surface-subtle mb-6 p-4">
        <CardContent className="p-0">
          <div className="h-6 w-24 bg-surface-loading rounded animate-pulse mb-4"></div>
          <div className="flex gap-4">
            <div className="h-10 w-24 bg-surface-loading rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-surface-loading rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="w-full lg:w-80 lg:flex-shrink-0 lg:self-stretch">
          <div className="lg:sticky lg:top-6">
            {/* Filters skeleton */}
            <Card className="overflow-hidden relative bg-surface-card border-surface-subtle p-4 lg:h-full h-32">
              <CardContent className="p-0">
                {/* Filters Header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-4 h-4 bg-surface-loading rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-surface-loading rounded animate-pulse"></div>
                </div>

                {/* Price Range Section */}
                <div className="mb-6">
                  <div className="h-5 w-20 bg-surface-loading rounded animate-pulse mb-4"></div>
                  <div className="flex justify-between text-sm mb-2">
                    <div className="h-4 w-6 bg-surface-loading rounded animate-pulse"></div>
                    <div className="h-4 w-8 bg-surface-loading rounded animate-pulse"></div>
                  </div>
                  <div className="h-2 bg-surface-loading rounded-full animate-pulse mb-4"></div>
                  <div className="flex gap-4">
                    <div className="h-10 flex-1 bg-surface-loading rounded animate-pulse"></div>
                    <div className="h-10 flex-1 bg-surface-loading rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Color Section */}
                <div className="mb-6">
                  <div className="h-5 w-10 bg-surface-loading rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-surface-loading rounded-full animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="h-5 w-20 bg-surface-loading rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-surface-loading rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-surface-loading rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Product grid skeleton */}
        <div className="flex-1 min-w-0">
          <ProductListSkeleton />
        </div>
      </div>
    </div>
  );
}

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
}: {
  params: { categorySlug?: string };
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
    window.location.href,
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

  // Start collection data load but don't await it,
  // It will be awaited in the route component for the skeleton to be rendered
  const notAwaitedData = Promise.all([
    loadProductsListServiceConfig(parsedSearchOptions),
  ]);

  return {
    categoriesListConfig,
    notAwaitedData,
    currentCategorySlug: params.categorySlug,
  };
}

export function StoreCollectionRoute({
  productPageRoute,
}: {
  productPageRoute: string;
}) {
  const { categoriesListConfig, notAwaitedData, currentCategorySlug } =
    useLoaderData<typeof storeCollectionRouteLoader>();

  return (
    <div className="wix-verticals-container">
      {/* Collection/products load with skeleton using React Router's Await */}
      <React.Suspense fallback={<CollectionSkeleton />}>
        <Await resolve={notAwaitedData} errorElement={<CollectionError />}>
          {data => {
            const [productsListConfig] = data;

            return (
              <CategoryPage
                categoriesListConfig={categoriesListConfig}
                productsListConfig={productsListConfig}
                currentCategorySlug={currentCategorySlug}
                productPageRoute={productPageRoute}
              />
            );
          }}
        </Await>
      </React.Suspense>
    </div>
  );
}
