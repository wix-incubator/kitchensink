import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal } from '../../Signal';
import {
  SOCIAL_PLATFORM_CONFIGS,
  SocialPlatform,
} from '../enums/social-platform-enums';

export interface SharingPlatform {
  name: string;
  icon: string;
  color: string;
  shareUrl: string;
}

export interface SocialSharingServiceAPI {
  availablePlatforms: Signal<SharingPlatform[]>;
  shareCount: Signal<number>;
  lastSharedPlatform: Signal<string | null>;

  shareToFacebook: (url: string, title: string, description?: string) => void;
  shareToTwitter: (url: string, text: string, hashtags?: string[]) => void;
  shareToLinkedIn: (url: string, title: string, summary?: string) => void;
  shareToWhatsApp: (url: string, text: string) => void;
  shareToEmail: (url: string, subject: string, body: string) => void;
  copyToClipboard: (url: string) => Promise<boolean>;
  shareNative: (data: {
    title: string;
    text: string;
    url: string;
  }) => Promise<boolean>;
  trackShare: (platform: string) => void;
}

export const SocialSharingServiceDefinition =
  defineService<SocialSharingServiceAPI>('socialSharing');

export const SocialSharingService = implementService.withConfig<{
  productName: string;
  productUrl: string;
  productDescription?: string;
  productImage?: string;
}>()(SocialSharingServiceDefinition, ({ getService }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const availablePlatforms: Signal<SharingPlatform[]> = signalsService.signal([
    SOCIAL_PLATFORM_CONFIGS[SocialPlatform.FACEBOOK],
    SOCIAL_PLATFORM_CONFIGS[SocialPlatform.TWITTER],
    SOCIAL_PLATFORM_CONFIGS[SocialPlatform.LINKEDIN],
    SOCIAL_PLATFORM_CONFIGS[SocialPlatform.WHATSAPP],
    SOCIAL_PLATFORM_CONFIGS[SocialPlatform.EMAIL],
  ]);

  const shareCount: Signal<number> = signalsService.signal(0 as any);
  const lastSharedPlatform: Signal<string | null> = signalsService.signal(
    null as any
  );

  const openShareWindow = (url: string, platform: string) => {
    const width = 600;
    const height = 400;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      url,
      `share-${platform}`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    trackShare(platform);
  };

  const shareToFacebook = (
    url: string,
    title: string,
    description?: string
  ) => {
    const shareUrl = new URL(
      SOCIAL_PLATFORM_CONFIGS[SocialPlatform.FACEBOOK].shareUrl!
    );
    shareUrl.searchParams.set('u', url);
    shareUrl.searchParams.set(
      'quote',
      `${title}${description ? ` - ${description}` : ''}`
    );

    openShareWindow(shareUrl.toString(), SocialPlatform.FACEBOOK);
  };

  const shareToTwitter = (url: string, text: string, hashtags?: string[]) => {
    const shareUrl = new URL(
      SOCIAL_PLATFORM_CONFIGS[SocialPlatform.TWITTER].shareUrl!
    );
    shareUrl.searchParams.set('url', url);
    shareUrl.searchParams.set('text', text);
    if (hashtags && hashtags.length > 0) {
      shareUrl.searchParams.set('hashtags', hashtags.join(','));
    }

    openShareWindow(shareUrl.toString(), SocialPlatform.TWITTER);
  };

  const shareToLinkedIn = (url: string, title: string, summary?: string) => {
    const shareUrl = new URL(
      SOCIAL_PLATFORM_CONFIGS[SocialPlatform.LINKEDIN].shareUrl!
    );
    shareUrl.searchParams.set('url', url);
    shareUrl.searchParams.set('title', title);
    if (summary) {
      shareUrl.searchParams.set('summary', summary);
    }

    openShareWindow(shareUrl.toString(), SocialPlatform.LINKEDIN);
  };

  const shareToWhatsApp = (url: string, text: string) => {
    const message = `${text} ${url}`;
    const shareUrl = `${SOCIAL_PLATFORM_CONFIGS[SocialPlatform.WHATSAPP].shareUrl}?text=${encodeURIComponent(message)}`;

    openShareWindow(shareUrl, SocialPlatform.WHATSAPP);
  };

  const shareToEmail = (url: string, subject: string, body: string) => {
    const emailBody = `${body}\n\n${url}`;
    const mailtoUrl = `${SOCIAL_PLATFORM_CONFIGS[SocialPlatform.EMAIL].shareUrl}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoUrl;
    trackShare(SocialPlatform.EMAIL);
  };

  const copyToClipboard = async (url: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(url);
      trackShare(SocialPlatform.CLIPBOARD);
      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      return false;
    }
  };

  const shareNative = async (data: {
    title: string;
    text: string;
    url: string;
  }): Promise<boolean> => {
    try {
      if (navigator.share) {
        await navigator.share(data);
        trackShare(SocialPlatform.NATIVE);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to share natively:', err);
      return false;
    }
  };

  const trackShare = (platform: string) => {
    const currentCount = shareCount.get();
    shareCount.set(currentCount + 1);
    lastSharedPlatform.set(platform);

    console.log(`Shared to ${platform} - Total shares: ${currentCount + 1}`);
  };

  return {
    availablePlatforms,
    shareCount,
    lastSharedPlatform,

    shareToFacebook,
    shareToTwitter,
    shareToLinkedIn,
    shareToWhatsApp,
    shareToEmail,
    copyToClipboard,
    shareNative,
    trackShare,
  };
});

export async function loadSocialSharingServiceConfig(
  productName: string,
  productUrl: string,
  productDescription?: string,
  productImage?: string
): Promise<ServiceFactoryConfig<typeof SocialSharingService>> {
  return {
    productName,
    productUrl,
    productDescription,
    productImage,
  };
}
