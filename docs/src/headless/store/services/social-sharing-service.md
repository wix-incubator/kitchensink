# Social Sharing Service

The `social-sharing-service` provides comprehensive social media sharing functionality for products, enabling users to share products across various platforms including Facebook, Twitter, LinkedIn, WhatsApp, email, and native device sharing.

## Overview

The Social Sharing Service handles:

- **Multi-Platform Sharing** - Support for major social media platforms
- **Native Sharing** - Web Share API integration for mobile devices
- **Email Sharing** - Direct email sharing capability
- **Clipboard Operations** - Copy product links to clipboard
- **Share Tracking** - Track sharing activity and platform usage
- **Custom Configuration** - Configurable sharing options per product

## API Interface

```tsx
interface SocialSharingServiceAPI {
  availablePlatforms: Signal<SharingPlatform[]>;
  shareCount: Signal<number>;
  lastSharedPlatform: Signal<string | null>;

  shareToFacebook: (url: string, title: string, description?: string) => void;
  shareToTwitter: (url: string, text: string, hashtags?: string[]) => void;
  shareToLinkedIn: (url: string, title: string, summary?: string) => void;
  shareToWhatsApp: (url: string, text: string) => void;
  shareToEmail: (url: string, subject: string, body: string) => void;
  copyToClipboard: (url: string) => Promise<boolean>;
  shareNative: (data: { title: string; text: string; url: string }) => Promise<boolean>;
  trackShare: (platform: string) => void;
}

interface SharingPlatform {
  name: string;
  icon: string;
  color: string;
  shareUrl: string;
}
```

## Service Configuration

```tsx
interface SocialSharingServiceConfig {
  productName: string;
  productUrl: string;
  productDescription?: string;
  productImage?: string;
}
```

## Supported Platforms

The service supports sharing to:

- **Facebook** - Product sharing with image and description
- **Twitter** - Tweet with hashtags and product link
- **LinkedIn** - Professional sharing with summary
- **WhatsApp** - Direct message sharing
- **Email** - Email sharing with custom subject and body
- **Native** - Device native sharing (mobile/desktop)
- **Clipboard** - Copy link functionality

## Core Functionality

### Basic Sharing Operations

```tsx
import { useService } from "@wix/services-manager-react";
import { SocialSharingServiceDefinition } from "../services/social-sharing-service";

function SocialSharingComponent() {
  const sharingService = useService(SocialSharingServiceDefinition);
  
  const availablePlatforms = sharingService.availablePlatforms.get();
  const shareCount = sharingService.shareCount.get();
  
  const handleFacebookShare = () => {
    sharingService.shareToFacebook(
      "https://example.com/product/123",
      "Amazing Product",
      "Check out this amazing product!"
    );
  };
  
  const handleTwitterShare = () => {
    sharingService.shareToTwitter(
      "https://example.com/product/123",
      "Check out this amazing product!",
      ["products", "shopping", "deals"]
    );
  };
  
  return (
    <div>
      <h3>Share this product:</h3>
      <div className="flex gap-2">
        <button onClick={handleFacebookShare}>Share on Facebook</button>
        <button onClick={handleTwitterShare}>Share on Twitter</button>
      </div>
      <p>Total shares: {shareCount}</p>
    </div>
  );
}
```

### Platform-Specific Sharing

```tsx
// Facebook sharing
sharingService.shareToFacebook(
  "https://example.com/product/123",
  "Product Name",
  "Product description"
);

// Twitter sharing with hashtags
sharingService.shareToTwitter(
  "https://example.com/product/123",
  "Check out this product!",
  ["shopping", "deals", "products"]
);

// LinkedIn sharing
sharingService.shareToLinkedIn(
  "https://example.com/product/123",
  "Product Name",
  "Professional summary about the product"
);

// WhatsApp sharing
sharingService.shareToWhatsApp(
  "https://example.com/product/123",
  "Look at this amazing product!"
);

// Email sharing
sharingService.shareToEmail(
  "https://example.com/product/123",
  "Check out this product",
  "I thought you might be interested in this product."
);
```

### Clipboard and Native Sharing

```tsx
// Copy to clipboard
const copySuccess = await sharingService.copyToClipboard("https://example.com/product/123");
if (copySuccess) {
  alert("Link copied to clipboard!");
}

// Native sharing (mobile/desktop)
const shareData = {
  title: "Product Name",
  text: "Check out this amazing product!",
  url: "https://example.com/product/123"
};

const nativeShareSuccess = await sharingService.shareNative(shareData);
if (!nativeShareSuccess) {
  // Fallback to custom sharing UI
  showCustomSharingModal();
}
```

## Usage Examples

### Complete Social Sharing Widget

