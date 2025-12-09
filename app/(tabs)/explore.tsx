import CategoryFilterBar from "@/components/filters/CategoryFilterBar";
import ActivityCard from "@/components/ui/ActivityCard";
import SearchBar from "@/components/ui/SearchBar";
import { useActivitySheet } from "@/hooks/useActivitySheet";
import { useFilteredActivities } from "@/hooks/useFilteredActivities";
import { Activity, getActivities } from "@/lib/supabase";
import { getCategoryColor } from "@/constants/categoryColors";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const INITIAL_COORDS: Region = {
  latitude: 39.9526,
  longitude: -75.1652,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingMarkers, setIsUpdatingMarkers] = useState(false);

  const mapRef = useRef<MapView>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();
  const { open } = useActivitySheet();

  // This hook handles ALL filtering + caching + debouncing
  const { filteredActivities, mappableActivities } = useFilteredActivities(
    activities,
    selectedCategory,
    searchQuery
  );

  useEffect(() => {
    loadActivities();
  }, []);

  // Fit all markers when mappable activities are first loaded (not filtered)
  useEffect(() => {
    console.log(
      "mappableActivities changed:",
      mappableActivities.length,
      "category:",
      selectedCategory,
      "search:",
      searchQuery
    );
    if (mappableActivities.length > 0 && !selectedCategory && !searchQuery) {
      // Small delay to ensure map is ready
      const timer = setTimeout(() => {
        console.log("Fitting all markers");
        fitAllMarkers();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mappableActivities.length, fitAllMarkers]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await getActivities();
      console.log("Loaded activities:", data.length);
      console.log(
        "Activities with coords:",
        data.filter(
          (a) =>
            typeof a.latitude === "number" && typeof a.longitude === "number"
        ).length
      );
      setActivities(data);
    } catch (error) {
      console.error("Error loading activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleActivityPress = useCallback(
    (activity: Activity) => {
      if (!activity) return;
      open(activity);

      if (viewMode === "map" && activity.latitude && activity.longitude) {
        mapRef.current?.animateToRegion(
          {
            latitude: activity.latitude,
            longitude: activity.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }
    },
    [viewMode, open]
  );

  const handleCategoryPress = useCallback((category: string) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    setIsUpdatingMarkers(true);

    InteractionManager.runAfterInteractions(() => {
      setSelectedCategory((prev) => (prev === category ? null : category));
      updateTimeoutRef.current = setTimeout(
        () => setIsUpdatingMarkers(false),
        500
      );
    });
  }, []);

  const fitAllMarkers = useCallback(() => {
    if (mappableActivities.length === 0) return;

    const coords = mappableActivities.map((a) => ({
      latitude: a.latitude!,
      longitude: a.longitude!,
    }));

    const latitudes = coords.map((c) => c.latitude);
    const longitudes = coords.map((c) => c.longitude);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const region: Region = {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.2, 0.01),
      longitudeDelta: Math.max((maxLng - minLng) * 1.2, 0.01),
    };

    mapRef.current?.animateToRegion(region, 1000);
  }, [mappableActivities]);

  const getMarkerColor = useCallback((category?: string) => {
    return getCategoryColor(category);
  }, []);

  const markers = useMemo(() => {
    // Don't clear markers on initial load
    if (isUpdatingMarkers && selectedCategory !== null) return [];

    console.log(
      "Creating markers, mappableActivities:",
      mappableActivities.length
    );

    return mappableActivities.map((activity) => (
      <Marker
        key={`${activity.id}-${selectedCategory || "all"}`}
        coordinate={{
          latitude: activity.latitude!,
          longitude: activity.longitude!,
        }}
        title={activity.name || "Unknown"}
        description={`${activity.category || ""} • $${
          activity.price_min || 0
        }-${activity.price_max || 0}`}
        pinColor={getMarkerColor(activity.category)}
        onPress={() => handleActivityPress(activity)}
        tracksViewChanges={false}
      />
    ));
  }, [
    mappableActivities,
    selectedCategory,
    isUpdatingMarkers,
    handleActivityPress,
    getMarkerColor,
  ]);

  return (
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

            {/* Category Filters */}
            <CategoryFilterBar
              selectedCategory={selectedCategory}
              onCategoryPress={handleCategoryPress}
              disabled={isUpdatingMarkers}
            />
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#333" />
              <Text style={styles.loadingText}>Loading activities...</Text>
            </View>
          ) : viewMode === "map" ? (
            <View style={{ flex: 1 }}>
              <MapView
                ref={mapRef}
                initialRegion={INITIAL_COORDS}
                style={styles.mapView}
                showsUserLocation
                showsMyLocationButton
                loadingEnabled
                loadingIndicatorColor="#333"
                loadingBackgroundColor="#FEFDF8"
                moveOnMarkerPress={false}
                pitchEnabled={false}
                rotateEnabled={false}
                minZoomLevel={5}
                maxZoomLevel={20}
              >
                {markers}
              </MapView>

              {!isUpdatingMarkers && mappableActivities.length > 1 && (
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
              keyExtractor={(item) => `list-${item.id}`}
              renderItem={({ item }) => (
                <ActivityCard
                  activity={item}
                  onPress={() => handleActivityPress(item)}
                />
              )}
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
              removeClippedSubviews={Platform.OS === "android"}
              maxToRenderPerBatch={10}
              initialNumToRender={10}
              windowSize={10}
            />
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FEFDF8" },
  container: { flex: 1, backgroundColor: "#FEFDF8" },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FEFDF8",
  },
  toggleButtonActive: { backgroundColor: "#5AA691" },
  toggleText: { fontSize: 16, color: "#333" },
  toggleTextActive: { fontWeight: "600", color: "#FEFDF8" },
  mapView: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#666" },
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
  emptyContainer: { padding: 32, alignItems: "center" },
  emptyListContainer: { flexGrow: 1, justifyContent: "center" },
  emptyText: { fontSize: 16, color: "#999" },
});
