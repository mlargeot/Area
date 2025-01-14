import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { getServerAddress } from '../components/confirmServerAddress';

export type EffectTemplate = {
  name: string;
  description: string;
  argumentsExample: Params[];
};

export type Params = {
  name: string;
  description: string;
  example: any;
  type: string;
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
  fetchData: () => void;
}>({
  serviceActionList: [],
  serviceReactionList: [],
  fetchData: () => {}
});

export const ServiceListProvider = ({ children } : { children : ReactNode }) => {
  const [serviceActionList, setServiceActionList] = useState<Service[]>([]);
  const [serviceReactionList, setServiceReactionList] = useState<Service[]>([]);
  
  const fetchData = async () => {
    try {
      const apiUrl = await getServerAddress();
      if (apiUrl === "") {
        return;
      }
      const actionData = await axios.get(`${apiUrl}/actions`);
      const reactionsData = await axios.get(`${apiUrl}/reactions`);
      const actions : ActionInterface[] = actionData.data;
      const reactions : ReactionInterface[] = reactionsData.data;
      setServiceActionList([]);
      setServiceReactionList([]);

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
    fetchData();
  }, []);

  return (
    <ServiceListContext.Provider value={{ serviceActionList, serviceReactionList, fetchData }}>
      {children}
    </ServiceListContext.Provider>
  );
};

export const useServiceList = () => useContext(ServiceListContext);
