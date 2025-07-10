/**
 * Business logic enums for social sharing platforms (headless layer)
 */

/**
 * Enum for social sharing platforms (business identifiers)
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
 * Enum for social platform share URLs (business logic)
 */
export enum SocialPlatformShareUrl {
  FACEBOOK = 'https://www.facebook.com/sharer/sharer.php',
  TWITTER = 'https://twitter.com/intent/tweet',
  LINKEDIN = 'https://www.linkedin.com/sharing/share-offsite/',
  WHATSAPP = 'https://wa.me/',
  EMAIL = 'mailto:',
}
