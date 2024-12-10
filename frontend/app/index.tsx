import React, { useEffect } from "react";
import { Link } from "expo-router";
import { Linking, Platform, View } from "react-native";
import { Button, Text } from "tamagui";
import { useRouter } from "expo-router";
import { useAuth } from "./hooks/useAuth";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (Platform.OS !== "web") {
    router.push("/login");
  }

  useEffect(() => {
    if (!loading && isAuthenticated) {
      Linking.openURL("/explore");
    }
  }, [loading, isAuthenticated]);


  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text>AR3M Home Page</Text>
      <Link href={"/login"} asChild>
        <Button color="green">Login</Button>
      </Link>
    </View>
  );
}