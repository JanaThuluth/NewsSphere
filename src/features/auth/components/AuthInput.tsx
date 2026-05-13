import React, { forwardRef, ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors, Fonts } from "../../../constants/constants";

type AuthInputProps = TextInputProps & {
  icon: ReactNode;
  error?: string;
  secureToggle?: boolean;
  secureValue?: boolean;
  onToggleSecure?: () => void;
  disabled?: boolean;
};

const AuthInput = forwardRef<TextInput, AuthInputProps>(
  (
    {
      icon,
      error,
      secureToggle = false,
      secureValue = false,
      onToggleSecure,
      disabled = false,
      style,
      ...inputProps
    },
    ref
  ) => {
    return (
      <>
        <View style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}>
          {icon}

          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={Colors.gray}
            editable={!disabled}
            {...inputProps}
          />

          {secureToggle && (
            <TouchableOpacity
              onPress={onToggleSecure}
              disabled={disabled}
              activeOpacity={0.8}
            >
              <Feather
                name={secureValue ? "eye-off" : "eye"}
                size={20}
                color={Colors.secondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;

const styles = StyleSheet.create({
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
    marginBottom: 6,
    marginLeft: 5,
  },
});