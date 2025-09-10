import React from 'react';
import { Button } from '../ui/button';
import { SocialXIcon } from '../icons/SocialXIcon';
import { SocialLinkIcon } from '../icons/SocialLinkIcon';
import { SocialLinkedInIcon } from '../icons/SocialLinkedInIcon';
import { SocialFacebookIcon } from '../icons/SocialFacebookIcon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

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
  const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(href)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(href)}`;
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
