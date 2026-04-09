import { Href, router } from "expo-router";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors, Fonts, FontSizes } from "../../constants/constants";

const AppFooter: React.FC = () => {
    const links: { label: string; screen: Href }[] = [
        { label: "Home", screen: "/HomePage" },
        { label: "Today's News", screen: "/HomePage" },
        //{ label: "Favorites", screen: "/myFavorites" },
        { label: "Log In", screen: "/login" },
        { label: "Sign Up", screen: "/register" },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Image
                    source={require("../../assets/images/icon.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                />

                <Text style={styles.logo}>NewsSphere</Text>

                <Text style={styles.tagline}>
                    Stay informed with the latest updates from around the world.
                </Text>

                <View style={styles.links}>
                    {links.map((item) => (
                        <TouchableOpacity
                            key={item.label}
                            onPress={() => router.push(item.screen)}
                            style={styles.linkBtn}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.linkText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.divider} />

                <Text style={styles.copy}>
                    © 2026 NewsSphere. All rights reserved.
                </Text>
            </View>
        </View>
    );
};

export default AppFooter;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: Colors.primary,
        paddingTop: 28,
        paddingBottom: 20,
    },

    inner: {
        paddingHorizontal: 10,
        alignItems: "center",
    },

    logoImage: {
        width: 150,
        height: 150,
    },

    logo: {
        fontSize: 26,
        fontFamily: Fonts.heading,
        color: Colors.white,
        marginBottom: 6,
    },

    tagline: {
        fontSize: 14,
        fontFamily: Fonts.body,
        color: Colors.lightGray,
        marginBottom: 20,
        lineHeight: 22,
        textAlign: "center",
    },

    links: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        marginBottom: 18,
    },

    linkBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: Colors.secondary + "25",
    },

    linkText: {
        color: Colors.white,
        fontFamily: Fonts.body,
        fontSize: 14,
    },

    divider: {
        height: 1,
        width: "100%",
        backgroundColor: Colors.white + "20",
        marginVertical: 12,
    },

    copy: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.body,
        color: Colors.background,
        textAlign: "center",
    },
});