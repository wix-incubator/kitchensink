import { createServicesMap } from '@wix/services-manager';
import {
  CurrentCartService,
  CurrentCartServiceDefinition,
} from '@wix/headless-ecom/services';
import {
  ProductService,
  ProductServiceDefinition,
} from '@wix/headless-stores/services';
import {
  SelectedVariantService,
  SelectedVariantServiceDefinition,
} from '@wix/headless-stores/services';
import type { ReactNode } from 'react';
import { WixServices } from '@wix/services-manager-react';
import {
  FilterService,
  FilterServiceDefinition,
} from '@wix/headless-stores/services';
import {
  CategoryService,
  CategoryServiceDefinition,
} from '@wix/headless-stores/services';
import {
  SortService,
  SortServiceDefinition,
} from '@wix/headless-stores/services';
import {
  CollectionService,
  CollectionServiceDefinition,
} from '@wix/headless-stores/services';
import {
  CatalogService,
  CatalogServiceDefinition,
} from '@wix/headless-stores/services';
import { StoreLayout } from '../layouts/StoreLayout';
import {
  MediaGalleryService,
  MediaGalleryServiceDefinition,
} from '@wix/headless-media/services';
import {
  ProductModifiersService,
  ProductModifiersServiceDefinition,
} from '@wix/headless-stores/services';

export interface WixServicesProviderProps {
  children: ReactNode;
  // whether to show the cart icon in the header allowing the user to view the mini cart
  showCartIcon?: boolean;
}

export default function WixServicesProvider({
  children,
  showCartIcon = false,
}: WixServicesProviderProps) {
  let servicesMap = createServicesMap()
    .addService(ProductServiceDefinition, ProductService)
    .addService(CurrentCartServiceDefinition, CurrentCartService)
    .addService(SelectedVariantServiceDefinition, SelectedVariantService)
    .addService(MediaGalleryServiceDefinition, MediaGalleryService)
    .addService(CollectionServiceDefinition, CollectionService)
    .addService(FilterServiceDefinition, FilterService)
    .addService(CategoryServiceDefinition, CategoryService)
    .addService(SortServiceDefinition, SortService)
    .addService(ProductModifiersServiceDefinition, ProductModifiersService)
    .addService(CatalogServiceDefinition, CatalogService);

  return (
    <>
      {showCartIcon ? (
        <StoreLayout currentCartServiceConfig={null}>
          {children}
        </StoreLayout>
      ) : (
        <WixServices servicesMap={servicesMap}>{children}</WixServices>
      )}
    </>
  );
}
