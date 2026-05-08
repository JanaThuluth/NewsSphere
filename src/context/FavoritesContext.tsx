import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";
import {
  getArticleId,
  getSavedArticles,
  removeSavedArticle,
  saveArticle,
  SavedArticle,
} from "../features/saved/storage";

export type Article = SavedArticle;

type FavoritesContextType = {
  favorites: Article[];
  loading: boolean;
  isFavorite: (article: Article) => boolean;
  toggleFavorite: (article: Article) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();

  const [favorites, setFavorites] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      if (authLoading) return;

      if (!user) {
        setFavorites([]);
        return;
      }

      try {
        setLoading(true);

        const savedArticles = await getSavedArticles(user.uid);
        setFavorites(savedArticles);
      } catch (error) {
        console.log("Error loading saved articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, authLoading]);

  const isFavorite = (article: Article) => {
    const articleId = getArticleId(article);

    return favorites.some((fav) => getArticleId(fav) === articleId);
  };

  const toggleFavorite = async (article: Article) => {
    if (!user) {
      Alert.alert("Login required", "Please login to save articles.");
      return;
    }

    const articleId = getArticleId(article);

    const alreadyFavorite = favorites.some(
      (fav) => getArticleId(fav) === articleId
    );

    try {
      if (alreadyFavorite) {
        setFavorites((prev) =>
          prev.filter((fav) => getArticleId(fav) !== articleId)
        );

        await removeSavedArticle(user.uid, article);
      } else {
        setFavorites((prev) => [...prev, article]);

        await saveArticle(user.uid, article);
      }
    } catch (error) {
      console.log("Error toggling favorite:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
};