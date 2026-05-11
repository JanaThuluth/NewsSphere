import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { searchNews } from "../../../api/newsApi";
import Card from "../../../components/ui/Card";
import { Fonts, FontSizes } from "../../../constants/constants";
import { useTheme } from "../../../constants/ThemeContext";

type Article = {
    title: string;
    description?: string | null;
    urlToImage: string | null;
    source?: {
        name?: string;
    };
    publishedAt?: string;
    content?: string | null;
    url?: string;
    [key: string]: any;
};

const SearchScreen = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const [query, setQuery] = useState("");
    const [news, setNews] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const requestIdRef = useRef(0);

    const styles = useMemo(() => createStyles(theme), [theme]);

    const handleArticlePress = (item: Article) => {
        router.push({
            pathname: "/news/news-details",
            params: {
                title: item.title,
                description: item.description ?? "",
                image: item.urlToImage ?? "",
                source: item.source?.name ?? "",
                publishedAt: item.publishedAt ?? "",
                content: item.content ?? "",
                url: item.url ?? "",
            },
        });
    };

    const loadSearchResults = async (searchText: string) => {
        const cleanQuery = searchText.trim();

        if (!cleanQuery) {
            setNews([]);
            setHasSearched(false);
            setLoading(false);
            return;
        }

        const currentRequestId = requestIdRef.current + 1;
        requestIdRef.current = currentRequestId;

        try {
            setLoading(true);
            setHasSearched(true);

            const data = await searchNews({
                q: cleanQuery,
            });

            if (currentRequestId !== requestIdRef.current) {
                return;
            }

            const filteredData = Array.isArray(data)
                ? data.filter((item) => item.title && item.urlToImage)
                : [];

            setNews(filteredData);
        } catch (error) {
            console.log("Search page error:", error);

            if (currentRequestId === requestIdRef.current) {
                setNews([]);
            }
        } finally {
            if (currentRequestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadSearchResults(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleClear = () => {
        setQuery("");
        setNews([]);
        setHasSearched(false);
        Keyboard.dismiss();
    };

    const renderEmptyState = () => {
        if (loading) return null;

        if (!hasSearched) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={56} color={theme.gray} />

                    <Text style={styles.emptyTitle}>Search for news</Text>

                    <Text style={styles.emptyText}>
                        Start typing anything like sports, technology, politics, health, or
                        business.
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="newspaper-outline" size={56} color={theme.gray} />

                <Text style={styles.emptyTitle}>No results found</Text>

                <Text style={styles.emptyText}>
                    Try another keyword or use a more general topic.
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.root}>
            <View
                style={[
                    styles.headerWrapper,
                    {
                        paddingTop: insets.top,
                        backgroundColor: theme.primary,
                    },
                ]}
            >
                <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

                <View style={styles.navbar}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.navButton}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
                    </TouchableOpacity>

                    <Text style={styles.navTitle}>Search News</Text>

                    <View style={styles.navButton} />
                </View>
            </View>

            <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={22} color={theme.gray} />

                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search news..."
                    placeholderTextColor={theme.gray}
                    style={styles.input}
                    returnKeyType="search"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {query.length > 0 && (
                    <Pressable onPress={handleClear} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={22} color={theme.gray} />
                    </Pressable>
                )}
            </View>

            {loading && (
                <View style={styles.smallLoader}>
                    <ActivityIndicator size="small" color={theme.primary} />
                </View>
            )}

            <FlatList
                data={news}
                keyExtractor={(item, index) =>
                    `search-${item.url || item.title}-${index}`
                }
                renderItem={({ item }) => (
                    <Card item={item} onPress={() => handleArticlePress(item)} />
                )}
                contentContainerStyle={[
                    styles.list,
                    news.length === 0 && styles.emptyList,
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );
};

export default SearchScreen;

const createStyles = (theme: any) =>
    StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.background,
        },

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

        navTitle: {
            fontSize: 20,
            color: "#FFFFFF",
            fontFamily: Fonts.heading,
            fontWeight: "bold",
            letterSpacing: 0.5,
        },

        searchBox: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.white,
            marginHorizontal: 16,
            marginTop: 18,
            marginBottom: 8,
            borderRadius: 18,
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: theme.border,
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
        },

        input: {
            flex: 1,
            fontFamily: Fonts.body,
            fontSize: 15,
            color: theme.black,
            paddingVertical: 10,
            paddingHorizontal: 8,
        },

        clearButton: {
            padding: 4,
        },

        smallLoader: {
            paddingVertical: 8,
            alignItems: "center",
            justifyContent: "center",
        },

        list: {
            paddingTop: 12,
            paddingBottom: 90,
        },

        emptyList: {
            flexGrow: 1,
        },

        emptyContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 28,
            marginTop: 80,
        },

        emptyTitle: {
            fontFamily: Fonts.heading,
            fontSize: 22,
            color: theme.primary,
            marginTop: 14,
            textAlign: "center",
        },

        emptyText: {
            fontFamily: Fonts.body,
            fontSize: FontSizes.body,
            color: theme.gray,
            textAlign: "center",
            marginTop: 6,
            lineHeight: 22,
        },
    });