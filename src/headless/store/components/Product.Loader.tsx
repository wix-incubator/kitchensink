import React, { useEffect, useState, type ReactNode } from 'react';
import { useService } from '@wix/services-manager-react';
import { ProductServiceDefinition } from '../services/product-service';
import { MediaGalleryServiceDefinition } from '../../media/services/media-gallery-service';

interface ProductDetailsLoaderProps {
  /** Product slug to load */
  slug: string | undefined;
  /** Render prop function that receives loading data */
  children: (data: {
    isLoading: boolean;
    error: string | null;
    reload: () => Promise<void>;
  }) => ReactNode;
}

export const Loader: React.FC<ProductDetailsLoaderProps> = ({ slug, children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const productService = useService(ProductServiceDefinition);
  const mediaGalleryService = useService(MediaGalleryServiceDefinition);

  const loadProduct = async () => {
    if (!slug) return;
    
    try {
      setError(null);
      setIsLoading(true);
      
      // Subscribe to product service error
      productService.error.subscribe((error: string | null) => {
        setError(error);
      });
      
      // Load product and set up media gallery
      await productService.loadProduct(slug);
      await mediaGalleryService.setMediaToDisplay(
        productService.product.get().media?.itemsInfo?.items ?? []
      );
    } catch (err: any) {
      console.warn('Failed to load product:', err);
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [slug]);

  return (
    <>
      {children({
        isLoading,
        error,
        reload: loadProduct,
      })}
    </>
  );
}; 