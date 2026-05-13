import NetInfo from "@react-native-community/netinfo";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import { auth } from "../../../lib/firebase";
import { createNotification } from "../../notification/notificationService";
import { getTopHeadlines, searchNews } from "../api/newsApi";

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

export type Article = {
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

export type Category = {
  key: string;
  label: string;
};

export type ListItem =
  | { type: "trending" }
  | { type: "slider" }
  | { type: "article"; article: Article };

export const homeCategories: Category[] = [
  { key: "all", label: "All" },
  { key: "politics", label: "Politics" },
  { key: "sports", label: "Sports" },
  { key: "economy", label: "Economy" },
  { key: "science", label: "Science" },
  { key: "health", label: "Health" },
];

const GENERAL_NEWS_QUERY =
  "world OR business OR politics OR science OR health OR sports";

const TRENDING_NEWS_QUERY = "technology OR sports OR health";

export const useHomeNews = () => {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [trendingNews, setTrendingNews] = useState<Article[]>([]);
  const [generalNews, setGeneralNews] = useState<Article[]>([]);
  const [sliderNews, setSliderNews] = useState<Article[]>([]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [isOnline, setIsOnline] = useState(true);

  const saveNewsSection = useCallback(
    async (articles: Article[], section: string, category: string) => {
      const localNews = articles.map((article) =>
        mapArticleToLocalNews(article, section, category),
      );

      await clearNewsBySection(section);
      await insertNews(localNews);
    },
    [],
  );

  const saveCategoryNews = useCallback(
    async (articles: Article[], category: string) => {
      const localNews = articles.map((article) =>
        mapArticleToLocalNews(article, "category", category),
      );

      await clearNewsByCategory(category);
      await insertNews(localNews);
    },
    [],
  );

  const loadNewsFromSQLite = useCallback(async () => {
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
  }, []);

  const createRandomNewsNotification = useCallback(
    async (allNews: Article[]) => {
      if (!auth.currentUser) return;

      const availableNews = allNews.filter(
        (article) => article.title && article.urlToImage,
      );

      if (availableNews.length === 0) return;

      const randomIndex = Math.floor(Math.random() * availableNews.length);
      const randomNews = availableNews[randomIndex];

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
    },
    [queryClient],
  );

  const loadHomeNews = useCallback(async () => {
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
        searchNews({ q: TRENDING_NEWS_QUERY }),
        searchNews({ q: GENERAL_NEWS_QUERY }),
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
  }, [createRandomNewsNotification, loadNewsFromSQLite, saveNewsSection]);

  const handleCategoryChange = useCallback(
    async (key: string) => {
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

        const query = key === "all" ? GENERAL_NEWS_QUERY : key;

        const data = await searchNews({ q: query });
        const categoryData = Array.isArray(data) ? data : [];

        setGeneralNews(categoryData);

        if (key === "all") {
          await saveNewsSection(categoryData, "general", "all");
        } else {
          await saveCategoryNews(categoryData, key);
        }
      } catch (error) {
        console.log(
          "API category failed, loading category from SQLite:",
          error,
        );

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
    },
    [saveCategoryNews, saveNewsSection],
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(!!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadHomeNews();
  }, [loadHomeNews]);

  const topNewsList = useMemo(
    () => generalNews.filter((item) => item.urlToImage).slice(0, 6),
    [generalNews],
  );

  const bottomNewsList = useMemo(
    () => generalNews.filter((item) => item.urlToImage).slice(6, 12),
    [generalNews],
  );

  const sliderList = useMemo(
    () => sliderNews.filter((item) => item.urlToImage).slice(0, 5),
    [sliderNews],
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

  return {
    loading,
    categoryLoading,
    activeCategory,
    isOnline,
    sliderList,
    listData,
    categories: homeCategories,
    handleCategoryChange,
  };
};
