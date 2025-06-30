import { type SEOTagsServiceConfig } from "../services/seo-tags-service";
import { SeoTags } from "./SeoTags";

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
  return <SeoTags tags={seoTagsServiceConfig.initialSeoTags} />;
}
