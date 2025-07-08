import React from 'react';
import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import {
  SocialSharingServiceDefinition,
  type SharingPlatform,
} from '../services/social-sharing-service';

/**
 * Props for Root headless component
 */
export interface RootProps {
  /** Render prop function that receives sharing data */
  children: (props: RootRenderProps) => React.ReactNode;
}

/**
 * Render props for Root component
 */
export interface RootRenderProps {
  /** Available sharing platforms */
  platforms: SharingPlatform[];
  /** Total share count */
  shareCount: number;
  /** Last shared platform */
  lastShared: string | null;
  /** Share to Facebook */
  shareFacebook: (url: string, title: string, description?: string) => void;
  /** Share to Twitter */
  shareTwitter: (url: string, text: string, hashtags?: string[]) => void;
  /** Share to LinkedIn */
  shareLinkedIn: (url: string, title: string, summary?: string) => void;
  /** Share to WhatsApp */
  shareWhatsApp: (url: string, text: string) => void;
  /** Share via Email */
  shareEmail: (url: string, subject: string, body: string) => void;
  /** Copy to clipboard */
  copyLink: (url: string) => Promise<boolean>;
  /** Native share API */
  shareNative: (data: {
    title: string;
    text: string;
    url: string;
  }) => Promise<boolean>;
}

/**
 * Headless component for social sharing root
 */
export const Root = (props: RootProps) => {
  const service = useService(SocialSharingServiceDefinition) as ServiceAPI<
    typeof SocialSharingServiceDefinition
  >;

  const [platforms, setPlatforms] = React.useState<SharingPlatform[]>([]);
  const [shareCount, setShareCount] = React.useState(0);
  const [lastShared, setLastShared] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribes = [
      service.availablePlatforms.subscribe(setPlatforms),
      service.shareCount.subscribe(setShareCount),
      service.lastSharedPlatform.subscribe(setLastShared),
    ];

    return () => unsubscribes.forEach(fn => fn());
  }, [service]);

  return props.children({
    platforms,
    shareCount,
    lastShared,
    shareFacebook: service.shareToFacebook,
    shareTwitter: service.shareToTwitter,
    shareLinkedIn: service.shareToLinkedIn,
    shareWhatsApp: service.shareToWhatsApp,
    shareEmail: service.shareToEmail,
    copyLink: service.copyToClipboard,
    shareNative: service.shareNative,
  });
};

/**
 * Props for Platform headless component
 */
export interface PlatformProps {
  /** Platform data */
  platform: SharingPlatform;
  /** Click handler */
  onClick: () => void;
  /** Render prop function that receives platform data */
  children: (props: PlatformRenderProps) => React.ReactNode;
}

/**
 * Render props for Platform component
 */
export interface PlatformRenderProps {
  /** Platform data */
  platform: SharingPlatform;
  /** Platform click handler */
  onSelect: () => void;
}

/**
 * Headless component for individual social platform
 */
export const Platform = (props: PlatformProps) => {
  const { platform, onClick } = props;

  return props.children({
    platform,
    onSelect: onClick,
  });
};

/**
 * Props for Platforms headless component
 */
export interface PlatformsProps {
  /** URL to share */
  url: string;
  /** Share title */
  title: string;
  /** Share description */
  description?: string;
  /** Hashtags for sharing */
  hashtags?: string[];
  /** Render prop function that receives platforms data */
  children: (props: PlatformsRenderProps) => React.ReactNode;
}

/**
 * Render props for Platforms component
 */
export interface PlatformsRenderProps {
  /** Available platforms */
  platforms: SharingPlatform[];
  /** Share to Facebook */
  shareFacebook: () => void;
  /** Share to Twitter */
  shareTwitter: () => void;
  /** Share to LinkedIn */
  shareLinkedIn: () => void;
  /** Share to WhatsApp */
  shareWhatsApp: () => void;
  /** Share via Email */
  shareEmail: () => void;
  /** Copy link to clipboard */
  copyLink: () => Promise<boolean>;
  /** Share natively */
  shareNative: () => Promise<boolean>;
}

/**
 * Headless component for social sharing platforms with logic
 */
export const Platforms = (props: PlatformsProps) => {
  const { url, title, description = '', hashtags = [] } = props;

  const service = useService(SocialSharingServiceDefinition) as ServiceAPI<
    typeof SocialSharingServiceDefinition
  >;

  const platforms = service.availablePlatforms.get();

  const shareFacebook = () => service.shareToFacebook(url, title, description);
  const shareTwitter = () => service.shareToTwitter(url, title, hashtags);
  const shareLinkedIn = () => service.shareToLinkedIn(url, title, description);
  const shareWhatsApp = () =>
    service.shareToWhatsApp(url, `${title} - ${description}`);
  const shareEmail = () => service.shareToEmail(url, title, description);
  const copyLink = () => service.copyToClipboard(url);
  const shareNative = () =>
    service.shareNative({ title, text: description, url });

  return props.children({
    platforms,
    shareFacebook,
    shareTwitter,
    shareLinkedIn,
    shareWhatsApp,
    shareEmail,
    copyLink,
    shareNative,
  });
};
