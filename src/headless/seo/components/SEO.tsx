import {
  ServicesManagerProvider,
  useService,
} from "@wix/services-manager-react";
import {
  SEOTagsService,
  SEOTagsServiceDefinition,
  type SEOTagsServiceConfig,
} from "../services/seo-tags-service";
import type { ServiceAPI } from "@wix/services-manager/types";
import type { seoTags } from "@wix/seo";
import { useEffect } from "react";
import { createServicesMap } from "@wix/services-manager";
import { createServicesManager } from "@wix/services-manager";

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
 * @param {SEOTagsServiceConfig} props.seoTagsServiceConfig - Configuration for the SEO tags service.
 *
 * @example
 * import { loadSEOTagsServiceConfig } from "@wix/seo/server-actions";
 * import { SEO } from "@wix/seo/components";
 * import { seoTags } from "@wix/seo";
 * 
 * const seoTagsServiceConfig = await loadSEOTagsServiceConfig({
 *   pageURL: url,
 *   itemData: { slug: "<YOUR_ITEM_SLUG>" },
 *   itemType: seoTags.ItemType.<YOUR_ITEM_TYPE>,
 * });
 *
 * <head>
 *   <SEO.Tags seoTagsServiceConfig={seoTagsServiceConfig} />
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
 * <SEO.UpdateTagsTrigger seoTagsServiceConfig={seoTagsServiceConfig}>
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
 * </SEO.UpdateTagsTrigger>
 * ```
 */
export const UpdateTagsTrigger = ({
  seoTagsServiceConfig,
  ...props
}: UpdateTagsTrigger & { seoTagsServiceConfig: SEOTagsServiceConfig }) => {
  const seoTagsServiceManager = createServicesManager(
    createServicesMap().addService(
      SEOTagsServiceDefinition,
      SEOTagsService,
      seoTagsServiceConfig
    )
  );
  return (
    <ServicesManagerProvider servicesManager={seoTagsServiceManager}>
      <UpdateTagsTriggerRender {...props} />  
    </ServicesManagerProvider>
  );
};

function UpdateTagsTriggerRender(props: UpdateTagsTrigger) {
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
}

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
