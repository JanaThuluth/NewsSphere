import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type NotificationContextType = {
    notificationsEnabled: boolean;
    toggleNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
    notificationsEnabled: true,
    toggleNotifications: () => { },
});

export const NotificationProvider = ({ children }: any) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        loadNotificationState();
    }, []);

    const loadNotificationState = async () => {
        try {
            const saved = await AsyncStorage.getItem("notificationsEnabled");

            if (saved !== null) {
                setNotificationsEnabled(JSON.parse(saved));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toggleNotifications = async () => {
        try {
            const newValue = !notificationsEnabled;

            setNotificationsEnabled(newValue);

            await AsyncStorage.setItem(
                "notificationsEnabled",
                JSON.stringify(newValue)
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notificationsEnabled,
                toggleNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);