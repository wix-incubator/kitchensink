import { createServicesMap } from '@wix/services-manager';
import { useService, WixServices } from '@wix/services-manager-react';
import type { PropsWithChildren, ReactNode } from 'react';
import { type ProductsListServiceConfig } from './products-list';
import {
  ProductsListSortService,
  ProductsListSortServiceDefinition,
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

type SortProps = {
  children: ((props: SortRenderProps) => ReactNode) | ReactNode;
};

type SortRenderProps = {
  sort: string;
  setSort: (sort: string) => void;
};

function Sort(props: SortProps) {
  const service = useService(ProductsListSortServiceDefinition);
  const sort = service.sort.get();
  const setSort = service.setSort;

  return typeof props.children === 'function'
    ? props.children({ sort, setSort })
    : props.children;
}

export const ProductsListSort = {
  Root,
  Sort,
};
