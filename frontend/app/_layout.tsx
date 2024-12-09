import { Slot, SplashScreen } from "expo-router";
import { TamaguiProvider } from "@tamagui/core";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import config from "../tamagui.config";

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
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <Slot />
    </TamaguiProvider>
  );
}