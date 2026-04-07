import { Stack } from "expo-router";
import Providers from "../src/providers/Providers";

import { useFonts } from "expo-font";
import { Cairo_400Regular } from "@expo-google-fonts/cairo";
import { Tajawal_400Regular } from "@expo-google-fonts/tajawal";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "../src/constants/constants";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Tajawal_400Regular,
  });

  // ⏳ Wait for fonts to load
  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.white,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }} />
    </Providers>
  );
}