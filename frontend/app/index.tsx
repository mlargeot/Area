import React, { useEffect } from "react";
import { Link } from "expo-router";
import { Linking, Platform, View } from "react-native";
import { Button, Text } from "tamagui";
import { useRouter } from "expo-router";

export default function Home() {

  const router = useRouter();
  if (Platform.OS !== "web") {
    router.push("/login");
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text>AR3M Home Page</Text>
      <Link href={"/login"} asChild>
        <Button color="green">Login</Button>
      </Link>
    </View>
  );
}