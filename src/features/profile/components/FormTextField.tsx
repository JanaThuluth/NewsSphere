import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";

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
    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>

            <TextInput
                style={[styles.input, multiline && styles.textarea]}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
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
        color: Colors.primary,
        fontFamily: Fonts.body,
    },

    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 10,
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
        backgroundColor: Colors.white,
    },

    textarea: {
        height: 90,
        textAlignVertical: "top",
    },
});