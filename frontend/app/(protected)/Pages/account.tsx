import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { H2, Input, Label, Text, Button, Image, YStack, XStack, Stack } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Link } from 'expo-router';
import { ArrowLeft } from '@tamagui/lucide-icons';

function Header() {
    const router = useRouter();
    return (
        <XStack ai="center" jc="space-between" px="$4" pt="$5" py="$2" bg="$background" borderBottomWidth={1} borderBottomColor="$borderColor">
            <Button onPress={() => router.push('/profile')} icon={ArrowLeft} />
            <Text fontWeight="700" fontSize="$10">Account</Text>
            <Stack width={40} />
        </XStack>
    );
}

const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.error('Error reading data', e);
    }
  };

export default function account() {
  const router = useRouter();

  const [serverAddress, setServerAddress] = useState('');
  const [serverPort, setServerPort] = useState('');
  const [userId, setUserId] = useState('');

  const getDefaultValues = async () => {
    try {
      AsyncStorage.getItem('serverAdress').then((value) => {
        setServerAddress(value || 'http://localhost:8080');
      });
      AsyncStorage.getItem('serverPort').then((value) => {
        setServerPort(value || '8080');
      });
      AsyncStorage.getItem('userId').then((value) => {
        setUserId(value || '');
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDefaultValues();
  }, []);

  const handleServerAddress = async (e : any) => {
    AsyncStorage.setItem('serverAdress', e.target.value);
  };

  const handleServerPort = async (e : any) => {
    AsyncStorage.setItem('serverPort', e.target.value);
  };

  const handleUserId = async (e : any) => {
    AsyncStorage.setItem('userId', e.target.value);
  };

  return (
    <YStack f={1} bg="$background">
                <Header />
        <YStack f={1} ai="center" gap="$2" px="$10" pt="$10" bg="$background">
        <Image
            source={{ uri: 'https://png.pngtree.com/recommend-works/png-clipart/20240531/ourlarge/pngtree-cute-cat-meme-sticker-illustration-png-image_12554897.png' }} 
            width={120}
            height={120}
            borderRadius={60}
        />
        <Text fontSize="$5" fontWeight="700">
            arthur
        </Text>

        {/* <Label>Server address</Label>
        <Input defaultValue={serverAddress} onBlur={handleServerAddress} />
        <Label>Server port</Label>
        <Input defaultValue={serverPort} onBlur={handleServerPort} />
        <Label>User ID</Label>
        <Input defaultValue={userId} onBlur={handleUserId} /> */}
        <XStack 
            justifyContent="space-between" 
            width="100%" 
            paddingHorizontal="$4" 
            paddingVertical="$2" 
            borderTopWidth={1} 
            borderColor="$borderColor"
            position="absolute"
            bottom={0}
            bg="$background"
        >
            <Text fontSize="$2">Terms & Privacy</Text>
            <Text fontSize="$2">v0.1</Text>
        </XStack>
        </YStack>
    </YStack>
  );
}
