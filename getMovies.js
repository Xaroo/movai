const axios = require("axios");
const fs = require("fs");

// Twój API Key
const API_KEY = "2c07d9671ecbd3dfb5f5b43f251b6c6b";

// Funkcja do pobierania gatunków
async function fetchGenres() {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list",
      {
        params: {
          api_key: API_KEY,
          language: "en-US",
        },
      }
    );

    const genresMap = response.data.genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});

    return genresMap;
  } catch (error) {
    console.error("Błąd podczas pobierania gatunków:", error.message);
    return {};
  }
}

// Funkcja do pobierania filmów
async function fetchPopularMovies() {
  const genresMap = await fetchGenres();

  const popularMovies = [];
  let page = 1;
  let totalPages = 1;
  let moviesCount = 0;

  // Pobierz filmy z każdej strony, aż uzyskasz 50 filmów
  while (page <= totalPages && moviesCount < 10000) {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/popular",
        {
          params: {
            api_key: API_KEY,
            page: page,
            language: "en-US",
          },
        }
      );

      totalPages = response.data.total_pages;

      const movies = response.data.results.map((movie) => {
        const genres = movie.genre_ids
          .map((id) => genresMap[id] || "Unknown")
          .join(", ");
        return {
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
          backdrop_path: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
            : "",
          overview: `"${movie.overview.replace(/"/g, '""')}"`, // Dodanie cudzysłowów i escapowanie wewnętrznych cudzysłowów
          popularity: movie.popularity,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          adult: movie.adult,
          genres: genres, // Tylko nazwy gatunków, nie id
          original_language: movie.original_language,
          original_title: movie.original_title,
          video: movie.video,
        };
      });

      popularMovies.push(...movies);
      moviesCount += movies.length;
      page++;
    } catch (error) {
      console.error("Błąd podczas pobierania filmów:", error.message);
    }
  }

  return popularMovies;
}

// Funkcja do zapisywania filmów do CSV
function saveMoviesToCSV(movies) {
  const header =
    "id,title,release_date,poster_path,backdrop_path,overview,popularity,vote_average,vote_count,adult,genres,original_language,original_title,video\n";
  const rows = movies
    .map((movie) => {
      return `${movie.id},"${movie.title}",${movie.release_date},${movie.poster_path},${movie.backdrop_path},${movie.overview},${movie.popularity},${movie.vote_average},${movie.vote_count},${movie.adult},"${movie.genres}",${movie.original_language},"${movie.original_title}",${movie.video}`;
    })
    .join("\n");

  const csvContent = header + rows;

  fs.writeFileSync("popular_movies_test.csv", csvContent, "utf8");
  console.log("Plik CSV został zapisany.");
}

// Uruchomienie procesu pobierania i zapisywania filmów
(async () => {
  const popularMovies = await fetchPopularMovies();
  saveMoviesToCSV(popularMovies);
})();
