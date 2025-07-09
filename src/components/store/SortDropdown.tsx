import { Sort } from '../../headless/store/components';
import { type SortBy } from '../../headless/store/services/sort-service';
import { StoreSortLabels } from '../../headless/store/enums';

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
          {StoreSortLabels.SORT_BY}
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
        <option value="" className="bg-surface-primary text-content-primary">
          {StoreSortLabels.LATEST_ARRIVALS}
        </option>
        <option
          value="recommended"
          className="bg-surface-primary text-content-primary"
        >
          {StoreSortLabels.RECOMMENDED}
        </option>
        <option
          value="name-asc"
          className="bg-surface-primary text-content-primary"
        >
          {StoreSortLabels.NAME_ASC}
        </option>
        <option
          value="name-desc"
          className="bg-surface-primary text-content-primary"
        >
          {StoreSortLabels.NAME_DESC}
        </option>
        <option
          value="price-asc"
          className="bg-surface-primary text-content-primary"
        >
          {StoreSortLabels.PRICE_ASC}
        </option>
        <option
          value="price-desc"
          className="bg-surface-primary text-content-primary"
        >
          {StoreSortLabels.PRICE_DESC}
        </option>
      </select>
    </div>
  );
}

export const SortDropdown: React.FC<SortDropdownProps> = () => {
  return (
    <Sort.Provider>
      <Sort.Controller>
        {({ currentSort, setSortBy }) => (
          <SortDropdownContent sortBy={currentSort} setSortBy={setSortBy} />
        )}
      </Sort.Controller>
    </Sort.Provider>
  );
};

export default SortDropdown;
