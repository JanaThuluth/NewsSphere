import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import AuthInput from "../components/AuthInput";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";
import { auth } from "../../../lib/firebase";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const passwordInputRef = useRef<TextInput | null>(null);

  const [secureText, setSecureText] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const isAnyLoading = isLoginLoading || isForgotLoading;

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    setError,
    trigger,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const normalizeEmail = (value: string) => value.trim().toLowerCase();

  const handleLogin = async (data: LoginFormData) => {
    if (isAnyLoading) return;

    const cleanEmail = normalizeEmail(data.email);
    setValue("email", cleanEmail);

    try {
      setIsLoginLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        data.password
      );

      
      router.replace("/(tabs)/home");
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      switch (error?.code) {
        case "auth/invalid-email":
          message = "The email address is invalid.";
          setError("email", {
            type: "firebase",
            message: "Please enter a valid email address.",
          });
          break;

        case "auth/user-not-found":
          message = "No account found with this email.";
          break;

        case "auth/wrong-password":
          message = "The password is incorrect.";
          setError("password", {
            type: "firebase",
            message: "Incorrect password.",
          });
          break;

        case "auth/invalid-credential":
          message = "Invalid email or password.";
          break;

        case "auth/user-disabled":
          message = "This account has been disabled.";
          break;

        case "auth/too-many-requests":
          message = "Too many attempts. Please try again later.";
          break;

        case "auth/network-request-failed":
          message = "Network error. Please check your internet connection.";
          break;
      }

      Alert.alert("Login Failed", message);
      console.log("Login error:", error?.code, error?.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (isAnyLoading) return;

    const cleanEmail = normalizeEmail(getValues("email"));

    setValue("email", cleanEmail, {
      shouldValidate: true,
    });

    const isEmailValid = await trigger("email");

    if (!isEmailValid) {
      Alert.alert(
        "Enter your email first",
        "Please type a valid email address so we can send you a reset link."
      );
      return;
    }

    try {
      setIsForgotLoading(true);

      auth.languageCode = "en";
      await sendPasswordResetEmail(auth, cleanEmail);

      Alert.alert(
        "Password reset email sent",
        "Check your inbox and spam folder for the reset link."
      );
    } catch (error: any) {
      let message = "We couldn’t send the reset email. Please try again.";

      switch (error?.code) {
        case "auth/invalid-email":
          message = "The email address is invalid.";
          setError("email", {
            type: "firebase",
            message: "Please enter a valid email address.",
          });
          break;

        case "auth/missing-email":
          message = "Please enter your email address first.";
          break;

        case "auth/user-not-found":
          message = "No account found with this email.";
          break;

        case "auth/network-request-failed":
          message = "Network error. Please check your internet connection.";
          break;

        case "auth/too-many-requests":
          message = "Too many requests. Please try again later.";
          break;
      }

      Alert.alert("Reset Password Failed", message);
      console.log("Reset password error:", error?.code, error?.message);
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.replace("/welcome")}
              activeOpacity={0.8}
              disabled={isAnyLoading}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>

            <View style={styles.mainContent}>
              <View>
                <Text style={styles.heading}>Welcome Back</Text>
                <Text style={styles.subText}>
                  Login to continue exploring the latest news.
                </Text>

                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required.",
                    validate: (value) => {
                      const cleanEmail = normalizeEmail(value);
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                      if (!emailRegex.test(cleanEmail)) {
                        return "Please enter a valid email address.";
                      }

                      return true;
                    },
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthInput
                      icon={
                        <Feather
                          name="mail"
                          size={20}
                          color={Colors.secondary}
                        />
                      }
                      value={value}
                      onChangeText={onChange}
                      onBlur={() => {
                        const cleanEmail = normalizeEmail(value);
                        setValue("email", cleanEmail, {
                          shouldValidate: true,
                        });
                        onBlur();
                      }}
                      error={errors.email?.message}
                      placeholder="Email address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      textContentType="emailAddress"
                      autoComplete="email"
                      disabled={isAnyLoading}
                      onSubmitEditing={() => passwordInputRef.current?.focus()}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "Password is required.",
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthInput
                      ref={passwordInputRef}
                      icon={
                        <Feather
                          name="lock"
                          size={20}
                          color={Colors.secondary}
                        />
                      }
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.password?.message}
                      placeholder="Password"
                      secureTextEntry={secureText}
                      returnKeyType="done"
                      textContentType="password"
                      autoComplete="password"
                      disabled={isAnyLoading}
                      secureToggle
                      secureValue={secureText}
                      onToggleSecure={() => setSecureText((prev) => !prev)}
                      onSubmitEditing={handleSubmit(handleLogin)}
                    />
                  )}
                />

                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleForgotPassword}
                    disabled={isAnyLoading}
                  >
                    <Text style={styles.forgotText}>
                      {isForgotLoading ? "Sending..." : "Forgot password?"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isAnyLoading ? styles.loginButtonDisabled : null,
                  ]}
                  activeOpacity={0.85}
                  onPress={handleSubmit(handleLogin)}
                  disabled={isAnyLoading}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoginLoading ? "Logging in..." : "Login"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Don’t have an account? </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/register")}
                    disabled={isAnyLoading}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.signupText}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
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
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 50,
    alignSelf: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 0,
  },
  heading: {
    fontSize: 30,
    letterSpacing: 0.5,
    fontFamily: Fonts.heading,
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 12,
    marginTop: 30,
  },
  subText: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 100,
    lineHeight: 21,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
    marginTop: 6,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: Fonts.body,
    color: Colors.primary,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 180,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Fonts.heading,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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