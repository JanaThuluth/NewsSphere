import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Colors, Fonts } from "../../constants/constants";

type Props = {
    onSearchPress?: () => void;
    onAccountPress?: () => void;
};

const HomeNavbar: React.FC<Props> = ({ onSearchPress, onAccountPress }) => {
    return (
        <View style={styles.wrapper}>
            <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

            <View style={styles.navbar}>
                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={onAccountPress}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="person-circle-outline" size={28} color={Colors.white} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/HomePage")}>
                    <Text style={styles.logoText}>NewsSphere</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={onSearchPress}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="search-outline" size={26} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeNavbar;

const STATUSBAR_HEIGHT =
    Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.primary,
        paddingTop: STATUSBAR_HEIGHT,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 6,
    },
    navbar: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        height: 58,
    },
    iconBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    logoWrap: {
        flex: 1,
        alignItems: "center",
    },
    logoText: {
        fontSize: 22,
        color: Colors.white,
        fontFamily: Fonts.heading,
        letterSpacing: 1.5,
    },
});