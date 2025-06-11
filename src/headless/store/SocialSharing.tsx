import React from "react";
import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import {
  SocialSharingServiceDefinition,
  type SocialSharingServiceAPI,
  type SharingPlatform,
} from "./social-sharing-service";

/**
 * Props for SharingActions headless component
 */
export interface SharingActionsProps {
  /** Render prop function that receives sharing actions */
  children: (props: SharingActionsRenderProps) => React.ReactNode;
}

/**
 * Render props for SharingActions component
 */
export interface SharingActionsRenderProps {
  /** Available sharing platforms */
  availablePlatforms: SharingPlatform[];
  /** Total share count */
  shareCount: number;
  /** Last shared platform */
  lastSharedPlatform: string | null;
  /** Share to Facebook */
  shareToFacebook: (url: string, title: string, description?: string) => void;
  /** Share to Twitter */
  shareToTwitter: (url: string, text: string, hashtags?: string[]) => void;
  /** Share to LinkedIn */
  shareToLinkedIn: (url: string, title: string, summary?: string) => void;
  /** Share to WhatsApp */
  shareToWhatsApp: (url: string, text: string) => void;
  /** Share via Email */
  shareToEmail: (url: string, subject: string, body: string) => void;
  /** Copy to clipboard */
  copyToClipboard: (url: string) => Promise<boolean>;
  /** Native share API */
  shareNative: (data: {
    title: string;
    text: string;
    url: string;
  }) => Promise<boolean>;
}

/**
 * Headless component for social sharing actions
 */
export const SharingActions = (props: SharingActionsProps) => {
  const service = useService(SocialSharingServiceDefinition) as ServiceAPI<
    typeof SocialSharingServiceDefinition
  >;

  const [availablePlatforms, setAvailablePlatforms] = React.useState<
    SharingPlatform[]
  >([]);
  const [shareCount, setShareCount] = React.useState(0);
  const [lastSharedPlatform, setLastSharedPlatform] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    const unsubscribes = [
      service.availablePlatforms.subscribe(setAvailablePlatforms),
      service.shareCount.subscribe(setShareCount),
      service.lastSharedPlatform.subscribe(setLastSharedPlatform),
    ];

    return () => unsubscribes.forEach((fn) => fn());
  }, [service]);

  return props.children({
    availablePlatforms,
    shareCount,
    lastSharedPlatform,
    shareToFacebook: service.shareToFacebook,
    shareToTwitter: service.shareToTwitter,
    shareToLinkedIn: service.shareToLinkedIn,
    shareToWhatsApp: service.shareToWhatsApp,
    shareToEmail: service.shareToEmail,
    copyToClipboard: service.copyToClipboard,
    shareNative: service.shareNative,
  });
};

/**
 * Props for SocialButton headless component
 */
export interface SocialButtonProps {
  /** Platform data */
  platform: SharingPlatform;
  /** Click handler */
  onClick: () => void;
  /** Render prop function that receives button data */
  children: (props: SocialButtonRenderProps) => React.ReactNode;
}

/**
 * Render props for SocialButton component
 */
export interface SocialButtonRenderProps {
  /** Platform data */
  platform: SharingPlatform;
  /** Button click handler */
  handleClick: () => void;
}

/**
 * Headless component for individual social sharing button
 */
export const SocialButton = (props: SocialButtonProps) => {
  const { platform, onClick } = props;

  return props.children({
    platform,
    handleClick: onClick,
  });
};

/**
 * Props for ShareButtons headless component
 */
export interface ShareButtonsProps {
  /** URL to share */
  url: string;
  /** Share title */
  title: string;
  /** Share description */
  description?: string;
  /** Hashtags for sharing */
  hashtags?: string[];
  /** Render prop function that receives share buttons data */
  children: (props: ShareButtonsRenderProps) => React.ReactNode;
}

/**
 * Render props for ShareButtons component
 */
export interface ShareButtonsRenderProps {
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
  shareNatively: () => Promise<boolean>;
}

/**
 * Headless component for social sharing buttons with platform logic
 */
export const ShareButtons = (props: ShareButtonsProps) => {
  const { url, title, description = "", hashtags = [] } = props;

  const service = useService(SocialSharingServiceDefinition) as ServiceAPI<
    typeof SocialSharingServiceDefinition
  >;

  const [platforms, setPlatforms] = React.useState<SharingPlatform[]>([]);

  React.useEffect(() => {
    const unsubscribe = service.availablePlatforms.subscribe(setPlatforms);
    return unsubscribe;
  }, [service]);

  const shareFacebook = () => service.shareToFacebook(url, title, description);
  const shareTwitter = () => service.shareToTwitter(url, title, hashtags);
  const shareLinkedIn = () => service.shareToLinkedIn(url, title, description);
  const shareWhatsApp = () =>
    service.shareToWhatsApp(url, `${title} - ${description}`);
  const shareEmail = () => service.shareToEmail(url, title, description);
  const copyLink = () => service.copyToClipboard(url);
  const shareNatively = () =>
    service.shareNative({ title, text: description, url });

  return props.children({
    platforms,
    shareFacebook,
    shareTwitter,
    shareLinkedIn,
    shareWhatsApp,
    shareEmail,
    copyLink,
    shareNatively,
  });
};

// Namespace export for clean API
export const SocialSharing = {
  Actions: SharingActions,
  Button: SocialButton,
  ShareButtons: ShareButtons,
} as const;
