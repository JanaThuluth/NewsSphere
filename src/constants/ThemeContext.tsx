import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Colors as ConstantColors } from './constants';

export const LightTheme = { ...ConstantColors };
export const DarkTheme = {
    ...ConstantColors,
    primary: "#0A3D5C",
    background: "#121212",
    white: "#1E1E1E",
    black: "#FFFFFF",
    lightGray: "#2C2C2C",
    border: "#333333",
    gray: "#A0AAB4",
};

const ThemeContext = createContext({
    isDark: false,
    theme: LightTheme,
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('userTheme');
            if (savedTheme !== null) {
                setIsDark(savedTheme === 'dark');
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newMode = !isDark;
        setIsDark(newMode);
        await AsyncStorage.setItem('userTheme', newMode ? 'dark' : 'light');
    };

    const theme = isDark ? DarkTheme : LightTheme;

    return (
        <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);