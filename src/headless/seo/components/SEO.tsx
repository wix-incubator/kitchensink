import { useService } from "@wix/services-manager-react";
import {
  SEOTagsServiceDefinition,
  type SEOTagsServiceConfig,
} from "../services/seo-tags-service";
import type { ServiceAPI } from "@wix/services-manager/types";
import type { seoTags } from "@wix/seo";
import { useEffect } from "react";

interface SEOTagsProps {
  tags: seoTags.Tag[];
}

function SEOTags({ tags }: SEOTagsProps): React.ReactNode {
  return (
    <>
      {tags
        .filter((tag) => !tag.disabled)
        .map((tag, index) => {
          const dataAttr = { "wix-seo-tags": "true" };
          if (tag.type === "title") {
            return (
              <title key={`title-${index}`} {...dataAttr}>
                {tag.children}
              </title>
            );
          }
          if (tag.type === "meta") {
            return <meta key={`meta-${index}`} {...tag.props} {...dataAttr} />;
          }

          if (tag.type === "link") {
            return <link key={`link-${index}`} {...tag.props} {...dataAttr} />;
          }

          if (tag.type === "script") {
            return (
              <script
                key={`script-${index}`}
                {...tag.props}
                {...tag.meta}
                {...dataAttr}
              >
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
 * import { loadSEOTagsServiceConfig } from "@wix/seo/server-actions";
 * import { SEO } from "@wix/seo/components";
 * const seoTagsServiceConfig = await loadSEOTagsServiceConfig({
 *   pageURL: url,
 *   itemData: { slug: "<YOUR_ITEM_SLUG>" },
 *   itemType: seoTags.ItemType.<YOUR_ITEM_TYPE>,
 * });
 *
 * <head>
 *   <SEO.Tags
 *     seoTagsServiceConfig={seoTagsServiceConfig}
 *     itemType={seoTags.ItemType.<YOUR_ITEM_TYPE>}
 *     itemData={{ slug: "<YOUR_ITEM_SLUG>" }}
 *   />
 * </head>
 */

export interface TagsProps {
  seoTagsServiceConfig: SEOTagsServiceConfig;
}

export function Tags({ seoTagsServiceConfig }: TagsProps): React.ReactNode {
  return <SEOTags tags={seoTagsServiceConfig.initialSeoTags} />;
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
 * UpdateTagsTrigger - Handles updating SEO tags
 * 
 * @example
 * ```tsx
 * import { seoTags } from "@wix/seo";
 * import { SEO } from "@wix/seo/components";
 * import { SEOTagsServiceDefinition, SEOTagsService } from "@wix/seo/services/seo-tags-service";
 * import { createServicesManager, createServicesMap } from "@wix/services-manager";
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
 *   <SEO.UpdateTagsTrigger>
 *     {({ updateSeoTags }) => (
 *       <a href="https://your-domain.com/items/different-item" 
 *         onClick={() => 
 *           updateSeoTags(seoTags.ItemType.<YOUR_ITEM_TYPE>, { slug: "<YOUR_ITEM_SLUG>" })
 *         }
 *       >
 *         Go to different item
 *       </a>
 *     )}
 *   </SEO.UpdateTagsTrigger>
 * </ServicesManagerProvider>
 * ```
 */
export const UpdateTagsTrigger = (props: UpdateTagsTrigger) => {
  const service = useService(SEOTagsServiceDefinition) as ServiceAPI<
    typeof SEOTagsServiceDefinition
  >;

  useEffect(() => {
    const tags = service.seoTags.get().filter((tag) => !tag.disabled);
    appendNewTags(tags);
  }, [service.seoTags.get()]);

  return props.children({
    updateSeoTags: service.updateSeoTags,
  });
};

function appendNewTags(tags: seoTags.Tag[]) {
  const newTagElements: HTMLElement[] = [];
  try {
    tags.forEach((tag) => {
      const el = createTagElement(tag);
      if (el) newTagElements.push(el);
    });

    document.head
      .querySelectorAll('[wix-seo-tags="true"]')
      .forEach((el) => el.remove());

    newTagElements.forEach((el) => document.head.appendChild(el));
  } catch (err) {
    console.error("SEO tag update failed", err);
  }

  function createTagElement(tag: any): HTMLElement | null {
    let el: HTMLElement | null = null;
    if (tag.type === "title") {
      el = document.createElement("title");
      el.textContent = tag.children || "";
    } else if (tag.type === "meta") {
      el = document.createElement("meta");
      setAttributes(el, tag.props);
    } else if (tag.type === "link") {
      el = document.createElement("link");
      setAttributes(el, tag.props);
    } else if (tag.type === "script") {
      el = document.createElement("script");
      setAttributes(el, tag.props);
      setAttributes(el, tag.meta);
      if (tag.children) el.textContent = tag.children;
    }
    if (el) el.setAttribute("wix-seo-tags", "true");
    return el;
  }

  function setAttributes(el: HTMLElement, attrs?: Record<string, any>) {
    if (!attrs) return;
    Object.entries(attrs).forEach(([k, v]) => {
      if (v !== undefined) el.setAttribute(k, v as string);
    });
  }
}
