import { categories } from '@wix/categories';
import { useService } from '@wix/services-manager-react';
import React, { type ReactNode } from 'react';
import { CategoryServiceDefinition } from '../services/category-service';

// Grid component for displaying filtered products
interface CategoryListProps {
  children: (data: {
    categories: categories.Category[];
    selectedCategory: string | null;
    setSelectedCategory: (categoryId: string | null) => void;
  }) => ReactNode;
}

export const List: React.FC<CategoryListProps> = ({ children }) => {
  const service = useService(CategoryServiceDefinition);

  const categories = service.categories.get();
  const selectedCategory = service.selectedCategory.get();

  return (
    <>
      {children({
        selectedCategory,
        categories,
        setSelectedCategory: service.setSelectedCategory,
      })}
    </>
  );
};
