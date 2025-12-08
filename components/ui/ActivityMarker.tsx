import { Activity } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Callout, Marker } from "react-native-maps";

interface ActivityMarkerProps {
  activity: Activity;
  onPress: (activity: Activity) => void;
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

// Memoized component to prevent unnecessary re-renders
const ActivityMarker = memo(
  function ActivityMarker({ activity, onPress }: ActivityMarkerProps) {
    // Validate coordinates before rendering
    if (!hasValidCoordinates(activity)) {
      console.warn(
        `Invalid coordinates for activity ${activity.id}: ${activity.name}`
      );
      return null;
    }

    // Determine marker color and icon based on category
    const getMarkerStyle = () => {
      const category = activity.category?.toLowerCase().trim() || "";

      switch (category) {
        case "eat & drink":
        case "restaurant":
        case "food":
          return { color: "#FF6B6B", icon: "restaurant" };
        case "shop & stroll":
        case "shopping":
        case "retail":
          return { color: "#4ECDC4", icon: "cart" };
        case "tour & learn":
        case "watch & play":
        case "see":
        case "activity":
        case "entertainment":
          return { color: "#45B7D1", icon: "camera" };
        case "nightlife":
          return { color: "#9B59B6", icon: "moon" };
        default:
          return { color: "#95A5A6", icon: "location" };
      }
    };

    const { color, icon } = getMarkerStyle();

    // Safe handler for marker press
    const handlePress = () => {
      try {
        if (onPress && typeof onPress === "function") {
          onPress(activity);
        }
      } catch (error) {
        console.error("Error handling marker press:", error);
      }
    };

    // Format price range safely
    const getPriceRange = () => {
      const min = activity.price_min || 0;
      const max = activity.price_max || 0;

      if (min === 0 && max === 0) {
        return "Price not available";
      }

      return `$${min}-$${max}`;
    };

    // Format rating safely
    const getRating = () => {
      if (typeof activity.rating === "number" && !isNaN(activity.rating)) {
        return activity.rating.toFixed(1);
      }
      return null;
    };

    try {
      return (
        <Marker
          coordinate={{
            latitude: activity.latitude!,
            longitude: activity.longitude!,
          }}
          onPress={handlePress}
          tracksViewChanges={false} // Performance optimization
          identifier={`marker-${activity.id}`}
        >
          {/* Custom Marker View */}
          <View style={[styles.markerContainer, { backgroundColor: color }]}>
            <Ionicons name={icon as any} size={20} color="white" />
          </View>

          {/* Callout when tapped */}
          <Callout tooltip={false}>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutTitle} numberOfLines={2}>
                {activity.name || "Unknown Activity"}
              </Text>

              {activity.category && (
                <Text style={styles.calloutCategory}>{activity.category}</Text>
              )}

              <View style={styles.calloutInfo}>
                <Text style={styles.calloutPrice}>{getPriceRange()}</Text>

                {getRating() && (
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.calloutRating}>{getRating()}</Text>
                  </View>
                )}
              </View>

              {activity.address && (
                <Text style={styles.calloutAddress} numberOfLines={2}>
                  {activity.address}
                </Text>
              )}
            </View>
          </Callout>
        </Marker>
      );
    } catch (error) {
      console.error(
        `Error rendering marker for activity ${activity.id}:`,
        error
      );
      return null;
    }
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo
    // Only re-render if essential props change
    return (
      prevProps.activity.id === nextProps.activity.id &&
      prevProps.activity.latitude === nextProps.activity.latitude &&
      prevProps.activity.longitude === nextProps.activity.longitude &&
      prevProps.activity.category === nextProps.activity.category &&
      prevProps.activity.name === nextProps.activity.name
    );
  }
);

export default ActivityMarker;

const styles = StyleSheet.create({
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutContainer: {
    minWidth: 200,
    maxWidth: 250,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  calloutCategory: {
    fontSize: 12,
    color: "#666",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  calloutInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  calloutPrice: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  calloutRating: {
    fontSize: 12,
    color: "#333",
    marginLeft: 2,
  },
  calloutAddress: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});
