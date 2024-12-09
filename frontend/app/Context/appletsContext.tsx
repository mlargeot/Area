import React, { createContext, useState, useContext } from 'react';
import { Action } from './actionContext'
import { Reaction } from './reactionContext'

const ActionContext = createContext<{
  actions: Action[];
  setActions: React.Dispatch<React.SetStateAction<Action[]>>;
}>({
  actions: [],
  setActions: () => {}
});

export type Applets = {
  id: String;
  actions: Action;
  reactions: Reaction;
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