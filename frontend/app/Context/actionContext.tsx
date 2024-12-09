import React, { createContext, useState, useContext } from 'react';

const ActionContext = createContext<{
  actions: Action[];
  setActions: React.Dispatch<React.SetStateAction<Action[]>>;
}>({
  actions: [],
  setActions: () => {}
});

export type Action = {
  service: string;
  name: string;
  id: string;
};

export const ActionProvider = ({ children }) => {
  const [actions, setActions] = useState<Action[]>([]);
  return (
    <ActionContext.Provider value={{ actions, setActions }}>
      {children}
    </ActionContext.Provider>
  );
};

export const useAction = () => useContext(ActionContext);