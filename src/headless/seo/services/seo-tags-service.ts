import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
  type Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import { seoTags } from "@wix/seo";

export interface SEOTagsServiceAPI {
  // @ts-ignore
  seoTags: Signal<seoTags.Tag[]>;
  updateSeoTags: (
    itemType?: seoTags.ItemType,
    itemData?: seoTags.SlugData | seoTags.PageNameData
  ) => Promise<void>;
}

export const SEOTagsServiceDefinition =
  defineService<SEOTagsServiceAPI>("seoTagsService");

export type SEOTagsServiceConfig = {
  initialSeoTags: seoTags.Tag[];
  itemType?: seoTags.ItemType;
  itemData: seoTags.SlugData | seoTags.PageNameData;
};

export const SEOTagsService =
  implementService.withConfig<SEOTagsServiceConfig>()(
    SEOTagsServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const { initialSeoTags } = config;

      // @ts-ignore
      const tags: Signal<seoTags.Tag[]> = signalsService.signal(
        // @ts-ignore
        initialSeoTags || []
      );

      const updateSeoTags = async (
        itemType: seoTags.ItemType = config.itemType ??
          seoTags.ItemType.UNKNOWN_ITEM_TYPE,
        itemData: seoTags.SlugData | seoTags.PageNameData = config.itemData
      ) => {
        const pageURL = window.location.href;
        let resolvedTags = [];

        const isStaticPage =
          !itemType || itemType === seoTags.ItemType.UNKNOWN_ITEM_TYPE;
        if (isStaticPage) {
          resolvedTags = await resolveStaticPageSeoTags(
            pageURL,
            itemData as seoTags.PageNameData
          );
        } else {
          resolvedTags = await resolveItemSeoTags(
            pageURL,
            itemType,
            itemData as seoTags.SlugData
          );
        }
        tags.set(resolvedTags);
        // remove all elements with data-ssr-seo-tags attributes from the document to avoid duplicates
        const elements = document.querySelectorAll("[data-ssr-seo-tags]");
        elements.forEach((element) => element.remove());
      };

      return { seoTags: tags, updateSeoTags };
    }
  );

async function resolveItemSeoTags(
  pageUrl: string,
  itemType: seoTags.ItemType,
  itemData: seoTags.SlugData
): Promise<seoTags.Tag[]> {
  const res = await seoTags.resolveItemSeoTags({
    pageUrl,
    itemType,
    slug: itemData.slug,
  });

  return res.seoTags?.tags || [];
}

async function resolveStaticPageSeoTags(
  pageUrl: string,
  itemData: seoTags.PageNameData
): Promise<seoTags.Tag[]> {
  const { pageName, seoData } = itemData;
  const res = await seoTags.resolveStaticPageSeoTags({
    pageUrl,
    pageName,
    seoData,
  });

  return res.seoTags?.tags || [];
}

/**
 * Loads the SEO tags service configuration for a given page.
 *
 * @param {string} pageUrl - The full URL of the page where SEO tags will be applied.
 * @param {seoTags.ItemType} itemType - Optional. The type of item (e.g., STORES_PRODUCT, BLOG_POST) for item pages.
 * @param {seoTags.SlugData | seoTags.PageNameData} itemData - Item metadata (slug for item pages or pageName for static pages).
 * @returns {Promise<SEOTagsServiceConfig>} Promise resolving to SEO tags service configuration.
 *
 * @example
 * ```typescript
 * // Static page configuration
 * const config = await loadSEOTagsServiceConfig({
 *   pageUrl: "https://mysite.com/store",
 *   itemData: { 
 *     pageName: "Store Home", 
 *     seoData: { tags: [] } 
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Item page configuration
 * const config = await loadSEOTagsServiceConfig({
 *   pageUrl: "https://mysite.com/store/product-123",
 *   itemType: seoTags.ItemType.STORES_PRODUCT,
 *   itemData: { slug: "product-123" }
 * });
 * ```
 */
export async function loadSEOTagsServiceConfig({
  itemType,
  pageUrl,
  itemData,
}: {
  itemType?: seoTags.ItemType;
  pageUrl: string;
  itemData: seoTags.SlugData | seoTags.PageNameData;
}): Promise<ServiceFactoryConfig<typeof SEOTagsService>> {
  const isStaticPage =
    !itemType || itemType === seoTags.ItemType.UNKNOWN_ITEM_TYPE;

  let initialSeoTags: seoTags.Tag[] = [];
  if (isStaticPage) {
    initialSeoTags = await resolveStaticPageSeoTags(
      pageUrl,
      itemData as seoTags.PageNameData
    );
  } else {
    initialSeoTags = await resolveItemSeoTags(
      pageUrl,
      itemType,
      itemData as seoTags.SlugData
    );
  }
  return {
    initialSeoTags,
    itemType,
    itemData,
  };
}
