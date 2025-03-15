// navigations/TabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { HomeIcon, BookmarkIcon, UserIcon, StarIcon } from "react-native-heroicons/outline";
import HomeScreen from "../app/(tabs)/home";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 65,
        },
        tabBarActiveTintColor: "#D97706",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <HomeIcon size={28} color={color} />,
          title: "",
        }}
      />
      <Tab.Screen
        name="Search"
        component={() => <View />} // Placeholder
        options={{
          tabBarIcon: ({ color }) => <StarIcon size={28} color={color} />,
          title: "",
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={() => <View />} // Placeholder
        options={{
          tabBarIcon: ({ color }) => <BookmarkIcon size={28} color={color} />,
          title: "",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={() => <View />} // Placeholder
        options={{
          tabBarIcon: ({ color }) => <UserIcon size={28} color={color} />,
          title: "",
        }}
      />
    </Tab.Navigator>
  );
}
