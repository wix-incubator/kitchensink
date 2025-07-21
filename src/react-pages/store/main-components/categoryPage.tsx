import { createServicesMap } from '@wix/services-manager';
import { useState } from 'react';
import {
  CatalogOptionsService as CatalogService,
  CatalogOptionsServiceDefinition as CatalogServiceDefinition,
} from '@wix/stores/services';
import {
  CategoryService,
  CategoryServiceDefinition,
} from '@wix/stores/services';
import {
  CollectionService,
  CollectionServiceDefinition,
} from '@wix/stores/services';
import {
  FilterService,
  FilterServiceDefinition,
} from '@wix/stores/services';
import {
  SortService,
  SortServiceDefinition,
} from '@wix/stores/services';
import ProductList from '../../../components/store/ProductList';
import { WixServices } from '@wix/services-manager-react';

interface StoreCollectionPageProps {
  filteredCollectionServiceConfig: any;
  categoriesConfig: any;
  productPageRoute: string;
  basePath: string;
}

function CategoryPage({
  filteredCollectionServiceConfig,
  categoriesConfig,
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

  const [servicesMap] = useState(() =>
    createServicesMap()
      .addService(
        CollectionServiceDefinition,
        CollectionService,
        filteredCollectionServiceConfig
      )
      .addService(
        FilterServiceDefinition,
        FilterService,
        filteredCollectionServiceConfig
      )
      .addService(CategoryServiceDefinition, CategoryService, {
        ...categoriesConfig,
        onCategoryChange: handleCategoryChange,
      })
      .addService(SortServiceDefinition, SortService, {
        initialSort: filteredCollectionServiceConfig.initialSort,
      })
      .addService(CatalogServiceDefinition, CatalogService, {})
  );

  return (
    <WixServices servicesMap={servicesMap}>
      <ProductList productPageRoute={productPageRoute} />
    </WixServices>
  );
}

export default CategoryPage;
