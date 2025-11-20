import { useLoaderData, useParams, useLocation } from 'react-router';
import { loadProductServiceConfig, ProductService } from '@wix/stores/services';
import type { ServiceFactoryConfig } from '@wix/services-definitions';
import ProductDetailPage from '../../store/main-components/productDetailsPage';
import { SEO } from '@wix/seo/components';
import { seoTags } from '@wix/seo';
import { useEffect } from 'react';

export async function productRouteLoader({
  params,
}: {
  params: { slug?: string };
}): Promise<{
  productServiceConfig: ServiceFactoryConfig<typeof ProductService>;
}> {
  if (!params.slug) {
    throw new Error('Product slug is required');
  }

  const productServiceConfigResult = await loadProductServiceConfig(
    params.slug
  );

  if (productServiceConfigResult.type === 'notFound') {
    throw new Response('Not Found', { status: 404 });
  }

  return {
    productServiceConfig: productServiceConfigResult.config,
  };
}

export function ProductDetailsRoute() {
  const { productServiceConfig } = useLoaderData<typeof productRouteLoader>();
  const { slug } = useParams();
  const location = useLocation();

  return (
    <SEO.UpdateTagsTrigger>
      {({ updateSeoTags }) => {
        useEffect(() => {
          if (slug) {
            updateSeoTags(seoTags.ItemType.STORES_PRODUCT, { slug });
          }
        }, [slug, location.pathname, updateSeoTags]);

        return (
          <div className="wix-verticals-container">
            <ProductDetailPage productServiceConfig={productServiceConfig} />
          </div>
        );
      }}
    </SEO.UpdateTagsTrigger>
  );
}
