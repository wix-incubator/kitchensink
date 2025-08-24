import { StyledProductListSort } from '@/components/store/styled-components/Sort';

export function SortDropdown() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-content-primary font-semibold text-sm uppercase tracking-wide">
          Sort by
        </h3>
      </div>

      <StyledProductListSort as="select" />
    </div>
  );
}
