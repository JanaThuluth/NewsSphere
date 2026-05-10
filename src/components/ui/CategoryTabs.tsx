import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../constants/ThemeContext";

type Category = {
  key: string;
  label: string;
};

type Props = {
  categories: Category[];
  activeKey: string;
  onChange: (key: string) => void;
};

const CategoryTabs = ({ categories, activeKey, onChange }: Props) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        {categories.map((category) => {
          const isActive = activeKey === category.key;

          return (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.tab,
                isActive && { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#E9EDF1" }
              ]}
              onPress={() => onChange(category.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isDark ? "#FFFFFF" : "#2F2F2F" },
                  isActive && { color: isDark ? "#FFFFFF" : "#163B56", fontWeight: "bold" }
                ]}
              >
                {category.label}
              </Text>

              {isActive && (
                <View style={[styles.activeLine, { backgroundColor: theme.primary }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoryTabs;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingTop: 8,
    paddingBottom: 9,
    borderBottomWidth: 1,
  },

  tabsContent: {
    paddingHorizontal: 18,
    alignItems: "center",
  },

  tab: {
    minWidth: 75,
    height: 50,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 14,
    borderRadius: 22,
    justifyContent: "space-between",
    alignItems: "center",
  },

  tabText: {
    fontSize: 16,
    fontFamily: "Tajawal_400Regular",
    marginTop: 4,
  },

  activeLine: {
    width: 52,
    height: 5,
    borderRadius: 8,
    marginBottom: 2,
  },
});