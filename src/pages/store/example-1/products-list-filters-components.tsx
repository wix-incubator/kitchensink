import { createServicesMap } from '@wix/services-manager';
import { useService, WixServices } from '@wix/services-manager-react';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  ProductsListFiltersService,
  ProductsListFiltersServiceDefinition,
  InventoryStatusType,
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

export type InventoryStatusProps = {
  children: ((props: InventoryStatusRenderProps) => ReactNode) | ReactNode;
};

export type InventoryStatusRenderProps = {
  availableInventoryStatuses: InventoryStatusType[];
  selectedInventoryStatuses: InventoryStatusType[];
  toggleInventoryStatus: (status: InventoryStatusType) => void;
};

function InventoryStatus(props: InventoryStatusProps) {
  const service = useService(ProductsListFiltersServiceDefinition);
  const availableInventoryStatuses = service.availableInventoryStatuses.get();
  const selectedInventoryStatuses = service.selectedInventoryStatuses.get();
  const toggleInventoryStatus = service.toggleInventoryStatus;

  return typeof props.children === 'function'
    ? props.children({
        availableInventoryStatuses,
        selectedInventoryStatuses,
        toggleInventoryStatus,
      })
    : props.children;
}

export type ResetTriggerProps = {
  children: ((props: ResetTriggerRenderProps) => ReactNode) | ReactNode;
};

export type ResetTriggerRenderProps = {
  resetFilters: () => void;
  isFiltered: boolean;
};

function ResetTrigger(props: ResetTriggerProps) {
  const service = useService(ProductsListFiltersServiceDefinition);
  const resetFilters = service.reset;
  const isFiltered = service.isFiltered.get();

  return typeof props.children === 'function'
    ? props.children({ resetFilters, isFiltered })
    : props.children;
}

export type PriceRangeProps = {
  children: ((props: PriceRangeRenderProps) => ReactNode) | ReactNode;
};

export type PriceRangeRenderProps = {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (minPrice: number) => void;
  setMaxPrice: (maxPrice: number) => void;
};

function PriceRange(props: PriceRangeProps) {
  const service = useService(ProductsListFiltersServiceDefinition);
  const minPrice = service.minPrice.get();
  const maxPrice = service.maxPrice.get();
  const setMinPrice = service.setMinPrice;
  const setMaxPrice = service.setMaxPrice;

  return typeof props.children === 'function'
    ? props.children({ minPrice, maxPrice, setMinPrice, setMaxPrice })
    : props.children;
}

export const ProductsListFilters = {
  Root,
  MinPrice,
  MaxPrice,
  InventoryStatus,
  ResetTrigger,
  PriceRange,
};
