import type { services } from '@wix/bookings';
import { media as wixMedia } from '@wix/sdk';

type MediaItem = services.MediaItem;

export const getImageUrlForMedia = (
    media: MediaItem,
    width: number = 640,
    height: number = 320
) =>
    wixMedia.getScaledToFillImageUrl(media.image!, width, height, {});

export default function WixMediaImage({
    media,
    width = 640,
    height = 320,
    className,
    showPlaceholder = true,
}: {
    media?: MediaItem;
    width?: number;
    height?: number;
    className?: string;
    showPlaceholder?: boolean;
}) {
    return media?.image ? (<img
        className={className}
        src={getImageUrlForMedia(media!, width, height)}
        alt={''}
    />) :
        showPlaceholder ? <div className={className}>
            <div className="w-full h-full flex items-center justify-center text-white/40">
                <svg
                    className="w-16 h-16"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div> : null;
}