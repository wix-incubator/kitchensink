import { useService } from '@wix/services-manager-react';
import React from 'react';
import { SortServiceDefinition, type SortBy } from '../services/sort-service';

interface ControllerProps {
  children: (props: {
    currentSort: SortBy;
    setSortBy: (sortBy: SortBy) => void;
  }) => React.ReactNode;
}

export function Controller({ children }: ControllerProps) {
  const sortService = useService(SortServiceDefinition);
  const currentSort = sortService.currentSort.get();
  const setSortBy = sortService.setSortBy;

  return <>{children({ currentSort, setSortBy })}</>;
}
