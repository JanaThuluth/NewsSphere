import CategoryTabs from "@/src/components/ui/CategoryTabs";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    View,
} from "react-native";

import {
    getTopHeadlines,
    searchNews,
} from "../../../api/newsApi";

import Card from "../../../components/ui/Card";
import HomeNavbar from "../../../components/ui/HomeNavbar";
import NewsImageSlider from "../../../components/ui/NewsImageSlider";
import TrendingSlider from "../../../components/ui/TrendingSlider";
import { Colors } from "../../../constants/constants";

type Article = {
    title: string;
    description?: string | null;
    urlToImage: string | null;
    source?: { name?: string };
};

type ListItem =
    | { type: "trending" }
    | { type: "slider" }
    | { type: "article"; article: Article };

const HomeScreen = () => {
    const [loading, setLoading] = useState(true);

    const [trendingNews, setTrendingNews] = useState<Article[]>([]);
    const [generalNews, setGeneralNews] = useState<Article[]>([]);
    const [sliderNews, setSliderNews] = useState<Article[]>([]);

    const [activeCategory, setActiveCategory] = useState("all");

    const categories = [
        { key: "all", label: "All" },
        { key: "politics", label: "Politics" },
        { key: "sports", label: "Sports" },
        { key: "economy", label: "Economy" },
        { key: "science", label: "Science" },
        { key: "health", label: "Health" },
    ];

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const [top, trending, general] = await Promise.all([
                    getTopHeadlines(),
                    searchNews({ q: "technology OR sports OR health" }),
                    searchNews({
                        q: "world OR business OR politics OR science OR health OR sports",
                    }),
                ]);

                setSliderNews(top || []);
                setTrendingNews(trending || []);
                setGeneralNews(general || []);

            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleCategoryChange = async (key: string) => {
        setActiveCategory(key);

        try {
            const data = await searchNews({
                q: key === "all"
                    ? "world OR business OR politics OR science OR health OR sports"
                    : key,
            });

            setGeneralNews(data || []);
        } catch (e) {
            console.log(e);
        }
    };

    const topNewsList = useMemo(
        () => generalNews.filter(i => i.urlToImage).slice(0, 6),
        [generalNews]
    );

    const bottomNewsList = useMemo(
        () => generalNews.filter(i => i.urlToImage).slice(6, 12),
        [generalNews]
    );

    const sliderList = useMemo(
        () => sliderNews.filter(i => i.urlToImage).slice(0, 5),
        [sliderNews]
    );

    const trendingList = useMemo(
        () => trendingNews.filter(i => i.urlToImage).slice(0, 5),
        [trendingNews]
    );

    const listData: ListItem[] = useMemo(() => {
        const result: ListItem[] = [];

        result.push({ type: "trending" });

        topNewsList.forEach(article =>
            result.push({ type: "article", article })
        );

        result.push({ type: "slider" });

        bottomNewsList.forEach(article =>
            result.push({ type: "article", article })
        );

        return result;
    }, [topNewsList, bottomNewsList]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <HomeNavbar />

            <CategoryTabs
                categories={categories}
                activeKey={activeCategory}
                onChange={handleCategoryChange}
            />

            <FlatList
                data={listData}
                keyExtractor={(_, i) => String(i)}
                contentContainerStyle={{ paddingTop: 12 }}
                renderItem={({ item }) => {
                    switch (item.type) {
                        case "trending":
                            return <TrendingSlider />;

                        case "slider":
                            return (
                                <NewsImageSlider
                                    data={sliderList}
                                    onPress={() => { }}
                                />
                            );

                        case "article":
                            return (
                                <Card
                                    item={item.article}
                                    onPress={() => { }}
                                    onFavoritePress={() => { }}
                                />
                            );
                    }
                }}
            />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
});