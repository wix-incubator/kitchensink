import { createServicesMap } from '@wix/services-manager';
import { useService, WixServices } from '@wix/services-manager-react';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  ProductsListFiltersService,
  ProductsListFiltersServiceDefinition,
} from './products-list-filters';

function Root(props: PropsWithChildren) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductsListFiltersServiceDefinition,
        ProductsListFiltersService
      )}
    >
      {props.children}
    </WixServices>
  );
}

type MinPriceProps = {
  children: ((props: MinPriceRenderProps) => ReactNode) | ReactNode;
};

type MinPriceRenderProps = {
  minPrice: number;
  setMinPrice: (minPrice: number) => void;
};

function MinPrice(props: MinPriceProps) {
  const service = useService(ProductsListFiltersServiceDefinition);
  const minPrice = service.minPrice.get();
  const setMinPrice = service.setMinPrice;

  return typeof props.children === 'function'
    ? props.children({ minPrice, setMinPrice })
    : props.children;
}

export type MaxPriceProps = {
  children: ((props: MaxPriceRenderProps) => ReactNode) | ReactNode;
};

export type MaxPriceRenderProps = {
  maxPrice: number;
  setMaxPrice: (maxPrice: number) => void;
};

function MaxPrice(props: MaxPriceProps) {
  const service = useService(ProductsListFiltersServiceDefinition);
  const maxPrice = service.maxPrice.get();
  const setMaxPrice = service.setMaxPrice;

  return typeof props.children === 'function'
    ? props.children({ maxPrice, setMaxPrice })
    : props.children;
}

export const ProductsListFilters = {
  Root,
  MinPrice,
  MaxPrice,
};
