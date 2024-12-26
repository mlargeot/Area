import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Action = {
  service: string;
  name: string;
  params: Record<string, string>[];
  id: string;
};

export type Reaction = {
  service: string;
  name: string;
  params: Record<string, string>[];
  id: string;
};

export type Applet = {
  id: String;
  action: Action;
  reactions: Reaction[];
};


export const emptyApplet = (): Applet => {
  const applet: Applet = {
    id: "",
    action: { service: "", name: "", id: "", params: [] },
    reactions: []
  };

  return applet;
}

export const emptyReaction = (): Reaction => {
  const reaction: Reaction = {
    service: "",
    name: "",
    id: "",
    params: []
  };

  return reaction;
}


export const getParamValueString = (name : string, effect : Reaction | Action) => {
  for (let i = 0; i < effect.params.length; i++) {
    if (effect.params[i][name]) {
      return effect.params[i][name]
    }
  }
  return ""
}

const AppletContext = createContext<{
  applet: Applet;
  setApplet: React.Dispatch<React.SetStateAction<Applet>>;
}>({
  applet: emptyApplet(),
  setApplet: () => {}
});

export const AppletProvider = ({ children } : { children : ReactNode }) => {
  const [applet, setApplet] = useState<Applet>(emptyApplet());
  return (
    <AppletContext.Provider value={{ applet, setApplet }}>
      {children}
    </AppletContext.Provider>
  );
};

export const useApplet = () => useContext(AppletContext);
