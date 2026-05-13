import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Controller } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";
import AuthInput from "../components/AuthInput";
import { useRegisterForm } from "../hooks/useRegisterForm";

export default function RegisterScreen() {
  const router = useRouter();

  const {
    control,
    controlRules,
    nameError,
    emailError,
    passwordError,
    confirmPasswordError,
    securePassword,
    setSecurePassword,
    secureConfirmPassword,
    setSecureConfirmPassword,
    loading,
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
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>

            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subText}>
              Register to continue exploring the latest news.
            </Text>

            <Controller
              control={control}
              name="fullName"
              rules={controlRules.fullName}
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthInput
                  icon={
                    <FontAwesome
                      name="user-o"
                      size={20}
                      color={Colors.secondary}
                    />
                  }
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={nameError}
                  placeholder="Full name"
                  disabled={loading}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={controlRules.email}
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthInput
                  icon={
                    <Feather name="mail" size={20} color={Colors.secondary} />
                  }
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={emailError}
                  placeholder="Email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  disabled={loading}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={controlRules.password}
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthInput
                  icon={
                    <Feather name="lock" size={20} color={Colors.secondary} />
                  }
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={passwordError}
                  placeholder="Password"
                  secureTextEntry={securePassword}
                  disabled={loading}
                  secureToggle
                  secureValue={securePassword}
                  onToggleSecure={() => setSecurePassword(!securePassword)}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={controlRules.confirmPassword}
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthInput
                  icon={
                    <Feather name="lock" size={20} color={Colors.secondary} />
                  }
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={confirmPasswordError}
                  placeholder="Confirm Password"
                  secureTextEntry={secureConfirmPassword}
                  disabled={loading}
                  secureToggle
                  secureValue={secureConfirmPassword}
                  onToggleSecure={() =>
                    setSecureConfirmPassword(!secureConfirmPassword)
                  }
                />
              )}
            />

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
                disabled={loading}
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
    marginBottom: 136,
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
