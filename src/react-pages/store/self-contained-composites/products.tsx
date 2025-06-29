import React, { useState, useEffect, useMemo } from "react";
import ProductGridContent from "../composites/products";
import { loadCategoriesConfig } from "../../../headless/store/services/category-service";
import { loadCollectionServiceConfig } from "../../../headless/store/services/collection-service";
import { loadCurrentCartServiceConfig } from "../../../headless/ecom/services/current-cart-service";
import '../../../styles/theme-vibe.css';
import '../../../styles/global.css';


// Skeleton components
const ProductCardSkeleton = () => (
  <div className="bg-[var(--theme-bg-card)] rounded-xl p-4 animate-pulse">
    <div className="aspect-square bg-[var(--theme-bg-options)] rounded-lg mb-4"></div>
    <div className="h-4 bg-[var(--theme-bg-options)] rounded mb-2"></div>
    <div className="h-3 bg-[var(--theme-bg-options)] rounded w-2/3 mb-2"></div>
    <div className="h-6 bg-[var(--theme-bg-options)] rounded w-1/2"></div>
  </div>
);


export default function SelfContainedProductsPage() {

  const [isLoading, setIsLoading] = useState(true);
  const [filteredCollectionServiceConfig, setFilteredCollectionServiceConfig] = useState<any>(null);
  const [currentCartServiceConfig, setCurrentCartServiceConfig] = useState<any>(null);
  const [categoriesConfig, setCategoriesConfig] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesConfig, filteredCollectionServiceConfig, currentCartServiceConfig] = await Promise.all([
        loadCategoriesConfig(),
        loadCollectionServiceConfig(undefined, undefined),
        loadCurrentCartServiceConfig()
      ])
      setCategoriesConfig(categoriesConfig);
      setFilteredCollectionServiceConfig(filteredCollectionServiceConfig);
      setCurrentCartServiceConfig(currentCartServiceConfig);
      setIsLoading(false);
    };
    fetchData();
  }, []);


  return (
    <>
      {isLoading ?
      <ProductCardSkeleton/> :
      <ProductGridContent
        filteredCollectionServiceConfig={filteredCollectionServiceConfig}
        currentCartServiceConfig={currentCartServiceConfig}
        categoriesConfig={categoriesConfig}
      />
      }
    </>
  );
}
