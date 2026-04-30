import { useState } from "react";
import { Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export function useRegisterForm(router: any) {
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

  return {
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
  };
}