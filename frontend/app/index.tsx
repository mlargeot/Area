import { Link } from "expo-router";
import { Platform, View } from "react-native";
import { Button } from "tamagui";

export default function Home() {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Link href={"/explore"}>
        <Button color="green">{Platform.OS === 'web' ? "web" : "mobile"}</Button>
      </Link>
    </View>
  );
}