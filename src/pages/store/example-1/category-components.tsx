import { createServicesMap } from '@wix/services-manager';
import { useService, WixServices } from '@wix/services-manager-react';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  CategoryService,
  CategoryServiceDefinition,
  type CategoryServiceConfig,
} from './category';

function Root(
  props: PropsWithChildren<{ categoryServiceConfig: CategoryServiceConfig }>
) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CategoryServiceDefinition,
        CategoryService,
        props.categoryServiceConfig
      )}
    >
      {props.children}
    </WixServices>
  );
}

type NameProps = {
  children: ((props: NameRenderProps) => ReactNode) | ReactNode;
};

type NameRenderProps = {
  name: string;
};

function Name(props: NameProps) {
  const categoryService = useService(CategoryServiceDefinition);

  return typeof props.children === 'function'
    ? props.children({ name: categoryService.category.get().name! })
    : props.children;
}

type SlugProps = {
  children: ((props: SlugRenderProps) => ReactNode) | ReactNode;
};

type SlugRenderProps = {
  slug: string;
};

function Slug(props: SlugProps) {
  const categoryService = useService(CategoryServiceDefinition);

  return typeof props.children === 'function'
    ? props.children({ slug: categoryService.category.get().slug! })
    : props.children;
}

export const Category = {
  Root,
  Name,
  Slug,
};
