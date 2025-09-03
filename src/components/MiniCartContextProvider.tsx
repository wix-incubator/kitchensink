import { createContext, useContext, useState, type ReactNode } from 'react';

interface MiniCartModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const MiniCartModalContext = createContext<
  MiniCartModalContextValue | undefined
>(undefined);

export function useMiniCartContext(): MiniCartModalContextValue {
  const context = useContext(MiniCartModalContext);
  if (!context) {
    console.error(
      'useMiniCartModal must be used within a MiniCartModalProvider'
    );
    throw new Error(
      'useMiniCartModal must be used within a MiniCartModalProvider'
    );
  }
  return context;
}

interface MiniCartContextProviderProps {
  children: ReactNode;
}

export function MiniCartContextProvider({
  children,
}: MiniCartContextProviderProps) {
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
