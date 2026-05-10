import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../../../constants/ThemeContext";
import { Fonts, FontSizes } from "../../../constants/constants";

interface FormTextFieldProps {
    label: string;
    value?: string;
    onChangeText: (val: string) => void;
    editable?: boolean;
    multiline?: boolean;
}

export const FormTextField = ({
    label,
    value,
    onChangeText,
    editable = true,
    multiline = false,
}: FormTextFieldProps) => {
    const { theme } = useTheme();

    return (
        <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: theme.primary }]}>{label}</Text>

            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor: theme.border,
                        backgroundColor: theme.white,
                        color: "#FFFFFF"
                    },
                    !editable && { opacity: 0.6 },
                    multiline && styles.textarea
                ]}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                placeholderTextColor={theme.gray}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    fieldGroup: {
        marginBottom: 14,
    },

    label: {
        fontSize: FontSizes.body,
        marginBottom: 6,
        fontFamily: Fonts.body,
    },

    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
    },

    textarea: {
        height: 90,
        textAlignVertical: "top",
    },
});