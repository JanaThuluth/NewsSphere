import axios from "axios";
import { cacheUtils, dedupRequest } from "./cacheUtils";

const API_KEY = process.env.EXPO_PUBLIC_GUARDIAN_API_KEY;
const BASE_URL = "https://content.guardianapis.com/search";

const transformArticle = (article: any) => ({
  title: article.webTitle,
  description: article.fields?.trailText || null,
  urlToImage: article.fields?.thumbnail || null,
  url: article.webUrl,
  source: {
    name: article.sectionName || "The Guardian",
  },
  publishedAt: article.webPublicationDate,
});

export const getTopHeadlines = async () => {
  const cacheKey = "news_cache_top_headlines";

  try {
    const cached = await cacheUtils.getCacheData(cacheKey);
    if (cached) return cached;

    const data = await dedupRequest("topHeadlines", async () => {
      const res = await axios.get(BASE_URL, {
        params: {
          "api-key": API_KEY,
          "page-size": 10,
          "order-by": "newest",
          "show-fields": "thumbnail,trailText",
        },
      });

      return res.data.response.results.map(transformArticle);
    });

    await cacheUtils.setCacheData(cacheKey, data);
    return data;
  } catch (error: any) {
    console.log(" Top Headlines Error:", error.response?.status || error.message);

    return [];
  }
};

export const searchNews = async (params: any) => {
  const cacheKey = `news_cache_${JSON.stringify(params).slice(0, 40)}`;

  try {
    const cached = await cacheUtils.getCacheData(cacheKey);
    if (cached) return cached;

    const data = await dedupRequest(cacheKey, async () => {
      const res = await axios.get(BASE_URL, {
        params: {
          ...params,
          "api-key": API_KEY,
          "page-size": 8,
          "order-by": "newest",
          "show-fields": "thumbnail,trailText",
        },
      });

      return res.data.response.results.map(transformArticle);
    });

    await cacheUtils.setCacheData(cacheKey, data);
    return data;
  } catch (error: any) {
    console.log(" Search Error:", error.response?.status || error.message);
    return [];
  }
};

export const searchNewsByCategory = async (category: string) => {
  const sectionMap: Record<string, string> = {
    politics: "politics",
    sports: "sport",
    economy: "business",
    science: "science",
    health: "lifeandstyle",
  };

  const section = sectionMap[category] || category;

  return searchNews({ section });
};

const createThrottledFunction = (fn: any, delay = 1000) => {
  let lastCall = 0;

  return async (...args: any[]) => {
    const now = Date.now();

    if (now - lastCall < delay) {
      await new Promise((r) =>
        setTimeout(r, delay - (now - lastCall))
      );
    }

    lastCall = Date.now();
    return fn(...args);
  };
};

export const searchNewsByCategoryThrottled = createThrottledFunction(
  searchNewsByCategory,
  2000
);