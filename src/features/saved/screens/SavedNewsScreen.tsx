import { Fonts } from "@/src/constants/constants";
import { useTheme } from "@/src/constants/ThemeContext";
import Card from "@/src/features/news/components/Card";
import { useSavedNews } from "@/src/features/saved/hooks/useSavedNews";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SavedNews() {
  const { favorites, isLoading, isLoggedIn, hasSavedArticles } = useSavedNews();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

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
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.headerWrapper,
          {
            paddingTop: insets.top,
            backgroundColor: theme.primary,
          },
        ]}
      >
        <StatusBar backgroundColor={theme.primary} barStyle="light-content" />

        <View style={styles.navbar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.navButton}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Saved News</Text>

          <View style={styles.navButton} />
        </View>
      </View>

      {!isLoggedIn ? (
        <View style={[styles.center, { backgroundColor: theme.background }]}>
          <Ionicons name="person-outline" size={44} color={theme.secondary} />

          <Text style={[styles.emptyTitle, { color: theme.primary }]}>
            Login Required
          </Text>

          <Text style={[styles.emptyText, { color: theme.gray }]}>
            Please login to view your saved news.
          </Text>
        </View>
      ) : !hasSavedArticles ? (
        <View style={[styles.center, { backgroundColor: theme.background }]}>
          <Ionicons name="bookmark-outline" size={48} color={theme.secondary} />

          <Text style={[styles.emptyTitle, { color: theme.primary }]}>
            No Saved News Yet
          </Text>

          <Text style={[styles.emptyText, { color: theme.gray }]}>
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
  },

  headerWrapper: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },

  navbar: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  navButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: Fonts.heading,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  list: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 90,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 20,
    fontFamily: Fonts.heading,
    textAlign: "center",
    fontWeight: "bold",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: Fonts.body,
    textAlign: "center",
    lineHeight: 22,
  },
});
