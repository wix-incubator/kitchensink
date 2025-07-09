import { createServicesMap } from '@wix/services-manager';
import {
  CurrentCartService,
  CurrentCartServiceDefinition,
} from '../headless/ecom/services/current-cart-service';
import {
  ProductService,
  ProductServiceDefinition,
} from '../headless/store/services/product-service';
import {
  SelectedVariantService,
  SelectedVariantServiceDefinition,
} from '../headless/store/services/selected-variant-service';
import type { ReactNode } from 'react';
import { WixServices } from '@wix/services-manager-react';
import {
  FilterService,
  FilterServiceDefinition,
} from '../headless/store/services/filter-service';
import {
  CategoryService,
  CategoryServiceDefinition,
} from '../headless/store/services/category-service';
import {
  SortService,
  SortServiceDefinition,
} from '../headless/store/services/sort-service';
import {
  CollectionService,
  CollectionServiceDefinition,
} from '../headless/store/services/collection-service';
import {
  CatalogPriceRangeService,
  CatalogPriceRangeServiceDefinition,
} from '../headless/store/services/catalog-price-range-service';
import {
  CatalogOptionsService,
  CatalogOptionsServiceDefinition,
} from '../headless/store/services/catalog-options-service';
import { StoreLayout } from '../layouts/StoreLayout';
import {
  MediaGalleryService,
  MediaGalleryServiceDefinition,
} from '../headless/media/services/media-gallery-service';
import {
  ProductModifiersService,
  ProductModifiersServiceDefinition,
} from '../headless/store/services/product-modifiers-service';

export interface WixServicesProviderProps {
  children: ReactNode;
  // whether to show the cart icon in the header allowing the user to view the mini cart
  showCartIcon?: boolean;
}

export default function WixServicesProvider({
  children,
  showCartIcon = false,
}: WixServicesProviderProps) {
  const servicesMap = createServicesMap()
    .addService(ProductServiceDefinition, ProductService)
    .addService(CurrentCartServiceDefinition, CurrentCartService)
    .addService(SelectedVariantServiceDefinition, SelectedVariantService)
    .addService(MediaGalleryServiceDefinition, MediaGalleryService)
    .addService(CollectionServiceDefinition, CollectionService)
    .addService(FilterServiceDefinition, FilterService)
    .addService(CategoryServiceDefinition, CategoryService)
    .addService(SortServiceDefinition, SortService)
    .addService(CatalogPriceRangeServiceDefinition, CatalogPriceRangeService)
    .addService(ProductModifiersServiceDefinition, ProductModifiersService)
    .addService(CatalogOptionsServiceDefinition, CatalogOptionsService);

  return (
    <WixServices servicesMap={servicesMap}>
      {showCartIcon ? (
        <StoreLayout currentCartServiceConfig={null}>{children}</StoreLayout>
      ) : (
        children
      )}
    </WixServices>
  );
}
