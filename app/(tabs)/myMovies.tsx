import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import moviesDataRaw from "../../assets/csv/popular_movies.json";
import StarRating from "react-native-star-rating-widget";
import { ref, set } from "firebase/database";
import { database } from "../../src/firebaseConfig";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const MyMovies = () => {
  const { movies, user, refreshMovies } = useAuth();
  const [ratedMovies, setRatedMovies] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    if (!movies) return;

    const allMovies: any[] = moviesDataRaw as any[];
    const filtered = Object.keys(movies)
      .map((id) => {
        const movie = allMovies.find((m) => m.id === Number(id));
        return movie ? { ...movie, rating: movies[Number(id)] } : null;
      })
      .filter(Boolean);

    setRatedMovies(filtered);
  }, [movies]);

  const handleCardPress = (movie: any) => {
    setSelectedMovie(movie);
    setRating(movie.rating || 0);
    setModalVisible(true);
  };

  const handleSave = async () => {
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
        console.error("❌ Błąd przy aktualizacji filmu:", error);
      }
    }
  };

  const renderMovie = ({ item, index }: { item: any; index: number }) => {
    const isLastOdd =
      ratedMovies.length % 2 !== 0 && index === ratedMovies.length - 1;
    return (
      <TouchableOpacity
        style={[styles.card, isLastOdd && styles.lastOddCard]}
        onPress={() => handleCardPress(item)}
      >
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
          style={styles.poster}
        />
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.rating}>Ocena: {item.rating}⭐</Text>
      </TouchableOpacity>
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
                  <Text style={styles.modalButton} onPress={handleSave}>
                    Zatwierdź
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
    width: "48%",
    margin: 5,
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  lastOddCard: {
    alignSelf: "center",
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
  modalPoster: {
    width: 100,
    height: 150,
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: 10,
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
