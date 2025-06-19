import { Redirect, router } from "expo-router";
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
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import Modal from "react-native-modal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      }
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      setIsLoggedIn(true);
    } catch (e: any) {
      const err = e as FirebaseError;
      let message = "Something went wrong. Please try again.";
      switch (err.code) {
        case "auth/invalid-email":
          message = "The email address is not valid.";
          break;
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-credential":
          message =
            "Invalid credentials. Please check your email and password.";
          break;
      }

      setErrorMessage(message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Redirect href="/myMovies" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <Image
        style={styles.logo}
        source={require("../assets/images/Logo.png")}
      />
      <Text style={styles.welcome1}>Welcome back!</Text>
      <Text style={styles.welcome2}>Log in to your account</Text>
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
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
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
              <TouchableOpacity style={styles.button} onPress={signIn}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bottomText}>
              Don't have an account?{" "}
              <Text
                onPress={() => router.push("/register")}
                style={styles.linkText}
              >
                Sign up
              </Text>
            </Text>
          </>
        )}
      </KeyboardAvoidingView>
      <Modal isVisible={showError} onBackdropPress={() => setShowError(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Login Failed</Text>
          <Text style={styles.modalMessage}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowError(false)}
          >
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Login;

// ⬇️ Te same style co w index.tsx:
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
  modalContent: {
    backgroundColor: "#282828",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "LatoRegular",
  },
  modalMessage: {
    color: "#CCCCCC",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "LatoRegular",
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: "#493499",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "LatoRegular",
  },
});
