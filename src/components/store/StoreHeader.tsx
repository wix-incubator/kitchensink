import SortDropdown from './SortDropdown';

export default function StoreHeader({ className }: { className?: string }) {
  return (
    <div
      className={`${className} bg-surface-primary backdrop-blur-sm rounded-xl border border-surface-subtle p-4 mb-6`}
    >
      <div className="flex items-center justify-end">
        <SortDropdown />
      </div>
    </div>
  );
}
