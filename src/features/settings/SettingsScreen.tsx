import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useNotifications } from "../../constants/NotificationContext";
import { useTheme } from "../../constants/ThemeContext";
import { Fonts, FontSizes } from "../../constants/constants";
import { fetchUserProfile } from "../profile/api";
import { User } from "../../types/user";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface MenuItemProps {
    title: string;
    subtitle?: string;
    icon: IconName;
    onPress?: () => void;
    danger?: boolean;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: () => void;
    theme: any;
}

const MenuItem = React.memo(({
    title,
    subtitle,
    icon,
    onPress,
    danger,
    hasSwitch,
    switchValue,
    onSwitchChange,
    theme,
}: MenuItemProps) => {
    const trackColor = useMemo(() => ({
        false: "#D1D1D1",
        true: theme.secondary,
    }), [theme.secondary]);

    return (
        <TouchableOpacity
            style={styles.item}
            activeOpacity={hasSwitch ? 1 : 0.7}
            onPress={hasSwitch ? undefined : onPress}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.lightGray }]}>
                    <MaterialCommunityIcons
                        name={icon}
                        size={18}
                        color={danger ? theme.red : theme.primary}
                    />
                </View>

                <View style={styles.itemTextGroup}>
                    <Text style={[styles.itemText, { color: danger ? theme.red : theme.black }]}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text style={[styles.itemSubtitle, { color: theme.gray }]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>

            {hasSwitch ? (
                <Switch
                    trackColor={trackColor}
                    thumbColor={switchValue ? theme.primary : "#F4F3F4"}
                    ios_backgroundColor="#D1D1D1"
                    onValueChange={onSwitchChange}
                    value={switchValue}
                    style={
                        Platform.OS === "ios"
                            ? { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }
                            : undefined
                    }
                />
            ) : (
                <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={theme.gray}
                    style={{ opacity: 0.4 }}
                />
            )}
        </TouchableOpacity>
    );
});

interface ProfileCardProps {
    user: User | null;
    theme: any;
    onPress: () => void;
}

const ProfileCard = React.memo(({ user, theme, onPress }: ProfileCardProps) => {
    const initials = user?.fullName
        ? user.fullName.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
        : "?";

    return (
        <TouchableOpacity
            style={[styles.profileCard, { backgroundColor: theme.white, borderColor: theme.border }]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: theme.primary + "20" }]}>
                    <Text style={[styles.avatarInitials, { color: theme.primary }]}>
                        {initials}
                    </Text>
                </View>
            )}

            <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.black }]} numberOfLines={1}>
                    {user?.fullName ?? "—"}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.gray }]} numberOfLines={1}>
                    {user?.email ?? "—"}
                </Text>
            </View>

            <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={theme.gray}
                style={{ opacity: 0.4 }}
            />
        </TouchableOpacity>
    );
});

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { isDark, theme, toggleTheme } = useTheme();
    const { notificationsEnabled, toggleNotifications } = useNotifications();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUserProfile().then(setUser);
    }, []);

    const handleToggleTheme = useCallback(() => toggleTheme(), [toggleTheme]);
    const handleToggleNotifications = useCallback(() => toggleNotifications(), [toggleNotifications]);

    const MENU_SECTIONS = useMemo(() => ([
        {
            label: "General",
            items: [
                {
                    title: "Dark Mode",
                    subtitle: "Switch app appearance",
                    icon: "theme-light-dark" as IconName,
                    hasSwitch: true,
                    switchValue: isDark,
                    onSwitchChange: handleToggleTheme,
                },
                {
                    title: "Notifications",
                    subtitle: "Push & alerts",
                    icon: "bell-outline" as IconName,
                    hasSwitch: true,
                    switchValue: notificationsEnabled,
                    onSwitchChange: handleToggleNotifications,
                },
                {
                    title: "About App",
                    subtitle: "Version & info",
                    icon: "information-outline" as IconName,
                    onPress: () => router.push("/about"),
                },
            ],
        },
    ]), [isDark, notificationsEnabled, handleToggleTheme, handleToggleNotifications, router]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View
                style={[
                    styles.headerWrapper,
                    { paddingTop: insets.top, backgroundColor: theme.primary }
                ]}
            >
                <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
                        <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Settings</Text>

                    <View style={styles.navButton} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <ProfileCard
                    user={user}
                    theme={theme}
                    onPress={() => router.push("/profile")}
                />

                {MENU_SECTIONS.map((section) => (
                    <View key={section.label} style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: theme.gray }]}>
                            {section.label}
                        </Text>

                        <View style={[styles.card, { backgroundColor: theme.white, borderColor: theme.border }]}>
                            {section.items.map((item, index) => (
                                <View key={item.title}>
                                    <MenuItem {...item} theme={theme} />

                                    {index < section.items.length - 1 && (
                                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                <Text style={[styles.version, { color: theme.gray }]}>
                    Version 1.0.0
                </Text>
            </ScrollView>
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
        gap: 18,
    },

    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderRadius: 18,
        borderWidth: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },

    avatarFallback: {
        alignItems: "center",
        justifyContent: "center",
    },

    avatarInitials: {
        fontSize: 18,
        fontFamily: Fonts.heading,
        fontWeight: "bold",
    },

    profileInfo: {
        flex: 1,
        gap: 3,
    },

    profileName: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.heading,
        fontWeight: "bold",
    },

    profileEmail: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.body,
    },

    section: {
        gap: 8,
    },

    sectionLabel: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.body,
        textTransform: "uppercase",
        marginLeft: 4,
        opacity: 0.7,
    },

    card: {
        borderRadius: 18,
        borderWidth: 1,
        overflow: "hidden",
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
        minHeight: 60,
    },

    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    iconBox: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    itemTextGroup: {
        gap: 2,
    },

    itemText: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
    },

    itemSubtitle: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.body,
        opacity: 0.7,
    },

    divider: {
        height: 1,
        marginLeft: 62,
        opacity: 0.3,
    },

    version: {
        textAlign: "center",
        fontSize: FontSizes.small,
        fontFamily: Fonts.body,
        opacity: 0.5,
        marginTop: 8,
    },
});