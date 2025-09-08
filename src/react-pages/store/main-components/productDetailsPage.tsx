import ProductDetails from '@/components/store/ProductDetails';
import type { CurrentCartServiceConfig } from '@wix/headless-ecom/services';

interface ProductDetailPageProps {
  productServiceConfig?: any;
  currentCartServiceConfig: CurrentCartServiceConfig;
}

function ProductDetailsPage({
  productServiceConfig,
  currentCartServiceConfig,
}: ProductDetailPageProps) {
  return (
    <ProductDetails
      product={productServiceConfig.product}
      currentCartServiceConfig={currentCartServiceConfig}
    />
  );
}

export default ProductDetailsPage;
