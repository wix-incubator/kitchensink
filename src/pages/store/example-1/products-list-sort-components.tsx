import { createServicesMap } from '@wix/services-manager';
import { useService, WixServices } from '@wix/services-manager-react';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  ProductsListSortService,
  ProductsListSortServiceDefinition,
  SortType,
} from './products-list-sort';

function Root(props: PropsWithChildren) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductsListSortServiceDefinition,
        ProductsListSortService,
        {}
      )}
    >
      {props.children}
    </WixServices>
  );
}

type OptionsProps = {
  children: ((props: SortRenderProps) => ReactNode) | ReactNode;
};

type SortRenderProps = {
  selectedSortOption: string;
  setSelectedSortOption: (sort: string) => void;
  sortOptions: SortType[];
};

function Options(props: OptionsProps) {
  const service = useService(ProductsListSortServiceDefinition);
  const selectedSortOption = service.selectedSortOption.get();
  const sortOptions = service.sortOptions;
  const setSelectedSortOption = service.setSelectedSortOption;

  return typeof props.children === 'function'
    ? props.children({
        selectedSortOption,
        setSelectedSortOption,
        sortOptions,
      })
    : props.children;
}

export const ProductsListSort = {
  Root,
  Options,
};
