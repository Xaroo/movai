import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../AuthContext";
import moviesDataRaw from "../../assets/csv/popular_movies.json";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const Suggestions = () => {
  type Movie = {
    id: number;
    title: string;
    genres: string;
    release_date: string;
    overview: string;
  };

  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFocused = useIsFocused();
  const { moviesRatings } = useAuth();

  const getPosterPath = (id: number) => {
    const found = (moviesDataRaw as any[]).find((m) => m.id === id);
    return found?.poster_path ? `${IMAGE_BASE_URL}${found.poster_path}` : null;
  };

  useEffect(() => {
    if (isFocused && moviesRatings) {
      setRecommendations([]);
      setPage(0);
      setHasMore(true);
      fetchRecommendations(0, true);
    }
  }, [isFocused, moviesRatings]);

  const fetchRecommendations = async (pageToFetch: number, initial = false) => {
    if (!moviesRatings || (!hasMore && !initial) || loadingMore) return;

    if (initial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch("http://192.168.100.40:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_ratings: moviesRatings,
          page: pageToFetch,
          per_page: 5,
        }),
      });

      const data: Movie[] = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setRecommendations((prev) => {
          const newMovies = data.filter(
            (m) => !prev.some((p) => p.id === m.id)
          );
          return [...prev, ...newMovies];
        });
        setPage(pageToFetch + 1);
      }
    } catch (error) {
      console.error("❌ Błąd przy pobieraniu:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleEndReached = () => {
    if (!loadingMore && hasMore) {
      fetchRecommendations(page);
    }
  };

  const renderMovieCard = ({ item }: { item: Movie }) => {
    const posterUri = getPosterPath(item.id);
    return (
      <View style={styles.card}>
        {posterUri ? (
          <Image source={{ uri: posterUri }} style={styles.poster} />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={{ color: "#999" }}>Brak plakatu</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subText}>{item.genres}</Text>
          <Text style={styles.subText}>{item.release_date}</Text>
          <Text style={styles.overview} numberOfLines={4}>
            {item.overview}
          </Text>
        </View>
      </View>
    );
  };

  if (loading && page === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#1A1A1A", paddingTop: 10 }}>
      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        renderItem={renderMovieCard}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.7}
        ListFooterComponent={() =>
          loadingMore ? (
            <ActivityIndicator size="small" color="#ccc" />
          ) : !hasMore ? (
            <Text style={styles.endText}>🔚 Koniec rekomendacji</Text>
          ) : null
        }
      />
    </View>
  );
};

export default Suggestions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    maxHeight: 160,
  },
  poster: {
    minHeight: 180,
    minWidth: 100,
    alignSelf: "center",
  },
  posterPlaceholder: {
    width: 100,
    height: 150,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    padding: 10,
  },
  title: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subText: {
    color: "#CCC",
    fontSize: 13,
    marginBottom: 2,
  },
  overview: {
    color: "#EEE",
    fontSize: 12,
    marginTop: 6,
  },
  endText: {
    color: "#aaa",
    textAlign: "center",
    marginVertical: 10,
  },
});
