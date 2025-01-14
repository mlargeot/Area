import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { Button, Text, useMedia, YStack, ScrollView } from "tamagui";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import Loginmobile from '../components/loginmobile';
import LoginWeb from '../components/loginweb.tsx';

export default function Home() {
  const { isAuthenticated, loading} = useAuth();
  const router = useRouter();
  const media = useMedia();


    useEffect(() => {
        if (isAuthenticated) {
            router.push("/explore");
        }
    }, [isAuthenticated]);

    if (media.sm) {
      return (
        <YStack alignItems="center" justifyContent="center" flex={1} bg="$background">
          <Loginmobile />
        </YStack>
      );
    } else {
      return (
        <ScrollView>
          <YStack alignItems="center" justifyContent="center" flex={1} bg="$background">
              <LoginWeb />
          </YStack>
        </ScrollView>
      );
    }
}
