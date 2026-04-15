import CategoryTabs from "@/src/components/ui/CategoryTabs";
import SectionHeader from "@/src/components/ui/SectionHeader";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { getTopHeadlines, searchNews } from "../../../api/newsApi";
import Card from "../../../components/ui/Card";
import HomeNavbar from "../../../components/ui/HomeNavbar";
import NewsImageSlider from "../../../components/ui/NewsImageSlider";
import TrendingSlider from "../../../components/ui/TrendingSlider";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";

type Article = {
    title: string;
    description?: string | null;
    urlToImage: string | null;
    source?: {
        name?: string;
    };
    [key: string]: any;
};

type Category = {
    key: string;
    label: string;
};

type ListItem =
    | { type: "tabs" }
    | { type: "section-header"; title: string }
    | { type: "slider" }
    | { type: "article"; article: Article };

const categories: Category[] = [
    { key: "politics", label: "Politics" },
    { key: "sports", label: "Sports" },
    { key: "economy", label: "Economy" },
    { key: "science", label: "Science" },
    { key: "health", label: "Health" },
];

const HomeScreen = ({ navigation }: any) => {
    const [todayNews, setTodayNews] = useState<Article[]>([]);
    const [recommendedNews, setRecommendedNews] = useState<Article[]>([]);
    const [usaNews, setUsaNews] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeCategory, setActiveCategory] = useState("politics");
    const [isSticky, setIsSticky] = useState(false);
    const [sliderHeight, setSliderHeight] = useState(0);

    useEffect(() => {
        const fetchAllNews = async () => {
            try {
                const [todayData, recommendedData, usaData] = await Promise.all([
                    getTopHeadlines(),
                    searchNews("technology OR sports OR health"),
                    searchNews("USA OR United States"),
                ]);

                setTodayNews(Array.isArray(todayData) ? todayData : []);
                setRecommendedNews(Array.isArray(recommendedData) ? recommendedData : []);
                setUsaNews(Array.isArray(usaData) ? usaData : []);
            } catch (err) {
                setError("Something went wrong while fetching news");
            } finally {
                setLoading(false);
            }
        };

        fetchAllNews();
    }, []);

    const sliderNews = useMemo(() => {
        return todayNews.filter((item) => item.urlToImage).slice(0, 5);
    }, [todayNews]);

    const todayList = useMemo(() => {
        return todayNews.filter((item) => item.urlToImage).slice(5, 10);
    }, [todayNews]);

    const recommendedList = useMemo(() => {
        return recommendedNews.filter((item) => item.urlToImage).slice(0, 5);
    }, [recommendedNews]);

    const usaList = useMemo(() => {
        return usaNews.filter((item) => item.urlToImage).slice(0, 5);
    }, [usaNews]);

    const listData = useMemo<ListItem[]>(() => {
        return [
            { type: "tabs" },

            { type: "section-header", title: "Recommended" },
            ...recommendedList.map((article) => ({
                type: "article" as const,
                article,
            })),

            { type: "slider" },

            { type: "section-header", title: "Today News" },
            ...todayList.map((article) => ({
                type: "article" as const,
                article,
            })),

            { type: "section-header", title: "USA News" },
            ...usaList.map((article) => ({
                type: "article" as const,
                article,
            })),
        ];
    }, [recommendedList, todayList, usaList]);

    const handleArticlePress = (item: Article) => {
        navigation.navigate("NewsDetails", { article: item });
    };

    const handleFavoritePress = (item: Article) => {
        console.log("Favorite:", item);
    };

    const handleCategoryChange = (key: string) => {
        setActiveCategory(key);
        console.log("Selected category:", key);
    };

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollY = e.nativeEvent.contentOffset.y;
        const shouldStick = scrollY >= Math.max(sliderHeight - 8, 0);

        if (shouldStick !== isSticky) {
            setIsSticky(shouldStick);
        }
    };

    if (loading) {
        return (
            <View style={styles.root}>
                <HomeNavbar />
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.message}>Loading news...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.root}>
                <HomeNavbar />
                <View style={styles.center}>
                    <Text style={styles.message}>{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <HomeNavbar />

            <FlatList
                data={listData}
                keyExtractor={(item, index) => {
                    if (item.type === "tabs") return `tabs-${index}`;
                    if (item.type === "slider") return `slider-${index}`;
                    if (item.type === "section-header") return `header-${item.title}-${index}`;
                    return `article-${item.article.title}-${index}`;
                }}
                renderItem={({ item }) => {
                    if (item.type === "tabs") {
                        return (
                            <CategoryTabs
                                categories={categories}
                                activeKey={activeCategory}
                                onChange={handleCategoryChange}
                                isSticky={isSticky}
                            />
                        );
                    }

                    if (item.type === "slider") {
                        return (
                            <View style={styles.sliderWrapper}>
                                <TrendingSlider />
                            </View>
                        );
                    }

                    if (item.type === "section-header") {
                        return <SectionHeader title={item.title} />;
                    }

                    return (
                        <View style={styles.cardWrapper}>
                            <Card
                                item={item.article}
                                onPress={handleArticlePress}
                                onFavoritePress={handleFavoritePress}
                            />
                        </View>
                    );
                }}
                ListHeaderComponent={
                    <View
                        onLayout={(e) => {
                            setSliderHeight(e.nativeEvent.layout.height);
                        }}
                    >
                        <NewsImageSlider
                            data={sliderNews}
                            onPress={handleArticlePress}
                        />
                    </View>
                }
                stickyHeaderIndices={[1]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                removeClippedSubviews={false}
                nestedScrollEnabled
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />

        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    list: {
        paddingTop: 14,
        paddingBottom: 90,
    },
    cardWrapper: {
        paddingHorizontal: 14,
    },
    sliderWrapper: {
        marginVertical: 16,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        paddingBottom: 100,
    },
    message: {
        marginTop: 12,
        fontSize: FontSizes.body,
        fontFamily: Fonts.body,
        color: Colors.gray,
        textAlign: "center",
    },
});