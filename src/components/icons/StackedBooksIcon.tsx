export const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Bottom book */}
    <rect x="2" y="16" width="20" height="4" rx="1" />
    <line x1="2" y1="18" x2="22" y2="18" />
    {/* Middle book */}
    <rect x="4" y="10" width="16" height="4" rx="1" />
    <line x1="4" y1="12" x2="20" y2="12" />
    {/* Top book */}
    <rect x="6" y="4" width="12" height="4" rx="1" />
    <line x1="6" y1="6" x2="18" y2="6" />
  </svg>
);
