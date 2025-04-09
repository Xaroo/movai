import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { Redirect } from "expo-router";
import { useAuth } from "../AuthContext";

const myMovies = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { user, loading } = useAuth();

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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 15,
            fontFamily: "LatoRegular",
            color: "white",
          }}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default myMovies;

const styles = StyleSheet.create({
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
  container: {
    backgroundColor: "#1A1A1A",
    flex: 1,
  },
});
