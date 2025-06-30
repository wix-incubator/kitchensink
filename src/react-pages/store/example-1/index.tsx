import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { PageDocsRegistration } from "../../../components/DocsMode";
import {
  CatalogOptionsService,
  CatalogOptionsServiceDefinition,
} from "../../../headless/store/services/catalog-options-service";
import {
  CatalogPriceRangeService,
  CatalogPriceRangeServiceDefinition,
} from "../../../headless/store/services/catalog-price-range-service";
import {
  CategoryService,
  CategoryServiceDefinition,
} from "../../../headless/store/services/category-service";
import {
  CollectionService,
  CollectionServiceDefinition,
} from "../../../headless/store/services/collection-service";
import {
  CurrentCartService,
  CurrentCartServiceDefinition,
} from "../../../headless/ecom/services/current-cart-service";
import {
  FilterService,
  FilterServiceDefinition,
} from "../../../headless/store/services/filter-service";
import {
  SortService,
  SortServiceDefinition,
} from "../../../headless/store/services/sort-service";
import { KitchensinkLayout } from "../../../layouts/KitchensinkLayout";
import { StoreLayout } from "../../../layouts/StoreLayout";
import "../../../styles/theme-1.css";
import ProductList from "../../../components/store/ProductList";

interface StoreCollectionPageProps {
  filteredCollectionServiceConfig: any;
  currentCartServiceConfig: any;
  categoriesConfig: any;
}

export default function StoreCollectionPage({
  filteredCollectionServiceConfig,
  currentCartServiceConfig,
  categoriesConfig,
}: StoreCollectionPageProps) {
  // Create navigation handler for example-1 specific URLs
  const handleCategoryChange = (categoryId: string | null, category: any) => {
    if (typeof window !== "undefined") {
      const basePath = "/store/example-1";
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

      window.history.pushState(null, 'Showing Category ' + category?.name, newPath);
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
      <PageDocsRegistration
        title="Product Collection - Example 1"
        description="Browse our collection of amazing products with advanced filtering."
        docsUrl="/docs/examples/store-collection-overview"
      />
      <StoreLayout
        currentCartServiceConfig={currentCartServiceConfig}
        servicesManager={servicesManager}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--theme-text-content)] mb-4">
              Product Collection - Example 1
            </h1>
            <p className="text-[var(--theme-text-content-70)] text-lg">
              Browse our collection of amazing products with advanced filtering
            </p>
          </div>

          <ProductList productPageRoute="/store/example-1" />
        </div>
      </StoreLayout>
    </KitchensinkLayout>
  );
}
