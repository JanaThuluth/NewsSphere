import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Fonts } from "../../constants/constants";

type Props = {
    title: string;
};

const SectionHeader: React.FC<Props> = ({ title }) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.line} />
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    );
};

export default SectionHeader;

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "flex-start",
        marginBottom: 12,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: Colors.secondary,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginLeft: 17,
    },
    line: {
        width: 4,
        height: 20,
        borderRadius: 4,
        backgroundColor: Colors.primary,
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.heading,
        color: Colors.white,
    },
});