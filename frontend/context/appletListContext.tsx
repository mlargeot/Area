import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Applet } from './appletContext';


const AppletListContext = createContext<{
  appletList: Applet[]
}>({
  appletList: []
});

export const AppletListProvider = ({ children } : { children : ReactNode }) => {
  const [appletList, setAppletList] = useState<Applet[]>([]);
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
      const access_token = await AsyncStorage.getItem('access_token');
      console.log("access_token :", access_token);
      const applets = await axios.get(`${serverAddress}/applets`, {headers: { Authorization: `Bearer ${access_token}` }});

      console.log("get data :", applets);

    //   for (let i = 0; i < applets.length; i++) {
    //     setAppletList((prev) => [
    //         ...prev,
    //         {
    //             id: applets[i].id,
    //             action: applets[i].action,
    //             reactions: applets[i].reactions,
    //         }
    //         ]);
    //   }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (serverAddress !== "")
      fetchData();
  }, [serverAddress]);

  return (
    <AppletListContext.Provider value={{ appletList }}>
      {children}
    </AppletListContext.Provider>
  );
};

export const useAppletList = () => useContext(AppletListContext);
