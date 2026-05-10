import CategoryTabs from "@/src/components/ui/CategoryTabs";
import { useTheme } from "@/src/constants/ThemeContext";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { getTopHeadlines, searchNews } from "../../../api/newsApi";
import Card from "../../../components/ui/Card";
import HomeNavbar from "../../../components/ui/HomeNavbar";
import NewsImageSlider from "../../../components/ui/NewsImageSlider";
import TrendingSlider from "../../../components/ui/TrendingSlider";
import { auth } from "../../../lib/firebase";
import { createNotification } from "../../notification/notificationService";

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
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [trendingNews, setTrendingNews] = useState<Article[]>([]);
  const [generalNews, setGeneralNews] = useState<Article[]>([]);
  const [sliderNews, setSliderNews] = useState<Article[]>([]);

  const [activeCategory, setActiveCategory] = useState("all");
  const queryClient = useQueryClient();

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

        const sliderData = Array.isArray(top) ? top : [];
        const trendingData = Array.isArray(trending) ? trending : [];
        const generalData = Array.isArray(general) ? general : [];

        setSliderNews(sliderData);
        setTrendingNews(trendingData);
        setGeneralNews(generalData);

        if (auth.currentUser) {
          const allAvailableNews = [
            ...sliderData,
            ...trendingData,
            ...generalData,
          ].filter((n) => n.title && n.urlToImage);

          if (allAvailableNews.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * allAvailableNews.length
            );

            const randomNews = allAvailableNews[randomIndex];

            await createNotification({
              title: " Breaking: " + randomNews.title,
              description: randomNews.description || "",
              message:
                randomNews.description ||
                "Tap to read the full story and stay updated.",
              imageUrl: randomNews.urlToImage || "",
              articleId: randomNews.url || randomNews.title,
              sourceName: randomNews.source?.name || "News App",
              publishedAt:
                randomNews.publishedAt || new Date().toISOString(),
            });

            queryClient.invalidateQueries({
              queryKey: ["notifications"],
            });
          }
        }
      } catch (error) {
        console.log("Error loading home news:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

  const handleCategoryChange = async (key: string) => {
    setActiveCategory(key);

    try {
      setCategoryLoading(true);

      const query =
        key === "all"
          ? "world OR business OR politics OR science OR health OR sports"
          : key;

      const data = await searchNews({ q: query });

      setGeneralNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error loading category news:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const topNewsList = useMemo(() => {
    return generalNews.filter((item) => item.urlToImage).slice(0, 6);
  }, [generalNews]);

  const bottomNewsList = useMemo(() => {
    return generalNews.filter((item) => item.urlToImage).slice(6, 12);
  }, [generalNews]);

  const sliderList = useMemo(() => {
    return sliderNews.filter((item) => item.urlToImage).slice(0, 5);
  }, [sliderNews]);

  const listData = useMemo<ListItem[]>(() => {
    const result: ListItem[] = [];

    result.push({ type: "trending" });

    topNewsList.forEach((article) => {
      result.push({ type: "article", article });
    });

    result.push({ type: "slider" });

    bottomNewsList.forEach((article) => {
      result.push({ type: "article", article });
    });

    return result;
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
        keyExtractor={(item, index) => {
          if (item.type === "trending") return `trending-${index}`;
          if (item.type === "slider") return `slider-${index}`;
          return `article-${item.article.title}-${index}`;
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          switch (item.type) {
            case "trending":
              return <TrendingSlider />;

            case "slider":
              return (
                <NewsImageSlider
                  data={sliderList}
                  onPress={handleArticlePress}
                />
              );

            case "article":
              return (
                <Card
                  item={item.article}
                  onPress={() => handleArticlePress(item.article)}
                />
              );
          }
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
  });