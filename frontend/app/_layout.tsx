import { Slot, SplashScreen, useRouter } from "expo-router";
import { TamaguiProvider, Theme } from "@tamagui/core";
import { AppletProvider } from "../context/appletContext";
import { AppletListProvider } from "../context/appletListContext";
import { NavigationProvider } from "../context/navigationContext";
import { ServiceListProvider } from "../context/serviceListContext";
import { ThemeProvider, useTheme } from '../context/themeContext';
import { useFonts } from "expo-font";
import { useEffect } from "react";
import config from "../tamagui.config";
import React from "react";
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  ) 
}

function RootLayoutNav() {
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      try {
        const url = new URL(event.url);
        const token = url.searchParams.get('token');
        if (token) {
          await AsyncStorage.setItem('access_token', token);
          router.replace('/explore');
        }
      } catch (error) {
        console.error('Error handling deep link:', error);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });


    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <TamaguiProvider config={config}>
      <Theme name={theme}>
        <AppletProvider>
          <AppletListProvider>
            <ServiceListProvider>
              <NavigationProvider>
                <Slot />
              </NavigationProvider>
            </ServiceListProvider>
          </AppletListProvider>
        </AppletProvider>
      </Theme>
    </TamaguiProvider>
  );
}