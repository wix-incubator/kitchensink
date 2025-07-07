import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
  type Signal,
} from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import { seoTags } from '@wix/seo';

export interface SEOTagsServiceAPI {
  // @ts-ignore
  seoTags: Signal<seoTags.Tag[]>;
  updateSeoTags: (
    itemType?: seoTags.ItemType,
    itemData?: seoTags.SlugData | seoTags.PageNameData
  ) => Promise<void>;
}

export const SEOTagsServiceDefinition =
  defineService<SEOTagsServiceAPI>('seoTagsService');

export type SEOTagsServiceConfig = {
  tags: seoTags.Tag[];
  itemType?: seoTags.ItemType;
  itemData: seoTags.SlugData | seoTags.PageNameData;
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
        itemType: seoTags.ItemType = config.itemType ??
          seoTags.ItemType.UNKNOWN_ITEM_TYPE,
        itemData: seoTags.SlugData | seoTags.PageNameData = config.itemData
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

  let tags: seoTags.Tag[] = [];
  if (isStaticPage) {
    tags = await resolveStaticPageSeoTags(
      pageUrl,
      itemData as seoTags.PageNameData
    );
  } else {
    tags = await resolveItemSeoTags(
      pageUrl,
      itemType,
      itemData as seoTags.SlugData
    );
  }
  return {
    tags,
    itemType,
    itemData,
  };
}

function appendNewTags(tags: seoTags.Tag[]) {
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
