import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import React, { useState } from "react";
import auth from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import { database } from "../src/firebaseConfig";
import { ref, get, set } from "firebase/database";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  const signUp = async () => {
    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password1
      );
      const user = userCredential.user;

      // 🔍 Sprawdź, czy użytkownik już istnieje w bazie
      const userRef = ref(database, `users/${user.uid}`);

      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        // 📝 Dodaj użytkownika jeśli nie istnieje
        await set(userRef, {
          id: user.uid,
          movies: null, // ← struktura jak chciałeś
        });
        console.log("User added to database");
      }

      await auth().signOut(); // 🚪 Wyloguj po rejestracji
      alert("Account created! Please log in.");
      router.replace("/login");
    } catch (e: any) {
      alert("Registration failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <Image
        style={styles.logo}
        source={require("../assets/images/Logo.png")}
      />
      <Text style={styles.welcome1}>Create account</Text>
      <Text style={styles.welcome2}>Sign up to get started</Text>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="white"
        />
        <View style={styles.line} />
        <TextInput
          style={styles.input}
          value={password1}
          onChangeText={setPassword1}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="white"
        />
        <View style={styles.line} />
        <TextInput
          style={styles.input}
          value={password2}
          onChangeText={setPassword2}
          placeholder="Confirm Password"
          secureTextEntry
          placeholderTextColor="white"
        />
        <View style={styles.line} />
        {loading ? (
          <ActivityIndicator size="small" style={{ margin: 28 }} />
        ) : (
          <>
            <View
              style={{
                width: screenWidth * 0.9,
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              <TouchableOpacity style={styles.button} onPress={signUp}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bottomText}>
              Already have an account?{" "}
              <Text
                onPress={() => router.push("/login")}
                style={styles.linkText}
              >
                Log in
              </Text>
            </Text>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Register;

// użyj tych samych stylów co w loginie:
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#493499" },
  button: {
    backgroundColor: "#493499",
    color: "white",
    height: 40,
    padding: 5,
    borderRadius: 20,
    width: "75%",
    alignSelf: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "LatoRegular",
    color: "white",
  },
  welcome1: {
    color: "white",
    fontSize: 30,
    marginTop: 15,
    textAlign: "center",
    fontFamily: "LatoLight",
  },
  welcome2: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 60,
    fontFamily: "LatoLight",
  },
  logo: { marginTop: 30, width: 130, height: 80, alignSelf: "center" },
  input: {
    marginTop: 15,
    height: 35,
    borderRadius: 4,
    padding: 8,
    backgroundColor: "transparent",
    width: "65%",
    alignSelf: "center",
    color: "white",
    borderWidth: 0,
    fontSize: 16,
    fontFamily: "LatoRegular",
  },
  circle: {
    width: 850,
    height: 850,
    borderRadius: 850 / 2,
    backgroundColor: "#282828",
    position: "absolute",
    top: -250,
    alignSelf: "center",
    elevation: 15,
    zIndex: 0,
  },
  line: {
    height: 1,
    width: "75%",
    backgroundColor: "white",
    alignSelf: "center",
    marginBottom: 10,
  },
  bottomText: {
    textAlign: "center",
    color: "white",
    fontFamily: "LatoRegular",
    marginTop: 10,
  },
  linkText: {
    color: "#9281D8",
    fontWeight: "bold",
  },
});
