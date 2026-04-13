import * as ImagePicker from "expo-image-picker";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";
import { EditProfileData } from "../../../types/user";

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
    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm<EditProfileData>({
        defaultValues: initialData,
    });

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const pickImage = async (onChange: (val: string) => void) => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri + "?t=" + Date.now();
            onChange(uri);
        }
    };

    const onSubmit = async (data: EditProfileData) => {
        await onSave(data);
        onClose();
    };

    const photoURL = watch("photoURL");

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.backdrop}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Edit Profile</Text>

                    {/* Avatar */}
                    <Controller
                        control={control}
                        name="photoURL"
                        render={({ field: { onChange } }) => (
                            <View style={styles.avatarSection}>
                                <TouchableOpacity
                                    onPress={() => pickImage(onChange)}
                                >
                                    <View style={styles.avatar}>
                                        {photoURL ? (
                                            <Image
                                                source={{ uri: photoURL }}
                                                style={styles.image}
                                            />
                                        ) : (
                                            <Text style={styles.avatarText}>
                                                +
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>

                                <Text style={styles.changePhotoText}>
                                    Change Profile Photo
                                </Text>
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="fullName"
                        render={({ field: { value, onChange } }) => (
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                    editable={!isLoading}
                                />
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value } }) => (
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    value={value}
                                    editable={false}
                                />
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { value, onChange } }) => (
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>
                                    Phone (Optional)
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                    editable={!isLoading}
                                />
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="bio"
                        render={({ field: { value, onChange } }) => (
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>
                                    Bio (Optional)
                                </Text>
                                <TextInput
                                    style={[styles.input, styles.textarea]}
                                    value={value}
                                    onChangeText={onChange}
                                    multiline
                                    numberOfLines={4}
                                    editable={!isLoading}
                                />
                            </View>
                        )}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                isLoading && styles.buttonDisabled,
                            ]}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isLoading}
                        >
                            <Text style={styles.saveButtonText}>
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
        backgroundColor: Colors.white,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        paddingBottom: 30,
    },

    title: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.heading,
        color: Colors.primary,
        marginBottom: 16,
    },

    avatarSection: {
        alignItems: "center",
        marginBottom: 20,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: Colors.lightGray,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },

    image: {
        width: "100%",
        height: "100%",
    },

    avatarText: {
        fontSize: 28,
        color: Colors.gray,
        fontFamily: Fonts.heading,
    },

    changePhotoText: {
        marginTop: 8,
        fontSize: FontSizes.small,
        color: Colors.gray,
        fontFamily: Fonts.body,
    },

    fieldGroup: {
        marginBottom: 14,
    },

    label: {
        fontSize: FontSizes.body,
        marginBottom: 6,
        color: Colors.secondary,
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

    buttonContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
        marginBottom: 5,
    },

    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: Colors.white,
        height: 45,
        justifyContent: "center",
    },

    saveButton: {
        flex: 1,
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        height: 45,
    },

    saveButtonText: {
        color: Colors.white,
        fontFamily: Fonts.body,
        fontSize: FontSizes.subheading,
    },

    buttonText: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.body,
        color: Colors.primary,
    },

    buttonDisabled: {
        opacity: 0.5,
    },
});