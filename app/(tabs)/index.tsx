import SearchBar from "@/components/ui/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Feed() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar
            onSearch={handleSearch}
            value={searchQuery}
            placeholder="Search for activities"
          />
        </View>
        <View style={styles.filterContainer}>
          <Ionicons
            name="options-outline"
            size={24}
            color="#333"
            style={styles.filterIcon}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === "eat" && styles.filterButtonActive,
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === "eat" ? null : "eat")
              }
            >
              <Text style={styles.filterText}>Eat & Drink</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === "shop" && styles.filterButtonActive,
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === "shop" ? null : "shop")
              }
            >
              <Text style={styles.filterText}>Shop & Stroll</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === "see" && styles.filterButtonActive,
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === "see" ? null : "see")
              }
            >
              <Text style={styles.filterText}>See & Do</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FEFDF8",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#FEFDF8",
  },
  searchContainer: {
    zIndex: 1,
    elevation: 3,
    backgroundColor: "#FEFDF8",
    paddingBottom: 8,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 8,
  },
  filterIcon: {
    marginRight: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#333",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
});