```tsx
function SocialSharingWidget() {
  const sharingService = useService(SocialSharingServiceDefinition);
  
  const availablePlatforms = sharingService.availablePlatforms.get();
  const shareCount = sharingService.shareCount.get();
  const lastSharedPlatform = sharingService.lastSharedPlatform.get();
  
  const productUrl = "https://example.com/product/123";
  const productTitle = "Amazing Product";
  const productDescription = "Check out this amazing product!";
  
  const handleShare = async (platform: string) => {
    switch (platform) {
      case "Facebook":
        sharingService.shareToFacebook(productUrl, productTitle, productDescription);
        break;
      case "Twitter":
        sharingService.shareToTwitter(productUrl, productDescription, ["shopping", "deals"]);
        break;
      case "LinkedIn":
        sharingService.shareToLinkedIn(productUrl, productTitle, productDescription);
        break;
      case "WhatsApp":
        sharingService.shareToWhatsApp(productUrl, productDescription);
        break;
      case "Email":
        sharingService.shareToEmail(productUrl, `Check out: ${productTitle}`, productDescription);
        break;
      case "Native":
        const success = await sharingService.shareNative({
          title: productTitle,
          text: productDescription,
          url: productUrl
        });
        if (!success) {
          alert("Native sharing not supported");
        }
        break;
      case "Clipboard":
        const copied = await sharingService.copyToClipboard(productUrl);
        if (copied) {
          alert("Link copied to clipboard!");
        }
        break;
    }
  };
  
  return (
    <div className="social-sharing-widget">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Share this product
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {availablePlatforms.map(platform => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform.name)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
            style={{ borderColor: platform.color }}
          >
            <span className="w-5 h-5" style={{ color: platform.color }}>
              {getPlatformIcon(platform.icon)}
            </span>
            <span className="text-sm">{platform.name}</span>
          </button>
        ))}
        
        {/* Native Share Button (mobile/desktop) */}
        <button
          onClick={() => handleShare("Native")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          <span className="w-5 h-5">📱</span>
          <span className="text-sm">Share</span>
        </button>
        
        {/* Copy Link Button */}
        <button
          onClick={() => handleShare("Clipboard")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          <span className="w-5 h-5">📋</span>
          <span className="text-sm">Copy Link</span>
        </button>
      </div>
      
      <div className="text-sm text-gray-600">
        {shareCount > 0 && (
          <p>This product has been shared {shareCount} times</p>
        )}
        {lastSharedPlatform && (
          <p>Last shared on: {lastSharedPlatform}</p>
        )}
      </div>
    </div>
  );
}

// Helper function for platform icons
function getPlatformIcon(iconName: string) {
  const icons = {
    facebook: "📘",
    twitter: "🐦",
    linkedin: "💼",
    whatsapp: "💬",
    mail: "📧"
  };
  return icons[iconName] || "📤";
}
```

### Compact Share Button

