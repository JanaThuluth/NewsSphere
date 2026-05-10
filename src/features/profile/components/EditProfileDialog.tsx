import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useTheme } from "../../../constants/ThemeContext";
import { Fonts, FontSizes } from "../../../constants/constants";
import { EditProfileData } from "../../../types/user";
import { FormTextField } from "../components/FormTextField";
import { ProfileAvatarPicker } from "../components/ProfileAvatarPicker";

interface EditProfileDialogProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: EditProfileData) => void;
    initialData: EditProfileData;
    isLoading?: boolean;
}

export const EditProfileDialog = ({
    visible,
    onClose,
    onSave,
    initialData,
    isLoading = false,
}: EditProfileDialogProps) => {
    const { theme } = useTheme();
    const { control, handleSubmit, reset } = useForm<EditProfileData>({
        defaultValues: initialData,
    });

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const onSubmit = async (data: EditProfileData) => {
        await onSave(data);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.backdrop}>
                <View style={[styles.modal, { backgroundColor: theme.background }]}>
                    <Text style={[styles.title, { color: theme.primary }]}>Edit Profile</Text>

                    <Controller
                        control={control}
                        name="photoURL"
                        render={({ field: { value, onChange } }) => (
                            <ProfileAvatarPicker
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="fullName"
                        render={({ field: { value, onChange } }) => (
                            <FormTextField
                                label="Full Name"
                                value={value}
                                onChangeText={onChange}
                                editable={!isLoading}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value } }) => (
                            <FormTextField
                                label="Email"
                                value={value}
                                onChangeText={() => { }}
                                editable={false}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { value, onChange } }) => (
                            <FormTextField
                                label="Phone (Optional)"
                                value={value}
                                onChangeText={onChange}
                                editable={!isLoading}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="bio"
                        render={({ field: { value, onChange } }) => (
                            <FormTextField
                                label="Bio (Optional)"
                                value={value}
                                onChangeText={onChange}
                                editable={!isLoading}
                                multiline
                            />
                        )}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.cancelButton,
                                { borderColor: theme.border, backgroundColor: theme.white }
                            ]}
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Text style={[styles.buttonText, { color: theme.primary }]}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                { backgroundColor: theme.primary },
                                isLoading && styles.buttonDisabled,
                            ]}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isLoading}
                        >
                            <Text style={[styles.saveButtonText, { color: "#FFFFFF" }]}>
                                {isLoading ? "Saving..." : "Save changes"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modal: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        paddingBottom: 30,
    },
    title: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.heading,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
        marginBottom: 5,
    },
    cancelButton: {
        flex: 1,
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        height: 45,
        justifyContent: "center",
    },
    saveButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        height: 45,
    },
    saveButtonText: {
        fontFamily: Fonts.body,
        fontSize: FontSizes.subheading,
    },
    buttonText: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.body,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});