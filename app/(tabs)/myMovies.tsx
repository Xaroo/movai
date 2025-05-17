import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { Redirect } from "expo-router";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Constants from "expo-constants"; // Importowanie expo-constants

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

const MyMovies = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { user, loading } = useAuth();

  const [movies, setMovies] = useState<Movie[]>([]);

  // Wczytywanie danych o filmie Avatar z TMDB

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((User) => {
      setIsLoggedIn(!!User);
    });
    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error: any) {
      alert("Błąd podczas wylogowywania: " + error.message);
    }
  };

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  if (loading) {
    return <Text>Ładowanie...</Text>;
  }

  return <View style={styles.container}></View>;
};

export default MyMovies;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#493499",
    color: "white",
    height: 40,
    padding: 5,
    borderRadius: 20,
    width: 80,
    margin: 10,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    fontFamily: "LatoRegular",
    color: "white",
  },
  avatar: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  noAvatarText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
