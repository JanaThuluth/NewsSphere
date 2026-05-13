import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../constants/ThemeContext";
import { useFavorites } from "../../../context/FavoritesContext";

type Article = {
  title: string;
  description?: string | null;
  content?: string | null;
  url?: string;
  urlToImage?: string | null;
  source?: {
    name?: string;
  };
};

type Props = {
  item: Article;
  onPress: () => void;
};

const cleanText = (text?: string | null) => {
  if (!text) return "";

  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\[\+\d+\schars\]/g, "")
    .trim();
};

const getPreviewText = (item: Article) => {
  const text = cleanText(item.description || item.content || "");

  if (!text) return "No description available";

  return text;
};

const Card = ({ item, onPress }: Props) => {
  const preview = getPreviewText(item);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { theme } = useTheme();

  const saved = isFavorite(item);

  const handleFavoritePress = () => {
    toggleFavorite(item);
  };

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.white }]}
      onPress={onPress}
    >
      <View style={styles.contentRow}>
        <View style={styles.leftContent}>
          <Text numberOfLines={2} style={[styles.title, { color: theme.primary }]}>
            {item.title}
          </Text>

          <Text numberOfLines={1} style={[styles.source, { color: theme.gray }]}>
            {item.source?.name || "Business"}
          </Text>

          <Text numberOfLines={2} style={[styles.description, { color: theme.gray }]}>
            {preview}
          </Text>

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              { backgroundColor: theme.lightGray },
              saved && { backgroundColor: theme.secondary + '20' },
            ]}
            onPress={handleFavoritePress}
            activeOpacity={0.8}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={23}
              color={saved ? theme.primary : theme.gray}
            />
          </TouchableOpacity>
        </View>

        <Image
          source={{
            uri:
              item.urlToImage ||
              "https://via.placeholder.com/300x300.png?text=News",
          }}
          style={[styles.image, { backgroundColor: theme.lightGray }]}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 17,
    borderRadius: 26,
    padding: 13,
    minHeight: 145,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  leftContent: {
    flex: 1,
    paddingRight: 14,
    minHeight: 85,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "Cairo_400Regular",
    marginBottom: 5,
  },

  source: {
    fontSize: 13,
    fontFamily: "Tajawal_400Regular",
    marginBottom: 5,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Tajawal_400Regular",
    marginBottom: 8,
  },

  image: {
    width: 125,
    height: 120,
    borderRadius: 22,
    marginTop: 6,
  },

  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
});