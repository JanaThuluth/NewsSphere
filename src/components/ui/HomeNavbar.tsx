import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../constants/constants";

const HomeNavbar: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      <View style={styles.navbar}>
        <Text style={styles.logoText}>NewsSphere</Text>
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
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  logoText: {
    fontSize: 22,
    color: Colors.white,
    fontFamily: Fonts.heading,
    letterSpacing: 1.5,
  },
});