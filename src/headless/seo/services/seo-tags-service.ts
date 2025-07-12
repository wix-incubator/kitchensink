import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
  type Signal,
} from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import {
  ItemType,
  type SlugData,
  type PageNameData,
  type Tag,
  resolveStaticPageSeoTags as resolveStaticPageSeoTagsSDK,
  resolveItemSeoTags as resolveItemSeoTagsSDK,
} from '@wix/auto_sdk_seo_seo-tags';

export interface SEOTagsServiceAPI {
  // @ts-ignore
  seoTags: Signal<Tag[]>;
  updateSeoTags: (
    itemType?: ItemType,
    itemData?: SlugData | PageNameData
  ) => Promise<void>;
}

export const SEOTagsServiceDefinition =
  defineService<SEOTagsServiceAPI>('seoTagsService');

export type SEOTagsServiceConfig = {
  tags: Tag[];
  itemType?: ItemType;
  itemData: SlugData | PageNameData;
};

export const SEOTagsService =
  implementService.withConfig<SEOTagsServiceConfig>()(
    SEOTagsServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const { tags: initialTags } = config;

      // @ts-ignore
      const tags: Signal<seoTags.Tag[]> = signalsService.signal(initialTags);

      const updateSeoTags = async (
        itemType: ItemType = config.itemType ?? ItemType.UNKNOWN_ITEM_TYPE,
        itemData: SlugData | PageNameData = config.itemData
      ) => {
        const pageURL = window.location.href;

        const updatedConfig = await loadSEOTagsServiceConfig({
          pageUrl: pageURL,
          itemType,
          itemData,
        });

        tags.set(updatedConfig.tags);
        appendNewTags(updatedConfig.tags);
      };

      return { seoTags: tags, updateSeoTags };
    }
  );

async function resolveItemSeoTags(
  pageUrl: string,
  itemType: ItemType,
  itemData: SlugData
): Promise<Tag[]> {
  const res = await resolveItemSeoTagsSDK({
    pageUrl,
    itemType,
    slug: itemData.slug,
  });

  return res.seoTags?.tags || [];
}

async function resolveStaticPageSeoTags(
  pageUrl: string,
  itemData: PageNameData
): Promise<Tag[]> {
  const { pageName, seoData } = itemData;
  const res = await resolveStaticPageSeoTagsSDK({
    pageUrl,
    pageName,
    seoData,
  });

  return res.seoTags?.tags || [];
}

/**
 * Loads the SEO tags service configuration for a given page.
 *
 * @param {Object} params - The configuration parameters.
 * @param {string} params.pageUrl - The full URL of the page where SEO tags will be applied.
 * @param {ItemType} [params.itemType] - Optional. The type of item (e.g., STORES_PRODUCT, BLOG_POST) for item pages.
 * @param {SlugData | PageNameData} params.itemData - Item metadata (slug for item pages or pageName for static pages).
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
 *   itemType: ItemType.STORES_PRODUCT,
 *   itemData: { slug: "product-123" }
 * });
 * ```
 */
export async function loadSEOTagsServiceConfig({
  itemType,
  pageUrl,
  itemData,
}: {
  itemType?: ItemType;
  pageUrl: string;
  itemData: SlugData | PageNameData;
}): Promise<ServiceFactoryConfig<typeof SEOTagsService>> {
  const isStaticPage = !itemType || itemType === ItemType.UNKNOWN_ITEM_TYPE;

  let tags: Tag[] = [];
  if (isStaticPage) {
    tags = await resolveStaticPageSeoTags(pageUrl, itemData as PageNameData);
  } else {
    tags = await resolveItemSeoTags(pageUrl, itemType, itemData as SlugData);
  }
  return {
    tags,
    itemType,
    itemData,
  };
}

function appendNewTags(tags: Tag[]) {
  if (typeof window === 'undefined') return;

  const newTagElements: HTMLElement[] = [];
  try {
    tags.forEach(tag => {
      const el = createTagElement(tag);
      if (el) newTagElements.push(el);
    });

    document.head
      .querySelectorAll('[wix-seo-tags="true"]')
      .forEach(el => el.remove());

    newTagElements.forEach(el => document.head.appendChild(el));
  } catch (err) {
    console.error('SEO tag update failed', err);
  }

  function createTagElement(tag: any): HTMLElement | null {
    let el: HTMLElement | null = null;
    if (tag.type === 'title') {
      el = document.createElement('title');
      el.textContent = tag.children || '';
    } else if (tag.type === 'meta') {
      el = document.createElement('meta');
      setAttributes(el, tag.props);
    } else if (tag.type === 'link') {
      el = document.createElement('link');
      setAttributes(el, tag.props);
    } else if (tag.type === 'script') {
      el = document.createElement('script');
      setAttributes(el, tag.props);
      setAttributes(el, tag.meta);
      if (tag.children) el.textContent = tag.children;
    }
    if (el) el.setAttribute('wix-seo-tags', 'true');
    return el;
  }

  function setAttributes(el: HTMLElement, attrs?: Record<string, any>) {
    if (!attrs) return;
    Object.entries(attrs).forEach(([k, v]) => {
      if (v !== undefined) el.setAttribute(k, v as string);
    });
  }
}
