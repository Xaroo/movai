import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useAuth } from "../AuthContext";
import moviesDataRaw from "../../assets/csv/popular_movies.json";

const screenWidth = Dimensions.get("window").width;

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

const monthNames = [
  "Sty",
  "Lut",
  "Mar",
  "Kwi",
  "Maj",
  "Cze",
  "Lip",
  "Sie",
  "Wrz",
  "Paź",
  "Lis",
  "Gru",
];

const Statistics = () => {
  const { moviesRatings, moviesRatedAt, loading } = useAuth();
  const [ratingsHistogram, setRatingsHistogram] = useState<number[]>([]);
  const [genreAverages, setGenreAverages] = useState<
    { name: string; ratingSum: number; count: number }[]
  >([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [moviesPerMonth, setMoviesPerMonth] = useState<number[]>(
    Array(12).fill(0)
  );

  const moviesData = moviesDataRaw as Movie[];

  useEffect(() => {
    if (!moviesRatings) return;

    // Histogram ocen
    const histogram = Array(11).fill(0); // 0, 0.5, ..., 5

    const genreStats: { [genre: string]: { sum: number; count: number } } = {};

    Object.entries(moviesRatings).forEach(([movieIdStr, value]) => {
      const movieId = parseInt(movieIdStr);
      const rating =
        typeof value === "object"
          ? (value as { rating: number }).rating
          : value;
      const matchedMovie = moviesData.find((m) => m.id === movieId);

      // Histogram
      const index = Math.round(rating * 2);
      histogram[index]++;

      // Średnie ocen wg gatunku
      if (matchedMovie?.genres) {
        matchedMovie.genres.forEach((genre) => {
          if (!genreStats[genre]) genreStats[genre] = { sum: 0, count: 0 };
          genreStats[genre].sum += rating;
          genreStats[genre].count += 1;
        });
      }
    });

    setRatingsHistogram(histogram);

    const genreAveragesList = Object.entries(genreStats).map(
      ([name, { sum, count }]) => ({
        name,
        ratingSum: sum,
        count,
      })
    );

    setGenreAverages(genreAveragesList);
  }, [moviesRatings]);

  // Efekt liczący filmy obejrzane w miesiącach wybranego roku
  useEffect(() => {
    if (!moviesRatedAt) return;

    const counts = Array(12).fill(0);

    Object.entries(moviesRatedAt).forEach(([movieIdStr, dateStr]) => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      if (year === selectedYear) {
        const month = date.getMonth(); // 0-11
        counts[month]++;
      }
    });

    setMoviesPerMonth(counts);
  }, [moviesRatedAt, selectedYear]);

  if (loading) {
    return <Text style={{ color: "white", padding: 20 }}>Ładowanie...</Text>;
  }

  return (
    <View style={styles.containerMain}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Rozkład ocen</Text>
        <BarChart
          data={{
            labels: [
              "0",
              "0.5",
              "1",
              "1.5",
              "2",
              "2.5",
              "3",
              "3.5",
              "4",
              "4.5",
              "5",
            ],
            datasets: [{ data: ratingsHistogram }],
          }}
          width={screenWidth - 20}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
        />

        <Text style={styles.title}>Średnia ocen wg gatunku</Text>
        <PieChart
          data={genreAverages.map((genre, index) => ({
            name: genre.name,
            population: parseFloat((genre.ratingSum / genre.count).toFixed(2)),
            color: chartColors[index % chartColors.length],
            legendFontColor: "#fff",
            legendFontSize: 12,
          }))}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"10"}
          absolute
        />

        <Text style={styles.title}>
          Ilość obejrzanych filmów na miesiąc w roku
        </Text>

        {/* Wybór roku */}
        <View style={styles.yearSelector}>
          <TouchableOpacity
            style={styles.yearButton}
            onPress={() => setSelectedYear((y) => y - 1)}
          >
            <Text style={styles.yearButtonText}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.yearText}>{selectedYear}</Text>
          <TouchableOpacity
            style={styles.yearButton}
            onPress={() => setSelectedYear((y) => y + 1)}
          >
            <Text style={styles.yearButtonText}>▶</Text>
          </TouchableOpacity>
        </View>

        <BarChart
          data={{
            labels: monthNames,
            datasets: [{ data: moviesPerMonth }],
          }}
          width={screenWidth - 20}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </ScrollView>
    </View>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  containerMain: {
    backgroundColor: "#1A1A1A",
    flex: 1,
    paddingTop: 10,
  },
  container: {
    backgroundColor: "#1A1A1A",
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 20,
  },
  yearSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  yearButton: {
    backgroundColor: "#493499",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  yearButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  yearText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

const chartConfig = {
  backgroundGradientFrom: "#2A2A2A",
  backgroundGradientTo: "#383838",
  color: (opacity = 1) => `rgba(73, 52, 153, ${opacity})`,
  labelColor: () => "#fff",
  decimalPlaces: 1,
};

const chartColors = [
  "#493499",
  "#5e44c9",
  "#7b62e6",
  "#a08ffc",
  "#c4b9ff",
  "#8c6ae8",
  "#3d2a85",
  "#644e9c",
  "#7563b1",
  "#998dd2",
];
