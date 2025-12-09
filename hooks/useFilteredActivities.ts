import { Activity } from "@/lib/supabase";
import { useMemo } from "react";
import { useDebounce } from "./useDebounce";

// Keep this mapping in one place — used by filters AND markers
export const CATEGORY_MAP: Record<string, string[]> = {
  eat: ["eat & drink"],
  shop: ["shop & stroll"],
  tour: ["tour & learn"],
  move: ["move & play"],
  watch: ["watch & enjoy"],
  nightlife: ["nightlife"],
};

export const VALID_CATEGORIES = [
  "nightlife",
  "tour & learn",
  "eat & drink",
  "shop & stroll",
  "move & play",
  "watch & enjoy", // Fixed: was "watch & play", should be "watch & enjoy"
];

export function matchesCategory(
  activityCategory: string | undefined,
  selectedCategory: string
): boolean {
  if (!activityCategory) return false;

  const cat = activityCategory.toLowerCase().trim();
  const sel = selectedCategory.toLowerCase();

  // Debug logging
  console.log(`Checking if "${cat}" matches filter "${sel}"`);

  if (!VALID_CATEGORIES.some((v) => v.toLowerCase() === cat)) {
    console.log(`  -> "${cat}" is not in VALID_CATEGORIES`);
    return false;
  }

  const dbCategories = CATEGORY_MAP[sel] || [];
  const matches = dbCategories.some((db) => db.toLowerCase() === cat);
  console.log(
    `  -> DB categories for "${sel}":`,
    dbCategories,
    `Match: ${matches}`
  );

  return matches;
}

export function hasValidCoordinates(activity: Activity): boolean {
  return (
    typeof activity.latitude === "number" &&
    typeof activity.longitude === "number" &&
    !isNaN(activity.latitude) &&
    !isNaN(activity.longitude) &&
    Math.abs(activity.latitude) <= 90 &&
    Math.abs(activity.longitude) <= 180
  );
}

export function useFilteredActivities(
  activities: Activity[],
  selectedCategory: string | null,
  searchQuery: string
) {
  // Skip debouncing if no filters are applied (initial load)
  const shouldDebounce = selectedCategory !== null || searchQuery !== "";

  const debouncedCategory = useDebounce(
    selectedCategory,
    shouldDebounce ? 300 : 0
  );
  const debouncedSearch = useDebounce(searchQuery, shouldDebounce ? 500 : 0);

  const filteredActivities = useMemo(() => {
    console.log("Computing filtered activities...");

    if (!activities || !activities.length) {
      console.log("No activities to filter");
      return [];
    }

    let result = [...activities];
    console.log("Starting with activities:", result.length);

    // Only apply category filter if one is actually selected
    if (debouncedCategory) {
      result = result.filter((a) => {
        if (!a.category) return false;
        return matchesCategory(a.category, debouncedCategory);
      });
      console.log("After category filter:", result.length);
    }

    if (debouncedSearch && debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.address?.toLowerCase().includes(q)
      );
      console.log("After search filter:", result.length);
    }

    console.log("Final filtered activities:", result.length);
    return result;
  }, [activities, debouncedCategory, debouncedSearch]);

  const mappableActivities = useMemo(() => {
    console.log("Computing mappable activities...");

    if (!filteredActivities || !filteredActivities.length) {
      console.log("No filtered activities to map");
      return [];
    }

    // Filter the already filtered activities to only include those with valid coordinates
    const result = filteredActivities.filter(hasValidCoordinates);
    console.log(
      "Mappable activities (with valid coords):",
      result.length,
      "from",
      filteredActivities.length
    );

    return result;
  }, [filteredActivities]);

  return { filteredActivities, mappableActivities };
}
