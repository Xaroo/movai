import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../AuthContext";

const Suggestions = () => {
  type Movie = {
    id: number;
    title: string;
    genres: string;
    release_date: string;
    overview: string;
    textual_representation?: string;
  };

  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused();
  const { movies } = useAuth();

  useEffect(() => {
    if (isFocused) {
      fetch("http://192.168.100.40:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_ratings: movies,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Błąd odpowiedzi:", response.statusText);
            throw new Error("Błąd odpowiedzi z serwera");
          }
          return response.json();
        })
        .then((data) => {
          setRecommendations(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Błąd podczas pobierania rekomendacji:", error);
          setLoading(false);
        });
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Rekomendowane filmy:</Text>
      {recommendations.map((movie, index) => (
        <View key={index} style={styles.movieCard}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.text}>Genres: {movie.genres}</Text>
          <Text style={styles.text}>Release Date: {movie.release_date}</Text>
          <Text style={styles.text}>{movie.overview}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default Suggestions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  movieCard: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    color: "#FFFFFF",
    marginTop: 5,
  },
});

// import { View, Text, StyleSheet } from "react-native";
// import React from "react";

// const suggestions = () => {
//   return <View style={styles.container}></View>;
// };

// export default suggestions;

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: "#493499",
//     color: "white",
//     height: 40,
//     padding: 5,
//     borderRadius: 20,
//     width: 80,
//     margin: 10,
//     alignSelf: "flex-end",
//     justifyContent: "center",
//   },
//   container: {
//     backgroundColor: "#1A1A1A",
//     flex: 1,
//   },
// });
