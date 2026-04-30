import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Article = {
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

type FavoritesContextType = {
  favorites: Article[];
  isFavorite: (article: Article) => boolean;
  toggleFavorite: (article: Article) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const FAVORITES_KEY = "favorites_news";

const getArticleId = (article: Article) => {
  return article.url || article.title;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Article[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.log("Error loading favorites:", error);
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.log("Error saving favorites:", error);
      }
    };

    saveFavorites();
  }, [favorites]);

  const isFavorite = (article: Article) => {
    const articleId = getArticleId(article);

    return favorites.some((fav) => getArticleId(fav) === articleId);
  };

  const toggleFavorite = (article: Article) => {
    const articleId = getArticleId(article);

    setFavorites((prevFavorites) => {
      const alreadyFavorite = prevFavorites.some(
        (fav) => getArticleId(fav) === articleId
      );

      if (alreadyFavorite) {
        return prevFavorites.filter((fav) => getArticleId(fav) !== articleId);
      }

      return [...prevFavorites, article];
    });
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite }}
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