import React from "react";
import {
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
            <View style={[styles.tabsRow, isSticky && styles.stickyRow]}>
                {categories.map((item) => {
                    const isActive = activeKey === item.key;

                    return (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => onChange?.(item.key)}
                            activeOpacity={0.8}
                            style={[styles.tab, isActive && styles.activeTab]}
                        >
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
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
            </View>
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
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 10,
    },

    stickyRow: {
        paddingTop: 2,
        paddingHorizontal: 14,
    },

    tab: {
        flex: 1,
        minHeight: 42,
        paddingHorizontal: 8,
        paddingTop: 10,
        paddingBottom: 8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        marginHorizontal: 2,
    },

    activeTab: {
        backgroundColor: Colors.primary + "18",
    },

    text: {
        fontSize: 16,
        fontFamily: Fonts.heading,
        color: "#222",
        textAlign: "center",
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