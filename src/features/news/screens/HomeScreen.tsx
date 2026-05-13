import CategoryTabs from "../components/CategoryTabs";
import { useTheme } from "@/src/constants/ThemeContext";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Card from "../components/Card";
import HomeNavbar from "../components/HomeNavbar";
import NewsImageSlider from "../components/NewsImageSlider";
import TrendingSlider from "../components/TrendingSlider";
import { Article, ListItem, useHomeNews } from "../hooks/useHomeNews";

const HomeScreen = () => {
  const { theme, isDark } = useTheme();

  const {
    loading,
    categoryLoading,
    activeCategory,
    isOnline,
    sliderList,
    listData,
    categories,
    handleCategoryChange,
  } = useHomeNews();

  const styles = createStyles(theme);

  const handleArticlePress = useCallback((item: Article) => {
    router.push({
      pathname: "/news/news-details",
      params: {
        title: item.title,
        description: item.description ?? "",
        image: item.urlToImage ?? "",
        source: item.source?.name ?? "",
        publishedAt: item.publishedAt ?? "",
        content: item.content ?? "",
        url: item.url ?? "",
      },
    });
  }, []);

  const renderNewsItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "trending") {
        return <TrendingSlider />;
      }

      if (item.type === "slider") {
        return (
          <NewsImageSlider data={sliderList} onPress={handleArticlePress} />
        );
      }

      return (
        <Card
          item={item.article}
          onPress={() => handleArticlePress(item.article)}
        />
      );
    },
    [handleArticlePress, sliderList]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HomeNavbar />

      {!isOnline && (
        <View
          style={[
            styles.offlineBanner,
            { backgroundColor: isDark ? "#000000" : "#eeeeee" },
          ]}
        >
          <Text
            style={[
              styles.offlineText,
              { color: isDark ? "#FFFFFF" : "#000000" },
            ]}
          >
            You are offline. Showing saved news.
          </Text>
        </View>
      )}

      <CategoryTabs
        categories={categories}
        activeKey={activeCategory}
        onChange={handleCategoryChange}
      />

      {categoryLoading && (
        <View style={styles.categoryLoader}>
          <ActivityIndicator size="small" color={theme.primary} />
        </View>
      )}

      <FlatList
        data={listData}
        keyExtractor={(item, index) =>
          item.type === "article"
            ? `${item.article.title}-${index}`
            : `${item.type}-${index}`
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={renderNewsItem}
      />
    </View>
  );
};

export default HomeScreen;

const createStyles = (theme: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },

    list: {
      paddingTop: 14,
      paddingBottom: 80,
    },

    categoryLoader: {
      paddingVertical: 8,
      alignItems: "center",
    },

    offlineBanner: {
      paddingVertical: 8,
      alignItems: "center",
      backgroundColor: "#eeeeee",
    },

    offlineText: {
      fontSize: 13,
      color: theme.black,
    },
  });