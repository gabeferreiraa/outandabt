// components/filters/CategoryFilterBar.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORY_COLORS: Record<
  string,
  { activeBg: string; activeText?: string }
> = {
  eat: { activeBg: "#CC432e" },
  shop: { activeBg: "#4D98CD" },
  tour: { activeBg: "#115B37" },
  move: { activeBg: "#738FB9" },
  watch: { activeBg: "#005692" },
  nightlife: { activeBg: "#9B59B6" },
};

const CATEGORIES = [
  { key: "eat", label: "Eat & Drink" },
  { key: "shop", label: "Shop & Stroll" },
  { key: "tour", label: "Tour & Learn" },
  { key: "move", label: "Move & Play" },
  { key: "watch", label: "Watch & Enjoy" },
  { key: "nightlife", label: "Nightlife" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

interface CategoryFilterBarProps {
  selectedCategory: string | null;
  onCategoryPress: (category: CategoryKey) => void;
  disabled?: boolean;
}

export default function CategoryFilterBar({
  selectedCategory,
  onCategoryPress,
  disabled = false,
}: CategoryFilterBarProps) {
  return (
    <View style={styles.filterContainer}>
      <Ionicons
        name="filter-outline"
        size={24}
        color="#333"
        style={styles.filterIcon}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {CATEGORIES.map(({ key, label }) => {
          const isActive = selectedCategory === key;
          const colors = CATEGORY_COLORS[key];

          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterButton,
                isActive && {
                  backgroundColor: colors.activeBg,
                  borderColor: colors.activeBg,
                },
              ]}
              onPress={() => onCategoryPress(key)}
              disabled={disabled}
            >
              <Text
                style={[styles.filterText, isActive && styles.filterTextActive]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderWidth: 0.5,
    borderColor: "#333",
    backgroundColor: "#fff",
    marginRight: 10,
  },
  filterText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    fontFamily: "Poppins",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});
