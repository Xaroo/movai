import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { useAuth } from "../AuthContext";
import moviesDataRaw from "../../assets/csv/popular_movies.json";
import { BarChart, PieChart } from "react-native-gifted-charts";

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

    const histogram = Array(11).fill(0);
    const genreStats: { [genre: string]: { sum: number; count: number } } = {};

    Object.entries(moviesRatings).forEach(([movieIdStr, value]) => {
      const movieId = parseInt(movieIdStr);
      const rating =
        typeof value === "object"
          ? (value as { rating: number }).rating
          : value;
      const matchedMovie = moviesData.find((m) => m.id === movieId);

      const index = Math.round(rating * 2);
      histogram[index]++;

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

  useEffect(() => {
    if (!moviesRatedAt) return;

    const counts = Array(12).fill(0);

    Object.entries(moviesRatedAt).forEach(([movieIdStr, dateStr]) => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      if (year === selectedYear) {
        const month = date.getMonth();
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
        <View style={styles.chartContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Rozkład ocen</Text>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <BarChart
              barWidth={18}
              noOfSections={5}
              barBorderRadius={4}
              frontColor="#7b62e6"
              data={ratingsHistogram.map((value, i) => ({
                value,
                label: (i * 0.5).toString(),
              }))}
              yAxisColor="#555"
              xAxisColor="#555"
              yAxisTextStyle={{ color: "#fff" }}
              xAxisLabelTextStyle={{ color: "#fff", fontSize: 10 }}
              spacing={10}
              width={Dimensions.get("window").width - 80}
            />
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Średnia ocen wg gatunku</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <PieChart
              data={genreAverages.map((genre, index) => ({
                value: parseFloat((genre.ratingSum / genre.count).toFixed(2)),
                color: chartColors[index % chartColors.length],
              }))}
              showText={false}
              radius={80}
              strokeColor={"#1A1A1A"}
              focusOnPress
            />
          </View>
          <View style={styles.legendContainer}>
            {genreAverages.map((genre, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    {
                      backgroundColor: chartColors[index % chartColors.length],
                    },
                  ]}
                />
                <Text style={styles.legendText}>
                  {genre.name} ({(genre.ratingSum / genre.count).toFixed(2)})
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Ilość obejrzanych filmów na miesiąc
            </Text>
          </View>
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
          <View style={{ paddingHorizontal: 10 }}>
            <BarChart
              barWidth={16}
              noOfSections={5}
              barBorderRadius={4}
              frontColor="#5e44c9"
              data={moviesPerMonth.map((value, i) => ({
                value,
                label: monthNames[i],
              }))}
              yAxisColor="#555"
              xAxisColor="#555"
              yAxisTextStyle={{ color: "#fff" }}
              xAxisLabelTextStyle={{ color: "#fff", fontSize: 10 }}
              spacing={10}
              width={Dimensions.get("window").width - 80}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "#585858",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderBottomColor: "#555",
    alignItems: "center",
    justifyContent: "center",
  },
  chartContainer: {
    backgroundColor: "#2A2A2A",
    paddingBottom: 20,
    marginBottom: 10,
  },
  containerMain: {
    backgroundColor: "#1A1A1A",
    flex: 1,
    paddingTop: 10,
  },
  container: {
    backgroundColor: "#1A1A1A",
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 3,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 6,
    borderRadius: 3,
  },
  legendText: {
    color: "#fff",
    fontSize: 12,
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
