import ActivityCard from "@/components/ui/ActivityCard";
import SearchBar from "@/components/ui/SearchBar";
import { useActivitySheet } from "@/hooks/useActivitySheet";
import { Activity, getActivities } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

// Valid database categories (exact values only)
const VALID_CATEGORIES = [
  "nightlife",
  "tour & learn",
  "eat & drink",
  "shop & stroll",
  "watch & play",
];

// Map UI button categories to database categories
const CATEGORY_MAP: Record<string, string[]> = {
  eat: ["eat & drink"],
  shop: ["shop & stroll"],
  see: ["tour & learn", "watch & play"],
  nightlife: ["nightlife"],
};

// Helper function to check if activity matches category
function matchesCategory(
  activityCategory: string | undefined,
  selectedCategory: string
): boolean {
  if (!activityCategory) return false;

  const categoryLower = activityCategory.toLowerCase().trim();
  const selectedLower = selectedCategory.toLowerCase();

  const isValidCategory = VALID_CATEGORIES.some(
    (valid) => valid.toLowerCase() === categoryLower
  );

  if (!isValidCategory) {
    return false;
  }

  const databaseCategories = CATEGORY_MAP[selectedLower] || [];
  return databaseCategories.some(
    (dbCategory) => dbCategory.toLowerCase() === categoryLower
  );
}

