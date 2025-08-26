import { createContext, useContext, useState, type ReactNode } from 'react';

interface MiniCartModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const MiniCartModalContext = createContext<
  MiniCartModalContextValue | undefined
>(undefined);

export function useMiniCartModal(): MiniCartModalContextValue {
  const context = useContext(MiniCartModalContext);
  if (!context) {
    throw new Error(
      'useMiniCartModal must be used within a MiniCartModalProvider'
    );
  }
  return context;
}

interface MiniCartModalProviderProps {
  children: ReactNode;
}

export function MiniCartModalProvider({
  children,
}: MiniCartModalProviderProps) {
  const [isOpen, setIsOpened] = useState(false);

  const open = () => setIsOpened(true);
  const close = () => setIsOpened(false);

  const value: MiniCartModalContextValue = {
    isOpen,
    open,
    close,
  };

  return (
    <MiniCartModalContext.Provider value={value}>
      {children}
    </MiniCartModalContext.Provider>
  );
}
