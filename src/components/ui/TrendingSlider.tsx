import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Fonts } from "../../constants/constants";

const { width } = Dimensions.get("window");

const data = [
    { id: "1", title: "Netflix Original: Stranger Things", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500" },
    { id: "2", title: "Apple TV+: For All Mankind", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500" },
    { id: "3", title: "Disney+ News: The Mandalorian", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500" },
    { id: "4", title: "Prime Video: The Rings of Power", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=500" },
    { id: "5", title: "HBO Max: House of the Dragon", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500" },
];

const TrendingSlider = () => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = currentIndex + 1;

            if (nextIndex >= data.length) {
                nextIndex = 0;
            }

            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });

            setCurrentIndex(nextIndex);
        }, 2000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / (width - 28));
                    setCurrentIndex(index);
                }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.overlay}>
                            <Text style={styles.title}>{item.title}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default TrendingSlider;

const styles = StyleSheet.create({
    container: {
        marginBottom: 18,
    },
    card: {
        width: width - 28,
        height: 160,
        marginLeft: 14,
        marginRight: 14,
        borderRadius: 14,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontFamily: Fonts.heading,
    },
});