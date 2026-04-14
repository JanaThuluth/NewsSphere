import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

export const getTopHeadlines = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        country: "us",
        apiKey: API_KEY,
      },
    });

    return response.data.articles;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchNews = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: query,
        sortBy: "publishedAt",
        language: "en",
        apiKey: API_KEY,
      },
    });

    return response.data.articles;
  } catch (error) {
    console.error(error);
    return [];
  }
};