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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [totalMovies, setTotalMovies] = useState<number>(0);

  // Wczytywanie danych o filmie Avatar z TMDB
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Odczytanie API key z app.json
        const apiKey = Constants.manifest?.extra?.TMDB_API_KEY;
        if (!apiKey) {
          console.error("Brak API Key w konfiguracji");
          return;
        }

        const movieId = 19995; // ID filmu Avatar (możesz zmienić, jeśli potrzebujesz inny film)

        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
        );

        setMovies(response.data.results);
        setLoadingMovies(false);
        setTotalMovies(response.data.total_results);
      } catch (error) {
        console.error("Błąd podczas pobierania danych filmu:", error);
        setLoadingMovies(false);
      }
    };

    fetchMovies();
  }, []);

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

  return (
    <View style={styles.container}>
      <Text style={styles.totalMovies}>
        Łączna liczba popularnych filmów: {totalMovies}
      </Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieContainer}>
            {item.poster_path && (
              <Image
                style={styles.poster}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                }}
              />
            )}
            <Text style={styles.movieTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     {/* Wyświetlanie plakatu filmu Avatar */}
  //     {moviePoster ? (
  //       <Image source={{ uri: moviePoster }} style={styles.avatar} />
  //     ) : (
  //       <Text style={styles.noAvatarText}>Ładowanie plakatu...</Text>
  //     )}

  //     <TouchableOpacity style={styles.button} onPress={signOut}>
  //       <Text style={styles.buttonText}>Sign Out</Text>
  //     </TouchableOpacity>
  //   </View>
  // );
};

export default MyMovies;

const styles = StyleSheet.create({
  // container: {
  //   backgroundColor: "#1A1A1A",
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // button: {
  //   backgroundColor: "#493499",
  //   color: "white",
  //   height: 40,
  //   padding: 5,
  //   borderRadius: 20,
  //   width: 80,
  //   margin: 10,
  //   alignSelf: "flex-end",
  //   justifyContent: "center",
  // },
  // buttonText: {
  //   textAlign: "center",
  //   fontSize: 15,
  //   fontFamily: "LatoRegular",
  //   color: "white",
  // },
  // avatar: {
  //   width: 200,
  //   height: 300,
  //   borderRadius: 10,
  //   marginBottom: 20,
  // },
  // noAvatarText: {
  //   color: "white",
  //   fontSize: 16,
  //   textAlign: "center",
  //   marginBottom: 20,
  // },
  totalMovies: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  movieContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 10,
  },
  movieTitle: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
});
