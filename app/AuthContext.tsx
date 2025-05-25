import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import "@react-native-firebase/app";
import { ref, get } from "firebase/database";
import { database } from "../src/firebaseConfig";

// Typ kontekstu
type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  moviesRatings: { [movieId: number]: number } | null;
  moviesRatedAt: { [movieId: number]: string } | null;
  refreshMovies: () => Promise<void>;
  logout: () => Promise<void>;
};

// Tworzenie kontekstu
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  moviesRatings: null,
  moviesRatedAt: null,
  refreshMovies: async () => {},
  logout: async () => {},
});

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [moviesRatings, setMoviesRatings] = useState<{
    [movieId: number]: number;
  } | null>(null);
  const [moviesRatedAt, setMoviesRatedAt] = useState<{
    [movieId: number]: string;
  } | null>(null);

  const logout = async () => {
    try {
      await auth().signOut();
      setUser(null);
      setMoviesRatings(null);
      setMoviesRatedAt(null);
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  const extractMoviesData = (moviesRaw: any) => {
    const ratings: { [id: number]: number } = {};
    const ratedAt: { [id: number]: string } = {};

    if (moviesRaw && typeof moviesRaw === "object") {
      Object.entries(moviesRaw).forEach(([movieIdStr, value]) => {
        const movieId = Number(movieIdStr);

        if (value && typeof value === "object" && !Array.isArray(value)) {
          const rating = (value as { rating?: unknown }).rating;
          const ratedDate = (value as { rated_at?: unknown }).rated_at;

          if (typeof rating === "number") {
            ratings[movieId] = rating;
          }

          if (typeof ratedDate === "string") {
            ratedAt[movieId] = ratedDate;
          }
        } else if (typeof value === "number") {
          // obsługa starego formatu
          ratings[movieId] = value;
        }
      });
    }

    setMoviesRatings(Object.keys(ratings).length > 0 ? ratings : null);
    setMoviesRatedAt(Object.keys(ratedAt).length > 0 ? ratedAt : null);
  };

  const refreshMovies = async () => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      extractMoviesData(userData?.movies || null);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = ref(database, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        extractMoviesData(userData?.movies || null);
        setUser(firebaseUser);
      } else {
        setUser(null);
        setMoviesRatings(null);
        setMoviesRatedAt(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        moviesRatings,
        moviesRatedAt,
        refreshMovies,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);
