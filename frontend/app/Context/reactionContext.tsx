import React, { createContext, useState, useContext } from 'react';

const ReactionContext = createContext<{
  reactions: Reaction[];
  setReactions: React.Dispatch<React.SetStateAction<Reaction[]>>;
}>({
  reactions: [],
  setReactions: () => {}
});

export type Reaction = {
  service: string;
  name: string;
  id: string;
};

export const ReactionProvider = ({ children }) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  return (
    <ReactionContext.Provider value={{ reactions, setReactions }}>
      {children}
    </ReactionContext.Provider>
  );
};

export const useReaction = () => useContext(ReactionContext);