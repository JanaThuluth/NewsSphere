import React from "react";
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors, Fonts, FontSizes } from "../../constants/constants";

const { width } = Dimensions.get("window");

type Article = {
    title: string;
    urlToImage: string | null;
    [key: string]: any;
};

type Props = {
    data: Article[];
    onPress: (item: Article) => void;
};

const NewsImageSlider: React.FC<Props> = ({ data, onPress }) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={width - 32 + 16}
                decelerationRate="fast"
                contentContainerStyle={styles.contentContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => onPress(item)}
                        style={styles.card}
                    >
                        <Image
                            source={{
                                uri: item.urlToImage || "https://via.placeholder.com/300",
                            }}
                            style={styles.image}
                            resizeMode="cover"
                        />

                        <View style={styles.overlay}>
                            <Text style={styles.title} numberOfLines={2}>
                                {item.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default NewsImageSlider;

const styles = StyleSheet.create({
    container: {
        marginBottom: 14,
    },

    contentContainer: {
        paddingHorizontal: 16,
    },

    card: {
        width: width - 32,
        height: 220,
        marginRight: 16,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: Colors.white,
    },

    image: {
        width: "100%",
        height: "100%",
        backgroundColor: Colors.lightGray,
    },

    overlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 14,
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    title: {
        color: Colors.white,
        fontSize: FontSizes.body,
        fontFamily: Fonts.heading,
        textAlign: "right",
        lineHeight: 22,
    },
});