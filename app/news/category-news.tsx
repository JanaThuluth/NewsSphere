import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getNewsByCategory } from "../../src/api/newsApi";
import Card from "../../src/components/ui/Card";
import HomeNavbar from "../../src/components/ui/HomeNavbar";
import SectionHeader from "../../src/components/ui/SectionHeader";
import { Colors, Fonts, FontSizes } from "../../src/constants/constants";

type Article = {
  title: string;
  description?: string | null;
  urlToImage: string | null;
  source?: {
    name?: string;
  };
  [key: string]: any;
};

const categoryLabels: Record<string, string> = {
  technology: "Technology",
  sports: "Sports",
  business: "Business",
  science: "Science",
  health: "Health",
};

export default function CategoryNews() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();

  const selectedCategory = typeof category === "string" ? category : "general";

  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getNewsByCategory(selectedCategory);
        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Something went wrong while fetching category news");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews();
  }, [selectedCategory]);

  const handleArticlePress = (item: Article) => {
    router.push({
      pathname: "/news/news-details" as any,
      params: {
        article: JSON.stringify(item),
      },
    });
  };

  const handleFavoritePress = (item: Article) => {
    console.log("Favorite:", item);
  };

  if (loading) {
    return (
      <View style={styles.root}>
        <HomeNavbar />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.message}>Loading news...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.root}>
        <HomeNavbar />
        <View style={styles.center}>
          <Text style={styles.message}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HomeNavbar />

      <FlatList
        data={news.filter((item) => item.urlToImage)}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <Card
              item={item}
              onPress={handleArticlePress}
              onFavoritePress={handleFavoritePress}
            />
          </View>
        )}
        ListHeaderComponent={
          <SectionHeader
            title={categoryLabels[selectedCategory] || "Category News"}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.message}>No news found for this category.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingTop: 14,
    paddingBottom: 90,
  },
  cardWrapper: {
    paddingHorizontal: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    paddingBottom: 100,
  },
  message: {
    marginTop: 12,
    fontSize: FontSizes.body,
    fontFamily: Fonts.body,
    color: Colors.gray,
    textAlign: "center",
  },
});
