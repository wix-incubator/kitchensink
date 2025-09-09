import { useLoaderData } from 'react-router-dom';
import { loadProductServiceConfig, ProductService } from '@wix/stores/services';
import type { ServiceFactoryConfig } from '@wix/services-definitions';
import ProductDetailPage from '../../store/main-components/productDetailsPage';

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
  return (
    <div className="wix-verticals-container">
      <ProductDetailPage productServiceConfig={productServiceConfig} />
    </div>
  );
}
