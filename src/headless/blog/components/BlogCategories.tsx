import { useService } from '@wix/services-manager-react';
import type { BlogCategoriesServiceAPI, EnhancedCategory } from '../services';
import { BlogCategoriesServiceDefinition } from '../services/blog-categories-service';

export interface RootProps {
  children: (props: RootRenderProps) => React.ReactNode;
}

export interface RootRenderProps {
  activeCategory: ReturnType<BlogCategoriesServiceAPI['activeCategory']['get']>;
}

export const Root = (props: RootProps) => {
  const service = useService(BlogCategoriesServiceDefinition);

  return props.children({
    activeCategory: service.activeCategory.get(),
  });
};

export interface ListProps {
  children: (props: ListRenderProps) => React.ReactNode;
}

export interface ListRenderProps {
  categories: ReturnType<BlogCategoriesServiceAPI['categories']['get']>;
}

export const List = (props: ListProps) => {
  const service = useService(BlogCategoriesServiceDefinition);

  return props.children({
    categories: service.categories.get(),
  });
};
