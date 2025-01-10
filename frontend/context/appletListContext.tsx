import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Applet } from './appletContext';


const AppletListContext = createContext<{
  appletList: Applet[],
  fetchData?: () => void
}>({
  appletList: [],
  fetchData: () => {}
});

export const AppletListProvider = ({ children } : { children : ReactNode }) => {
  const [appletList, setAppletList] = useState<Applet[]>([]);
  const [serverAddress, setServerAddress] = useState<string>(process.env.EXPO_PUBLIC_API_URL ||'http://localhost:8080');

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
    setAppletList([]);

    try {
      const access_token = await AsyncStorage.getItem('access_token');
      const applets = await axios.get(`${serverAddress}/applets`, {headers: { Authorization: `Bearer ${access_token}` }});

      for (let i = 0; i < applets.data.length; i++) {
        setAppletList((prev) => [
            ...prev,
            {
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
      console.error(error);
    }
  };

  useEffect(() => {
    if (serverAddress !== "")
      fetchData();
  }, [serverAddress]);

  return (
    <AppletListContext.Provider value={{ appletList, fetchData }}>
      {children}
    </AppletListContext.Provider>
  );
};

export const useAppletList = () => useContext(AppletListContext);
