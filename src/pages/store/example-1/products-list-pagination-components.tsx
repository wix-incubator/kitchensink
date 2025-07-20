import { createServicesMap } from '@wix/services-manager';
import { useService, WixServices } from '@wix/services-manager-react';
import type { PropsWithChildren, ReactNode } from 'react';
import { type ProductsListServiceConfig } from './products-list';
import {
  ProductsListPaginationService,
  ProductsListPaginationServiceDefinition,
} from './products-list-pagination';

function Root(
  props: PropsWithChildren<{ productsListConfig: ProductsListServiceConfig }>
) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductsListPaginationServiceDefinition,
        ProductsListPaginationService
      )}
    >
      {props.children}
    </WixServices>
  );
}

type PageSizeProps = {
  children: ((props: PageSizeRenderProps) => ReactNode) | ReactNode;
};

type PageSizeRenderProps = {
  currentLimit: number;
  setLimit: (limit: number) => void;
};

function PageSize(props: PageSizeProps) {
  const service = useService(ProductsListPaginationServiceDefinition);
  const currentLimit = service.currentLimit.get();
  const setLimit = service.setLimit;

  return typeof props.children === 'function'
    ? props.children({ currentLimit, setLimit })
    : props.children;
}

type NavigationProps = {
  children: ((props: NavigationRenderProps) => ReactNode) | ReactNode;
};

type NavigationRenderProps = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
};

function Navigation(props: NavigationProps) {
  const service = useService(ProductsListPaginationServiceDefinition);
  const hasNextPage = service.hasNextPage.get();
  const hasPrevPage = service.hasPrevPage.get();
  const nextPage = service.nextPage;
  const prevPage = service.prevPage;
  const firstPage = service.firstPage;

  return typeof props.children === 'function'
    ? props.children({
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        firstPage,
      })
    : props.children;
}

type InfoProps = {
  children: ((props: InfoRenderProps) => ReactNode) | ReactNode;
};

type InfoRenderProps = {
  totalCount: number;
  currentLimit: number;
  currentCursor: string | null;
};

function Info(props: InfoProps) {
  const service = useService(ProductsListPaginationServiceDefinition);
  const totalCount = service.totalCount.get();
  const currentLimit = service.currentLimit.get();
  const currentCursor = service.currentCursor.get();

  return typeof props.children === 'function'
    ? props.children({ totalCount, currentLimit, currentCursor })
    : props.children;
}

export const ProductsListPagination = {
  Root,
  PageSize,
  Navigation,
  Info,
};

export type { PageSizeRenderProps, NavigationRenderProps, InfoRenderProps };
