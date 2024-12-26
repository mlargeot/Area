import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { H2, Input, Label, Text, Button, Image, YStack, XStack } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Link } from 'expo-router';
import { useAuth } from "../../../hooks/useAuth";

export default function ProfileScreen() {
  const { email} = useAuth();
  const router = useRouter();
  const disconnect = () => {
    AsyncStorage.removeItem('access_token');
    router.push('/explore');
  };

  return (
    <YStack f={1} ai="center" gap="$2" px="$10" pt="$10" bg="$background">
      <H2>Profile</H2>
      <Image
        source={{ uri: 'https://png.pngtree.com/recommend-works/png-clipart/20240531/ourlarge/pngtree-cute-cat-meme-sticker-illustration-png-image_12554897.png' }} 
        width={120}
        height={120}
        borderRadius={60}
      />
      <Text fontSize="$5" fontWeight="700">
        {email}
      </Text>
      <YStack ai="flex-start" gap="$5" pr="$10" paddingTop="$5" bg="$background">
        <Link href="/account" asChild>
          <Text fontWeight="700" fontSize="$8">Account</Text>
        </Link>
        <Link href="/services" asChild>
          <Text fontWeight="700" fontSize="$8">My services</Text>
        </Link>
        <Link href="/helpcenter" asChild>
          <Text fontWeight="700" fontSize="$8">Help Center</Text>
        </Link>
        <Link href="#" onPress={disconnect} asChild>
          <Text fontWeight="700" fontSize="$8">Sign Out</Text>
        </Link>
      </YStack>
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
  );
}
