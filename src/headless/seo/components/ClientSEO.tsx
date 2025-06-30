import { SEOTagsServiceDefinition } from "../services/seo-tags-service";
import type { seoTags } from "@wix/seo";
import { useService } from "@wix/services-manager-react";
import type { ServiceAPI } from "@wix/services-manager/types";
import { SeoTags } from "./SeoTags";

/**
 * Renders Client SEO tags (title, meta, link, script) in the document head using the SEO service from the services manager.
 *
 * Integrates with the Wix services manager and a custom SEO tags service to inject SEO-relevant tags on the client side.
 * This component must be used within a ServicesManagerProvider that has the SEOTagsService configured.
 *
 * @example
 * ```tsx
 * import { ClientSEO } from "@wix/seo/components";
 * import { ServicesManagerProvider } from "@wix/services-manager-react";
 * import { SEOTagsService } from "@wix/seo/services";
 *
 * const seoTagsServiceManager = createServicesManager(
 *   createServicesMap().addService(
 *     SEOTagsServiceDefinition,
 *     SEOTagsService,
 *     seoTagsServiceConfig
 *   )
 * );
 *
 * <ServicesManagerProvider servicesManager={seoTagsServiceManager}>
 *   <ClientSEO.Tags />
 * </ServicesManagerProvider>
 * ```
 */

export interface TagsProps {}

export function Tags(props: TagsProps): React.ReactNode {
  const service = useService(SEOTagsServiceDefinition) as ServiceAPI<
    typeof SEOTagsServiceDefinition
  >;

  return <SeoTags tags={service.seoTags.get()} isClient />;
}

export interface UpdateTagsTrigger {
  children: (props: {
    updateSeoTags: (
      itemType: seoTags.ItemType,
      itemData: seoTags.SlugData | seoTags.PageNameData
    ) => Promise<void>;
  }) => React.ReactNode;
}

/**
 * UpdateTagsTrigger - Handles updating SEO tags dynamically
 *
 * This component provides a way to update SEO tags on the client side without
 * requiring a full page reload. It wraps content with the ability to trigger
 * SEO tag updates.
 *
 * @example
 * ```tsx
 * import { SEO } from "@wix/seo/components";
 * import { seoTags } from "@wix/seo";
 *
 * <ClientSEO.UpdateTagsTrigger>
 *   {({ updateSeoTags }) => (
 *     <a
 *       href="https://your-domain.com/items/different-item"
 *       onClick={() =>
 *         updateSeoTags(seoTags.ItemType.STORES_PRODUCT, { slug: "product-slug" })
 *       }
 *     >
 *       Go to a different item
 *     </a>
 *   )}
 * </ClientSEO.UpdateTagsTrigger>
 * ```
 */
export const UpdateTagsTrigger = (props: UpdateTagsTrigger) => {
  const service = useService(SEOTagsServiceDefinition) as ServiceAPI<
    typeof SEOTagsServiceDefinition
  >;

  return props.children({
    updateSeoTags: service.updateSeoTags,
  });
};
