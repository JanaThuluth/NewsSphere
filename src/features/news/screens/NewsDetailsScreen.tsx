import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Fonts, FontSizes } from "../../../constants/constants";
import { useTheme } from "../../../constants/ThemeContext";
import { useFavorites } from "../../../context/FavoritesContext";

export default function NewsDetailsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

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

  const styles = createStyles(theme);

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.headerWrapper,
          {
            paddingTop: insets.top,
            backgroundColor: theme.primary,
          },
        ]}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.primary}
        />

        <View style={styles.navbar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.navButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.navTitle}>News Details</Text>

          <View style={styles.navButton} />
        </View>
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
                color={theme.gray}
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
                    color={theme.secondary}
                  />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {String(source || "News Source")}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={theme.secondary}
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
                  name={saved ? "bookmark" : "bookmark-outline"}
                  size={24}
                  color={saved ? theme.primary : theme.gray}
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
              <Ionicons
                name="open-outline"
                size={18}
                color={theme.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
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

    navTitle: {
      fontSize: 20,
      color: "#FFFFFF",
      fontFamily: Fonts.heading,
      fontWeight: "bold",
      letterSpacing: 0.5,
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
      backgroundColor: theme.white,
      borderRadius: 28,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.border,
    },

    image: {
      width: "100%",
      height: 250,
      backgroundColor: theme.lightGray,
    },

    imagePlaceholder: {
      width: "100%",
      height: 250,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.lightGray,
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
      color: theme.secondary,
    },

    favoriteButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.lightGray,
      justifyContent: "center",
      alignItems: "center",
    },

    favoriteButtonActive: {
      backgroundColor: theme.background,
    },

    title: {
      fontSize: 25,
      lineHeight: 36,
      fontFamily: Fonts.heading,
      color: theme.primary,
      marginBottom: 20,
    },

    sectionBox: {
      padding: 15,
      borderRadius: 18,
      backgroundColor: theme.lightGray,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 14,
    },

    sectionLabel: {
      fontSize: FontSizes.small,
      fontFamily: Fonts.heading,
      color: theme.primary,
      marginBottom: 8,
    },

    sectionText: {
      fontSize: FontSizes.body,
      lineHeight: 24,
      fontFamily: Fonts.body,
      color: theme.black,
    },

    readButton: {
      marginTop: 8,
      height: 52,
      borderRadius: 18,
      backgroundColor: theme.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    readButtonText: {
      fontSize: FontSizes.body,
      fontFamily: Fonts.heading,
      color: theme.white,
    },
  });