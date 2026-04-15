import * as ImagePicker from "expo-image-picker";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";

interface ProfileAvatarPickerProps {
    value?: string;
    onChange: (val: string) => void;
}

export const ProfileAvatarPicker = ({
    value,
    onChange,
}: ProfileAvatarPickerProps) => {
    const pickImage = async () => {
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

    return (
        <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage}>
                <View style={styles.avatar}>
                    {value ? (
                        <Image source={{ uri: value }} style={styles.image} />
                    ) : (
                        <Text style={styles.avatarText}>+</Text>
                    )}
                </View>
            </TouchableOpacity>

            <Text style={styles.changePhotoText}>
                Change Profile Photo
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
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
});