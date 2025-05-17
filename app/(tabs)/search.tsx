import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import moviesDataRaw from "../../assets/csv/popular_movies.json"; // <- Upewnij się, że ten plik istnieje
import StarRating from "react-native-star-rating-widget";
import { useAuth } from "../AuthContext"; // <- Upewnij się, że masz ten kontekst
import { database } from "../../src/firebaseConfig"; // <- Upewnij się, że masz ten plik
import { ref, set } from "firebase/database";

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

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const { movies } = useAuth() as {
    movies: { [key: string]: number } | null;
  };
  const { user, refreshMovies } = useAuth();

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

  const openModal = (movie: Movie) => {
    if (movies?.hasOwnProperty(movie.id)) {
      alert("Ten film już istnieje w Twojej bazie filmów!");
      return;
    } else {
      setRating(0);
      setSelectedMovie(movie);
      setModalVisible(true);
    }
  };

  const addToWatched = async () => {
    if (selectedMovie && rating && user) {
      try {
        const movieRef = ref(
          database,
          `users/${user.uid}/movies/${selectedMovie.id}`
        );
        await set(movieRef, rating);
        await refreshMovies();
        setModalVisible(false);
      } catch (error) {
        console.error("❌ Błąd przy dodawaniu filmu:", error);
      }
    }
  };

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
          <TouchableOpacity
            style={[
              styles.item,
              { backgroundColor: index % 2 === 0 ? "#1A1A1A" : "#2a2a2a" }, // co drugi inny
            ]}
            onPress={() => openModal(item)}
          >
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
              style={styles.poster}
            />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMovie && (
              <>
                <Image
                  source={{
                    uri: `${IMAGE_BASE_URL}${selectedMovie.poster_path}`,
                  }}
                  style={styles.modalPoster}
                />
                <Text style={styles.modalTitle}>{selectedMovie.title}</Text>

                <StarRating
                  rating={rating}
                  onChange={setRating}
                  starSize={30}
                  enableHalfStar={true}
                  color="#FFD700"
                />

                <View style={styles.modalButtons}>
                  <Text style={styles.modalButton} onPress={addToWatched}>
                    Dodaj
                  </Text>
                  <Text
                    style={styles.modalButton}
                    onPress={() => setModalVisible(false)}
                  >
                    Anuluj
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  modalPoster: {
    width: 100,
    height: 150,
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2a2a2a",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  modalButton: {
    color: "#00BFFF",
    fontSize: 16,
    paddingHorizontal: 20,
  },
});
