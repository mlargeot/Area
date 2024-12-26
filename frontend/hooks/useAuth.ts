// useAuth.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setemail] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        console.log("check auth token: " + token);
        if (token) {
          const response = await axios.get(`${apiUrl}/auth/protected`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            setIsAuthenticated(true);
            setemail(response.data.email);
            console.log(response.data.email);
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

  return { isAuthenticated, loading, email };
};