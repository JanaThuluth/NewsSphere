import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors, Fonts } from "../../constants/constants";

type Article = {
    title: string;
    description?: string | null;
    urlToImage: string | null;
    source?: {
        name?: string;
    };
    [key: string]: any;
};

type Props = {
    item: Article;
    onPress: (item: Article) => void;
    onFavoritePress?: (item: Article) => void;
    isFavoriteInitial?: boolean;
};

const Card: React.FC<Props> = ({ item, onPress, onFavoritePress, isFavoriteInitial = false }) => {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);

    const handlePress = () => {
        router.push({
            pathname: "/HomePage",
            params: { id: item.id, title: item.title }
        });
        onPress(item);
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        onFavoritePress?.(item);
    };

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={handlePress}
        >
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={3}>
                    {item.title}
                </Text>

                <Text style={styles.meta} numberOfLines={1}>
                    {item.source?.name || "News Source"}
                </Text>

                <Text style={styles.description} numberOfLines={2}>
                    {item.description || "No description available"}
                </Text>

                <TouchableOpacity
                    style={styles.favoriteCircle}
                    activeOpacity={0.7}
                    onPress={toggleFavorite}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={22}
                        color={isFavorite ? Colors.red : Colors.gray}
                    />
                </TouchableOpacity>
            </View>

            <Image
                source={{
                    uri: item.urlToImage || "https://via.placeholder.com/300",
                }}
                style={styles.image}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );
};

export default Card;

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 18,
        padding: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    content: {
        flex: 1,
        paddingRight: 12,
    },
    title: {
        fontSize: 17,
        lineHeight: 24,
        fontFamily: Fonts.heading,
        color: Colors.primary,
        marginBottom: 4,
    },
    meta: {
        fontSize: 12,
        fontFamily: Fonts.body,
        color: Colors.gray,
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: Fonts.body,
        color: Colors.gray,
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 14,
        backgroundColor: Colors.lightGray,
    },
    favoriteCircle: {
        alignSelf: "flex-start",
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
});
