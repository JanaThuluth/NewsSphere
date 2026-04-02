import { Tabs } from "expo-router";
import Providers from "../src/providers/Providers";

export default function Layout() {
  return (
    <Providers>
      <Tabs screenOptions={{ headerShown: false }} />
    </Providers>
  );
}