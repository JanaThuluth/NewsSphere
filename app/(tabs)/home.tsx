import HomeScreen from "@/src/features/news/screens/HomeScreen";
import { useAuth } from "../../src/context/AuthContext";
import { useEffect } from "react";
import { View } from "react-native";

export default function Home() {
  const { user, userProfile, token, loading } = useAuth();

  useEffect(() => {
    console.log("Auth loading:", loading);
    console.log("Current user:", user?.email);
    console.log("Current user uid:", user?.uid);
    console.log("User profile:", userProfile);
    console.log("Token exists:", token ? "Yes" : "No");
  }, [user, userProfile, token, loading]);

  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
    </View>
  );
}