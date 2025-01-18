import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Applet } from './appletContext';
import { getServerAddress } from '../components/confirmServerAddress';


const AppletListContext = createContext<{
  appletList: Applet[],
  fetchData: () => void
}>({
  appletList: [],
  fetchData: () => {}
});

export const AppletListProvider = ({ children } : { children : ReactNode }) => {
  const [appletList, setAppletList] = useState<Applet[]>([]);

  const fetchData = async () => {
    setAppletList([]);
    const apiUrl = await getServerAddress();
    if (apiUrl === "") {
      return;
    }

    try {
      const access_token = await AsyncStorage.getItem('access_token');
      const applets = await axios.get(`${apiUrl}/applets`, {headers: { Authorization: `Bearer ${access_token}` }});

      for (let i = 0; i < applets.data.length; i++) {
        if (applets.data[i].action.params === undefined || applets.data[i].action.params === null) {
          return;
        }
        if (applets.data[i].reaction.params === undefined || applets.data[i].reaction.params === null) {
          return;
        }

        setAppletList((prev) => [
            ...prev,
            {
              name: applets.data[i].name,
              appletId: applets.data[i].appletId,
              action: {
                service: applets.data[i].action.service,
                name: applets.data[i].action.name,
                _id: applets.data[i].action._id,
                params: Object.entries(applets.data[i].action.params).map(([key, value]) => ({ [key]: value as string }))
              },
              reactions: [
                {
                  service: applets.data[i].reaction.service,
                  name: applets.data[i].reaction.name,
                  params: Object.entries(applets.data[i].reaction.params).map(([key, value]) => ({ [key]: value as string })),
                  _id: applets.data[i].reaction._id
                }
              ]
            }
          ]);
      }

    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppletListContext.Provider value={{ appletList, fetchData }}>
      {children}
    </AppletListContext.Provider>
  );
};

export const useAppletList = () => useContext(AppletListContext);
