import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { FontAwesome, Feather, Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";
import { auth, db } from "../../../lib/firebase";

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validateNameField = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setNameError("Full name is required.");
      return false;
    }

    if (trimmed.length < 3) {
      setNameError("Full name must be at least 3 characters.");
      return false;
    }

    setNameError("");
    return true;
  };

  const validateEmailField = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setEmailError("Email is required.");
      return false;
    }

    if (!validateEmail(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePasswordField = (value: string) => {
    if (!value) {
      setPasswordError("Password is required.");
      return false;
    }

    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const validateConfirmPasswordField = (
    confirmValue: string,
    currentPassword: string
  ) => {
    if (!confirmValue) {
      setConfirmPasswordError("Please confirm your password.");
      return false;
    }

    if (confirmValue !== currentPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    }

    setConfirmPasswordError("");
    return true;
  };

  const validateForm = () => {
    const isNameValid = validateNameField(fullName);
    const isEmailValid = validateEmailField(email);
    const isPasswordValid = validatePasswordField(password);
    const isConfirmPasswordValid = validateConfirmPasswordField(
      confirmPassword,
      password
    );

    return (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    );
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: trimmedName,
        email: trimmedEmail,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Account created successfully.");
      router.replace("/(tabs)/home");
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        message = "This email is already in use.";
      } else if (error.code === "auth/invalid-email") {
        message = "The email address is invalid.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (error.code === "auth/network-request-failed") {
        message = "Network error. Please check your internet connection.";
      } else if (error.code === "auth/operation-not-allowed") {
        message = "Email/password sign-in is not enabled in Firebase.";
      }

      Alert.alert("Sign Up Failed", message);
      console.log("Register error:", error.code, error.message);
    } finally {
      setLoading(false);
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
          <View style={styles.formContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>

            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subText}>
              Register to continue exploring the latest news.
            </Text>

            <View style={styles.inputWrapper}>
              <FontAwesome name="user-o" size={20} color={Colors.secondary} />
              <TextInput
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  validateNameField(text);
                }}
                onBlur={() => validateNameField(fullName)}
                placeholder="Full name"
                placeholderTextColor={Colors.gray}
                style={styles.input}
              />
            </View>
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

            <View style={styles.inputWrapper}>
              <Feather name="mail" size={20} color={Colors.secondary} />
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateEmailField(text);
                }}
                onBlur={() => validateEmailField(email)}
                placeholder="Email address"
                placeholderTextColor={Colors.gray}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color={Colors.secondary} />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  validatePasswordField(text);
                  if (confirmPassword) {
                    validateConfirmPasswordField(confirmPassword, text);
                  }
                }}
                onBlur={() => validatePasswordField(password)}
                placeholder="Password"
                placeholderTextColor={Colors.gray}
                secureTextEntry={securePassword}
                style={styles.input}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSecurePassword(!securePassword)}
              >
                <Feather
                  name={securePassword ? "eye-off" : "eye"}
                  size={20}
                  color={Colors.secondary}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color={Colors.secondary} />
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  validateConfirmPasswordField(text, password);
                }}
                onBlur={() =>
                  validateConfirmPasswordField(confirmPassword, password)
                }
                placeholder="Confirm Password"
                placeholderTextColor={Colors.gray}
                secureTextEntry={secureConfirmPassword}
                style={styles.input}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  setSecureConfirmPassword(!secureConfirmPassword)
                }
              >
                <Feather
                  name={secureConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color={Colors.secondary}
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}

            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </Text>

            <TouchableOpacity
              style={styles.signupButton}
              activeOpacity={0.85}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.signupButtonText}>
                {loading ? "Creating..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.signinText}>Login In</Text>
              </TouchableOpacity>
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
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 32,
  },
  formContainer: {
    width: "100%",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 30,
    letterSpacing: 0.5,
    fontFamily: Fonts.heading,
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 30,
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
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: Fonts.body,
    color: Colors.black,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginLeft: 6,
    marginBottom: 5,
    fontFamily: Fonts.body,
  },
  termsText: {
    fontSize: 12,
    fontFamily: Fonts.body,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 26,
    paddingHorizontal: 8,
  },
  signupButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    //marginTop: 100,
    marginBottom: 128,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  signupButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Fonts.heading,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  footerText: {
    marginRight: 4,
    fontSize: FontSizes.body,
    fontFamily: Fonts.body,
    color: Colors.gray,
  },
  signinText: {
    fontSize: FontSizes.body,
    fontFamily: Fonts.heading,
    color: Colors.primary,
  },
});