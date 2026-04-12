import { Href, router, usePathname } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../../constants/constants";

const AppFooter: React.FC = () => {
    const pathname = usePathname();

    const links: {
        label: string;
        screen: Href;
        icon: keyof typeof Ionicons.glyphMap;
    }[] = [
            { label: "Home", screen: "/HomePage", icon: "home" },
            //{ label: "Favorites", screen: "/myFavorites", icon: "heart" },
            { label: "Account", screen: "/login", icon: "person" },
        ];

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                {links.map((item) => {
                    const isActive = pathname === item.screen;

                    return (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.navItem}
                            activeOpacity={0.8}
                            onPress={() => router.push(item.screen)}
                        >
                            <Ionicons
                                name={isActive ? item.icon : `${item.icon}-outline` as keyof typeof Ionicons.glyphMap}
                                size={24}
                                color={isActive ? Colors.primary : Colors.gray}
                            />
                            <Text
                                style={[
                                    styles.label,
                                    { color: isActive ? Colors.primary : Colors.gray },
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default AppFooter;

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 999,
    },

    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingVertical: 10,
        paddingHorizontal: 8,
        minHeight: 20,
    },

    navItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },

    label: {
        fontSize: 12,
        fontFamily: Fonts.body,
    },
});