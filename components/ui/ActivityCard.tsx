// components/ui/ActivityCard.tsx
import { Activity } from "@/lib/supabase";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
}

export default function ActivityCard({ activity, onPress }: ActivityCardProps) {
  // Your original static placeholder — simple and reliable
  const mainImage = "/assets/images/mango-mango-dessert.jpeg";

  const formatPrice = () => {
    if (activity.price_min && activity.price_max) {
      return `$${activity.price_min}–$${activity.price_max}`;
    }
    if (activity.price_min) {
      return `From $${activity.price_min}`;
    }
    return "Free";
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: mainImage }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {activity.name}
        </Text>
        <Text style={styles.category}>
          {activity.category
            ? activity.category.charAt(0).toUpperCase() +
              activity.category.slice(1)
            : ""}
        </Text>
        <Text style={styles.price}>{formatPrice()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  image: {
    width: 110,
    height: 110,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  category: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    textTransform: "capitalize",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2e8b57",
    marginTop: 8,
  },
});
