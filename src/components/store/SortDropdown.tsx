import { Sort } from '@wix/headless-stores/react';
import { type SortBy } from '@wix/headless-stores/services';

interface SortDropdownProps {}

function SortDropdownContent({
  sortBy,
  setSortBy,
}: {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-content-primary font-semibold text-sm uppercase tracking-wide">
          Sort by
        </h3>
      </div>
      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value as SortBy)}
        className="px-3 py-2 bg-surface-primary border border-brand-light rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none min-w-[160px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${encodeURIComponent(
            'var(--theme-dropdown-arrow-color)'
          )}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 8px center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '16px',
        }}
      >
        <option
          value={'newest'}
          className="bg-surface-primary text-content-primary"
        >
          Latest Arrivals
        </option>
        <option
          value={'recommended'}
          className="bg-surface-primary text-content-primary"
        >
          Recommended
        </option>
        <option
          value={'name_asc'}
          className="bg-surface-primary text-content-primary"
        >
          Name (A-Z)
        </option>
        <option
          value={'name_desc'}
          className="bg-surface-primary text-content-primary"
        >
          Name (Z-A)
        </option>
        <option
          value={'price_asc'}
          className="bg-surface-primary text-content-primary"
        >
          Price (Low to High)
        </option>
        <option
          value={'price_desc'}
          className="bg-surface-primary text-content-primary"
        >
          Price (High to Low)
        </option>
      </select>
    </div>
  );
}

export const SortDropdown: React.FC<SortDropdownProps> = () => {
  return (
    <Sort.Controller>
      {({ currentSort, setSortBy }) => (
        <SortDropdownContent sortBy={currentSort} setSortBy={setSortBy} />
      )}
    </Sort.Controller>
  );
};

export default SortDropdown;
