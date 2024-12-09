import React, { createContext, useState, useContext } from 'react';
import { Action } from './actionContext'
import { Reaction } from './reactionContext'


export type Applet = {
  id: String;
  action: Action;
  reactions: Reaction[];
};

export const emptyApplet = (): Applet => {
  const applet: Applet = {
    id: "",
    action: { service: "", name: "", id: "" },
    reactions: []
  };

  return applet;
}

const AppletContext = createContext<{
  applet: Applet;
  setApplet: React.Dispatch<React.SetStateAction<Applet>>;
}>({
  applet: emptyApplet(),
  setApplet: () => {}
});

export const AppletProvider = ({ children }) => {
  const [applet, setApplet] = useState<Applet>(emptyApplet());
  return (
    <AppletContext.Provider value={{ applet, setApplet }}>
      {children}
    </AppletContext.Provider>
  );
};

export const useApplet = () => useContext(AppletContext);