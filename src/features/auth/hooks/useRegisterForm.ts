import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { auth, db } from "../../../lib/firebase";

type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function useRegisterForm(router: any) {
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    control,
    watch,
    setValue,
    trigger,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const fullName = watch("fullName");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const controlRules = {
    fullName: {
      required: "Full name is required.",
      validate: (value: string) => {
        if (value.trim().length < 3) {
          return "Full name must be at least 3 characters.";
        }

        return true;
      },
    },

    email: {
      required: "Email is required.",
      validate: (value: string) => {
        if (!validateEmail(value)) {
          return "Please enter a valid email address.";
        }

        return true;
      },
    },

    password: {
      required: "Password is required.",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters.",
      },
    },

    confirmPassword: {
      required: "Please confirm your password.",
      validate: (value: string) => {
        if (value !== password) {
          return "Passwords do not match.";
        }

        return true;
      },
    },
  };

  const setFullName = (value: string) => {
    setValue("fullName", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const setEmail = (value: string) => {
    setValue("email", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const setPassword = (value: string) => {
    setValue("password", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (confirmPassword) {
      trigger("confirmPassword");
    }
  };

  const setConfirmPassword = (value: string) => {
    setValue("confirmPassword", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const validateNameField = (value: string) => {
    setFullName(value);
    return true;
  };

  const validateEmailField = (value: string) => {
    setEmail(value);
    return true;
  };

  const validatePasswordField = (value: string) => {
    setPassword(value);
    return true;
  };

  const validateConfirmPasswordField = (
    confirmValue: string,
    currentPassword: string,
  ) => {
    setValue("password", currentPassword, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setConfirmPassword(confirmValue);
    return true;
  };

  const onSubmit = async (data: RegisterFormData) => {
    const trimmedName = data.fullName.trim();
    const trimmedEmail = data.email.trim().toLowerCase();

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        data.password,
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
        setError("email", {
          type: "firebase",
          message: "This email is already in use.",
        });
      } else if (error.code === "auth/invalid-email") {
        message = "The email address is invalid.";
        setError("email", {
          type: "firebase",
          message: "Please enter a valid email address.",
        });
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
        setError("password", {
          type: "firebase",
          message: "Password must be at least 6 characters.",
        });
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

  const handleRegister = handleSubmit(onSubmit);

  return {
    control,
    controlRules,

    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,

    nameError: errors.fullName?.message || "",
    emailError: errors.email?.message || "",
    passwordError: errors.password?.message || "",
    confirmPasswordError: errors.confirmPassword?.message || "",

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
