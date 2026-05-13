import { useAuth } from "../../../context/AuthContext";
import { useFavorites } from "../../../context/FavoritesContext";

export const useSavedNews = () => {
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();

  const isLoading = authLoading || favoritesLoading;
  const isLoggedIn = !!user;
  const hasSavedArticles = favorites.length > 0;

  return {
    user,
    favorites,
    isLoading,
    isLoggedIn,
    hasSavedArticles,
  };
};
