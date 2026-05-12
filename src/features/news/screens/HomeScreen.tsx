import CategoryTabs from "@/src/components/ui/CategoryTabs";
import { useTheme } from "@/src/constants/ThemeContext";
import NetInfo from "@react-native-community/netinfo";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getTopHeadlines, searchNews } from "../../../api/newsApi";
import Card from "../../../components/ui/Card";
import HomeNavbar from "../../../components/ui/HomeNavbar";
import NewsImageSlider from "../../../components/ui/NewsImageSlider";
import TrendingSlider from "../../../components/ui/TrendingSlider";
import { auth } from "../../../lib/firebase";
import { createNotification } from "../../notification/notificationService";

import {
  clearNewsByCategory,
  clearNewsBySection,
  createNewsTable,
  getNewsByCategory,
  getNewsBySection,
  insertNews,
  mapArticleToLocalNews,
  mapLocalNewsToArticle,
} from "../database/newsDb";

type Article = {
  title: string;
  description?: string | null;
  urlToImage: string | null;
  source?: { name?: string };
  publishedAt?: string;
  content?: string | null;
  url?: string;
  [key: string]: any;
};

type Category = {
  key: string;
  label: string;
};

type ListItem =
  | { type: "trending" }
  | { type: "slider" }
  | { type: "article"; article: Article };

const categories: Category[] = [
  { key: "all", label: "All" },
  { key: "politics", label: "Politics" },
  { key: "sports", label: "Sports" },
  { key: "economy", label: "Economy" },
  { key: "science", label: "Science" },
  { key: "health", label: "Health" },
];

