import CategoryFilter from "./CategoryPicker";
import SortDropdown from "./SortDropdown";

export default function StoreHeader({className}: {className?: string}) {
  return (
    <div className={`${className} bg-[var(--theme-bg-options)] backdrop-blur-sm rounded-xl border border-[var(--theme-border-primary-10)] p-4 mb-6`}>
      <div className="flex items-top justify-between">
        <CategoryFilter />
        <SortDropdown />
      </div>
    </div>
  );
};  