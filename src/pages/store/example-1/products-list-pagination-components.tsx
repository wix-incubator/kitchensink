import { createServicesMap } from '@wix/services-manager';
import { useService, WixServices } from '@wix/services-manager-react';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  ProductsListPaginationService,
  ProductsListPaginationServiceDefinition,
} from './products-list-pagination';

function Root(props: PropsWithChildren) {
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

type NextPageProps = {
  children: ((props: NextPageRenderProps) => ReactNode) | ReactNode;
};

type NextPageRenderProps = {
  nextPage: () => void;
  hasNextPage: boolean;
};

function NextPage(props: NextPageProps) {
  const service = useService(ProductsListPaginationServiceDefinition);
  const nextPage = service.nextPage;
  const hasNextPage = service.hasNextPage.get();
  return typeof props.children === 'function'
    ? props.children({ nextPage, hasNextPage })
    : props.children;
}

type PrevPageProps = {
  children: ((props: PrevPageRenderProps) => ReactNode) | ReactNode;
};

type PrevPageRenderProps = {
  prevPage: () => void;
  hasPrevPage: boolean;
};

function PrevPage(props: PrevPageProps) {
  const service = useService(ProductsListPaginationServiceDefinition);
  const prevPage = service.prevPage;
  const hasPrevPage = service.hasPrevPage.get();
  return typeof props.children === 'function'
    ? props.children({ prevPage, hasPrevPage })
    : props.children;
}

type FirstPageProps = {
  children: ((props: FirstPageRenderProps) => ReactNode) | ReactNode;
};

type FirstPageRenderProps = {
  goToFirstPage: () => void;
  hasPrevPage: boolean;
};

function FirstPage(props: FirstPageProps) {
  const service = useService(ProductsListPaginationServiceDefinition);
  const goToFirstPage = service.goToFirstPage;
  const hasPrevPage = service.hasPrevPage.get();

  return typeof props.children === 'function'
    ? props.children({ goToFirstPage, hasPrevPage })
    : props.children;
}

export const ProductsListPagination = {
  Root,
  PageSize,
  NextPage,
  PrevPage,
  FirstPage,
};
