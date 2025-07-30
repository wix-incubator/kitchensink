import { useLoaderData, redirect, Await, useHref } from 'react-router-dom';
import React from 'react';
import { loadCategoriesListServiceConfig } from '@wix/headless-stores/services';
import {
  loadProductsListServiceConfig,
  loadProductsListFiltersServiceConfig,
} from '@wix/headless-stores/services';
import CategoryPage from '../../store/main-components/categoryPage';

// Skeleton component for product collection loading
function CollectionSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-10 w-64 bg-surface-loading rounded animate-pulse mb-4"></div>
        <div className="h-6 w-96 bg-surface-loading rounded animate-pulse"></div>
      </div>

      {/* Filters skeleton */}
      <div className="mb-6">
        <div className="h-10 w-32 bg-surface-loading rounded animate-pulse mb-4"></div>
        <div className="flex gap-4 mb-4">
          <div className="h-10 w-24 bg-surface-loading rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-surface-loading rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-surface-loading rounded animate-pulse"></div>
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-surface-card rounded-lg p-4">
            <div className="h-48 bg-surface-loading rounded animate-pulse mb-4"></div>
            <div className="h-6 w-3/4 bg-surface-loading rounded animate-pulse mb-2"></div>
            <div className="h-4 w-1/2 bg-surface-loading rounded animate-pulse mb-4"></div>
            <div className="h-10 w-full bg-surface-loading rounded animate-pulse"></div>
          </div>
        ))}
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
  // Load categories config immediately (blocks the transition - this is fast)
  const categoriesConfig = await loadCategoriesListServiceConfig();

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

  // If category not found, return 404
  if (!selectedCategory) {
    throw new Response('Not Found', { status: 404 });
  }

  const searchOptions = {
    cursorPaging: {
      limit: 20,
    },
    filter: {
      'allCategoriesInfo.categories': {
        $matchItems: [{ _id: selectedCategory._id! }],
      },
    },
  };

  // Start collection data load but don't await it,
  // It will be awaited in the route component for the skeleton to be rendered
  const notAwaiatedData = Promise.all([
    loadProductsListServiceConfig(searchOptions),
    loadProductsListFiltersServiceConfig(),
  ]);

  return {
    categoriesConfig,
    notAwaiatedData,
    currentCategorySlug: params.categorySlug,
  };
}

export function StoreCollectionRoute({
  productPageRoute,
  storeRoute,
}: {
  productPageRoute: string;
  storeRoute: string;
}) {
  const basename = useHref('/');
  const { categoriesConfig, notAwaiatedData, currentCategorySlug } =
    useLoaderData<typeof storeCollectionRouteLoader>();

  return (
    <div className="wix-verticals-container">
      {/* Collection/products load with skeleton using React Router's Await */}
      <React.Suspense fallback={<CollectionSkeleton />}>
        <Await resolve={notAwaiatedData} errorElement={<CollectionError />}>
          {data => {
            const [productsListConfig, productsListFiltersConfig] = data;
            return (
              <CategoryPage
                categoriesListConfig={categoriesConfig}
                productsListConfig={productsListConfig}
                productsListFiltersConfig={productsListFiltersConfig}
                currentCategorySlug={currentCategorySlug}
                productPageRoute={productPageRoute}
                basePath={`${basename}${storeRoute}`}
              />
            );
          }}
        </Await>
      </React.Suspense>
    </div>
  );
}
