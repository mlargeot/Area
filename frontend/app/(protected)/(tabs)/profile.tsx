import { ExternalLink } from '@tamagui/lucide-icons'
import { H2, Paragraph, XStack, YStack, Text, Input, Label } from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Linking } from 'react-native';
import { useRouter, Link } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const disconnect = () => {
    AsyncStorage.removeItem('access_token');
    router.push('/explore');
  }
  const [serverAddress, setServerAddress] = useState('');
  const [serverPort, setServerPort] = useState('');
  const [userId, setUserId] = useState('');

  const  getDefaultValues = async () => {
    try {
      AsyncStorage.getItem('serverAdress').then((value) => {
        setServerAddress(value || "http://localhost:8080");
      });
      AsyncStorage.getItem('serverPort').then((value) => {
        setServerPort(value || "8080");
      });
      AsyncStorage.getItem('userId').then((value) => {
        setUserId(value || "");
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getDefaultValues();
  }, []);

  const handleServerAddress = async (e : any) => {
    AsyncStorage.setItem('serverAdress', e.target.value);
  }

  const handleServerPort = async (e : any) => {
    AsyncStorage.setItem('serverPort', e.target.value);
  }

  const handleUserId = async (e : any) => {
    AsyncStorage.setItem('userId', e.target.value);
  }

  return (
    <YStack f={1} ai="center" gap="$8" px="$10" pt="$5" bg="$background">
      <H2>Profile</H2>
      <Link href="/Pages/services">
        <Text>services</Text>
      </Link>
      <Link href="#" onPress={disconnect}>
        <Text>Disconnect</Text>
      </Link>
      <Label>Server adress</Label>
      <Input onBlur={handleServerAddress} defaultValue={serverAddress} />
      <Label>Server port</Label>
      <Input onBlur={handleServerPort} defaultValue={serverPort} />
      <Label>User ID</Label>
      <Input onBlur={handleUserId} defaultValue={userId} />
    </YStack>
  )
}
