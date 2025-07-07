import React, { createContext, useContext, useEffect, useState } from 'react';
import { SortServiceDefinition, type SortBy } from '../services/sort-service';
import { useService } from '@wix/services-manager-react';

interface SortContextValue {
  currentSort: SortBy;
  setSortBy: (sortBy: SortBy) => void;
}

const SortContext = createContext<SortContextValue | null>(null);

export function useSortContext() {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error('useSortContext must be used within a Sort.SortProvider');
  }
  return context;
}

interface ProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProviderProps) {
  const sortService = useService(SortServiceDefinition);
  const [currentSort, setCurrentSort] = useState<SortBy>('');

  useEffect(() => {
    const unsubscribe = sortService.currentSort.subscribe((sort: SortBy) => {
      setCurrentSort(sort);
    });

    // Initialize with current value
    setCurrentSort(sortService.currentSort.get());

    return unsubscribe;
  }, [sortService]);

  const setSortBy = (sortBy: SortBy) => {
    sortService.setSortBy(sortBy);
  };

  const contextValue: SortContextValue = {
    currentSort,
    setSortBy,
  };

  return (
    <SortContext.Provider value={contextValue}>{children}</SortContext.Provider>
  );
}

interface ControllerProps {
  children: (props: SortContextValue) => React.ReactNode;
}

export function Controller({ children }: ControllerProps) {
  const context = useSortContext();
  return <>{children(context)}</>;
}
