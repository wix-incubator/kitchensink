import * as React from 'react';
import { sdk } from '@wix/image-kit';
import './image.css';

const parseDim = (dim?: number | string): number | null => {
  if (!dim) return null;
  if (typeof dim === 'number' && !isNaN(dim)) return dim;
  if (typeof dim === 'string') {
    // Check for string of a number (e.g., "100")
    if (/^\d+$/.test(dim)) return parseInt(dim, 10);
    // Check for string of number+px (e.g., "100px")
    const match = dim.match(/^(\d+)px$/);
    if (match) return parseInt(match[1], 10);
  }
  return null;
};

const parseImageSrc = (
  url: string,
  width?: number | string,
  height?: number | string
): string => {
  // Velo image format: wix:image://v1/68d3a9_1de7529c444b4c9eb38401f8efe0cad2.jpg/flowers.jpg#originWidth=1970&originHeight=1120
  // wix:image://v1/${uri}/${filename}#originWidth=${width}&originHeight=${height}
  const wixImagePrefix = 'wix:image://v1/';

  try {
    if (url && url.startsWith(wixImagePrefix)) {
      const uri = url.replace(wixImagePrefix, '').split('#')[0].split('/')[0];

      const params = new URLSearchParams(url.split('#')[1] || '');
      const originalWidth = parseInt(params.get('originWidth'), 10);
      const originalHeight = parseInt(params.get('originHeight'), 10);

      let intWidth = parseDim(width);
      let intHeight = parseDim(height);
      if (intWidth && !height) {
        intHeight = originalHeight * (intWidth / originalWidth);
      }
      return sdk.getScaleToFitImageURL(
        uri,
        originalWidth,
        originalHeight,
        intWidth || originalWidth,
        intHeight || originalHeight
      );
    }
  } catch (error) {
    console.warn('Error parsing image src', error);
    return url;
  }
  return url;
};

const Image = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ src, alt, className, width, height, ...props }, ref) => {
  return (
    <img
      ref={ref}
      src={parseImageSrc(src, width, height)}
      alt={alt || ''}
      className={className}
      width={width}
      height={height}
      {...props}
    />
  );
});
Image.displayName = 'Image';

export { Image };
