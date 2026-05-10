import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../../constants/ThemeContext";
import { Fonts, FontSizes } from "../../../constants/constants";

interface LogoutDialogProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export const LogoutDialog = ({
    visible,
    onCancel,
    onConfirm,
    isLoading = false,
}: LogoutDialogProps) => {
    const { theme } = useTheme();

    const handleCancel = () => {
        if (!isLoading) onCancel();
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={handleCancel}
            >
                <TouchableOpacity
                    style={[styles.dialog, { backgroundColor: theme.background }]}
                    activeOpacity={1}
                >
                    <Text style={[styles.title, { color: theme.primary }]}>Logout</Text>

                    <Text style={[styles.message, { color: theme.gray }]}>
                        Are you sure you want to log out?
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.cancelButton,
                                { borderColor: theme.border, backgroundColor: theme.white }
                            ]}
                            onPress={handleCancel}
                            disabled={isLoading}
                        >
                            <Text style={[styles.buttonText, { color: theme.primary }]}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                { backgroundColor: theme.red },
                                isLoading && styles.buttonDisabled,
                            ]}
                            onPress={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={[styles.confirmButtonText, { color: "#FFFFFF" }]}>
                                    Yes, Logout
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },

    dialog: {
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 20,
        width: "85%",
        maxWidth: 340,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },

    title: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.heading,
        fontWeight: "bold",
        marginBottom: 8,
    },

    message: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
        marginBottom: 24,
        lineHeight: 22,
    },

    buttonContainer: {
        flexDirection: "row",
        gap: 12,
    },

    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    confirmButton: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonDisabled: {
        opacity: 0.5,
    },

    confirmButtonText: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
        fontWeight: "600",
    },

    buttonText: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
        fontWeight: "600",
    },
});