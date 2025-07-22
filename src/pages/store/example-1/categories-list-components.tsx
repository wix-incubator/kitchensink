import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  CategoriesListService,
  CategoriesListServiceDefinition,
  type CategoriesListServiceConfig,
} from './categories-list';
import type { PropsWithChildren, ReactNode } from 'react';
import { categories } from '@wix/categories';
import { Category } from './category-components';

function Root(
  props: PropsWithChildren<{
    categoriesListConfig: CategoriesListServiceConfig;
  }>
) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CategoriesListServiceDefinition,
        CategoriesListService,
        props.categoriesListConfig
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
  const { isLoading, error, categories } = useService(
    CategoriesListServiceDefinition
  );
  const isLoadingValue = isLoading.get();
  const errorValue = error.get();
  const categoriesValue = categories.get();

  if (!isLoadingValue && !errorValue && categoriesValue.length === 0) {
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
  const { isLoading } = useService(CategoriesListServiceDefinition);
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
  const { error } = useService(CategoriesListServiceDefinition);
  const errorValue = error.get();

  if (errorValue) {
    return typeof props.children === 'function'
      ? props.children({ error: errorValue })
      : props.children;
  }

  return null;
}

export type ItemContentRenderProps = {
  category: categories.Category;
};

export type ItemContentProps = {
  children: ((props: ItemContentRenderProps) => ReactNode) | ReactNode;
};

function ItemContent(props: ItemContentProps) {
  const { categories, isLoading, error } = useService(
    CategoriesListServiceDefinition
  );
  const categoriesValue = categories.get();

  if (isLoading.get() || error.get() || categoriesValue.length === 0) {
    return null;
  }

  return categoriesValue.map(category => (
    <Category.Root key={category._id} categoryServiceConfig={{ category }}>
      {typeof props.children === 'function'
        ? props.children({
            category,
          })
        : props.children}
    </Category.Root>
  ));
}

export const CategoriesList = {
  Root,
  EmptyState,
  Loading,
  Error,
  ItemContent,
};
