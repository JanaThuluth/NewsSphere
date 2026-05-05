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
import { Colors, Fonts, FontSizes } from "../../src/constants/constants";
import { getNotifications, markAllAsRead } from "../../src/features/notification/notificationService";

export default function NotificationsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const queryClient = useQueryClient();

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
            style={styles.card}
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.7}
        >
            <ExpoImage
                source={{ uri: item.imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={200}
            />

            <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                    {!item.isRead && <View style={styles.unreadDot} />}
                    <Text
                        style={[styles.cardTitle, !item.isRead ? styles.unreadText : styles.readText]}
                        numberOfLines={1}
                    >
                        {item.title}
                    </Text>
                </View>

                <Text style={styles.cardMessage} numberOfLines={2}>
                    {item.message}
                </Text>

                <Text style={styles.timeText}>
                    {formatRelativeTime(item.createdAt)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
                <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
                        <Ionicons name="arrow-back" size={26} color={Colors.white} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Notifications</Text>

                    <View style={styles.navButton}>
                        {notifications && notifications.length > 0 && (
                            <TouchableOpacity onPress={() => markAllMutation.mutate(notifications?.filter(n => !n.isRead).map(n => n.id) || [])}>
                                <Ionicons name="checkmark-done-outline" size={26} color={Colors.white} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {isLoading && !isRefetching ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : notifications && notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={() => queryClient.invalidateQueries({ queryKey: ["notifications"] })}
                            tintColor={Colors.primary}
                        />
                    }
                />
            ) : (
                <View style={styles.centerContainer}>
                    <Ionicons name="notifications-off-outline" size={80} color={Colors.gray} style={{ opacity: 0.3 }} />
                    <Text style={styles.emptyTitle}>No Notifications Yet</Text>
                    <Text style={styles.emptySubtitle}>We'll keep you posted with the latest news.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
    headerWrapper: {
        backgroundColor: Colors.primary,
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
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 20,
        color: Colors.white,
        fontFamily: Fonts.heading,
        fontWeight: "bold",
        letterSpacing: 0.5
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 30
    },
    card: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
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
        backgroundColor: Colors.lightGray
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center"
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.red,
        marginRight: 8
    },
    cardTitle: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.heading,
        color: Colors.primary,
        flex: 1
    },
    unreadText: { fontWeight: "bold" },
    readText: { fontWeight: "400", color: Colors.gray },
    cardMessage: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.body,
        color: Colors.gray,
        lineHeight: 18
    },
    timeText: {
        fontSize: 11,
        fontFamily: Fonts.body,
        color: Colors.gray,
        marginTop: 6
    },
    emptyTitle: {
        fontSize: FontSizes.subheading,
        fontFamily: Fonts.heading,
        color: Colors.primary,
        marginTop: 15,
        fontWeight: 'bold'
    },
    emptySubtitle: {
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
        color: Colors.gray,
        textAlign: "center",
        marginTop: 5
    }
});