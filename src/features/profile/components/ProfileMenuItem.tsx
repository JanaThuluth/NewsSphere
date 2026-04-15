import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, FontSizes, Fonts } from "../../../constants/constants";

type Props = {
    icon: string;
    text: string;
    color?: string;
    isDanger?: boolean;
    onPress: () => void;
};

export const ProfileMenuItem = ({
    icon,
    text,
    color = Colors.secondary,
    isDanger,
    onPress,
}: Props) => {
    return (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.menuItemContent}>
                <MaterialCommunityIcons
                    name={icon as any}
                    size={20}
                    color={color}
                />

                <Text
                    style={[
                        styles.menuItemText,
                        isDanger && styles.logoutText,
                    ]}
                >
                    {text}
                </Text>
            </View>

            <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={Colors.secondary}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        backgroundColor: Colors.white,
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 16,

        marginBottom: 14,

        shadowColor: Colors.primary,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },

    menuItemContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    menuItemText: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.body,
        color: Colors.black,
    },

    logoutText: {
        color: Colors.red,
    },
});