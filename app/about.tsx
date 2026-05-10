import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Linking,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../src/constants/ThemeContext";
import { Fonts, FontSizes } from "../src/constants/constants";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const FEATURES: { icon: IconName; title: string }[] = [
    { icon: "view-grid-outline", title: "Browse by Categories" },
    { icon: "magnify", title: "Search Articles" },
    { icon: "newspaper-variant-outline", title: "Read Full Articles" },
    { icon: "bookmark-outline", title: "Save for Later" },
    { icon: "account-outline", title: "User Profile" },
    { icon: "bell-outline", title: "Notifications" },
];

export default function AboutScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(anim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

            <View style={[styles.headerWrapper, { paddingTop: insets.top, backgroundColor: theme.primary }]}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
                        <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>About App</Text>
                    <View style={styles.navButton} />
                </View>
            </View>

            <Animated.ScrollView
                style={{
                    opacity: anim,
                    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
                }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.heroCard, { backgroundColor: theme.primary }]}>
                    <View style={styles.appIconWrapper}>
                        <MaterialCommunityIcons name="newspaper-variant-multiple-outline" size={38} color="#fff" />
                    </View>
                    <Text style={styles.appName}>NewsHub</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>v1.0.0</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.gray }]}>ABOUT</Text>
                    <View style={[styles.card, { backgroundColor: theme.white, borderColor: theme.border }]}>
                        <Text style={[styles.descText, { color: theme.black }]}>
                            A university project that aggregates news from The Guardian API and displays
                            them in one organized platform. Users can browse by category, search, save
                            articles, and manage their account.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.gray }]}>FEATURES</Text>
                    <View style={[styles.card, { backgroundColor: theme.white, borderColor: theme.border }]}>
                        {FEATURES.map((f, index) => (
                            <View key={f.title}>
                                <View style={styles.featureRow}>
                                    <View style={[styles.iconBox, { backgroundColor: theme.lightGray }]}>
                                        <MaterialCommunityIcons name={f.icon} size={18} color={theme.primary} />
                                    </View>
                                    <Text style={[styles.featureTitle, { color: theme.black }]}>{f.title}</Text>
                                </View>
                                {index < FEATURES.length - 1 && (
                                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.gray }]}>DATA SOURCE</Text>
                    <TouchableOpacity
                        style={[styles.card, styles.sourceRow, { backgroundColor: theme.white, borderColor: theme.border }]}
                        activeOpacity={0.7}
                        onPress={() => Linking.openURL("https://open-platform.theguardian.com/")}
                    >
                        <View style={[styles.iconBox, { backgroundColor: theme.lightGray }]}>
                            <MaterialCommunityIcons name="api" size={18} color={theme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.featureTitle, { color: theme.black }]}>The Guardian API</Text>
                            <Text style={[styles.sourceDesc, { color: theme.gray }]}>open-platform.theguardian.com</Text>
                        </View>
                        <MaterialCommunityIcons name="open-in-new" size={16} color={theme.gray} style={{ opacity: 0.4 }} />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.footer, { color: theme.gray }]}>
                    Version 1.0.0
                </Text>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    headerWrapper: {
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    navbar: {
        height: 58,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },

    navButton: {
        width: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 20,
        color: "#fff",
        fontFamily: Fonts.heading,
        fontWeight: "bold",
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },

    heroCard: {
        borderRadius: 20,
        alignItems: "center",
        paddingVertical: 28,
        marginBottom: 24,
    },

    appIconWrapper: {
        width: 68,
        height: 68,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.18)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    appName: {
        fontSize: 24,
        color: "#fff",
        fontFamily: Fonts.heading,
        fontWeight: "bold",
        marginBottom: 10,
    },

    badge: {
        backgroundColor: "rgba(255,255,255,0.18)",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },

    badgeText: {
        fontSize: 12,
        color: "#fff",
        fontFamily: Fonts.body,
    },

    section: {
        marginBottom: 18,
    },

    sectionLabel: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.body,
        textTransform: "uppercase",
        marginBottom: 8,
        marginLeft: 4,
        opacity: 0.7,
    },

    card: {
        borderRadius: 18,
        borderWidth: 1,
        overflow: "hidden",
        paddingHorizontal: 16,
        paddingVertical: 14,
    },

    descText: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
        lineHeight: 22,
        opacity: 0.85,
    },

    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
    },

    iconBox: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    featureTitle: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
    },

    divider: {
        height: 1,
        marginLeft: 46,
        opacity: 0.3,
    },

    sourceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 14,
    },

    sourceDesc: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.body,
        marginTop: 2,
        opacity: 0.7,
    },

    footer: {
        textAlign: "center",
        fontSize: FontSizes.small,
        fontFamily: Fonts.body,
        opacity: 0.5,
        marginTop: 8,
    },
});