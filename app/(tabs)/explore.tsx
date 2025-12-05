import ActivityCard from "@/components/ui/ActivityCard";
import SearchBar from "@/components/ui/SearchBar";
import { useActivitySheet } from "@/hooks/useActivitySheet";
import { Activity, getActivities } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
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
  const [mapRegion, setMapRegion] = useState<Region>(INITIAL_COORDS);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { activity, isOpen, open, close } = useActivitySheet();

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await getActivities();

      // Log sample activity to check structure
      if (data.length > 0) {
        // Check how many have coordinates
        const withCoords = data.filter((a) => a.latitude && a.longitude);
        console.log();
      }

      setActivities(data);
    } catch (error) {
      console.error("❌ Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter activities based on search and category
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (activity) =>
          activity.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.name?.toLowerCase().includes(query) ||
          activity.description?.toLowerCase().includes(query) ||
          activity.address?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activities, selectedCategory, searchQuery]);

  // Get activities with valid coordinates for map display
  const mappableActivities = useMemo(() => {
    const mappable = filteredActivities.filter((activity) => {
      const hasCoords = activity.latitude && activity.longitude;
      if (!hasCoords && activity.name) {
        console.log(`⚠️ No coordinates for: ${activity.name}`);
      }
      return hasCoords;
    });

    if (mappable.length > 0) {
      console.log(
        "📍 Mappable activities sample:",
        mappable.slice(0, 3).map((a) => ({
          name: a.name,
          lat: a.latitude,
          lng: a.longitude,
        }))
      );
    }

    return mappable;
  }, [filteredActivities]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleActivityPress = (activity: Activity) => {
    open(activity);

    // If in map view, center on the selected activity
    if (viewMode === "map" && activity.latitude && activity.longitude) {
      setMapRegion({
        latitude: activity.latitude,
        longitude: activity.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedActivity(null), 300);
  };

  // Function to fit all markers in view
  const fitAllMarkers = () => {
    if (mappableActivities.length === 0) {
      return;
    }

    const coordinates = mappableActivities.map((activity) => ({
      latitude: activity.latitude!,
      longitude: activity.longitude!,
    }));

    // Calculate bounding box
    const minLat = Math.min(...coordinates.map((c) => c.latitude));
    const maxLat = Math.max(...coordinates.map((c) => c.latitude));
    const minLng = Math.min(...coordinates.map((c) => c.longitude));
    const maxLng = Math.max(...coordinates.map((c) => c.longitude));

    setMapRegion({
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) * 1.2,
      longitudeDelta: (maxLng - minLng) * 1.2,
    });
  };

  // Get marker color based on category
  const getMarkerColor = (category: string) => {
    const color = (() => {
      switch (category?.toLowerCase()) {
        case "eat":
          return "#FF6B6B";
        case "shop":
          return "#4ECDC4";
        case "see":
          return "#45B7D1";
        default:
          return "#95A5A6";
      }
    })();
    return color;
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
                placeholder="Search"
              />

              {/* Map/List Toggle */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    viewMode === "map" && styles.toggleButtonActive,
                  ]}
                  onPress={() => {
                    console.log("🗺️ Switching to map view");
                    setViewMode("map");
                  }}
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
                    viewMode === "list" && styles.toggleButtonActive,
                  ]}
                  onPress={() => {
                    console.log("📋 Switching to list view");
                    setViewMode("list");
                  }}
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
                    onPress={() => {
                      const newCategory =
                        selectedCategory === "eat" ? null : "eat";
                      console.log(
                        `🍴 Eat filter: ${newCategory ? "ON" : "OFF"}`
                      );
                      setSelectedCategory(newCategory);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedCategory === "eat" && styles.filterTextActive,
                      ]}
                    >
                      Eat & Drink
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      selectedCategory === "shop" && styles.filterButtonActive,
                    ]}
                    onPress={() => {
                      const newCategory =
                        selectedCategory === "shop" ? null : "shop";
                      console.log(
                        `🛍️ Shop filter: ${newCategory ? "ON" : "OFF"}`
                      );
                      setSelectedCategory(newCategory);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedCategory === "shop" && styles.filterTextActive,
                      ]}
                    >
                      Shop & Stroll
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      selectedCategory === "see" && styles.filterButtonActive,
                    ]}
                    onPress={() => {
                      const newCategory =
                        selectedCategory === "see" ? null : "see";
                      console.log(
                        `👁️ See filter: ${newCategory ? "ON" : "OFF"}`
                      );
                      setSelectedCategory(newCategory);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedCategory === "see" && styles.filterTextActive,
                      ]}
                    >
                      See & Do
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>

            {/* Conditional Rendering: Map or List */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#333" />
                <Text style={styles.loadingText}>Loading activities...</Text>
              </View>
            ) : viewMode === "map" ? (
              <View style={{ flex: 1 }}>
                <MapView
                  region={mapRegion}
                  onRegionChangeComplete={(region) => {
                    console.log("🗺️ Map region changed:", region);
                    setMapRegion(region);
                  }}
                  provider={PROVIDER_DEFAULT}
                  style={styles.mapView}
                  showsUserLocation
                  showsMyLocationButton
                  onMapReady={() => {
                    console.log("✅ Map is ready!");
                  }}
                >
                  {mappableActivities.map((activity) => {
                    return (
                      <Marker
                        key={activity.id}
                        coordinate={{
                          latitude: activity.latitude!,
                          longitude: activity.longitude!,
                        }}
                        title={activity.name}
                        description={`${activity.category} • $${activity.price_min}-$${activity.price_max}`}
                        onPress={() => {
                          handleActivityPress(activity);
                        }}
                        pinColor={getMarkerColor(activity.category)}
                      />
                    );
                  })}
                </MapView>

                {/* Fit All Button */}
                {mappableActivities.length > 1 && (
                  <TouchableOpacity
                    style={styles.fitAllButton}
                    onPress={fitAllMarkers}
                  >
                    <Ionicons name="expand-outline" size={24} color="#333" />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <FlatList
                data={filteredActivities}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  return (
                    <ActivityCard
                      activity={item}
                      onPress={() => handleActivityPress(item)}
                    />
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      No activities found matching your criteria
                    </Text>
                  </View>
                }
                contentContainerStyle={
                  filteredActivities.length === 0
                    ? styles.emptyListContainer
                    : undefined
                }
              />
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
    borderRadius: 8,
    overflow: "hidden",
    // Fixed shadow syntax for React Native
    shadowColor: "rgba(35, 23, 17, 0.13)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FEFDF8",
    // Fixed shadow syntax for React Native
    shadowColor: "rgba(35, 23, 17, 0.13)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButtonActive: {
    backgroundColor: "#5AA691",
  },
  toggleText: {
    fontSize: 16,
    color: "#333",
  },
  toggleTextActive: {
    fontWeight: "600",
    color: "#FEFDF8",
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
  filterTextActive: {
    color: "#fff",
  },
  mapView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  mapOverlay: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mapOverlayText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  mapOverlaySubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  fitAllButton: {
    position: "absolute",
    bottom: 100,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
