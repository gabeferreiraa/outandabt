import ActivityCard from "@/components/ui/ActivityCard";
import SearchBar from "@/components/ui/SearchBar";
import { useActivitySheet } from "@/hooks/useActivitySheet";
import { Activity, getActivities } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  const INITIAL_COORDS = {
    latitude: 39.9526,
    longitude: -75.1652,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [activities, setActivities] = useState<Activity[]>([]);
  const { activity, isOpen, open, close } = useActivitySheet();

  useEffect(() => {
    getActivities().then(setActivities);
  }, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    const data = await getActivities();
    setActivities(data);
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleActivityPress = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    // Small delay before clearing to allow animation to complete
    setTimeout(() => setSelectedActivity(null), 300);
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.container}>
            <View style={styles.searchContainer}>
              <SearchBar
                onSearch={handleSearch}
                value={searchQuery}
                placeholder="Search for activities"
              />

              {/* Map/List Toggle */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    styles.toggleButtonLeft,
                    viewMode === "map" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setViewMode("map")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      viewMode === "map" && styles.toggleTextActive,
                    ]}
                  >
                    Map
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    styles.toggleButtonRight,
                    viewMode === "list" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setViewMode("list")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      viewMode === "list" && styles.toggleTextActive,
                    ]}
                  >
                    List
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Filter Buttons */}
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
                      setSelectedCategory(
                        selectedCategory === "eat" ? null : "eat"
                      )
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
                      setSelectedCategory(
                        selectedCategory === "shop" ? null : "shop"
                      )
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
                      setSelectedCategory(
                        selectedCategory === "see" ? null : "see"
                      )
                    }
                  >
                    <Text style={styles.filterText}>See & Do</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
            {/* Conditional Rendering: Map or List */}
            {viewMode === "map" ? (
              <MapView
                initialRegion={INITIAL_COORDS}
                provider={PROVIDER_DEFAULT}
                style={styles.mapView}
                showsUserLocation
                showsMyLocationButton
              ></MapView>
            ) : (
              <>
                <FlatList
                  data={activities}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <ActivityCard activity={item} onPress={() => open(item)} />
                  )}
                />

                {/* <ActivitySheet activity={activity} onClose={close} /> */}
              </>
            )}
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FEFDF8",
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
  toggleContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 25,
    overflow: "hidden",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FEFDF8",
  },
  toggleButtonLeft: {
    borderRightWidth: 0.5,
    borderRightColor: "#333",
  },
  toggleButtonRight: {
    borderLeftWidth: 0.5,
    borderLeftColor: "#333",
  },
  toggleButtonActive: {
    backgroundColor: "#e0e0e0",
  },
  toggleText: {
    fontSize: 16,
    color: "#333",
  },
  toggleTextActive: {
    fontWeight: "600",
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
  mapView: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  listItemCategory: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  listItemMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listItemDistance: {
    fontSize: 13,
    color: "#999",
  },
  listItemPrice: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
