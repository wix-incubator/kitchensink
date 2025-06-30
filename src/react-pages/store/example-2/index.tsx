import React from "react";
import { KitchensinkLayout } from "../../../layouts/KitchensinkLayout";
import StoreCollectionPage from "../composites/products";
import "../../../styles/theme-2.css";
import { StoreLayout } from "../../../layouts/StoreLayout";
import {
  CollectionService,
  CollectionServiceDefinition,
} from "../../../headless/store/services/collection-service";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import {
  FilterService,
  FilterServiceDefinition,
} from "../../../headless/store/services/filter-service";
import {
  CurrentCartService,
  CurrentCartServiceDefinition,
} from "../../../headless/ecom/services/current-cart-service";
import {
  CategoryService,
  CategoryServiceDefinition,
} from "../../../headless/store/services/category-service";
import {
  SortService,
  SortServiceDefinition,
} from "../../../headless/store/services/sort-service";
import {
  CatalogPriceRangeService,
  CatalogPriceRangeServiceDefinition,
} from "../../../headless/store/services/catalog-price-range-service";
import {
  CatalogOptionsService,
  CatalogOptionsServiceDefinition,
} from "../../../headless/store/services/catalog-options-service";
import { ServicesManagerProvider } from "@wix/services-manager-react";

interface StoreExample2PageProps {
  filteredCollectionServiceConfig: any;
  currentCartServiceConfig: any;
  categoriesConfig: any;
}

export default function StoreExample2Page({
  filteredCollectionServiceConfig,
  currentCartServiceConfig,
  categoriesConfig,
}: StoreExample2PageProps) {
  // Create navigation handler for example-2 specific URLs
  const handleCategoryChange = (categoryId: string | null, category: any) => {
    if (typeof window !== "undefined") {
      const basePath = "/store/example-2";
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

      // Navigate immediately - pulse animation will show during page load
      window.location.href = newPath;
    }
  };

  const servicesManager = createServicesManager(
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
      .addService(
        CurrentCartServiceDefinition,
        CurrentCartService,
        currentCartServiceConfig
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
    <KitchensinkLayout>
      <ServicesManagerProvider servicesManager={servicesManager}>
        <StoreLayout 
          currentCartServiceConfig={currentCartServiceConfig}
          servicesManager={servicesManager}>
          <StoreCollectionPage productPageRoute={"/store/example-2"} />
        </StoreLayout>
      </ServicesManagerProvider>
    </KitchensinkLayout>
  );
}
