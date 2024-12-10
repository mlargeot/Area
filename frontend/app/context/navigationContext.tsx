import React, { createContext, useState, useContext, ReactNode } from 'react';

const NavigationContext = createContext<{
  navigationData: NavigationData;
  setNavigationData: React.Dispatch<React.SetStateAction<NavigationData>>;
}>({
  navigationData: {
    actionType: "",
    currentService: "",
    id: ""
  },
  setNavigationData: () => {}
});

export type NavigationData = {
  actionType: string;
  currentService: string;
  id: string;
};

export const NavigationProvider = ({ children } : { children : ReactNode }) => {
  const [navigationData, setNavigationData] = useState<NavigationData>(
    {
      actionType: "",
      currentService: "",
      id: ""
    });
  return (
    <NavigationContext.Provider value={{ navigationData, setNavigationData }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationData = () => useContext(NavigationContext);