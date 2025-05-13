import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import moviesDataRaw from "../../assets/csv/popular_movies.json"; // <- Upewnij się, że ten plik istnieje

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const Search = () => {
  type Movie = {
    id: number;
    title: string;
    release_date: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    popularity: number;
    vote_average: number;
    vote_count: number;
    adult: boolean;
    genres: string[];
    original_language: string;
    original_title: string;
    video: boolean;
  };

  const moviesData: Movie[] = moviesDataRaw as Movie[];
  const [query, setQuery] = useState<string>("");
  const [filtered, setFiltered] = useState<Movie[]>([]);

  useEffect(() => {
    if (query.length >= 3) {
      const lower = query.toLowerCase();
      const matches = moviesData.filter((movie) =>
        movie.title.toLowerCase().includes(lower)
      );
      setFiltered(matches);
    } else {
      setFiltered([]);
    }
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Szukaj filmu..."
        placeholderTextColor="#ccc"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.item,
              { backgroundColor: index % 2 === 0 ? "#1A1A1A" : "#2a2a2a" }, // co drugi inny
            ]}
          >
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
              style={styles.poster}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    flex: 1,
    paddingLeft: 10,
    paddingTop: 10,
  },
  input: {
    backgroundColor: "#2a2a2a",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginRight: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  poster: {
    width: 60,
    height: 90,
    marginRight: 10,
    borderRadius: 4,
  },
  title: {
    color: "white",
    fontSize: 16,
  },
});
