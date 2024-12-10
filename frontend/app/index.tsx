import React, { useEffect } from "react";
import { Link } from "expo-router";
import { Linking, Platform, View } from "react-native";
import { Button } from "tamagui";

export default function Home() {
  const signInWithGoogle = async () => {
    const url = `http://localhost:8080/auth/google?device=${Platform.OS}`;
    Linking.openURL(url);
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Link href={"/explore"}>
        <Button color="green">{Platform.OS === 'web' ? "web" : "mobile"}</Button>
      </Link>
      <Button color="red" onPress={signInWithGoogle}>Google</Button>
      <Button color="blue">Discord</Button>
    </View>
  );
}