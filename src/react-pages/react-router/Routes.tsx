import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useService } from '@wix/services-manager-react';
import ProductList from '../../components/store/ProductList';
import ProductDetails from '../../components/store/ProductDetails';
import { ProductServiceDefinition } from '@wix/headless-stores/services';
import { CategoryServiceDefinition } from '@wix/headless-stores/services';
import { CurrentCartServiceDefinition } from '@wix/headless-ecom/services';
import '../../styles/theme-wix-vibe.css';
import { MediaGalleryServiceDefinition } from '@wix/headless-media/services';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';

// Store Route Component with Categories Loading
function StoreRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const categoryService = useService(CategoryServiceDefinition);

  useEffect(() => {
    async function loadStoreData() {
      try {
        await categoryService.loadCategories();
      } catch (err: any) {
        console.warn('Failed to load categories:', err);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    }

    loadStoreData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin w-8 h-8 text-content-primary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-content-primary text-lg">
              Loading store...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-surface-error rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-status-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-content-primary mb-4">
            {error}
          </h2>
          <p className="text-content-light">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-status-success-medium backdrop-blur-sm text-content-primary px-6 py-3 rounded-xl shadow-lg border border-status-success animate-pulse">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Added to cart successfully!
          </div>
        </div>
      )}
      <ProductList
        productPageRoute="/products"
        setLayoutSuccessMessage={show => setShowSuccessMessage(show)}
      />
    </>
  );
}

// Global Cart Loader Component
function GlobalCartLoader({ children }: { children: React.ReactNode }) {
  const cartService = useService(CurrentCartServiceDefinition);

  useEffect(() => {
    // Load cart in background without blocking the UI
    cartService.reloadCart().catch((err: any) => {
      console.warn('Failed to reload cart:', err);
    });
  }, []);

  return <>{children}</>;
}

// Product Details Route Component
function ProductDetailsRoute() {
  const { slug } = useParams<{ slug: string }>();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const productService = useService(ProductServiceDefinition);
  const mediaGalleryService = useService(MediaGalleryServiceDefinition);
  const signalsService = useService(SignalsServiceDefinition);

  // Handle the success message timer
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  // Load product data and set up services manager
  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;

      const dispose = signalsService.effect(() => {
        const errorValue = productService.error.get();
        setError(errorValue);
      });

      await productService.loadProduct(slug);
      mediaGalleryService.setMediaToDisplay(
        productService.product.get().media?.itemsInfo?.items ?? []
      );
      setIsLoading(false);

      return dispose;
    }

    loadProduct();
  }, [slug, signalsService]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin w-8 h-8 text-content-primary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-content-primary text-lg">
              Loading product...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-surface-error rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-status-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-content-primary mb-4">
            {error}
          </h2>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-light transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Product Details */}
      <ProductDetails setShowSuccessMessage={setShowSuccessMessage} />

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-status-success-medium backdrop-blur-sm text-content-primary px-6 py-3 rounded-xl shadow-lg border border-status-success animate-pulse">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Added to cart successfully!
          </div>
        </div>
      )}
    </>
  );
}

export { StoreRoute, ProductDetailsRoute, GlobalCartLoader };
