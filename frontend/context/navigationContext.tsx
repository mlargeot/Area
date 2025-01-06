import React, { createContext, useState, useContext, ReactNode } from 'react';

const NavigationContext = createContext<{
  navigationData: NavigationData;
  setNavigationData: React.Dispatch<React.SetStateAction<NavigationData>>;
}>({
  navigationData: {
    actionType: "",
    currentService: "",
    reactionId: ""
  },
  setNavigationData: () => {}
});

/**
 * @brief Context to pass temporary data between pages
 * @property {string} actionType - used to differentiate between actions and reactions
 * @property {string} currentService - used to pass the selected service between pages
 * @property {string} reactionId - used when modifying a reaction
 */
export interface NavigationData {
  actionType: string;
  currentService: string;
  reactionId: string;
};

export const NavigationProvider = ({ children } : { children : ReactNode }) => {
  const [navigationData, setNavigationData] = useState<NavigationData>(
    {
      actionType: "",
      currentService: "",
      reactionId: ""
    });
  return (
    <NavigationContext.Provider value={{ navigationData, setNavigationData }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationData = () => useContext(NavigationContext);