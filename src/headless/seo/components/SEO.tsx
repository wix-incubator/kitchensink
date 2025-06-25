import { useService } from "@wix/services-manager-react";
import {
  SEOTagsService,
  SEOTagsServiceDefinition,
  type SEOTagsServiceConfig,
} from "../services/seo-tags-service";
import type { ServiceAPI } from "@wix/services-manager/types";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import { useEffect } from "react";
import { seoTags } from "@wix/seo";

interface SEOTagsProps {
  itemType: seoTags.ItemType;
  itemData: seoTags.SlugData | seoTags.PageNameData;
}

function SEOTags({ itemType, itemData }: SEOTagsProps): React.ReactNode {
  const service = useService(SEOTagsServiceDefinition) as ServiceAPI<
    typeof SEOTagsServiceDefinition
  >;
  const tags = service.seoTags.get();

  useEffect(() => {
    service.updateSeoTags(itemType, itemData);
  }, []);

  return (
    <>
      {tags
        .filter((tag) => !tag.disabled)
        .map((tag) => {
          if (tag.type === "title") {
            return <title>{tag.children}</title>;
          }
          if (tag.type === "meta") {
            return <meta {...tag.props} />;
          }

          if (tag.type === "link") {
            return <link {...tag.props} />;
          }

          if (tag.type === "script") {
            return (
              <script {...tag.props} {...tag.meta}>
                {tag.children}
              </script>
            );
          }
          return null;
        })}
    </>
  );
}

/**
 * Renders SEO tags (title, meta, link, script) in the document head using a provided SEO service configuration.
 *
 * Integrates with the Wix services manager and a custom SEO tags service to inject SEO-relevant tags.
 *
 * @param {Object} props
 * @param {SEOTagsServiceConfig} props.seoTagsServiceConfig - Configuration for the SEO tags service.
 * @param {seoTags.ItemType} props.itemType - The type of item for which to generate SEO tags.
 * @param {seoTags.SlugData | seoTags.PageNameData} props.itemData - Data for the item (slug or page name).
 *
 * @example
 * // SSR usage:
 * import { loadSEOTagsServiceConfig } from "...";
 * const seoTagsServiceConfig = await loadSEOTagsServiceConfig({
 *   pageURL: url,
 *   itemData: { slug: "<YOUR_ITEM_SLUG>" },
 *   itemType: seoTags.ItemType.<YOUR_ITEM_TYPE>,
 * });
 *
 * // Client usage:
 * import { SEO } from "...";
 * <head>
 *   <SEO
 *     seoTagsServiceConfig={seoTagsServiceConfig}
 *     itemType={seoTags.ItemType.<YOUR_ITEM_TYPE>}
 *     itemData={{ slug: "<YOUR_ITEM_SLUG>" }}
 *   />
 * </head>
 */

export interface SEOProps {
  seoTagsServiceConfig: SEOTagsServiceConfig;
  itemType: seoTags.ItemType;
  itemData: seoTags.SlugData | seoTags.PageNameData;
}

export function SEO({
  seoTagsServiceConfig,
  itemType,
  itemData,
}: SEOProps): React.ReactNode {
  // Create services manager with both booking services
  const servicesManager = createServicesManager(
    createServicesMap().addService(
      SEOTagsServiceDefinition,
      SEOTagsService,
      seoTagsServiceConfig
    )
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <SEOTags itemType={itemType} itemData={itemData} />
    </ServicesManagerProvider>
  );
}
