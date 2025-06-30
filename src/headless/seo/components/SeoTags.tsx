import { Helmet } from "react-helmet";
import type { seoTags } from "@wix/seo";

interface SEOTagsProps {
  tags: seoTags.Tag[];
  isClient?: boolean;
}

export function SeoTags({
  tags,
  isClient = false,
}: SEOTagsProps): React.ReactNode {
  const dataAttr = !isClient ? {"data-ssr-seo-tags": "true"} : {};

  const tagsToRender = tags
    .filter((tag) => !tag.disabled)
    .map((tag, index) => {
      if (tag.type === "title") {
        return <title key={`title-${index}`} {...dataAttr}>{tag.children}</title>;
      }
      if (tag.type === "meta") {
        return <meta key={`meta-${index}`} {...tag.props} {...dataAttr} />;
      }

      if (tag.type === "link") {
        return <link key={`link-${index}`} {...tag.props} {...dataAttr} />;
      }

      if (tag.type === "script") {
        return (
          <script key={`script-${index}`} {...tag.props} {...tag.meta} {...dataAttr}>
            {tag.children}
          </script>
        );
      }
      return null;
    });

  if (isClient) {
    return <Helmet>{tagsToRender}</Helmet>;
  }

  return tagsToRender;
}
