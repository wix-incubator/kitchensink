import { ProductActionButtons } from './ProductActionButtons';
import {
  ProductRoot,
  ProductModifiersRoot,
  ProductVariantSelectorRoot,
  SelectedVariantRoot,
  ProductDescriptionDisplay,
  ProductVariantSelectorOptions,
  ProductModifiersComplete,
  ProductDetailsGrid,
  ProductImagesSection,
  ProductMainImage,
  ProductInfoSection,
  ProductPriceAndSKUSection,
  ProductQuantitySelectorWithStock,
  ProductStockStatusDisplay,
  ProductDetailsSection,
  ProductCartSummarySection,
} from '../ui/store/Product';

import { productsV3 } from '@wix/stores';

import { SocialSharingButtons } from '../social/SocialSharingButtons';
import { useNavigation } from '../NavigationContext';
import * as StyledMediaGallery from '@/components/media/MediaGallery';

export default function ProductDetails({
  product,
}: {
  isQuickView?: boolean;
  product: productsV3.V3Product;
}) {
  const Navigation = useNavigation();

  return (
    <ProductRoot product={product}>
      <StyledMediaGallery.Root
        mediaGalleryServiceConfig={{
          media: product.media?.itemsInfo?.items ?? [],
        }}
      >
        <ProductModifiersRoot>
          <ProductVariantSelectorRoot>
            <SelectedVariantRoot>
              <>
                <ProductDetailsGrid>
                  {/* Product Images */}
                  <ProductImagesSection>
                    {/* Main Image */}
                    <ProductMainImage>
                      <StyledMediaGallery.Viewport />
                      <StyledMediaGallery.Previous />
                      <StyledMediaGallery.Next />
                      <StyledMediaGallery.Indicator />
                    </ProductMainImage>
                    {/* Thumbnail Images */}
                    <StyledMediaGallery.Thumbnails>
                      <StyledMediaGallery.ThumbnailRepeater>
                        <StyledMediaGallery.ThumbnailItem />
                      </StyledMediaGallery.ThumbnailRepeater>
                    </StyledMediaGallery.Thumbnails>
                  </ProductImagesSection>
                  {/* Product Info */}
                  <ProductInfoSection>
                    {/* Product Name & Price */}
                    <ProductPriceAndSKUSection />
                    {/* Product Description */}
                    <ProductDescriptionDisplay />
                    {/* Product Options (if any) */}
                    <ProductVariantSelectorOptions />
                    {/* Product Modifiers */}
                    <ProductModifiersComplete />
                    {/* Quantity Selector */}
                    <ProductQuantitySelectorWithStock />
                    <SocialSharingButtons />
                    {/* Add to Cart */}
                    <ProductActionButtons />
                    {/* Stock Status */}
                    <ProductStockStatusDisplay />
                    {/* Product Details */}
                    <ProductDetailsSection />
                  </ProductInfoSection>
                </ProductDetailsGrid>
                {/* Current Cart Summary */}
                <ProductCartSummarySection Navigation={Navigation} />
              </>
            </SelectedVariantRoot>
          </ProductVariantSelectorRoot>
        </ProductModifiersRoot>
      </StyledMediaGallery.Root>
    </ProductRoot>
  );
}
