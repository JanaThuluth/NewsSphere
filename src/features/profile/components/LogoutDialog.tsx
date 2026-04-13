import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";

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
                <TouchableOpacity style={styles.dialog} activeOpacity={1}>
                    <Text style={styles.title}>Logout</Text>

                    <Text style={styles.message}>
                        Are you sure you want to log out?
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancel}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                isLoading && styles.buttonDisabled,
                            ]}
                            onPress={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={Colors.white} />
                            ) : (
                                <Text style={styles.confirmButtonText}>Yes, Logout</Text>
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
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    dialog: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 20,
        width: "80%",
        maxWidth: 320,

        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },

    title: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.heading,
        color: Colors.primary,
        marginBottom: 8,
    },

    message: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
        color: Colors.gray,
        marginBottom: 24,
        lineHeight: 20,
    },

    buttonContainer: {
        flexDirection: "row",
        gap: 12,
    },

    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: Colors.white,
    },

    confirmButton: {
        flex: 1,
        backgroundColor: Colors.red,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    confirmButtonText: {
        color: Colors.white,
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
    },

    buttonText: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
        color: Colors.primary,
    },
});