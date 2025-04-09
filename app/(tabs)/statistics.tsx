import { View, Text, StyleSheet } from "react-native";
import React from "react";

const statistics = () => {
  return <View style={styles.container}></View>;
};

export default statistics;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#493499",
    color: "white",
    height: 40,
    padding: 5,
    borderRadius: 20,
    width: 80,
    margin: 10,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#1A1A1A",
    flex: 1,
  },
});
