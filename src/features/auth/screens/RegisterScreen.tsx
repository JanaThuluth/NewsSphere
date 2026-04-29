import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
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
import { useRegisterForm } from "../useRegisterForm";

export default function RegisterScreen() {
  const router = useRouter();

  const {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    nameError,
    emailError,
    passwordError,
    confirmPasswordError,
    securePassword,
    setSecurePassword,
    secureConfirmPassword,
    setSecureConfirmPassword,
    loading,
    validateNameField,
    validateEmailField,
    validatePasswordField,
    validateConfirmPasswordField,
    handleRegister,
  } = useRegisterForm(router);

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
                <Text style={styles.signinText}>Log In</Text>
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