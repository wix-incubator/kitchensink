import React from "react";
import { Sort } from "../headless/store/components/Sort";
import { type SortBy } from "../headless/store/services/sort-service";

interface SortDropdownProps {
  className?: string;
}

function SortDropdownContent({
  sortBy,
  setSortBy,
  className = "",
}: {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  className?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
          Sort by
        </h3>
      </div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortBy)}
        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[160px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 8px center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "16px",
        }}
      >
        <option value="" className="bg-gray-800 text-white">
          Latest Arrivals
        </option>
        <option value="name-asc" className="bg-gray-800 text-white">
          Name (A-Z)
        </option>
        <option value="name-desc" className="bg-gray-800 text-white">
          Name (Z-A)
        </option>
        <option value="price-asc" className="bg-gray-800 text-white">
          Price (Low to High)
        </option>
        <option value="price-desc" className="bg-gray-800 text-white">
          Price (High to Low)
        </option>
      </select>
    </div>
  );
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  className = "",
}) => {
  return (
    <Sort.Provider>
      <Sort.Controller>
        {({ currentSort, setSortBy }) => (
          <SortDropdownContent
            sortBy={currentSort}
            setSortBy={setSortBy}
            className={className}
          />
        )}
      </Sort.Controller>
    </Sort.Provider>
  );
};

export default SortDropdown;
