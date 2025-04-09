import { IconSymbol } from "@/app-example/components/ui/IconSymbol.ios";
import { Tabs } from "expo-router";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet } from "react-native";

export default () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 60,
          paddingTop: 4,
          backgroundColor: "#664AD2",
        },
      }}
    >
      <Tabs.Screen
        name="myMovies"
        options={{
          headerStyle: {
            backgroundColor: "#282828",
          },
          headerTitle: () => (
            <Image
              style={styles.logo}
              source={require("../../assets/images/Logo.png")}
            />
          ),
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
          headerStyle: {
            backgroundColor: "#282828",
          },
          headerTitle: () => (
            <Image
              style={styles.logo}
              source={require("../../assets/images/Logo.png")}
            />
          ),
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
          headerStyle: {
            backgroundColor: "#282828",
          },
          headerTitle: () => (
            <Image
              style={styles.logo}
              source={require("../../assets/images/Logo.png")}
            />
          ),
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
          headerStyle: {
            backgroundColor: "#282828",
          },
          headerTitle: () => (
            <Image
              style={styles.logo}
              source={require("../../assets/images/Logo.png")}
            />
          ),
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

const styles = StyleSheet.create({
  logo: {
    width: 70,
    height: 40,
    alignSelf: "center",
  },
});
