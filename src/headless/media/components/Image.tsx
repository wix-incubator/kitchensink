import type { services } from '@wix/bookings';
import { Image, type FittingType, initCustomElement } from '@wix/image';

type MediaItem = services.MediaItem;

initCustomElement();

const parseMediaFromUrl = (url: string) => {
  if (!url)
    return { uri: url, originalWidth: undefined, originalHeight: undefined };

  const wixImagePrefix = 'wix:image://v1/';

  if (url.startsWith(wixImagePrefix)) {
    const uri = url.replace(wixImagePrefix, '').split('#')[0].split('/')[0];

    const params = new URLSearchParams(url.split('#')[1] || '');
    const originalWidth = params.get('originWidth');
    const originalHeight = params.get('originHeight');

    return {
      uri,
      originalWidth: originalWidth ? parseInt(originalWidth, 10) : undefined,
      originalHeight: originalHeight ? parseInt(originalHeight, 10) : undefined,
    };
  }

  return {
    uri: url,
  };
};

export function WixMediaImage({
  media,
  width,
  height,
  className,
  alt = '',
  showPlaceholder = true,
  displayMode = 'fill',
}: {
  media?: MediaItem;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  showPlaceholder?: boolean;
  displayMode?: FittingType;
}) {
  const {
    uri,
    originalWidth = 640,
    originalHeight = 320,
  } = parseMediaFromUrl(media?.image!);

  return (
    <Image
      key={uri}
      uri={uri}
      width={width || originalWidth}
      height={height || originalHeight}
      containerWidth={width}
      containerHeight={height}
      displayMode={displayMode}
      isSEOBot={false}
      shouldUseLQIP={showPlaceholder}
      alt={alt}
      className={className}
    />
  );
}
