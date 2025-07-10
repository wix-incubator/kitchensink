import React, { useState } from 'react';
import { SocialSharing } from '../../headless/store/components';

interface SocialSharingButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  className?: string;
}

export const SocialSharingButtons: React.FC<SocialSharingButtonsProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Check out this amazing product',
  description = "An amazing product you'll love",
  hashtags = ['product', 'shop', 'amazing'],
  className = '',
}) => {
  return (
    <SocialSharing.Platforms
      url={url}
      title={title}
      description={description}
      hashtags={hashtags}
    >
      {({ shareTwitter, shareFacebook, shareLinkedIn, copyLink }) => {
        const [copySuccess, setCopySuccess] = useState(false);

        const handleCopyLink = async () => {
          const success = await copyLink();
          if (success) {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
          }
        };

        return (
          <div
            className={`flex items-center gap-2 pt-2 border-t border-white/10 ${className}`}
          >
            <span className="text-white/60 text-sm">Share:</span>
            <button
              onClick={shareTwitter}
              className="p-2 rounded-full bg-white/10 hover:bg-blue-500/20 hover:text-blue-400 transition-all"
              title="Share on Twitter"
            >
              <svg
                className="w-4 h-4 text-white/60 hover:text-blue-400 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </button>
            <button
              onClick={shareFacebook}
              className="p-2 rounded-full bg-white/10 hover:bg-blue-600/20 hover:text-blue-500 transition-all"
              title="Share on Facebook"
            >
              <svg
                className="w-4 h-4 text-white/60 hover:text-blue-500 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button
              onClick={shareLinkedIn}
              className="p-2 rounded-full bg-white/10 hover:bg-blue-700/20 hover:text-blue-600 transition-all"
              title="Share on LinkedIn"
            >
              <svg
                className="w-4 h-4 text-white/60 hover:text-blue-600 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-full bg-white/10 hover:bg-teal-500/20 hover:text-teal-400 transition-all relative"
              title="Copy link"
            >
              {copySuccess ? (
                <svg
                  className="w-4 h-4 text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-white/60 hover:text-teal-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              )}
            </button>
            {copySuccess && (
              <span className="text-teal-400 text-xs ml-2 animate-fade-in">
                Copied!
              </span>
            )}
          </div>
        );
      }}
    </SocialSharing.Platforms>
  );
};

export default SocialSharingButtons;
