import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export type EffectTemplate = {
  name: string;
  description: string;
  argumentsExample: Params[];
};

export type Params = {
  name: string;
  description: string;
  example: any;
  type?: string;
  required: boolean;
}

export type Service = {
  service: string;
  effect: EffectTemplate[];
}

type ActionInterface = {
  service: string;
  actions: EffectTemplate[];
}

type ReactionInterface = {
  service: string;
  reactions: EffectTemplate[];
}

const ServiceListContext = createContext<{
  serviceActionList: Service[];
  serviceReactionList: Service[];
}>({
  serviceActionList: [],
  serviceReactionList: []
});

export const ServiceListProvider = ({ children } : { children : ReactNode }) => {
  const [serviceActionList, setServiceActionList] = useState<Service[]>([]);
  const [serviceReactionList, setServiceReactionList] = useState<Service[]>([]);
  const [serverAddress, setServerAddress] = useState<string>("http://localhost:8080");

  const getServerAddress = async () => {
    try {
      const address = await AsyncStorage.getItem('serverAddress');
      if (address !== null && address !== "") {
        setServerAddress(address);
      }
    } catch (error) {
      console.error('Failed to fetch server address from storage', error);
    }
  };

  useEffect(() => {
    getServerAddress();
  }, []);

  const fetchData = async () => {
    try {
      const actionData = await axios.get(`${serverAddress}/actions`);
      const reactionsData = await axios.get(`${serverAddress}/reactions`);
      const actions : ActionInterface[] = actionData.data;
      const reactions : ReactionInterface[] = reactionsData.data;

      for (let i = 0; i < actions.length; i++) {
        setServiceActionList((prev) => [
          ...prev,
          {
            service: actions[i].service,
            effect: actions[i].actions,
          }
        ]);
      }

      for (let i = 0; i < reactions.length; i++) {
        setServiceReactionList((prev) => [
          ...prev,
          {
            service: reactions[i].service,
            effect: reactions[i].reactions,
          }
        ]);
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (serverAddress !== "")
      fetchData();
  }, [serverAddress]);

  return (
    <ServiceListContext.Provider value={{ serviceActionList, serviceReactionList }}>
      {children}
    </ServiceListContext.Provider>
  );
};

export const useServiceList = () => useContext(ServiceListContext);

