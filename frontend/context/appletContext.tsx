import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type Action = {
  service: string;
  name: string;
  params: Record<string, string>[];
  _id: string;
};

export type Reaction = {
  service: string;
  name: string;
  params: Record<string, string>[];
  _id: string;
};

export type Applet = {
  appletId: String;
  name: string;
  action: Action;
  reactions: Reaction[];
};


export const emptyApplet = (): Applet => {
  const applet: Applet = {
    name: "",
    appletId: "",
    action: { service: "", name: "", _id: "", params: [] },
    reactions: []
  };

  return applet;
}

export const emptyReaction = (): Reaction => {
  const reaction: Reaction = {
    service: "",
    name: "",
    _id: "",
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


  useEffect(() => {
    console.log("Applet changed", applet.name);
  }, [applet]);

  return (
    <AppletContext.Provider value={{ applet, setApplet }}>
      {children}
    </AppletContext.Provider>
  );
};

export const useApplet = () => useContext(AppletContext);
