import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import "@react-native-firebase/app"; // <-- To ważne!

// Typ kontekstu
type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
};

// Tworzenie kontekstu
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe; // wyrejestrowanie listenera przy unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook do pobierania użytkownika
export const useAuth = () => useContext(AuthContext);