const HomeScreen = () => {
  const { theme, isDark } = useTheme();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [trendingNews, setTrendingNews] = useState<Article[]>([]);
  const [generalNews, setGeneralNews] = useState<Article[]>([]);
  const [sliderNews, setSliderNews] = useState<Article[]>([]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [isOnline, setIsOnline] = useState(true);

  const saveNewsSection = async (
    articles: Article[],
    section: string,
    category: string
  ) => {
    const localNews = articles.map((article) =>
      mapArticleToLocalNews(article, section, category)
    );

    await clearNewsBySection(section);
    await insertNews(localNews);
  };

  const saveCategoryNews = async (articles: Article[], category: string) => {
    const localNews = articles.map((article) =>
      mapArticleToLocalNews(article, "category", category)
    );

    await clearNewsByCategory(category);
    await insertNews(localNews);
  };

  const loadNewsFromSQLite = async () => {
    try {
      await createNewsTable();

      const [localSlider, localTrending, localGeneral] = await Promise.all([
        getNewsBySection("slider"),
        getNewsBySection("trending"),
        getNewsBySection("general"),
      ]);

      setSliderNews(localSlider.map(mapLocalNewsToArticle));
      setTrendingNews(localTrending.map(mapLocalNewsToArticle));
      setGeneralNews(localGeneral.map(mapLocalNewsToArticle));
    } catch (localError) {
      console.log("Error loading local news:", localError);
    }
  };

  const createRandomNewsNotification = async (allNews: Article[]) => {
    if (!auth.currentUser) return;

    const allAvailableNews = allNews.filter((n) => n.title && n.urlToImage);

    if (allAvailableNews.length === 0) return;

    const randomIndex = Math.floor(Math.random() * allAvailableNews.length);
    const randomNews = allAvailableNews[randomIndex];

    await createNotification({
      title: "Breaking: " + randomNews.title,
      description: randomNews.description || "",
      message: randomNews.description || "Tap to read more",
      imageUrl: randomNews.urlToImage || "",
      articleId: randomNews.url || randomNews.title,
      sourceName: randomNews.source?.name || "News App",
      publishedAt: randomNews.publishedAt || new Date().toISOString(),
    });

    queryClient.invalidateQueries({
      queryKey: ["notifications"],
    });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = !!state.isConnected;
      setIsOnline(connected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        await createNewsTable();

        const state = await NetInfo.fetch();

        if (!state.isConnected) {
          console.log("No internet, loading news from SQLite");
          await loadNewsFromSQLite();
          return;
        }

        const [top, trending, general] = await Promise.all([
          getTopHeadlines(),
          searchNews({ q: "technology OR sports OR health" }),
          searchNews({
            q: "world OR business OR politics OR science OR health OR sports",
          }),
        ]);

        const sliderData = Array.isArray(top) ? top : [];
        const trendingData = Array.isArray(trending) ? trending : [];
        const generalData = Array.isArray(general) ? general : [];

        setSliderNews(sliderData);
        setTrendingNews(trendingData);
        setGeneralNews(generalData);

        await saveNewsSection(sliderData, "slider", "top");
        await saveNewsSection(trendingData, "trending", "trending");
        await saveNewsSection(generalData, "general", "all");

        await createRandomNewsNotification([
          ...sliderData,
          ...trendingData,
          ...generalData,
        ]);
      } catch (error) {
        console.log("API failed, loading news from SQLite:", error);
        await loadNewsFromSQLite();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleCategoryChange = async (key: string) => {
    setActiveCategory(key);

    try {
      setCategoryLoading(true);

      await createNewsTable();

      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        const fallback =
          key === "all"
            ? await getNewsBySection("general")
            : await getNewsByCategory(key);

        setGeneralNews(fallback.map(mapLocalNewsToArticle));
        return;
      }

      const query =
        key === "all"
          ? "world OR business OR politics OR science OR health OR sports"
          : key;

      const data = await searchNews({ q: query });
      const categoryData = Array.isArray(data) ? data : [];

      setGeneralNews(categoryData);

      if (key === "all") {
        await saveNewsSection(categoryData, "general", "all");
      } else {
        await saveCategoryNews(categoryData, key);
      }
    } catch (error) {
      console.log("API category failed, loading category from SQLite:", error);

      try {
        const fallback =
          key === "all"
            ? await getNewsBySection("general")
            : await getNewsByCategory(key);

        setGeneralNews(fallback.map(mapLocalNewsToArticle));
      } catch (localError) {
        console.log("Error loading local category news:", localError);
      }
    } finally {
      setCategoryLoading(false);
    }
  };

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

  const topNewsList = useMemo(
    () => generalNews.filter((item) => item.urlToImage).slice(0, 6),
    [generalNews]
  );

  const bottomNewsList = useMemo(
    () => generalNews.filter((item) => item.urlToImage).slice(6, 12),
    [generalNews]
  );

  const sliderList = useMemo(
    () => sliderNews.filter((item) => item.urlToImage).slice(0, 5),
    [sliderNews]
  );

  const listData: ListItem[] = useMemo(() => {
    return [
      { type: "trending" as const },
      ...topNewsList.map((article) => ({
        type: "article" as const,
        article,
      })),
      { type: "slider" as const },
      ...bottomNewsList.map((article) => ({
        type: "article" as const,
        article,
      })),
    ];
  }, [topNewsList, bottomNewsList]);

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HomeNavbar />

      {!isOnline && (
        <View
          style={[
            styles.offlineBanner,
            { backgroundColor: isDark ? "#000000" : "#eeeeee" },
          ]}
        >
          <Text
            style={[
              styles.offlineText,
              { color: isDark ? "#FFFFFF" : "#000000" },
            ]}
          >
            You are offline. Showing saved news.
          </Text>
        </View>
      )}

      <CategoryTabs
        categories={categories}
        activeKey={activeCategory}
        onChange={handleCategoryChange}
      />

      {categoryLoading && (
        <View style={styles.categoryLoader}>
          <ActivityIndicator size="small" color={theme.primary} />
        </View>
      )}

      <FlatList
        data={listData}
        keyExtractor={(item, index) =>
          item.type === "article"
            ? `${item.article.title}-${index}`
            : `${item.type}-${index}`
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.type === "trending") {
            return <TrendingSlider />;
          }

          if (item.type === "slider") {
            return (
              <NewsImageSlider
                data={sliderList}
                onPress={handleArticlePress}
              />
            );
          }

          return (
            <Card
              item={item.article}
              onPress={() => handleArticlePress(item.article)}
            />
          );
        }}
      />
    </View>
  );
};

export default HomeScreen;

const createStyles = (theme: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },

    list: {
      paddingTop: 14,
      paddingBottom: 80,
    },

    categoryLoader: {
      paddingVertical: 8,
      alignItems: "center",
    },

    offlineBanner: {
      paddingVertical: 8,
      alignItems: "center",
      backgroundColor: "#eeeeee",
    },

    offlineText: {
      fontSize: 13,
      color: theme.black,
    },
  });