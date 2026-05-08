import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export type SavedArticle = {
  id?: string;
  title: string;
  description?: string | null;
  content?: string | null;
  urlToImage?: string | null;
  image?: string | null;
  url?: string;
  publishedAt?: string;
  source?: {
    name?: string;
  };
  [key: string]: any;
};

export const getArticleId = (article: SavedArticle) => {
  const raw = article.url || article.title;

  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }

  return `article_${Math.abs(hash).toString(36)}`;
};

const getSavedArticleRef = (userId: string, article: SavedArticle) => {
  const articleId = getArticleId(article);

  return doc(db, "users", userId, "savedArticles", articleId);
};

export const getSavedArticles = async (userId: string) => {
  const savedRef = collection(db, "users", userId, "savedArticles");
  const snapshot = await getDocs(savedRef);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as SavedArticle[];
};

export const saveArticle = async (userId: string, article: SavedArticle) => {
  const articleId = getArticleId(article);
  const articleRef = getSavedArticleRef(userId, article);

  await setDoc(articleRef, {
    ...article,
    id: articleId,
    savedAt: serverTimestamp(),
  });
};

export const removeSavedArticle = async (
  userId: string,
  article: SavedArticle
) => {
  const articleRef = getSavedArticleRef(userId, article);

  await deleteDoc(articleRef);
};