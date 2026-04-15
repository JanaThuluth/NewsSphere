import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors, Fonts } from "../../constants/constants";

type Category = {
    key: string;
    label: string;
};

type Props = {
    categories: Category[];
    activeKey: string;
    onChange?: (key: string) => void;
    isSticky?: boolean;
};

const CategoryTabs: React.FC<Props> = ({
    categories,
    activeKey,
    onChange,
    isSticky = false,
}) => {
    return (
        <View
            style={[
                styles.container,
                !isSticky && styles.normalContainer,
                isSticky && styles.stickyContainer,
            ]}
        >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.tabsRow,
                    isSticky && styles.stickyRow,
                ]}
            >
                {categories.map((item) => {
                    const isActive = activeKey === item.key;

                    return (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => onChange?.(item.key)}
                            activeOpacity={0.8}
                            style={[
                                styles.tab,
                                isActive && styles.activeTab,
                            ]}
                        >
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.text,
                                    isActive && styles.activeText,
                                ]}
                            >
                                {item.label}
                            </Text>

                            <View
                                style={[
                                    styles.underline,
                                    isActive && styles.activeUnderline,
                                ]}
                            />
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default CategoryTabs;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
        zIndex: 999,
        elevation: 8,
        overflow: "hidden",
    },

    normalContainer: {
        marginHorizontal: 14,
        marginBottom: 10,
        borderRadius: 15,
    },

    stickyContainer: {
        marginHorizontal: 0,
        marginBottom: 10,
        borderRadius: 0,
        paddingTop: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 12,
    },

    tabsRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    stickyRow: {
        paddingHorizontal: 14,
    },

    tab: {
        minHeight: 42,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        marginHorizontal: 6,
    },

    activeTab: {
        backgroundColor: Colors.primary + "18",
    },

    text: {
        fontSize: 15,
        fontFamily: Fonts.heading,
        color: "#222",
        textAlign: "center",
        flexShrink: 0,
    },

    activeText: {
        color: Colors.primary,
        fontWeight: "900",
    },

    underline: {
        marginTop: 7,
        width: 34,
        height: 3,
        borderRadius: 999,
        backgroundColor: "transparent",
    },

    activeUnderline: {
        backgroundColor: Colors.primary,
    },
});