// useAuth.ts
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getServerAddress } from '../components/confirmServerAddress';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setemail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {

    const checkAuth = async () => {
      const apiUrl = await getServerAddress();
      if (apiUrl === "") {
        return;
      }

      try {
        const token = await AsyncStorage.getItem('access_token');
        console.log("check auth token: " + token + " at " + apiUrl);
        if (token) {
          const response = await axios.get(`${apiUrl}/auth/protected`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            setIsAuthenticated(true);
            setemail(response.data.email);
            setUserId(response.data._id);
            console.log(response.data);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);


  return { isAuthenticated, loading, email, userId };
};