import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../constants/ThemeContext";
import { FontSizes, Fonts } from "../../../constants/constants";

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
    color,
    isDanger,
    onPress,
}: Props) => {
    const { theme, isDark } = useTheme();

    const iconColor = isDanger
        ? theme.red
        : (isDark ? theme.primary : (color || theme.secondary));

    const chevronColor = isDark ? "#FFFFFF" : theme.gray;

    return (
        <TouchableOpacity
            style={[
                styles.menuItem,
                {
                    backgroundColor: theme.white,
                    shadowColor: isDark ? "#000" : theme.primary
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.menuItemContent}>
                <MaterialCommunityIcons
                    name={icon as any}
                    size={20}
                    color={iconColor}
                />
                <Text
                    style={[
                        styles.menuItemText,
                        { color: isDark ? "#FFFFFF" : theme.primary },
                        isDanger && { color: theme.red }
                    ]}
                >
                    {text}
                </Text>
            </View>

            <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={chevronColor}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 14,
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
    },
});