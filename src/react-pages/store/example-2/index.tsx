import React from "react";
import { KitchensinkLayout } from "../../../layouts/KitchensinkLayout";
import StoreCollectionPage from "../composites/products";
import "../../../styles/theme-2.css";
interface StoreExample2PageProps {
  filteredCollectionServiceConfig: any;
  currentCartServiceConfig: any;
  categoriesConfig: any;
}

export default function StoreExample2Page({
  filteredCollectionServiceConfig,
  currentCartServiceConfig,
  categoriesConfig,
}: StoreExample2PageProps) {
  // Create navigation handler for example-2 specific URLs
  const handleCategoryChange = (categoryId: string | null, category: any) => {
    if (typeof window !== "undefined") {
      const basePath = "/store/example-2";
      let newPath;

      if (categoryId === null) {
        // No category selected - fallback to base path
        newPath = basePath;
      } else {
        // Use category slug for URL
        if (!category?.slug) {
          console.warn(
            `Category ${categoryId} has no slug, using category ID as fallback`
          );
        }
        const categorySlug = category?.slug || categoryId;
        newPath = `${basePath}/category/${categorySlug}`;
      }

      // Navigate immediately - pulse animation will show during page load
      window.location.href = newPath;
    }
  };

  
  return (
    <KitchensinkLayout>
      <StoreCollectionPage
        filteredCollectionServiceConfig={filteredCollectionServiceConfig}
        currentCartServiceConfig={currentCartServiceConfig}
        categoriesConfig={categoriesConfig}
        onCategoryChange={handleCategoryChange}
        productPageRoute={'/store/example-2'}
      />
    </KitchensinkLayout>
  );
}
