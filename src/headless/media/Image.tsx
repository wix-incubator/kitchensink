import type { services } from "@wix/bookings";
import { media as wixMedia } from "@wix/sdk";
import { Image } from "@wix/image";

type MediaItem = services.MediaItem;

export const parseWixImageUrl = (url: string) => {
  if (!url) {
    return { uri: url, originalWidth: undefined, originalHeight: undefined };
  }

  // Extract the hash parameters part
  const hashIndex = url.indexOf("#");
  let baseUrl = hashIndex !== -1 ? url.substring(0, hashIndex) : url;

  // Extract URI by removing wix:image://v1/ prefix if present
  let uri = baseUrl;
  if (baseUrl.startsWith("wix:image://v1/")) {
    uri = baseUrl.substring("wix:image://v1/".length);
  }

  // Extract just the image file part (before the first "/")
  const slashIndex = uri.indexOf("/");
  if (slashIndex !== -1) {
    uri = uri.substring(0, slashIndex);
  }

  if (hashIndex === -1) {
    return { uri, originalWidth: undefined, originalHeight: undefined };
  }

  // Parse the hash parameters
  const params = url.substring(hashIndex + 1);
  const searchParams = new URLSearchParams(params);

  const originWidth = searchParams.get("originWidth");
  const originHeight = searchParams.get("originHeight");

  return {
    uri,
    originalWidth: originWidth ? parseInt(originWidth, 10) : undefined,
    originalHeight: originHeight ? parseInt(originHeight, 10) : undefined,
  };
};

export default function WixMediaImage({
  media,
  width = 640,
  height = 320,
  className,
  alt = "",
  showPlaceholder = true,
}: {
  media?: MediaItem;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  showPlaceholder?: boolean;
}) {
  const { uri, originalWidth, originalHeight } = parseWixImageUrl(
    media?.image!
  );

  console.log({ uri, originalWidth, originalHeight });

  return (
    <Image
      uri={uri}
      width={originalWidth || width}
      height={originalHeight || height}
      displayMode="fit"
      isInFirstFold={true}
      isSEOBot={false}
      shouldUseLQIP={showPlaceholder}
      alt={alt}
      className={className}
    />
  );
}
