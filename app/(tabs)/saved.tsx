import Card from "@/src/components/ui/Card";
import { Colors, Fonts } from "@/src/constants/constants";
import { useAuth } from "@/src/context/AuthContext";
import { useFavorites } from "@/src/context/FavoritesContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SavedNews() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();

  const isLoading = authLoading || favoritesLoading;

  const handleArticlePress = (item: any) => {
    router.push({
      pathname: "/news/news-details",
      params: {
        title: item.title,
        description: item.description ?? "",
        image: item.urlToImage ?? item.image ?? "",
        source: item.source?.name ?? "",
        publishedAt: item.publishedAt ?? "",
        content: item.content ?? "",
        url: item.url ?? "",
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Ionicons name="person-outline" size={44} color={Colors.secondary} />
        <Text style={styles.emptyTitle}>Login Required</Text>
        <Text style={styles.emptyText}>
          Please login to view your saved news.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved News</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.center}>
          <Ionicons
            name="bookmark-outline"
            size={48}
            color={Colors.secondary}
          />
          <Text style={styles.emptyTitle}>No Saved News Yet</Text>
          <Text style={styles.emptyText}>
            Tap the bookmark icon on any article to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) =>
            item.id || item.url || `${item.title}-${index}`
          }
          renderItem={({ item }) => (
            <Card item={item} onPress={() => handleArticlePress(item)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
  height: 110,
  paddingTop: 52,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: Colors.primary,
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading,
    color: Colors.white,
  },

  list: {
    paddingTop: 18,
    paddingBottom: 90,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 28,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 20,
    fontFamily: Fonts.heading,
    color: Colors.primary,
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: Fonts.body,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 22,
  },
});