import React, { useEffect, useState, type ReactNode } from 'react';
import { useService } from '@wix/services-manager-react';
import { CurrentCartServiceDefinition } from '../services/current-cart-service';

interface CurrentCartLoaderProps {
  children: (data: {
    isLoading: boolean;
    error: string | null;
    reload: () => Promise<void>;
  }) => ReactNode;
}

export const Loader: React.FC<CurrentCartLoaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cartService = useService(CurrentCartServiceDefinition);

  const loadCart = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await cartService.reloadCart();
    } catch (err: any) {
      console.warn('Failed to reload cart:', err);
      setError('Failed to reload cart');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load cart in background without blocking the UI
    loadCart();
  }, []);

  return (
    <>
      {children({
        isLoading,
        error,
        reload: loadCart,
      })}
    </>
  );
}; 