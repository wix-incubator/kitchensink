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
 * This loader function is used to load the SEO tags service config.
 * For static pages, you don't need to pass itemType
 *
 * @param {string} pageURL - The full URL of the page where the SEO tags will be applied
 * @param {seoTags.ItemType} itemType - Optional. The type of item (e.g., STORES_PRODUCT, BLOG_POST),Used for item pages, for static pages, pass undefined
 * @param {seoTags.SlugData | seoTags.PageNameData} itemData - Object containing metadata for the item (slug or page name)
 * @returns {Promise<seoTags.Tag[]>} Promise that resolves to an array of SEO tags
 *
 * @example
 * ```typescript
 * const seoTagsServiceConfig = await loadSEOTagsServiceConfig(
 *   pageURL: "https://mysite.com/store/product-123",
 *   itemType: seoTags.ItemType.STORES_PRODUCT,
 *   itemData: { slug: "product-123" }
 * );
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
