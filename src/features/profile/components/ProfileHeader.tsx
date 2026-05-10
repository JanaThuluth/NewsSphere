import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../constants/ThemeContext";
import { Fonts, FontSizes } from "../../../constants/constants";

interface ProfileHeaderProps {
    fullName: string;
    email: string;
    photoURL?: string;
}

export const ProfileHeader = ({
    fullName,
    email,
    photoURL,
}: ProfileHeaderProps) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                    {photoURL ? (
                        <Image source={{ uri: photoURL }} style={styles.image} />
                    ) : (
                        <Text style={[styles.avatarText, { color: "#FFFFFF" }]}>
                            {fullName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </Text>
                    )}
                </View>
            </View>

            <Text style={[styles.name, { color: theme.primary }]}>{fullName}</Text>
            <Text style={[styles.email, { color: theme.gray }]}>{email}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 24,
    },

    avatarContainer: {
        marginBottom: 16,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },

    image: {
        width: "100%",
        height: "100%",
    },

    avatarText: {
        fontSize: 40,
        fontFamily: Fonts.heading,
    },

    name: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.heading,
        marginBottom: 4,
    },

    email: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
    },
});