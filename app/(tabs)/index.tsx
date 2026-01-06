import CategoryFilterBar from "@/components/filters/CategoryFilterBar";
import SearchBar from "@/components/ui/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import {
  InteractionManager,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Feed() {
  const [searchQuery, setSearchQuery] = useState("");
  const updateTimeoutRef = useRef<NodeJS.Timeout>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryPress = useCallback((category: string) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);

    InteractionManager.runAfterInteractions(() => {
      setSelectedCategory((prev) => (prev === category ? null : category));
    });
  }, []);
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar
            onSearch={handleSearch}
            value={searchQuery}
            placeholder="Search"
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
            {/* Category Filters */}
            <CategoryFilterBar
              selectedCategory={selectedCategory}
              onCategoryPress={handleCategoryPress}
            />
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#333",
  },
  filterText: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Poppins",
  },
});
