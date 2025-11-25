import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Saved = () => {
  return (
    <SafeAreaView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText>
          Hello! Welcome to the Saved page, what do you want to adjust?
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
};

export default Saved;

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
