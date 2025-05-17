import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import "@react-native-firebase/app"; // <-- To ważne!
import { ref, get, set } from "firebase/database";
import { database } from "../src/firebaseConfig"; // Upewnij się, że ścieżka jest poprawna

// Typ kontekstu
type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  movies: { [key: number]: number } | null;
  refreshMovies: () => Promise<void>;
};

// Tworzenie kontekstu
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  movies: null,
  refreshMovies: async () => {},
});

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<{ [key: number]: number } | null>(null);
  const refreshMovies = async () => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      setMovies(userData?.movies || null);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      const userRef = ref(database, `users/${firebaseUser?.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      setMovies(userData?.movies || null); // Ustawienie filmów użytkownika
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe; // wyrejestrowanie listenera przy unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, movies, refreshMovies }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook do pobierania użytkownika
export const useAuth = () => useContext(AuthContext);
