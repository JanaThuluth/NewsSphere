import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";
import { useAuth } from "../../../context/AuthContext";

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(tabs)/home");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.brand}>NewsSphere</Text>

          <View style={styles.illustrationWrapper}>
            <Image
              source={require("../../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Stay Connected</Text>
          <Text style={styles.description}>
            Read the latest headlines from trusted sources and save the stories
            that matter to you.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.85}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            activeOpacity={0.85}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    backgroundColor: Colors.primary,
  },
  topSection: {
    alignItems: "center",
    marginTop: 20,
  },
  brand: {
    fontSize: 34,
    fontFamily: Fonts.heading,
    color: Colors.white,
    marginBottom: 36,
  },
  illustrationWrapper: {
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 210,
    height: 210,
  },
  title: {
    fontSize: 26,
    fontFamily: Fonts.heading,
    color: Colors.white,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: FontSizes.body,
    fontFamily: Fonts.body,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  bottomSection: {
    width: "100%",
    gap: 14,
  },
  loginButton: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontFamily: Fonts.heading,
  },
  signupButton: {
    borderWidth: 1.5,
    borderColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  signupButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Fonts.heading,
  },
});