import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNotifications } from "../../../constants/NotificationContext";
import { useTheme } from "../../../constants/ThemeContext";
import { Fonts, FontSizes } from "../../../constants/constants";
import { getNotifications, markAllAsRead,} from "../notificationService";

export default function NotificationsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const queryClient = useQueryClient();

    const { theme } = useTheme();
    const { notificationsEnabled } = useNotifications();

    const { data: notifications, isLoading, isRefetching } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });

    const formatRelativeTime = useCallback((date: any) => {
        if (!date) return "Just now";
        const postDate = date.toDate ? date.toDate() : new Date(date);
        const now = new Date();

        const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
        if (diffInSeconds < 60) return "Just now";

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return postDate.toLocaleDateString();
    }, []);

    const markAsReadMutation = useMutation({
        mutationFn: (id: string) => markAllAsRead([id]),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    });

    const markAllMutation = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    });

    const handleNotificationPress = useCallback((item: any) => {
        if (!item.isRead) {
            markAsReadMutation.mutate(item.id);
        }

        router.push({
            pathname: "/news/news-details",
            params: {
                title: item.title,
                description: item.description || item.message,
                image: item.imageUrl,
                source: item.sourceName || "News",
                publishedAt: item.publishedAt || "",
                content: item.description || "",
                url: item.articleId,
            }
        });
    }, [markAsReadMutation, router]);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.white, borderColor: theme.border }]}
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.7}
        >
            <ExpoImage
                source={{ uri: item.imageUrl }}
                style={[styles.image, { backgroundColor: theme.lightGray }]}
                contentFit="cover"
                transition={200}
            />

            <View style={styles.textContainer}>
                <View style={styles.titleRow}>

                    {!item.isRead && notificationsEnabled && (
                        <View style={[styles.unreadDot, { backgroundColor: theme.red }]} />
                    )}

                    <Text
                        style={[
                            styles.cardTitle,
                            { color: !item.isRead ? theme.primary : theme.gray },
                            !item.isRead ? styles.unreadText : styles.readText
                        ]}
                        numberOfLines={1}
                    >
                        {item.title}
                    </Text>
                </View>

                <Text style={[styles.cardMessage, { color: theme.gray }]} numberOfLines={2}>
                    {item.message}
                </Text>

                <Text style={[styles.timeText, { color: theme.gray }]}>
                    {formatRelativeTime(item.createdAt)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>

            <View style={[styles.headerWrapper, { paddingTop: insets.top, backgroundColor: theme.primary }]}>
                <StatusBar backgroundColor={theme.primary} barStyle="light-content" />

                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
                        <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Notifications</Text>

                    <View style={styles.navButton}>
                        {notifications && notifications.length > 0 && (
                            <TouchableOpacity
                                onPress={() =>
                                    markAllMutation.mutate(
                                        notifications?.filter(n => !n.isRead).map(n => n.id) || []
                                    )
                                }
                            >
                                <Ionicons name="checkmark-done-outline" size={26} color="#FFFFFF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {!notificationsEnabled && (
                <View style={[styles.muteBanner, { backgroundColor: theme.lightGray }]}>
                    <Ionicons name="notifications-off-outline" size={18} color={theme.gray} />
                    <Text style={[styles.muteText, { color: theme.gray }]}>
                        Notifications are muted
                    </Text>
                </View>
            )}

            {isLoading && !isRefetching ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : notifications && notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={[styles.listContent, { paddingBottom: 75 }]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={() =>
                                queryClient.invalidateQueries({ queryKey: ["notifications"] })
                            }
                            tintColor={theme.primary}
                        />
                    }
                />
            ) : (
                <View style={styles.centerContainer}>
                    <Ionicons
                        name="notifications-off-outline"
                        size={80}
                        color={theme.gray}
                        style={{ opacity: 0.3 }}
                    />
                    <Text style={[styles.emptyTitle, { color: theme.primary }]}>
                        No Notifications Yet
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: theme.gray }]}>
                        We'll keep you posted with the latest news.
                    </Text>
                </View>
            )}
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
        zIndex: 10,
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

    muteBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        gap: 8,
    },

    muteText: {
        color: "#fff",
        fontSize: 13,
        fontFamily: Fonts.body,
        fontWeight: "600",
    },

    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },

    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    card: {
        flexDirection: "row",
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },

    image: {
        width: 65,
        height: 65,
        borderRadius: 12,
    },

    textContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 3,
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },

    cardTitle: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.heading,
        flex: 1,
    },

    unreadText: { fontWeight: "bold" },
    readText: { fontWeight: "400" },

    cardMessage: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.body,
        lineHeight: 18,
    },

    timeText: {
        fontSize: 11,
        fontFamily: Fonts.body,
        marginTop: 6,
    },

    emptyTitle: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.heading,
        marginTop: 15,
        fontWeight: "bold",
    },

    emptySubtitle: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
        textAlign: "center",
        marginTop: 5,
    },
});