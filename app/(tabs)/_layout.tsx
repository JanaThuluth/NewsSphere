import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Colors } from "../../src/constants/constants";

export default function TabsLayout() {
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
              color="white"
              style={{
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={24}
              color="white"
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
              color="white"
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
              color="white"
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