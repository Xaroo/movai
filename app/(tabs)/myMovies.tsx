import { View, StyleSheet, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import moviesDataRaw from "../../assets/csv/popular_movies.json";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const MyMovies = () => {
  const { movies } = useAuth();
  const [ratedMovies, setRatedMovies] = useState<any[]>([]);

  useEffect(() => {
    if (!movies) return;

    const allMovies: any[] = moviesDataRaw as any[];
    const filtered = Object.keys(movies)
      .map((id) => {
        const movie = allMovies.find((m) => m.id === Number(id));
        return movie ? { ...movie, rating: movies[Number(id)] } : null;
      })
      .filter(Boolean); // usuń null, jeśli film nie został znaleziony

    setRatedMovies(filtered);
  }, [movies]);

  const renderMovie = ({ item, index }: { item: any; index: any }) => {
    const isLastOdd =
      ratedMovies.length % 2 !== 0 && index === ratedMovies.length - 1;

    return (
      <View style={[styles.card, isLastOdd && styles.lastOddCard]}>
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
          style={styles.poster}
        />
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.rating}>Ocena: {item.rating}⭐</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {ratedMovies.length === 0 ? (
        <Text style={styles.noMoviesText}>Brak ocenionych filmów</Text>
      ) : (
        <FlatList
          data={ratedMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovie}
          numColumns={2}
          contentContainerStyle={styles.grid}
        />
      )}
    </View>
  );
};

export default MyMovies;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    flex: 1,
    padding: 10,
  },
  grid: {
    paddingBottom: 20,
  },
  card: {
    width: "48%", // zamiast flexBasis – bardziej niezależne
    margin: 5,
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  lastOddCard: {
    alignSelf: "center", // centrowanie w rzędzie FlatList
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  rating: {
    color: "#FFD700",
    fontSize: 12,
    marginTop: 4,
  },
  noMoviesText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
