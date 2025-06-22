import React, { createContext, useContext, useEffect, useState } from "react";
import { SortServiceDefinition, type SortBy } from "../services/sort-service";
import { useService } from "@wix/services-manager-react";

interface SortContextValue {
  currentSort: SortBy;
  setSortBy: (sortBy: SortBy) => void;
}

const SortContext = createContext<SortContextValue | null>(null);

export function useSortContext() {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("useSortContext must be used within a Sort.Provider");
  }
  return context;
}

interface SortProviderProps {
  children: React.ReactNode;
}

function SortProvider({ children }: SortProviderProps) {
  const sortService = useService(SortServiceDefinition);
  const [currentSort, setCurrentSort] = useState<SortBy>("");

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

interface SortControllerProps {
  children: (props: SortContextValue) => React.ReactNode;
}

function SortController({ children }: SortControllerProps) {
  const context = useSortContext();
  return <>{children(context)}</>;
}

export const Sort = {
  Provider: SortProvider,
  Controller: SortController,
};
