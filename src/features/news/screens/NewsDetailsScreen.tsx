import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Fonts, FontSizes } from "../../../constants/constants";
import { useFavorites } from "../../../context/FavoritesContext";

export default function NewsDetailsScreen() {
  const { title, description, image, source, publishedAt, content, url } =
    useLocalSearchParams();

  const { isFavorite, toggleFavorite } = useFavorites();

  const article = {
    title: String(title || ""),
    description: String(description || ""),
    content: String(content || ""),
    urlToImage: String(image || ""),
    source: {
      name: String(source || ""),
    },
    publishedAt: String(publishedAt || ""),
    url: String(url || ""),
  };

  const saved = isFavorite(article);

  const formattedDate = publishedAt
    ? new Date(String(publishedAt)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown date";

  const cleanText = (text: unknown) => {
    return String(text || "")
      .replace(/<[^>]*>/g, "")
      .replace(/\[\+\d+\schars\]/g, "")
      .trim();
  };

  const storyPreview =
    cleanText(content) ||
    cleanText(description) ||
    "No story preview available.";

  const handleOpenArticle = async () => {
    const articleUrl = String(url || "");

    if (!articleUrl) return;

    const canOpen = await Linking.canOpenURL(articleUrl);

    if (canOpen) {
      await Linking.openURL(articleUrl);
    }
  };

  const handleFavoritePress = () => {
    toggleFavorite(article);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>News Details</Text>

        <View style={styles.headerIconPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.newsCard}>
          {image ? (
            <Image source={{ uri: String(image) }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="newspaper-outline"
                size={42}
                color={Colors.gray}
              />
            </View>
          )}

          <View style={styles.cardContent}>
            <View style={styles.metaHeader}>
              <View style={styles.metaBox}>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="newspaper-outline"
                    size={16}
                    color={Colors.secondary}
                  />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {String(source || "News Source")}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={Colors.secondary}
                  />
                  <Text style={styles.metaText}>{formattedDate}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.favoriteButton,
                  saved && styles.favoriteButtonActive,
                ]}
                onPress={handleFavoritePress}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={saved ? "heart" : "heart-outline"}
                  size={24}
                  color={saved ? "#E63946" : "#97A2AE"}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>
              {String(title || "No title available")}
            </Text>

            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>Description</Text>
              <Text style={styles.sectionText}>
                {String(description || "No description available.")}
              </Text>
            </View>

            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>Article Preview</Text>
              <Text style={styles.sectionText} numberOfLines={4}>
                {storyPreview}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.readButton}
              onPress={handleOpenArticle}
              activeOpacity={0.85}
            >
              <Text style={styles.readButtonText}>Continue Reading</Text>
              <Ionicons name="open-outline" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    height: 96,
    paddingTop: 48,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
  },

  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  headerIconPlaceholder: {
    width: 42,
    height: 42,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: FontSizes.subheading,
    fontFamily: Fonts.heading,
    color: Colors.primary,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },

  newsCard: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: Colors.white,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  image: {
    width: "100%",
    height: 250,
    backgroundColor: Colors.lightGray,
  },

  imagePlaceholder: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
  },

  cardContent: {
    padding: 20,
  },

  metaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
    gap: 12,
  },

  metaBox: {
    flex: 1,
    gap: 9,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  metaText: {
    flex: 1,
    fontSize: FontSizes.small,
    fontFamily: Fonts.body,
    color: Colors.secondary,
  },

  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F7F9",
    justifyContent: "center",
    alignItems: "center",
  },

  favoriteButtonActive: {
    backgroundColor: "#FCEEEF",
  },

  title: {
    fontSize: 25,
    lineHeight: 36,
    fontFamily: Fonts.heading,
    color: Colors.primary,
    marginBottom: 20,
  },

  sectionBox: {
    padding: 15,
    borderRadius: 18,
    backgroundColor: "#F7F9FC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
  },

  sectionLabel: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.heading,
    color: Colors.primary,
    marginBottom: 8,
  },

  sectionText: {
    fontSize: FontSizes.body,
    lineHeight: 24,
    fontFamily: Fonts.body,
    color: Colors.black,
  },

  readButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  readButtonText: {
    fontSize: FontSizes.body,
    fontFamily: Fonts.heading,
    color: Colors.white,
  },
});
