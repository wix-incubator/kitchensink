import React, { createContext, useContext, type ReactNode } from 'react';

interface NavigationProps {
  route: string;
  children: ReactNode;
  [key: string]: any;
}

type NavigationComponent = React.ComponentType<NavigationProps>;

const NavigationContext = createContext<NavigationComponent | null>(null);

const DefaultNavigationComponent: NavigationComponent = ({
  route,
  children,
  ...props
}) => {
  return (
    <a href={route} {...props}>
      {children}
    </a>
  );
};

interface NavigationProviderProps {
  children: ReactNode;
  navigationComponent?: NavigationComponent;
}

const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  navigationComponent = DefaultNavigationComponent,
}) => {
  return (
    <NavigationContext.Provider value={navigationComponent}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationComponent => {
  const navigationComponent = useContext(NavigationContext);

  return navigationComponent || DefaultNavigationComponent;
};
