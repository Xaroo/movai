import { Tabs } from "expo-router";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useAuth } from "../AuthContext"; // Zakładam, że tak wygląda ścieżka

export default function Layout() {
  const { logout } = useAuth();

  const headerRight = () => (
    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );

  const screenOptionsBase = {
    headerStyle: {
      backgroundColor: "#282828",
    },
    headerTitle: () => (
      <Image
        style={styles.logo}
        source={require("../../assets/images/Logo.png")}
      />
    ),
    headerRight,
    tabBarInactiveTintColor: "#9281D8",
    tabBarActiveTintColor: "#FFFFFF",
    tabBarStyle: {
      height: 60,
      paddingTop: 4,
      backgroundColor: "#664AD2",
    },
  };

  return (
    <Tabs screenOptions={screenOptionsBase}>
      <Tabs.Screen
        name="myMovies"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={25} name="movie" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={25} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="suggestions"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather size={25} name="heart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign size={25} name="linechart" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 70,
    height: 40,
    alignSelf: "center",
  },
  logoutButton: {
    marginRight: 15,
    backgroundColor: "#493499",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
});
