import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';

const SocialFacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const SocialLinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const SocialLinkIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.2 14.0935C4.4 14.8935 3.1 14.8935 2.3 14.0935C1.5 13.2935 1.5 11.9935 2.3 11.1935L5.6 7.89353C6.4 7.09353 7.7 7.09353 8.5 7.89353C8.8 8.19353 9.4 8.19353 9.7 7.89353C10 7.59353 10 6.99353 9.7 6.69353C8.2 5.19353 5.8 5.19353 4.4 6.69353L1.1 9.99353C0.4 10.6935 0 11.5935 0 12.5935C0 13.5935 0.4 14.5935 1.1 15.2935C1.8 15.9935 2.8 16.3935 3.8 16.3935C4.8 16.3935 5.7 15.9935 6.5 15.2935L8.2 13.5935C8.5 13.2935 8.5 12.6935 8.2 12.3935C7.8 12.0935 7.2 12.0935 6.9 12.3935L5.2 14.0935ZM9.6 1.49353L7.9 3.19353C7.6 3.49353 7.6 4.09353 7.9 4.39353C8.2 4.69353 8.8 4.69353 9.1 4.39353L10.8 2.69353C11.6 1.89353 12.9 1.89353 13.7 2.69353C14.5 3.49353 14.5 4.79353 13.7 5.59353L10.4 8.89353C9.6 9.69353 8.3 9.69353 7.5 8.89353C7.2 8.59353 6.6 8.59353 6.3 8.89353C6 9.19353 6 9.79353 6.3 10.0935C7 10.7935 8 11.1935 9 11.1935C10 11.1935 10.9 10.7935 11.7 10.0935L15 6.79353C16.4 5.39353 16.4 2.99353 14.9 1.49353C13.4 -0.00646973 11 -0.00646973 9.6 1.49353Z"
      fill="currentColor"
    />
  </svg>
);

const SocialXIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface CopyToClipboardProps {
  href: string;
  children: (props: CopyToClipboardRenderProps) => React.ReactNode;
}

interface CopyToClipboardRenderProps {
  copyToClipboard: () => Promise<void>;
  isCopied: boolean;
}

const CopyToClipboard = (props: CopyToClipboardProps) => {
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

type SharePostActionsProps = {
  href: string;
};

const SharePostActions = ({ href }: SharePostActionsProps) => {
  if (!href) return null;

  const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    href
  )}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    href
  )}`;
  const xShareUrl = `https://x.com/share?url=${encodeURIComponent(href)}`;

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon">
              <a
                href={xShareUrl}
                target="_blank"
                title="Share on X"
                rel="noopener noreferrer"
              >
                <SocialXIcon className="w-4 h-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on X</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon">
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Facebook"
              >
                <SocialFacebookIcon className="w-4 h-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Facebook</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon">
              <a
                href={linkedInShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
              >
                <SocialLinkedInIcon className="w-4 h-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on LinkedIn</TooltipContent>
        </Tooltip>

        <CopyToClipboard href={href}>
          {({ copyToClipboard, isCopied }) => (
            <>
              <Tooltip open={isCopied || undefined}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Copy Link"
                    onClick={copyToClipboard}
                  >
                    <SocialLinkIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isCopied ? 'Copied!' : 'Copy Link'}
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </CopyToClipboard>
      </TooltipProvider>
    </div>
  );
};

export default SharePostActions;
