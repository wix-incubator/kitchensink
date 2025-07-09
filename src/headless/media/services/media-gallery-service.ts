import { defineService, implementService } from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type {
  ReadOnlySignal,
  Signal,
} from '@wix/services-definitions/core-services/signals';

export interface MediaGalleryServiceAPI {
  selectedMediaIndex: Signal<number>;

  mediaToDisplay: ReadOnlySignal<MediaItem[]>;
  setMediaToDisplay: (media: MediaItem[]) => void;

  totalMedia: ReadOnlySignal<number>;

  setSelectedMediaIndex: (index: number) => void;
  nextMedia: () => void;
  previousMedia: () => void;
}

export const MediaGalleryServiceDefinition =
  defineService<MediaGalleryServiceAPI>('mediaGallery');

export type MediaItem = {
  image?: string | null;
  altText?: string | null;
};

export const MediaGalleryService = implementService.withConfig<{
  media?: MediaItem[];
}>()(MediaGalleryServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const mediaToDisplay = signalsService.signal<MediaItem[]>(config.media ?? []);

  const selectedMediaIndex: Signal<number> = signalsService.signal(0 as any);

  const totalMedia: ReadOnlySignal<number> = signalsService.computed(
    () => mediaToDisplay.get().length
  );

  const setSelectedMediaIndex = (index: number) => {
    const images = mediaToDisplay.get();
    if (!images.length) return;

    const maxIndex = images.length - 1;
    const validIndex = Math.max(0, Math.min(index, maxIndex));
    selectedMediaIndex.set(validIndex);
  };

  const nextMedia = () => {
    const images = mediaToDisplay.get();
    const currentIndex = selectedMediaIndex.get();

    if (!images.length) return;

    const nextIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
    selectedMediaIndex.set(nextIndex);
  };

  const previousMedia = () => {
    const images = mediaToDisplay.get();
    const currentIndex = selectedMediaIndex.get();

    if (!images.length) return;

    const prevIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
    selectedMediaIndex.set(prevIndex);
  };

  const setMediaToDisplay = (media: MediaItem[]) => {
    mediaToDisplay.set(media);
    selectedMediaIndex.set(0);
  };

  return {
    selectedMediaIndex,
    mediaToDisplay,

    setMediaToDisplay,
    setSelectedMediaIndex,
    nextMedia,
    previousMedia,

    totalMedia,
  };
});
