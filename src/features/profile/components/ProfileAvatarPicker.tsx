import * as ImagePicker from "expo-image-picker";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useTheme } from "../../../constants/ThemeContext";
import { Fonts, FontSizes } from "../../../constants/constants";

interface ProfileAvatarPickerProps {
    value?: string;
    onChange: (val: string) => void;
}

export const ProfileAvatarPicker = ({
    value,
    onChange,
}: ProfileAvatarPickerProps) => {
    const { theme } = useTheme();

    const pickImage = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri + "?t=" + Date.now();
            onChange(uri);
        }
    };

    const takePhoto = async () => {
        const permission =
            await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) return;

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri + "?t=" + Date.now();
            onChange(uri);
        }
    };

    const openImageOptions = () => {
        Alert.alert(
            "Profile Photo",
            "Choose an option",
            [
                {
                    text: "Take Photo",
                    onPress: takePhoto,
                },
                {
                    text: "Choose from Gallery",
                    onPress: pickImage,
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };

    return (
        <View style={styles.avatarSection}>
            <TouchableOpacity onPress={openImageOptions}>
                <View
                    style={[
                        styles.avatar,
                        { backgroundColor: theme.lightGray },
                    ]}
                >
                    {value ? (
                        <Image
                            source={{ uri: value }}
                            style={styles.image}
                        />
                    ) : (
                        <Text
                            style={[
                                styles.avatarText,
                                { color: theme.gray },
                            ]}
                        >
                            +
                        </Text>
                    )}
                </View>
            </TouchableOpacity>

            <Text
                style={[
                    styles.changePhotoText,
                    { color: theme.gray },
                ]}
            >
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
        fontFamily: Fonts.heading,
    },

    changePhotoText: {
        marginTop: 8,
        fontSize: FontSizes.small,
        fontFamily: Fonts.body,
    },
});