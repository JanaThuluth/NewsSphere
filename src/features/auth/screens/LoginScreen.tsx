import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import AuthCard from "../../../components/ui/AuthCard";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing information", "Please enter your email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      console.log("Logged in:", userCredential.user.email);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/invalid-email") {
        message = "The email address is invalid.";
      } else if (error.code === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        message = "The password is incorrect.";
      } else if (error.code === "auth/invalid-credential") {
        message = "Invalid email or password.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      }

      Alert.alert("Login Failed", message);
      console.log("Login error:", error.code, error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthCard>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>

            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subText}>
              Sign in to continue exploring the latest news.
            </Text>

            <View style={styles.inputWrapper}>
              <Feather name="mail" size={20} color={Colors.secondary} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor={Colors.gray}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color={Colors.secondary} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={Colors.gray}
                secureTextEntry={secureText}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Feather
                  name={secureText ? "eye-off" : "eye"}
                  size={20}
                  color={Colors.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={12} color={Colors.white} />
                  )}
                </View>
                <Text style={styles.optionText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.85}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or login with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <FontAwesome name="google" size={22} color="#DB4437" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <FontAwesome name="facebook" size={22} color="#1877F2" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <FontAwesome name="twitter" size={22} color="#1DA1F2" />
              </TouchableOpacity>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  heading: {
    fontSize: 32,
    letterSpacing: 0.5,
    fontFamily: Fonts.heading,
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subText: {
    fontSize: 15,
    fontFamily: Fonts.body,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#AAB7C4",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: Fonts.body,
    color: Colors.black,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    marginTop: 6,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: Colors.white,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 13,
    fontFamily: Fonts.body,
    color: Colors.black,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: Fonts.body,
    color: Colors.primary,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 17,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Fonts.heading,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightGray,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: FontSizes.small,
    fontFamily: Fonts.body,
    color: Colors.gray,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginBottom: 28,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    marginRight: 4,
    fontSize: FontSizes.body,
    fontFamily: Fonts.body,
    color: Colors.gray,
  },
  signupText: {
    fontSize: FontSizes.body,
    fontFamily: Fonts.heading,
    color: Colors.primary,
  },
});