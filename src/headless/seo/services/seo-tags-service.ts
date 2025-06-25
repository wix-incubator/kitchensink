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
    itemType: seoTags.ItemType,
    itemData: seoTags.SlugData | seoTags.PageNameData
  ) => Promise<void>;
}

export const SEOTagsServiceDefinition =
  defineService<SEOTagsServiceAPI>("seoTagsService");

export type SEOTagsServiceConfig = {
  initialSeoTags: seoTags.Tag[];
  itemType: seoTags.ItemType;
  itemData: seoTags.SlugData | seoTags.PageNameData;
};

export const SEOTagsService =
  implementService.withConfig<SEOTagsServiceConfig>()(
    SEOTagsServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const { initialSeoTags  } = config;

      // @ts-ignore
      const seoTags: Signal<seoTags.Tag[]> = signalsService.signal(
        // @ts-ignore
        initialSeoTags || []
      ); 

      const updateSeoTags = async (
        itemType: seoTags.ItemType = config.itemType,
        itemData: seoTags.SlugData | seoTags.PageNameData = config.itemData
      ) => {
        const pageURL = window.location.href;
        const tags = await resolveSeoTags(itemType, pageURL, itemData);
        seoTags.set(tags);
      };

      return { seoTags, updateSeoTags };
    }
  );

async function resolveSeoTags(
  itemType: seoTags.ItemType,
  pageURL: string,
  itemData: seoTags.SlugData | seoTags.PageNameData
): Promise<seoTags.Tag[]> {
  const resolvedItemData = (itemData as seoTags.SlugData).slug
    ? { slugData: itemData as seoTags.SlugData }
    : { pageNameData: itemData as seoTags.PageNameData };

  const res = await seoTags.resolveSeoTags({
    pageUrl: pageURL,
    itemType: itemType,
    ...resolvedItemData,
  });

  return res.seoTags?.tags || [];
}

export async function loadSEOTagsServiceConfig({
  itemType,
  pageURL,
  itemData,
}: {
  itemType: seoTags.ItemType;
  pageURL: string;
  itemData: seoTags.SlugData | seoTags.PageNameData;
}): Promise<ServiceFactoryConfig<typeof SEOTagsService>> {
  const initialSeoTags = await resolveSeoTags(itemType, pageURL, itemData);
  return {
    initialSeoTags,
    itemType,
    itemData,
  };
}
