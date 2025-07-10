import React, { useEffect, useState, type ReactNode } from 'react';
import { useService } from '@wix/services-manager-react';
import { CategoryServiceDefinition } from '../services/category-service';

interface CategoryLoaderProps {
  children: (data: {
    isLoading: boolean;
    error: string | null;
    reload: () => Promise<void>;
  }) => ReactNode;
}

export const Loader: React.FC<CategoryLoaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categoryService = useService(CategoryServiceDefinition);

  const loadCategories = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await categoryService.loadCategories();
    } catch (err: any) {
      console.warn('Failed to load categories:', err);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <>
      {children({
        isLoading,
        error,
        reload: loadCategories,
      })}
    </>
  );
}; 