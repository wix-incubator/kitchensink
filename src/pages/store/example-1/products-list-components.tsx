import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  ProductListService,
  ProductsListServiceDefinition,
  type ProductsListServiceConfig,
} from './products-list';
import type { PropsWithChildren, ReactNode } from 'react';
import { productsV3 } from '@wix/stores';
import {
  ProductService,
  ProductServiceDefinition,
} from '@wix/headless-stores/services';

function Root(
  props: PropsWithChildren<{ productsListConfig: ProductsListServiceConfig }>
) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductsListServiceDefinition,
        ProductListService,
        props.productsListConfig
      )}
    >
      {props.children}
    </WixServices>
  );
}

export type EmptyStateProps = {
  children: ((props: EmptyStateRenderProps) => ReactNode) | ReactNode;
};

export type EmptyStateRenderProps = {};

function EmptyState(props: EmptyStateProps) {
  const { isLoading, error, products } = useService(
    ProductsListServiceDefinition
  );
  const isLoadingValue = isLoading.get();
  const errorValue = error.get();
  const productsValue = products.get();

  if (!isLoadingValue && !errorValue && productsValue.length === 0) {
    return typeof props.children === 'function'
      ? props.children({})
      : props.children;
  }

  return null;
}

export type LoadingProps = {
  children: ((props: LoadingRenderProps) => ReactNode) | ReactNode;
};

export type LoadingRenderProps = {};

function Loading(props: LoadingProps) {
  const { isLoading } = useService(ProductsListServiceDefinition);
  const isLoadingValue = isLoading.get();

  if (isLoadingValue) {
    return typeof props.children === 'function'
      ? props.children({})
      : props.children;
  }

  return null;
}

export type ErrorProps = {
  children: ((props: ErrorRenderProps) => ReactNode) | ReactNode;
};

export type ErrorRenderProps = { error: string | null };

function Error(props: ErrorProps) {
  const { error } = useService(ProductsListServiceDefinition);
  const errorValue = error.get();

  if (errorValue) {
    return typeof props.children === 'function'
      ? props.children({ error: errorValue })
      : props.children;
  }

  return null;
}

export type ItemContentRenderProps = {
  product: productsV3.V3Product;
};

export type ItemContentProps = {
  children: ((props: ItemContentRenderProps) => ReactNode) | ReactNode;
};

function ItemContent(props: ItemContentProps) {
  const { products, isLoading, error } = useService(
    ProductsListServiceDefinition
  );
  const productsValue = products.get();

  if (isLoading.get() || error.get() || productsValue.length === 0) {
    return null;
  }

  return productsValue.map(product => (
    <WixServices
      key={product._id}
      servicesMap={createServicesMap().addService(
        ProductServiceDefinition,
        ProductService,
        { product }
      )}
    >
      {typeof props.children === 'function'
        ? props.children({ product })
        : props.children}
    </WixServices>
  ));
}

export type ItemsProps = {
  children: ((props: ItemsRenderProps) => ReactNode) | ReactNode;
};

export type ItemsRenderProps = {
  products: productsV3.V3Product[];
};

function Items(props: ItemsProps) {
  const { products } = useService(ProductsListServiceDefinition);
  const productsValue = products.get();

  return typeof props.children === 'function'
    ? props.children({ products: productsValue })
    : props.children;
}

export const ProductsList = {
  Root,
  EmptyState,
  Loading,
  Error,
  ItemContent,
  Items,
};
