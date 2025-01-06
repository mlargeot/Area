import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { Button, Text } from "tamagui";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { isAuthenticated, loading} = useAuth();
  const router = useRouter();


    useEffect(() => {
        if (isAuthenticated) {
            router.push("/explore");
        }
    }, [isAuthenticated]);

  return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text>AR3M Home Page</Text>
        <Button color="green" onPress={() => router.push("/login")}>
          Login
        </Button>
      </View>
  );
}
