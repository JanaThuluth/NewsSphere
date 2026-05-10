import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Colors } from "../../src/constants/constants";
import { useNotifications } from "../../src/constants/NotificationContext";
import { getNotifications } from "../../src/features/notification/notificationService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function TabsLayout() {
  const queryClient = useQueryClient();
  const { notificationsEnabled } = useNotifications();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    if (notifications) {
      const unreadExists = notifications.some((n: any) => n.isRead === false);

      if (notificationsEnabled) {
        setHasNewNotification(unreadExists);
      } else {
        setHasNewNotification(false);
      }
    }
  }, [notifications, notificationsEnabled]);

  useEffect(() => {
    const notificationListener =
      Notifications.addNotificationReceivedListener(() => {
        if (notificationsEnabled) {
          setHasNewNotification(true);
        }
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(() => {
        setHasNewNotification(false);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [queryClient, notificationsEnabled]);

  const showBadge = hasNewNotification && notificationsEnabled;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.white,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 12,
          right: 12,
          height: 70,
          backgroundColor: Colors.primary,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 10,
          paddingTop: 10,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={Colors.white}
              style={{
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={24}
              color={Colors.white}
              style={{
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        listeners={{
          tabPress: () => {
            setHasNewNotification(false);
          },
        }}
        options={{
          tabBarBadge: showBadge ? "" : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.red,
            minWidth: 10,
            height: 10,
            borderRadius: 5,
            marginTop: 4,
          },
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={24}
              color={Colors.white}
              style={{
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={Colors.white}
              style={{
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}