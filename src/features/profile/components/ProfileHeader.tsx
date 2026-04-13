import { Image, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";

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
    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    {photoURL ? (
                        <Image source={{ uri: photoURL }} style={styles.image} />
                    ) : (
                        <Text style={styles.avatarText}>
                            {fullName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </Text>
                    )}
                </View>
            </View>

            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.email}>{email}</Text>
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
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },

    image: {
        width: "100%",
        height: "100%",
    },

    avatarText: {
        color: Colors.white,
        fontSize: 40,
        fontFamily: Fonts.heading,
    },

    name: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.heading,
        color: Colors.primary,
        marginBottom: 4,
    },

    email: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
        color: Colors.gray,
    },
});