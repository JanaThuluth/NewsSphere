import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Linking } from "react-native";
import AboutScreen from "../../app/about";

jest.mock("@expo/vector-icons", () => {
    return {
        MaterialCommunityIcons: () => null,
    };
});

const mockBack = jest.fn();

jest.mock("expo-router", () => ({
    useRouter: () => ({
        back: mockBack,
    }),
}));

jest.mock("react-native-safe-area-context", () => ({
    useSafeAreaInsets: () => ({
        top: 0,
    }),
}));

jest.mock("../../src/constants/ThemeContext", () => ({
    useTheme: () => ({
        theme: {
            background: "#fff",
            primary: "#000",
            white: "#fff",
            black: "#000",
            gray: "#888",
            border: "#ddd",
            lightGray: "#f5f5f5",
        },
    }),
}));

describe("AboutScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders app title and version", () => {
        render(<AboutScreen />);

        expect(screen.getByText("NewsHub")).toBeTruthy();
        expect(screen.getAllByText("v1.0.0").length).toBeGreaterThan(0);
    });

    it("renders about description", () => {
        render(<AboutScreen />);

        expect(
            screen.getByText(/A university project that aggregates news/i)
        ).toBeTruthy();
    });

    it("renders all features", () => {
        render(<AboutScreen />);

        expect(screen.getByText("Browse by Categories")).toBeTruthy();
        expect(screen.getByText("Search Articles")).toBeTruthy();
        expect(screen.getByText("Read Full Articles")).toBeTruthy();
        expect(screen.getByText("Save for Later")).toBeTruthy();
        expect(screen.getByText("User Profile")).toBeTruthy();
        expect(screen.getByText("Notifications")).toBeTruthy();
    });

    it("calls router.back when back button pressed", () => {
        render(<AboutScreen />);

        fireEvent.press(screen.getByTestId("back-button"));

        expect(mockBack).toHaveBeenCalled();
    });

    it("opens The Guardian API link when pressed", () => {
        const openURLSpy = jest
            .spyOn(Linking, "openURL")
            .mockImplementation(jest.fn());

        render(<AboutScreen />);

        fireEvent.press(screen.getByTestId("guardian-link"));

        expect(openURLSpy).toHaveBeenCalledWith(
            "https://open-platform.theguardian.com/"
        );
    });
});