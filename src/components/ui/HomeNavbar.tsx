import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../constants/constants";

const HomeNavbar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons
            name="settings-outline"
            size={26}
            color={Colors.white}
          />
        </TouchableOpacity>

        <Text style={styles.logoText}>NewsSphere</Text>

        <TouchableOpacity onPress={() => router.push("/search")}>
          <Ionicons
            name="search-outline"
            size={26}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeNavbar;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 6,
  },

  navbar: {
    height: 58,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 16,
  },

  logoText: {
    fontSize: 22,
    color: Colors.white,
    fontFamily: Fonts.heading,
    letterSpacing: 1.5,
  },
});