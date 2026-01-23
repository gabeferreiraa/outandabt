import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Saved = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={[styles.header]}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.brand}>Saved</ThemedText>
        </View>
      </ThemedView>

      {/* Main scrollable content */}
      <View style={styles.container}>
        <ThemedView style={styles.content}>
          <View style={styles.illustrationContainer}>
            <Image
              source={require("@/assets/images/placeholder-1.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          <ThemedText style={styles.title}>Organize your activities</ThemedText>
          <ThemedText style={styles.subtitle}>
            Boards allow you to save places{"\n"}and share with your friends.
          </ThemedText>

          <TouchableOpacity style={styles.createBoardButton}>
            <ThemedText style={styles.createBoardButtonText}>
              Create a board
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </SafeAreaView>
  );
};

export default Saved;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FEFDF8",
  },
  container: {
    flex: 1,
    backgroundColor: "#FEFDF8",
  },
  header: {
    backgroundColor: "#FEFDF8",
  },
  brand: { marginTop: 6, fontSize: 24, fontWeight: "800", color: "#1F1F1F" },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16, // Extra spacing below the status bar
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#4E917F",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  illustrationContainer: {
    width: 300,
    height: 200,
    marginBottom: 40,
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
    marginBottom: 32,
  },
  createBoardButton: {
    backgroundColor: "#4E917F",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    minHeight: 44,
  },
  createBoardButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
