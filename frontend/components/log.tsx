import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import { Text, View, YStack } from 'tamagui'
import { useMedia } from 'tamagui'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from '../hooks/useAuth';

export default function AppletLog() {
    const [applets, setapplets] = useState<any[]>([]);
    const media = useMedia();
    const { email, userId} = useAuth();

    const apiUrl = process.env.EXPO_PUBLIC_API_URL ||'http://localhost:8080';
  
    const fetchServices = async () => {
      const token = await AsyncStorage.getItem('access_token');
    
      if (!token) {
        console.error("Token is not available");
        return;
      }
    
      if (!userId) {
        console.error("User ID is not defined");
        return;
      }
    
      try {
        const response = await axios.get(`${apiUrl}/services/logs/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setapplets(response.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    useEffect(() => {
      if (userId) {
        fetchServices();
      }
    }, [userId]);

    const renderLogItem = ({ item }: { item: Log }) => (
      <Text
        color={item.status === 'success' ? '$red10' : '$gray11'}
        fontSize={14}
        marginBottom={8}
      >
        <Text color="$gray10" fontSize={12}>[{new Date(item.timestamp).toLocaleString()}] </Text>
        <Text fontWeight="bold">{item.name}</Text>:{' '}
        {item.status === 'success' ? 'a réussi' : 'a échoué'}
        {item.details && (
            <Text color="$gray9" fontSize={12}> ({item.details})</Text>
        )}
      </Text>
    )
  
    return (
      <YStack padding={16} f={1} alignItems="center">
        <Text fontSize={24} fontWeight="bold" marginBottom={16}>Logs d'Applets</Text>
        <View
            style={{
            flex: 1,
            Height: media.sm ? "90%" : "50%",
            width: media.sm ? "90%" : "50%",
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
            padding: 16,
            }}
        >
            <FlatList
            data={applets}
            keyExtractor={(item) => item.timestamp.toString()}
            renderItem={renderLogItem}
            />
        </View>
      </YStack>
    );
  }
  
