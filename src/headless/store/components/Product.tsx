import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { ProductServiceDefinition } from "../services/product-service";
import { SelectedVariantServiceDefinition } from "../services/selected-variant-service";
import type { productsV3 } from "@wix/stores";

/**
 * Props for ProductName headless component
 */
export interface ProductNameProps {
  /** Render prop function that receives product name data */
  children: (props: ProductNameRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductName component
 */
export interface ProductNameRenderProps {
  /** Product name */
  name: string;
}

/**
 * Headless component for product name display
 */
export const Name = (props: ProductNameProps) => {
  const service = useService(ProductServiceDefinition) as ServiceAPI<
    typeof ProductServiceDefinition
  >;

  const product = service.product.get();
  const name = product.name!;

  return props.children({
    name,
  });
};

/**
 * Props for ProductDescription headless component
 */
export interface ProductDescriptionProps {
  /** Render prop function that receives product description data */
  children: (props: ProductDescriptionRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductDescription component
 */
export interface ProductDescriptionRenderProps {
  /** Product description (may contain HTML) */
  description: NonNullable<productsV3.V3Product["description"]>;
  /** Product plain description */
  plainDescription: NonNullable<productsV3.V3Product["plainDescription"]>;
}

/**
 * Headless component for product description display
 */
export const Description = (props: ProductDescriptionProps) => {
  const service = useService(ProductServiceDefinition) as ServiceAPI<
    typeof ProductServiceDefinition
  >;

  const product = service.product.get();

  const descriptionRichContent = product.description!;
  const plainDescription = product.plainDescription!;

  return props.children({
    description: descriptionRichContent,
    plainDescription: plainDescription,
  });
};
