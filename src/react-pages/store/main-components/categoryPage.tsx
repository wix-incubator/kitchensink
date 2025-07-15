import { createServicesMap } from '@wix/services-manager';
import { useState } from 'react';
import {
  CatalogOptionsService,
  CatalogOptionsServiceDefinition,
} from '@wix/headless-stores/services';
import {
  CatalogPriceRangeService,
  CatalogPriceRangeServiceDefinition,
} from '@wix/headless-stores/services';
import {
  CategoryService,
  CategoryServiceDefinition,
} from '@wix/headless-stores/services';
import {
  CollectionService,
  CollectionServiceDefinition,
} from '@wix/headless-stores/services';
import {
  FilterService,
  FilterServiceDefinition,
} from '@wix/headless-stores/services';
import {
  SortService,
  SortServiceDefinition,
} from '@wix/headless-stores/services';
import ProductList from '../../../components/store/ProductList';
import { WixServices } from '@wix/services-manager-react';

interface StoreCollectionPageProps {
  filteredCollectionServiceConfig: any;
  categoriesConfig: any;
  productPageRoute: string;
}

function CategoryPage({
  filteredCollectionServiceConfig,
  categoriesConfig,
  productPageRoute,
}: StoreCollectionPageProps) {
  // Create navigation handler for example-1 specific URLs
  const handleCategoryChange = (categoryId: string | null, category: any) => {
    if (typeof window !== 'undefined') {
      const basePath = '/store/example-1';
      let newPath;

      if (categoryId === null) {
        // No category selected - fallback to base path
        newPath = basePath;
      } else {
        // Use category slug for URL
        if (!category?.slug) {
          console.warn(
            `Category ${categoryId} has no slug, using category ID as fallback`
          );
        }
        const categorySlug = category?.slug || categoryId;
        newPath = `${basePath}/category/${categorySlug}`;
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
      .addService(
        CatalogPriceRangeServiceDefinition,
        CatalogPriceRangeService,
        {}
      )
      .addService(CatalogOptionsServiceDefinition, CatalogOptionsService, {})
  );

  return (
    <WixServices servicesMap={servicesMap}>
      <ProductList productPageRoute={productPageRoute} />
    </WixServices>
  );
}

export default CategoryPage;