// Helper to validate coordinates
function hasValidCoordinates(activity: Activity): boolean {
  return (
    typeof activity.latitude === "number" &&
    typeof activity.longitude === "number" &&
    !isNaN(activity.latitude) &&
    !isNaN(activity.longitude) &&
    Math.abs(activity.latitude) <= 90 &&
    Math.abs(activity.longitude) <= 180
  );
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Type for cache keys
type CacheKey = string;

export default function TabTwoScreen() {
  const INITIAL_COORDS: Region = {
    latitude: 39.9526,
    longitude: -75.1652,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState<Region>(INITIAL_COORDS);
  const [isUpdatingMarkers, setIsUpdatingMarkers] = useState(false);

  // Cache for filtered activities by category
  const filteredCacheRef = useRef<Map<CacheKey, Activity[]>>(new Map());
  const mappableCacheRef = useRef<Map<CacheKey, Activity[]>>(new Map());

  // Refs for stability
  const mapRef = useRef<MapView>(null);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { open } = useActivitySheet();

  // Debounced values to prevent rapid updates
  const debouncedCategory = useDebounce(selectedCategory, 300);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await getActivities();

      // Validate and clean data
      const cleanedData = data.map((activity) => ({
        ...activity,
        latitude: hasValidCoordinates(activity) ? activity.latitude : undefined,
        longitude: hasValidCoordinates(activity)
          ? activity.longitude
          : undefined,
      }));

      if (cleanedData.length > 0) {
        const withCoords = cleanedData.filter(hasValidCoordinates);

        // Pre-cache the "all activities" view
        const allKey = getCacheKey(null, "");
        filteredCacheRef.current.set(allKey, cleanedData);
        mappableCacheRef.current.set(allKey, withCoords);
      }

      setActivities(cleanedData);
    } catch (error) {
      console.error("❌ Error loading activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // Create cache key for current filters
  const getCacheKey = (category: string | null, search: string): CacheKey => {
    return `${category || "all"}-${search || "none"}`;
  };

  // Filter activities with caching
  const filteredActivities = useMemo(() => {
    const cacheKey = getCacheKey(debouncedCategory, debouncedSearchQuery);

    // Check if we have this exact filter combination cached
    const cached = filteredCacheRef.current.get(cacheKey);
    if (cached) {
      console.log(`📦 Using cached results for: ${cacheKey}`);
      return cached;
    }

    if (!activities || activities.length === 0) return [];

    let filtered = [...activities];

    // Apply category filter
    if (debouncedCategory) {
      filtered = filtered.filter((activity) =>
        matchesCategory(activity.category, debouncedCategory)
      );
    }

    // Apply search filter
    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (activity) =>
          activity.name?.toLowerCase().includes(query) ||
          activity.description?.toLowerCase().includes(query) ||
          activity.address?.toLowerCase().includes(query)
      );
    }

    // Cache the result
    filteredCacheRef.current.set(cacheKey, filtered);

    // Limit cache size
    if (filteredCacheRef.current.size > 10) {
      const firstKey = filteredCacheRef.current.keys().next().value;
      if (firstKey) filteredCacheRef.current.delete(firstKey);
    }

    return filtered;
  }, [activities, debouncedCategory, debouncedSearchQuery]);

  // Get mappable activities with caching
  const mappableActivities = useMemo(() => {
    const cacheKey = `map-${getCacheKey(
      debouncedCategory,
      debouncedSearchQuery
    )}`;

    // Check cache first
    const cached = mappableCacheRef.current.get(cacheKey);
    if (cached) {
      console.log(`📦 Using cached mappable results for: ${cacheKey}`);
      return cached;
    }

    if (!filteredActivities || filteredActivities.length === 0) return [];

    const mappable = filteredActivities.filter((activity) => {
      return hasValidCoordinates(activity);
    });

    // Cache the result
    mappableCacheRef.current.set(cacheKey, mappable);

    // Limit cache size
    if (mappableCacheRef.current.size > 10) {
      const firstKey = mappableCacheRef.current.keys().next().value;
      if (firstKey) mappableCacheRef.current.delete(firstKey);
    }

    return mappable;
  }, [filteredActivities, debouncedCategory, debouncedSearchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleActivityPress = useCallback(
    (activity: Activity) => {
      if (!activity) return;

      open(activity);

      if (viewMode === "map" && hasValidCoordinates(activity)) {
        const newRegion: Region = {
          latitude: activity.latitude!,
          longitude: activity.longitude!,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }
    },
    [viewMode, open]
  );

  // Handle category selection with delayed update
  const handleCategoryPress = useCallback((category: string) => {
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Set updating state to show loading indicator
    setIsUpdatingMarkers(true);

    // Use InteractionManager to wait for animations to complete
    InteractionManager.runAfterInteractions(() => {
      setSelectedCategory((prevCategory) => {
        const newCategory = prevCategory === category ? null : category;
        console.log(`${category} filter: ${newCategory ? "ON" : "OFF"}`);

        // Delay removing the updating state to allow map to stabilize
        updateTimeoutRef.current = setTimeout(() => {
          setIsUpdatingMarkers(false);
        }, 500);

        return newCategory;
      });
    });
  }, []);

  // Fit all markers with error handling
  const fitAllMarkers = useCallback(() => {
    if (!mappableActivities || mappableActivities.length === 0) {
      return;
    }

    try {
      if (mappableActivities.length === 1) {
        const activity = mappableActivities[0];
        if (hasValidCoordinates(activity)) {
          const newRegion: Region = {
            latitude: activity.latitude!,
            longitude: activity.longitude!,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
        }
        return;
      }

      const coordinates = mappableActivities
        .filter(hasValidCoordinates)
        .map((activity) => ({
          latitude: activity.latitude!,
          longitude: activity.longitude!,
        }));

      if (coordinates.length === 0) return;

      const latitudes = coordinates.map((c) => c.latitude);
      const longitudes = coordinates.map((c) => c.longitude);

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      const latDelta = Math.max((maxLat - minLat) * 1.2, 0.01);
      const lngDelta = Math.max((maxLng - minLng) * 1.2, 0.01);

      const newRegion: Region = {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      };

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.error("Error fitting markers:", error);
    }
  }, [mappableActivities]);

  // Get marker color based on category
  const getMarkerColor = useCallback((category: string | undefined) => {
    if (!category) return "#95A5A6";

    switch (category.toLowerCase()) {
      case "eat & drink":
        return "#FF6B6B";
      case "shop & stroll":
        return "#4ECDC4";
      case "tour & learn":
      case "watch & play":
        return "#45B7D1";
      case "nightlife":
        return "#9B59B6";
      default:
        return "#95A5A6";
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Stable marker rendering with keys
  const markers = useMemo(() => {
    if (isUpdatingMarkers) {
      // Don't render markers while updating to prevent crashes
      return [];
    }

    return mappableActivities.filter(hasValidCoordinates).map((activity) => {
      // Create a stable key that includes category to force re-render when needed
      const markerKey = `${activity.id}-${debouncedCategory || "all"}`;

      return (
        <Marker
          key={markerKey}
          identifier={markerKey}
          coordinate={{
            latitude: activity.latitude!,
            longitude: activity.longitude!,
          }}
          title={activity.name || "Unknown Activity"}
          description={`${activity.category || "Uncategorized"} • $${
            activity.price_min || 0
          }-$${activity.price_max || 0}`}
          onPress={() => handleActivityPress(activity)}
          pinColor={getMarkerColor(activity.category)}
          tracksViewChanges={false}
        />
      );
    });
  }, [
    mappableActivities,
    debouncedCategory,
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
            <View style={styles.filterContainer}>
              <Ionicons
                name="filter-outline"
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
                  onPress={() => handleCategoryPress("eat")}
                  disabled={isUpdatingMarkers}
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
                  onPress={() => handleCategoryPress("shop")}
                  disabled={isUpdatingMarkers}
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
                  onPress={() => handleCategoryPress("see")}
                  disabled={isUpdatingMarkers}
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
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    selectedCategory === "nightlife" &&
                      styles.filterButtonActive,
                  ]}
                  onPress={() => handleCategoryPress("nightlife")}
                  disabled={isUpdatingMarkers}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedCategory === "nightlife" &&
                        styles.filterTextActive,
                    ]}
                  >
                    Nightlife
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
                ref={mapRef}
                initialRegion={INITIAL_COORDS}
                onRegionChangeComplete={(region) => {
                  if (
                    region &&
                    !isNaN(region.latitude) &&
                    !isNaN(region.longitude) &&
                    !isNaN(region.latitudeDelta) &&
                    !isNaN(region.longitudeDelta)
                  ) {
                    setMapRegion(region);
                  }
                }}
                provider={PROVIDER_DEFAULT}
                style={styles.mapView}
                showsUserLocation
                showsMyLocationButton
                onMapReady={() => {
                  console.log("✅ Map is ready!");
                  if (mappableActivities.length > 0) {
                    setTimeout(fitAllMarkers, 500);
                  }
                }}
                loadingEnabled={true}
                loadingIndicatorColor="#333"
                loadingBackgroundColor="#FEFDF8"
                moveOnMarkerPress={false}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollDuringRotateOrZoomEnabled={false}
                minZoomLevel={5}
                maxZoomLevel={20}
              >
                {/* Render markers */}
                {markers}
              </MapView>

              {/* Fit All Button */}
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
  updatingOverlay: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  updatingText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#666",
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
