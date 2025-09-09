import React from 'react';

interface ShareUrlToFacebookProps {
  href: string;
  children: (props: ShareUrlToFacebookRenderProps) => React.ReactNode;
}

interface ShareUrlToFacebookRenderProps {
  url: string;
}

const ShareUrlToFacebook = (props: ShareUrlToFacebookProps) => {
  const { href } = props;

  return props.children({
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(href)}`,
  });
};

interface ShareUrlToXProps {
  href: string;
  children: (props: ShareUrlToXRenderProps) => React.ReactNode;
}

interface ShareUrlToXRenderProps {
  url: string;
}

const ShareUrlToX = (props: ShareUrlToXProps) => {
  const { href } = props;

  return props.children({
    url: `https://x.com/share?url=${encodeURIComponent(href)}`,
  });
};

interface ShareUrlToLinkedInProps {
  href: string;
  children: (props: ShareUrlToLinkedInRenderProps) => React.ReactNode;
}

interface ShareUrlToLinkedInRenderProps {
  url: string;
}

const ShareUrlToLinkedIn = (props: ShareUrlToLinkedInProps) => {
  const { href } = props;

  return props.children({
    url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(href)}`,
  });
};

interface ShareUrlToClipboardProps {
  href: string;
  children: (props: ShareUrlToClipboardRenderProps) => React.ReactNode;
}

interface ShareUrlToClipboardRenderProps {
  copyToClipboard: () => Promise<void>;
  isCopied: boolean;
}

const ShareUrlToClipboard = (props: ShareUrlToClipboardProps) => {
  const { href, children } = props;
  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(href);
      setIsCopied(true);

      // Reset copied state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2000) as unknown as number;
    } catch (error) {
      console.error('Failed to copy URL to clipboard:', error);
    }
  }, [href]);

  return children({
    copyToClipboard,
    isCopied,
  });
};

const ShareUrl = {
  Facebook: ShareUrlToFacebook,
  X: ShareUrlToX,
  LinkedIn: ShareUrlToLinkedIn,
  Clipboard: ShareUrlToClipboard,
};

export default ShareUrl;
