import { Activity } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type FeedActivityCardProps = {
  activity: Activity;
  onPress: () => void;
  variant?: "horizontal" | "grid";
  onBookmarkPress?: () => void;
  bookmarked?: boolean;
};

export default function FeedActivityCard({
  activity,
  onPress,
  variant = "grid",
  onBookmarkPress,
  bookmarked = false,
}: FeedActivityCardProps) {
  const formatPrice = () => {
    if (activity.price_min && activity.price_max)
      return `$${activity.price_min}–${activity.price_max}`;
    if (activity.price_min) return `$${activity.price_min}+`;
    return "Varies+";
  };

  const distanceText =
    typeof (activity as any).distance_miles === "number"
      ? `${(activity as any).distance_miles.toFixed(1)} mi`
      : null;

  const categoryLabel = activity.category
    ? activity.category.charAt(0).toUpperCase() + activity.category.slice(1)
    : "";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        variant === "horizontal" ? styles.cardHorizontal : styles.cardGrid,
      ]}
    >
      {/* inset image */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: activity.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.textCol}>
            <Text style={styles.title} numberOfLines={2}>
              {activity.name}
            </Text>

            {!!categoryLabel && (
              <Text style={styles.category} numberOfLines={1}>
                {categoryLabel}
              </Text>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={(e) => {
              e.stopPropagation();
              onBookmarkPress?.();
            }}
            style={styles.bookmarkBtn}
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={14}
              color="#1F1F1F"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.price} numberOfLines={1}>
            {formatPrice()}
          </Text>
          {distanceText ? (
            <Text style={styles.distance} numberOfLines={1}>
              {distanceText}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
    overflow: "hidden",
  },

  // Popular strip
  cardHorizontal: {
    width: 170,
    marginRight: 14,
  },

  // Grid
  cardGrid: {
    width: "48%",
    marginBottom: 14,
  },

  imageWrap: {
    padding: 10,
    paddingBottom: 0,
  },
  image: {
    width: "100%",
    height: 115, // ✅ smaller card height
    borderRadius: 14,
  },

  content: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  textCol: { flex: 1, minWidth: 0 },

  title: {
    fontSize: 14, // ✅ figma
    fontWeight: "800",
    color: "#1F1F1F",
    lineHeight: 18,
  },
  category: {
    marginTop: 4,
    fontSize: 10, // ✅ figma
    color: "#9A9A9A",
  },

  bookmarkBtn: {
    paddingLeft: 6,
    paddingTop: 4,
    paddingBottom: 4,
  },

  bottomRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  price: {
    fontSize: 10, // ✅ figma
    fontWeight: "800",
    color: "#2E8B57",
  },
  distance: {
    fontSize: 10, // ✅ figma
    fontWeight: "700",
    color: "#3A3A3A",
  },
});