```tsx
import { useState } from "react";

function CompactShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const sharingService = useService(SocialSharingServiceDefinition);
  
  const availablePlatforms = sharingService.availablePlatforms.get();
  const productUrl = "https://example.com/product/123";
  const productTitle = "Amazing Product";
  
  const handleQuickShare = async () => {
    // Try native sharing first
    const success = await sharingService.shareNative({
      title: productTitle,
      text: "Check out this product!",
      url: productUrl
    });
    
    // If native sharing fails, open dropdown
    if (!success) {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={handleQuickShare}
        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <span>📤</span>
        <span>Share</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10">
          <div className="p-2 space-y-1">
            {availablePlatforms.map(platform => (
              <button
                key={platform.name}
                onClick={() => {
                  handleShare(platform.name);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                <span className="mr-2" style={{ color: platform.color }}>
                  {getPlatformIcon(platform.icon)}
                </span>
                {platform.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Share with Custom Content

```tsx
function CustomShareContent() {
  const sharingService = useService(SocialSharingServiceDefinition);
  
  const productUrl = "https://example.com/product/123";
  const productTitle = "Premium Headphones";
  const productPrice = "$99.99";
  
  const shareConfigurations = {
    facebook: {
      title: productTitle,
      description: `Premium quality headphones for just ${productPrice}. Perfect for music lovers!`
    },
    twitter: {
      text: `🎧 Check out these amazing ${productTitle} for only ${productPrice}! #headphones #music #deals`,
      hashtags: ["headphones", "music", "deals", "audio"]
    },
    linkedin: {
      title: productTitle,
      summary: `Professional-grade headphones perfect for work and entertainment. High-quality audio at ${productPrice}.`
    },
    whatsapp: {
      text: `Hey! I found these great ${productTitle} for ${productPrice}. Thought you might be interested!`
    },
    email: {
      subject: `Check out these ${productTitle}`,
      body: `I thought you might be interested in these ${productTitle}. They're available for ${productPrice} and have great reviews!`
    }
  };
  
  const handleCustomShare = (platform: string) => {
    const config = shareConfigurations[platform];
    
    switch (platform) {
      case "facebook":
        sharingService.shareToFacebook(productUrl, config.title, config.description);
        break;
      case "twitter":
        sharingService.shareToTwitter(productUrl, config.text, config.hashtags);
        break;
      case "linkedin":
        sharingService.shareToLinkedIn(productUrl, config.title, config.summary);
        break;
      case "whatsapp":
        sharingService.shareToWhatsApp(productUrl, config.text);
        break;
      case "email":
        sharingService.shareToEmail(productUrl, config.subject, config.body);
        break;
    }
  };
  
  return (
    <div className="custom-share-content">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Share with custom content:
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(shareConfigurations).map(platform => (
          <button
            key={platform}
            onClick={() => handleCustomShare(platform)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="capitalize">{platform}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Share Analytics Dashboard

```tsx
function ShareAnalytics() {
  const sharingService = useService(SocialSharingServiceDefinition);
  
  const shareCount = sharingService.shareCount.get();
  const lastSharedPlatform = sharingService.lastSharedPlatform.get();
  
  // This would typically come from a more comprehensive analytics service
  const [shareHistory, setShareHistory] = useState([]);
  
  const getShareStats = () => {
    // Mock analytics data
    return {
      totalShares: shareCount,
      mostPopularPlatform: lastSharedPlatform,
      platformBreakdown: {
        Facebook: Math.floor(shareCount * 0.4),
        Twitter: Math.floor(shareCount * 0.3),
        WhatsApp: Math.floor(shareCount * 0.2),
        Email: Math.floor(shareCount * 0.1)
      }
    };
  };
  
  const stats = getShareStats();
  
  return (
    <div className="share-analytics">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Share Analytics
      </h4>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Total Shares:</span>
          <span className="font-medium">{stats.totalShares}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Most Popular:</span>
          <span className="font-medium">{stats.mostPopularPlatform || "None"}</span>
        </div>
        
        <div className="mt-3">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Platform Breakdown:</h5>
          <div className="space-y-1">
            {Object.entries(stats.platformBreakdown).map(([platform, count]) => (
              <div key={platform} className="flex justify-between text-xs">
                <span>{platform}:</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Server-Side Configuration

Configure sharing service with product data:

```tsx
// Server-side configuration
import { loadSocialSharingServiceConfig } from "../services/social-sharing-service";

export async function createSharingConfig(product: any) {
  return await loadSocialSharingServiceConfig(
    product.name,
    `https://example.com/product/${product.slug}`,
    product.description,
    product.media?.[0]?.url
  );
}
```

## Error Handling and Fallbacks

```tsx
function SharingWithErrorHandling() {
  const sharingService = useService(SocialSharingServiceDefinition);
  
  const handleShareWithFallback = async (platform: string) => {
    try {
      switch (platform) {
        case "native":
          const success = await sharingService.shareNative({
            title: "Product Name",
            text: "Check this out!",
            url: "https://example.com/product/123"
          });
          
          if (!success) {
            // Fallback to copy to clipboard
            const copied = await sharingService.copyToClipboard("https://example.com/product/123");
            if (copied) {
              alert("Link copied to clipboard!");
            } else {
              alert("Sharing not supported on this device");
            }
          }
          break;
          
        case "clipboard":
          const copied = await sharingService.copyToClipboard("https://example.com/product/123");
          if (copied) {
            alert("Link copied to clipboard!");
          } else {
            // Fallback to showing the URL
            prompt("Copy this link:", "https://example.com/product/123");
          }
          break;
          
        default:
          // Platform-specific sharing
          handlePlatformShare(platform);
      }
    } catch (error) {
      console.error(`Sharing failed for ${platform}:`, error);
      alert("Sharing failed. Please try again.");
    }
  };
  
  return (
    <div className="sharing-with-fallback">
      <button onClick={() => handleShareWithFallback("native")}>
        Share (Native)
      </button>
      <button onClick={() => handleShareWithFallback("clipboard")}>
        Copy Link
      </button>
    </div>
  );
}
```

## Usage in Components

The Social Sharing Service is used throughout the application:

### In Social Sharing Components
```tsx
// src/headless/store/components/SocialSharing.tsx
export const ShareButton = (props: ShareButtonProps) => {
  const service = useService(SocialSharingServiceDefinition);
  
  const availablePlatforms = service.availablePlatforms.get();
  const shareCount = service.shareCount.get();
  
  return props.children({ availablePlatforms, shareCount, service });
};
```

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
const sharingService = useService(SocialSharingServiceDefinition);

// Used for product sharing functionality
const availablePlatforms = sharingService.availablePlatforms.get();
const shareCount = sharingService.shareCount.get();
```

## Integration with Other Services

### Product Service Integration
- Uses product data for sharing content
- Automatically updates sharing URLs when product changes
- Coordinated product information

### Analytics Integration
- Tracks sharing events for analytics
- Provides share count and platform preferences
- Integrates with broader analytics systems

### SEO Integration
- Generates proper meta tags for social sharing
- Supports Open Graph and Twitter Card metadata
- Enhances social media appearance

## Best Practices

### User Experience
- Provide clear sharing options
- Use recognizable platform icons and colors
- Implement fallback mechanisms for unsupported platforms
- Show feedback when sharing succeeds or fails

### Content Strategy
- Customize sharing content for each platform
- Use appropriate hashtags and mentions
- Include compelling descriptions and calls-to-action
- Optimize sharing content for each platform's audience

### Performance
- Lazy load sharing functionality
- Cache sharing configurations
- Minimize external dependencies
- Use efficient popup window management

### Privacy and Security
- Respect user privacy preferences
- Use secure sharing URLs
- Implement proper error handling
- Follow platform-specific guidelines and policies 