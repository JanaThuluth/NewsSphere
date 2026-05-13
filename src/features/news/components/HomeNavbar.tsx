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

import { useTheme } from "../../../constants/ThemeContext";
import { Fonts } from "../../../constants/constants";

const HomeNavbar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.headerWrapper,
        {
          paddingTop: insets.top,
          backgroundColor: theme.primary,
        },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.primary}
      />

      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => router.push("/settings")}
          style={styles.navButton}
          activeOpacity={0.8}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          NewsSphere
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/search")}
          style={styles.navButton}
          activeOpacity={0.8}
        >
          <Ionicons
            name="search-outline"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeNavbar;

const styles = StyleSheet.create({
  headerWrapper: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },

  navbar: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  navButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: Fonts.heading,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});