import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import AuthCard from "../../../components/ui/AuthCard";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
  const passwordInputRef = useRef<TextInput | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const isAnyLoading = isLoginLoading || isForgotLoading;

  const normalizeEmail = (value: string) => value.trim().toLowerCase();

  const validateEmail = (value: string) => {
    const cleanValue = normalizeEmail(value);

    if (!cleanValue) {
      return "Email is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanValue)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) {
      return "Password is required.";
    }

    return "";
  };

  const validateForm = () => {
    const currentEmailError = validateEmail(email);
    const currentPasswordError = validatePassword(password);

    setEmailError(currentEmailError);
    setPasswordError(currentPasswordError);

    return !currentEmailError && !currentPasswordError;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (emailError) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (passwordError) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleEmailBlur = () => {
    const cleanedEmail = normalizeEmail(email);
    setEmail(cleanedEmail);
    setEmailError(validateEmail(cleanedEmail));
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
  };

  const handleLogin = async () => {
    if (isAnyLoading) return;

    const isValid = validateForm();
    if (!isValid) return;

    try {
      setIsLoginLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        normalizeEmail(email),
        password
      );

      console.log("Logged in:", userCredential.user.email);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      switch (error?.code) {
        case "auth/invalid-email":
          message = "The email address is invalid.";
          setEmailError("Please enter a valid email address.");
          break;
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/wrong-password":
          message = "The password is incorrect.";
          setPasswordError("Incorrect password.");
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

    const cleanedEmail = normalizeEmail(email);
    const currentEmailError = validateEmail(cleanedEmail);

    setEmail(cleanedEmail);
    setEmailError(currentEmailError);

    if (currentEmailError) {
      Alert.alert(
        "Enter your email first",
        "Please type a valid email address so we can send you a reset link."
      );
      return;
    }

    try {
      setIsForgotLoading(true);

      auth.languageCode = "en";
      await sendPasswordResetEmail(auth, cleanedEmail);

      Alert.alert(
        "Password reset email sent",
        "Check your inbox and spam folder for the reset link."
      );
    } catch (error: any) {
      let message = "We couldn’t send the reset email. Please try again.";

      switch (error?.code) {
        case "auth/invalid-email":
          message = "The email address is invalid.";
          setEmailError("Please enter a valid email address.");
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
            <View style={styles.cardContent}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.8}
                disabled={isAnyLoading}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
              </TouchableOpacity>

              <Text style={styles.heading}>Welcome Back</Text>
              <Text style={styles.subText}>
                Sign in to continue exploring the latest news.
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  emailError ? styles.inputWrapperError : null,
                ]}
              >
                <Feather name="mail" size={20} color={Colors.secondary} />
                <TextInput
                  value={email}
                  onChangeText={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="Email address"
                  placeholderTextColor={Colors.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  textContentType="emailAddress"
                  autoComplete="email"
                  style={styles.input}
                  editable={!isAnyLoading}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
              </View>
              {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

              <View
                style={[
                  styles.inputWrapper,
                  passwordError ? styles.inputWrapperError : null,
                ]}
              >
                <Feather name="lock" size={20} color={Colors.secondary} />
                <TextInput
                  ref={passwordInputRef}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="Password"
                  placeholderTextColor={Colors.gray}
                  secureTextEntry={secureText}
                  style={styles.input}
                  editable={!isAnyLoading}
                  returnKeyType="done"
                  textContentType="password"
                  autoComplete="password"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={() => setSecureText((prev) => !prev)}
                  disabled={isAnyLoading}
                  activeOpacity={0.8}
                >
                  <Feather
                    name={secureText ? "eye-off" : "eye"}
                    size={20}
                    color={Colors.secondary}
                  />
                </TouchableOpacity>
              </View>
              {!!passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}

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

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isAnyLoading ? styles.loginButtonDisabled : null,
                ]}
                activeOpacity={0.85}
                onPress={handleLogin}
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
    paddingTop: 34,
    paddingBottom: 24,
  },
  cardContent: {
    minHeight: 670,
    justifyContent: "flex-start",
    paddingTop: 29,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },
  heading: {
    fontSize: 30,
    letterSpacing: 0.5,
    fontFamily: Fonts.heading,
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  subText: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 38,
    lineHeight: 21,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#AAB7C4",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 8,
    backgroundColor: Colors.white,
  },
  inputWrapperError: {
    borderColor: "#DC2626",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: Fonts.body,
    color: Colors.black,
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.body,
    color: "#DC2626",
    marginBottom: 12,
    marginLeft: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 38,
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
    marginBottom: 30,
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