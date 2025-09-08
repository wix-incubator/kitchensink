import { useLoaderData } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';

import {
  loadBlogCategoriesServiceConfig,
  loadBlogFeedServiceConfig,
} from '@wix/headless-blog/services';
import {
  NavigationProvider,
  type NavigationComponent,
} from '@/components/NavigationContext';
import { Link } from 'react-router-dom';
import '@wix/wix-vibe-plugins/plugins-vars.css';

const ReactRouterNavigationComponent: NavigationComponent = ({
  route,
  children,
  ...props
}) => {
  return (
    <Link to={route} {...props}>
      {children}
    </Link>
  );
};

export async function rootRouteLoader() {
  const [blogCategoriesServiceConfig, blogFeedServiceConfig] =
    await Promise.all([
      loadBlogCategoriesServiceConfig(),
      loadBlogFeedServiceConfig({
        pageSize: 3,
        sort: [
          {
            fieldName: 'firstPublishedDate',
            order: 'DESC',
          },
        ],
      }),
    ]);

  return {
    blogCategoriesServiceConfig,
    blogFeedServiceConfig,
  };
}

export function WixServicesProvider(props: { children: React.ReactNode }) {
  const { blogCategoriesServiceConfig, blogFeedServiceConfig } =
    useLoaderData<typeof rootRouteLoader>();

  return (
    <div data-testid="blog-container">
      <NavigationProvider navigationComponent={ReactRouterNavigationComponent}>
        {props.children}
      </NavigationProvider>
    </div>
  );
}
