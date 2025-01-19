import React, { useEffect, useRef, useState } from 'react';
import { H2, Input, Label, Text, Button, ButtonText, Image, YStack, XStack, Stack } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Link } from 'expo-router';
import { useAuth } from "./../../hooks/useAuth";
import { ArrowLeft } from '@tamagui/lucide-icons';
import { confirmServerAddress } from '../../components/confirmServerAddress';
import { getServerAddress } from '../../components/confirmServerAddress';

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

export default function account() {
  const { email, userId} = useAuth();
  const [id, setUserId] = useState('');
  const [apiUrl, setApiUrl] = useState<string>("");
  const tempUrl = useRef<string>("");

  const getDefaultValues = async () => {
    try {
      AsyncStorage.getItem('userId').then((value) => {
        setUserId(value || '');
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDefaultValues();
    getServerAddress().then((url) => {
      setApiUrl(url);
    });
  }, []);

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
            {email}
        </Text>
        <Text fontSize="$5" fontWeight="700">
            id: {userId}
        </Text>
        <Label>Server address</Label>
        <Input defaultValue={apiUrl} onChangeText={(val) => {tempUrl.current = val}} />
        <Button marginTop="$2" onPress={() => confirmServerAddress(tempUrl.current)}>
          <ButtonText>
            Save Server Address
          </ButtonText>
        </Button>
        <Label>User ID</Label>
        <Input defaultValue={id} onBlur={handleUserId} />
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
