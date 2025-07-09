/**
 * Enum for social sharing platforms
 */
export enum SocialPlatform {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  CLIPBOARD = 'clipboard',
  NATIVE = 'native',
}

/**
 * Enum for social platform display names
 */
export enum SocialPlatformDisplayName {
  FACEBOOK = 'Facebook',
  TWITTER = 'Twitter',
  LINKEDIN = 'LinkedIn',
  WHATSAPP = 'WhatsApp',
  EMAIL = 'Email',
  CLIPBOARD = 'Clipboard',
  NATIVE = 'Native',
}

/**
 * Enum for social platform icons
 */
export enum SocialPlatformIcon {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  WHATSAPP = 'whatsapp',
  EMAIL = 'mail',
  CLIPBOARD = 'clipboard',
  NATIVE = 'share',
}

/**
 * Enum for social platform colors
 */
export enum SocialPlatformColor {
  FACEBOOK = '#1877F2',
  TWITTER = '#1DA1F2',
  LINKEDIN = '#0A66C2',
  WHATSAPP = '#25D366',
  EMAIL = '#EA4335',
  CLIPBOARD = '#6B7280',
  NATIVE = '#374151',
}

/**
 * Enum for social platform share URLs
 */
export enum SocialPlatformShareUrl {
  FACEBOOK = 'https://www.facebook.com/sharer/sharer.php',
  TWITTER = 'https://twitter.com/intent/tweet',
  LINKEDIN = 'https://www.linkedin.com/sharing/share-offsite/',
  WHATSAPP = 'https://wa.me/',
  EMAIL = 'mailto:',
}

/**
 * Interface for social platform configuration
 */
export interface SocialPlatformConfig {
  platform: SocialPlatform;
  name: SocialPlatformDisplayName;
  icon: SocialPlatformIcon;
  color: SocialPlatformColor;
  shareUrl?: SocialPlatformShareUrl;
}

/**
 * Default social platform configurations
 */
export const SOCIAL_PLATFORM_CONFIGS: Record<
  SocialPlatform,
  SocialPlatformConfig
> = {
  [SocialPlatform.FACEBOOK]: {
    platform: SocialPlatform.FACEBOOK,
    name: SocialPlatformDisplayName.FACEBOOK,
    icon: SocialPlatformIcon.FACEBOOK,
    color: SocialPlatformColor.FACEBOOK,
    shareUrl: SocialPlatformShareUrl.FACEBOOK,
  },
  [SocialPlatform.TWITTER]: {
    platform: SocialPlatform.TWITTER,
    name: SocialPlatformDisplayName.TWITTER,
    icon: SocialPlatformIcon.TWITTER,
    color: SocialPlatformColor.TWITTER,
    shareUrl: SocialPlatformShareUrl.TWITTER,
  },
  [SocialPlatform.LINKEDIN]: {
    platform: SocialPlatform.LINKEDIN,
    name: SocialPlatformDisplayName.LINKEDIN,
    icon: SocialPlatformIcon.LINKEDIN,
    color: SocialPlatformColor.LINKEDIN,
    shareUrl: SocialPlatformShareUrl.LINKEDIN,
  },
  [SocialPlatform.WHATSAPP]: {
    platform: SocialPlatform.WHATSAPP,
    name: SocialPlatformDisplayName.WHATSAPP,
    icon: SocialPlatformIcon.WHATSAPP,
    color: SocialPlatformColor.WHATSAPP,
    shareUrl: SocialPlatformShareUrl.WHATSAPP,
  },
  [SocialPlatform.EMAIL]: {
    platform: SocialPlatform.EMAIL,
    name: SocialPlatformDisplayName.EMAIL,
    icon: SocialPlatformIcon.EMAIL,
    color: SocialPlatformColor.EMAIL,
    shareUrl: SocialPlatformShareUrl.EMAIL,
  },
  [SocialPlatform.CLIPBOARD]: {
    platform: SocialPlatform.CLIPBOARD,
    name: SocialPlatformDisplayName.CLIPBOARD,
    icon: SocialPlatformIcon.CLIPBOARD,
    color: SocialPlatformColor.CLIPBOARD,
  },
  [SocialPlatform.NATIVE]: {
    platform: SocialPlatform.NATIVE,
    name: SocialPlatformDisplayName.NATIVE,
    icon: SocialPlatformIcon.NATIVE,
    color: SocialPlatformColor.NATIVE,
  },
};
