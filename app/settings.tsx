import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Fonts, FontSizes } from "../src/constants/constants";

export default function SettingsScreen() {
    const router = useRouter();

    const MenuItem = ({ title }: { title: string }) => (
        <TouchableOpacity style={styles.item} activeOpacity={1}>
            <Text style={styles.itemText}>{title}</Text>

            <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={Colors.gray}
                style={{ opacity: 0.5 }}
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={28}
                        color={Colors.primary}
                    />
                </TouchableOpacity>

                <Text style={styles.title}>Settings</Text>

                <View style={{ width: 24 }} />
            </View>

            {/* Items */}
            <View style={styles.content}>
                <MenuItem title="App Preferences" />
                <MenuItem title="Notifications" />
                <MenuItem title="Security & Privacy" />
                <MenuItem title="Language Settings" />
                <MenuItem title="Help & Support" />
                <MenuItem title="About App" />
                <MenuItem title="Terms & Privacy Policy" />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 60,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingHorizontal: 20,
    },

    title: {
        fontSize: FontSizes.heading,
        fontFamily: Fonts.heading,
        color: Colors.primary,
    },

    content: {
        flex: 1,
        paddingTop: 45,
        alignItems: "center",
        gap: 20,
    },

    item: {
        width: "85%",
        paddingVertical: 22,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.white,
    },

    itemText: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.body,
        color: Colors.black,
    },
});