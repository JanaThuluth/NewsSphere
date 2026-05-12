import { getDatabase } from "../../../database/db";

export type LocalNewsItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  section: string;
  date: string;
  source: string;
  url: string;
  content: string;
};

export const createNewsTable = async (): Promise<void> => {
  try {
    const db = await getDatabase();

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        category TEXT,
        section TEXT,
        date TEXT,
        source TEXT,
        url TEXT,
        content TEXT
      );
    `);
  } catch (error) {
    console.error("Error creating news table:", error);
    throw error;
  }
};

export const insertNews = async (newsList: LocalNewsItem[]): Promise<void> => {
  if (!newsList || newsList.length === 0) return;

  const db = await getDatabase();

  try {
    for (const item of newsList) {
      await db.runAsync(
        `
        INSERT OR REPLACE INTO news (
          id,
          title,
          description,
          image,
          category,
          section,
          date,
          source,
          url,
          content
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
        [
          item.id,
          item.title,
          item.description,
          item.image,
          item.category,
          item.section,
          item.date,
          item.source,
          item.url,
          item.content,
        ],
      );
    }
  } catch (error) {
    console.error("Error inserting news:", error);
    throw error;
  }
};

export const getNewsBySection = async (
  section: string,
): Promise<LocalNewsItem[]> => {
  try {
    const db = await getDatabase();

    const result = await db.getAllAsync<LocalNewsItem>(
      `
      SELECT
        id,
        title,
        description,
        image,
        category,
        section,
        date,
        source,
        url,
        content
      FROM news
      WHERE section = ?
      ORDER BY date DESC;
      `,
      [section],
    );

    return result;
  } catch (error) {
    console.error("Error getting news by section:", error);
    throw error;
  }
};

export const getNewsByCategory = async (
  category: string,
): Promise<LocalNewsItem[]> => {
  try {
    const db = await getDatabase();

    const result = await db.getAllAsync<LocalNewsItem>(
      `
      SELECT
        id,
        title,
        description,
        image,
        category,
        section,
        date,
        source,
        url,
        content
      FROM news
      WHERE category = ?
      ORDER BY date DESC;
      `,
      [category],
    );

    return result;
  } catch (error) {
    console.error("Error getting news by category:", error);
    throw error;
  }
};

export const clearNewsBySection = async (section: string): Promise<void> => {
  try {
    const db = await getDatabase();

    await db.runAsync("DELETE FROM news WHERE section = ?;", [section]);
  } catch (error) {
    console.error("Error clearing news by section:", error);
    throw error;
  }
};

export const clearNewsByCategory = async (
  category: string,
): Promise<void> => {
  try {
    const db = await getDatabase();

    await db.runAsync("DELETE FROM news WHERE category = ?;", [category]);
  } catch (error) {
    console.error("Error clearing news by category:", error);
    throw error;
  }
};

export const clearAllNews = async (): Promise<void> => {
  try {
    const db = await getDatabase();

    await db.runAsync("DELETE FROM news;");
  } catch (error) {
    console.error("Error clearing all news:", error);
    throw error;
  }
};

export const mapArticleToLocalNews = (
  article: any,
  section: string,
  category: string = "general",
): LocalNewsItem => {
  return {
    id: article.url || article.title,
    title: article.title || "No title",
    description: article.description || "",
    image: article.urlToImage || "",
    category,
    section,
    date: article.publishedAt || new Date().toISOString(),
    source: article.source?.name || "",
    url: article.url || "",
    content: article.content || "",
  };
};

export const mapLocalNewsToArticle = (item: LocalNewsItem): any => {
  return {
    title: item.title,
    description: item.description,
    urlToImage: item.image,
    source: {
      name: item.source,
    },
    publishedAt: item.date,
    content: item.content,
    url: item.url,
  };
};