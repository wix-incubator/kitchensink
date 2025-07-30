import { ProductListSort } from '@wix/headless-stores/react';
import { SortType } from '@wix/headless-stores/services';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Helper function to get readable labels for sort options
function getSortOptionLabel(option: string): string {
  switch (option) {
    case SortType.NEWEST:
      return 'Latest Arrivals';
    case SortType.NAME_ASC:
      return 'Name (A-Z)';
    case SortType.NAME_DESC:
      return 'Name (Z-A)';
    case SortType.PRICE_ASC:
      return 'Price (Low to High)';
    case SortType.PRICE_DESC:
      return 'Price (High to Low)';
    case SortType.RECOMMENDED:
      return 'Recommended';
    default:
      return option;
  }
}

export function SortDropdown() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-content-primary font-semibold text-sm uppercase tracking-wide">
          Sort by
        </Label>
      </div>

      <ProductListSort.Options>
        {({ selectedSortOption, updateSortOption, sortOptions }) => (
          <Select value={selectedSortOption} onValueChange={updateSortOption}>
            <SelectTrigger className="min-w-[160px] text-content-primary border-primary/30">
              <SelectValue placeholder="Select sort option">
                {getSortOptionLabel(selectedSortOption)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-primary-foreground text-primary">
              {sortOptions.map(option => (
                <SelectItem
                  key={option}
                  value={option}
                  className="hover:text-primary-foreground hover:bg-primary/50"
                >
                  {getSortOptionLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </ProductListSort.Options>
    </div>
  );
}

export default SortDropdown;
