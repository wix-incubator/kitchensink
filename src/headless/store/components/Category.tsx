import React, {
  createContext,
  useContext,
  type ReactNode,
  useState,
} from "react";
import { useService } from "@wix/services-manager-react";
import {
  CategoryServiceDefinition,
  type CategoryServiceAPI,
} from "../services/category-service";
import { categories } from "@wix/categories";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";

const CategoryContext = createContext<CategoryServiceAPI | null>(null);

interface CategoryProviderProps {
  children: ReactNode;
}

export const Provider: React.FC<CategoryProviderProps> = ({ children }) => {
  const service = useService(CategoryServiceDefinition);

  return (
    <CategoryContext.Provider value={service}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

// Grid component for displaying filtered products
interface CategoryListProps {
  children: (data: {
    categories: categories.Category[];
    selectedCategory: string | null;
    setSelectedCategory: (categoryId: string | null) => void;
  }) => ReactNode;
}

export const List: React.FC<CategoryListProps> = ({ children }) => {
  const service = useCategory();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    service.selectedCategory.get()
  );
  const signalsService = useService(SignalsServiceDefinition);
  const categories = service.categories.get();
  signalsService.effect(() => {
    const categoryId = service.selectedCategory.get();
    if (categoryId !== selectedCategory) {
      setSelectedCategory(categoryId);
    }
  });

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
