import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Activity } from "@/lib/supabase";

interface ActivityMarkerProps {
  activity: Activity;
  onPress: (activity: Activity) => void;
}

export default function ActivityMarker({
  activity,
  onPress,
}: ActivityMarkerProps) {
  // Determine marker color and icon based on category
  const getMarkerStyle = () => {
    switch (activity.category?.toLowerCase()) {
      case "eat":
      case "restaurant":
      case "food":
        return { color: "#FF6B6B", icon: "restaurant" };
      case "shop":
      case "shopping":
      case "retail":
        return { color: "#4ECDC4", icon: "cart" };
      case "see":
      case "activity":
      case "entertainment":
        return { color: "#45B7D1", icon: "camera" };
      default:
        return { color: "#95A5A6", icon: "location" };
    }
  };

  const { color, icon } = getMarkerStyle();

  if (!activity.latitude || !activity.longitude) {
    return null;
  }

  return (
    <Marker
      coordinate={{
        latitude: activity.latitude,
        longitude: activity.longitude,
      }}
      onPress={() => onPress(activity)}
      tracksViewChanges={false} // Performance optimization
    >
      {/* Custom Marker View */}
      <View style={[styles.markerContainer, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={20} color="white" />
      </View>

      {/* Callout when tapped */}
      <Callout>
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutTitle}>{activity.name}</Text>
          <Text style={styles.calloutCategory}>{activity.category}</Text>
          <View style={styles.calloutInfo}>
            <Text style={styles.calloutPrice}>
              ${activity.price_min}-${activity.price_max}
            </Text>
            {activity.rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.calloutRating}>{activity.rating}</Text>
              </View>
            )}
          </View>
          <Text style={styles.calloutAddress} numberOfLines={2}>
            {activity.address}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}

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
  },
  calloutAddress: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});
