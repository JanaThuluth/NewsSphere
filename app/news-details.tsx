import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function NewsDetails() {
    const { article } = useLocalSearchParams();

    const data = JSON.parse(article as string);

    return (
        <View>
            <Text>{data.title}</Text>
        </View>
    );
}