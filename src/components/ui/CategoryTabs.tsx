import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/constants";

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
  return (
    <View style={styles.wrapper}>
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
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onChange(category.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {category.label}
              </Text>

              {isActive && <View style={styles.activeLine} />}
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
    backgroundColor: Colors.white,
    paddingTop: 8,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E8EC",
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
  backgroundColor: "transparent",
},

  activeTab: {
    backgroundColor: "#E9EDF1",
  },

  tabText: {
    fontSize: 16,
    color: "#2F2F2F",
    fontFamily: "Tajawal_400Regular",
    marginTop: 4,
  },

  activeTabText: {
    color: "#163B56",
  },

  activeLine: {
    width: 52,
    height: 5,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    marginBottom: 2,
  },
});