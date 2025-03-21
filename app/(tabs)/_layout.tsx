import { IconSymbol } from "@/app-example/components/ui/IconSymbol.ios";
import { Tabs } from "expo-router";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

export default () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 80,
          paddingTop: 8,
          backgroundColor: "#664AD2",
        },
      }}
    >
      <Tabs.Screen
        name="myMovies"
        options={{
          title: "My movies",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={25} name="movie" color={color} />
          ),
          tabBarInactiveTintColor: "#9281D8",
          tabBarActiveTintColor: "#FFFFFF",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={25} name="search" color={color} />
          ),
          tabBarInactiveTintColor: "#9281D8",
          tabBarActiveTintColor: "#FFFFFF",
        }}
      />
      <Tabs.Screen
        name="suggestions"
        options={{
          title: "Suggestions",
          tabBarIcon: ({ color }) => (
            <Feather size={25} name="heart" color={color} />
          ),
          tabBarInactiveTintColor: "#9281D8",
          tabBarActiveTintColor: "#FFFFFF",
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
          tabBarIcon: ({ color }) => (
            <AntDesign size={25} name="linechart" color={color} />
          ),
          tabBarInactiveTintColor: "#9281D8",
          tabBarActiveTintColor: "#FFFFFF",
        }}
      />
    </Tabs>
  );
};
